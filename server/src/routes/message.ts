import { Router } from 'express';
import { getMessages, sendMessage, sendFirstMessage } from '../controllers/messageController.js';

const router = Router();

router.post('/messages', sendFirstMessage); // POST /api/chats/messages (new chat)
router.get('/:chatId/messages', getMessages); // GET /api/chats/:chatId/messages
router.post('/:chatId/messages', sendMessage); // POST /api/chats/:chatId/messages

export default router;
