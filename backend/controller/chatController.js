import Conversation from '../models/Conversation.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { callGroq } from '../llm/groqClient.js';
import { INTENT_SYSTEM_PROMPT } from '../llm/intentPrompt.js';
// import { RESPONSE_SYSTEM_PROMPT } from '../llm/responsePrompt.js'; // if you want second pass

function safeJSONParse(str) {
  try { return JSON.parse(str); } catch { return null; }
}

async function runIntentDetector(userMessage, history) {
  const messages = [
    { role: 'system', content: INTENT_SYSTEM_PROMPT },
    { role: 'user', content: `History: ${JSON.stringify(history.slice(-6))}\nUser message: ${userMessage}` }
  ];
  const msg = await callGroq(messages);
  const parsed = safeJSONParse(msg.content);
  if (!parsed) {
    return {
      intent: 'unknown',
      slots: { limit: null, orderId: null, productName: null },
      needs_clarification: false,
      clarifying_question: null
    };
  }
  return parsed;
}

async function handleIntent(intent, slots) {
  switch (intent) {
    case 'top_products': {
      const limit = slots.limit || 5;
      const products = await Product.find().sort({ sold: -1 }).limit(limit);
      return {
        text: `Top ${limit} most sold products:\n` + products
          .map((p, i) => `${i + 1}. ${p.name} — sold ${p.sold}, stock ${p.stock}`)
          .join('\n'),
        facts: { products }
      };
    }
    case 'order_status': {
      const order = await Order.findOne({ orderId: slots.orderId });
      if (!order) return { text: `I couldn't find an order with ID ${slots.orderId}.`, facts: {} };
      return { text: `Order ${order.orderId} status: ${order.status}.`, facts: { order } };
    }
    case 'product_stock': {
      const product = await Product.findOne({ name: new RegExp(slots.productName, 'i') });
      if (!product) return { text: `I couldn't find "${slots.productName}".`, facts: {} };
      return { text: `We have ${product.stock} units of "${product.name}" in stock.`, facts: { product } };
    }
    case 'smalltalk':
      return { text: `Hi! How can I help you today?`, facts: {} };
    default:
      return { text: `Sorry, I didn't quite get that. Can you rephrase?`, facts: {} };
  }
}

export const chat = async (req, res) => {
  const { message, userId, conversation_id } = req.body;

  if (!message) return res.status(400).json({ error: 'message is required' });

  // load or create conversation
  let conversation = null;
  if (conversation_id) {
    conversation = await Conversation.findById(conversation_id);
  }
  if (!conversation) {
    conversation = await Conversation.create({
      userId: userId || 'anonymous',
      messages: [],
      slots: {}
    });
  }

  // save user message
  conversation.messages.push({ role: 'user', text: message });
  await conversation.save();

  // 1) Figure out the intent + missing slots
  const intentObj = await runIntentDetector(message, conversation.messages);
  // merge slots across turns
  conversation.slots = { ...(conversation.slots || {}), ...(intentObj.slots || {}) };
  await conversation.save();

  if (intentObj.needs_clarification) {
    const aiText = intentObj.clarifying_question || 'Could you clarify?';
    conversation.messages.push({ role: 'ai', text: aiText });
    await conversation.save();
    return res.json({
      response: aiText,
      conversation_id: conversation._id
    });
  }

  // 2) Execute business logic / DB queries
  const result = await handleIntent(intentObj.intent, conversation.slots);

  // (Optional) 3) Let LLM polish text (commented out to save tokens)
  // const polished = await callGroq([
  //   { role: 'system', content: RESPONSE_SYSTEM_PROMPT },
  //   { role: 'user', content: JSON.stringify({ intent: intentObj.intent, facts: result.facts }) }
  // ]);
  // const finalText = polished.content;

  const finalText = result.text;

  // store AI response
  conversation.messages.push({ role: 'ai', text: finalText });
  await conversation.save();

  res.json({
    response: finalText,
    conversation_id: conversation._id
  });
};
