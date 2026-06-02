import { Response } from 'express';
import Chat from '../models/Chat.js';
import { AuthRequest } from '../middleware/auth.js';

// GET /api/chats
export const getChats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const chats = await Chat.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(chats);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/chats/:id
export const deleteChat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params['id'], userId: req.userId });
    if (!chat) {
      res.status(404).json({ message: 'Chat not found' });
      return;
    }
    res.json({ message: 'Chat deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
