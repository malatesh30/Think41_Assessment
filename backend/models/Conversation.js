import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'ai', 'system'] },
  text: String,
  timestamp: { type: Date, default: Date.now }
}, {_id: false});

const conversationSchema = new mongoose.Schema({
  userId: String,
  messages: [messageSchema],
  // You can store extracted slots to keep collecting them across turns
  slots: {
    orderId: String,
    productName: String,
    limit: Number
  }
}, { timestamps: true });

export default mongoose.model('Conversation', conversationSchema);
