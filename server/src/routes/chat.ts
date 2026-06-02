import { Router } from 'express';
import { getChats, deleteChat } from '../controllers/chatController.js';

const router = Router();

router.get('/', getChats);
router.delete('/:id', deleteChat);

export default router;
