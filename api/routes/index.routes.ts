import { Router } from 'express'
import { ctrlIndex } from '../controllers/index.controller'

const router = Router()

router.post('/registro', ctrlIndex.addUser)
router.post('/login', ctrlIndex.loginUser)
router.get('/validate', ctrlIndex.validateUser)
router.get('/logout', ctrlIndex.logoutUser)
  
export default router