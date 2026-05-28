import { Router } from 'express';
import { submitFeedback } from '../controllers/feedbackController.js';

const router = Router();

router.post('/:messageId/feedback', submitFeedback);

export default router;