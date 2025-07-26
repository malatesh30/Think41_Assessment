import mongoose from 'mongoose';

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (e) {
    console.error('❌ Mongo connection error', e);
    process.exit(1);
  }
}
