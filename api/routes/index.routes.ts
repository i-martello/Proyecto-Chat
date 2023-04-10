import { Router } from 'express'
import { ctrlIndex } from '../controllers/index.controller'
import { ctrlChat } from '../controllers/chat.controller'

const router = Router()

router.post('/registro', ctrlIndex.addUser)
router.post('/login', ctrlIndex.loginUser)
router.get('/validate', ctrlIndex.validateUser)
  
export default router