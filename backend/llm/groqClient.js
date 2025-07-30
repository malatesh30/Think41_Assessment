import Groq from "groq-sdk";
import dotenv from 'dotenv';
dotenv.config();

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function callGroq(messages, opts = {}) {
  const model = process.env.GROQ_MODEL || "llama-3.1-70b-versatile";
  const completion = await client.chat.completions.create({
    model,
    messages,
    temperature: opts.temperature ?? 0.2,
    max_tokens: opts.max_tokens ?? 512
  });

  return completion.choices[0].message;
}
