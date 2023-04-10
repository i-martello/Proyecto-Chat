import { Router } from 'express';
import { ctrlChat } from '../controllers/chat.controller';

const router = Router()

router.route('/chat')
  .post(ctrlChat.postMsg)
  .get(ctrlChat.getMsg);

export default router;