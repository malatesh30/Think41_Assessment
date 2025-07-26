import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();
await connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite frontend URL
  credentials: true,
}));

app.get('/health', (_, res) => res.json({ ok: true }));
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on :${PORT}`));
