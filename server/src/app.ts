import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import messageRoutes from './routes/message.js';
import feedbackRoutes from './routes/feedback.js';
import authMiddleware from './middleware/auth.js';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Public routes (no token needed)
app.use('/api/auth', authRoutes);

// Protected routes (token required)
app.use('/api/chats', authMiddleware, chatRoutes);
app.use('/api/chats', authMiddleware, messageRoutes);
app.use('/api/messages', authMiddleware, feedbackRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// 404 handler
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: `Route not found: ${req.method} ${req.url}` });
});

export default app;
