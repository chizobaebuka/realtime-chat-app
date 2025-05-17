import { Router } from 'express';
import { register, login, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/', authenticate, getAllUsers);
router.get('/:id', authenticate, getUserById); 
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, isAdmin, deleteUser)


export default router;
