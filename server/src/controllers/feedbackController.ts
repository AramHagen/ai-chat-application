import { Response } from 'express';
import Message from '../models/Message.js';
import { AuthRequest } from '../middleware/auth.js';

// POST /api/messages/:messageId/feedback
export const submitFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { feedback } = req.body;
    const messageId = req.params['messageId'] as string;

    // Validate feedback value
    if (!['positive', 'negative'].includes(feedback)) {
      res.status(400).json({ message: 'Feedback must be positive or negative' });
      return;
    }

    const message = await Message.findByIdAndUpdate(messageId, { feedback }, { new: true });

    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    res.json({ message: 'Feedback submitted successfully', data: message });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
