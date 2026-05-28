import { Request, Response } from 'express';
import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import groq from '../config/groq.js';
import { AuthRequest } from '../middleware/auth.js';

// GET /api/chats/:chatId/messages
export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const chatId = req.params['chatId'] as string;
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/chats/messages → creates chat + first message
export const sendFirstMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content } = req.body;

    // Create chat using first message content as title
    const chat = await Chat.create({
      title: content.length > 50 ? content.substring(0, 50) + '...' : content,
      userId: req.userId, // real user from JWT token
    });

    // Save user message
    const userMessage = await Message.create({
      chatId: chat._id,
      role: 'user',
      content,
    });

    // Call Groq SDK
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content }],
    });

    const aiContent = completion.choices[0]?.message?.content || 'No response from AI';

    // Save assistant message
    const assistantMessage = await Message.create({
      chatId: chat._id,
      role: 'assistant',
      content: aiContent,
    });

    res.status(201).json({ chat, userMessage, assistantMessage });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};

// POST /api/chats/:chatId/messages → send message to existing chat
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    const chatId = req.params['chatId'] as string;

    // Check if chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.status(404).json({ message: 'Chat not found' });
      return;
    }

    // Get previous messages for context
    const previousMessages = await Message.find({ chatId }).sort({ createdAt: 1 });

    // Save user message
    const userMessage = await Message.create({
      chatId,
      role: 'user',
      content,
    });

    // Call Groq SDK with full conversation history
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        ...previousMessages.map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        { role: 'user', content },
      ],
    });

    const aiContent = completion.choices[0]?.message?.content || 'No response from AI';

    // Save assistant message
    const assistantMessage = await Message.create({
      chatId,
      role: 'assistant',
      content: aiContent,
    });

    res.status(201).json({ userMessage, assistantMessage });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};