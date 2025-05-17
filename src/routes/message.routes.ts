import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { deleteMessage, getMessagesBetweenUsers, getMessagesInRoom, getUserMessages, sendMessage } from '../controllers/message.controller';
import { Server } from 'socket.io';

const router = Router();

export const configureMessageRoutes = (io: Server) => {
    router.post('/create-message', authenticate, sendMessage(io));
    router.get('/:roomId', authenticate, getMessagesInRoom);
    router.get('/:senderId/:receiverId', authenticate, getMessagesBetweenUsers);
    router.get('/user/:userId', authenticate, getUserMessages);
    router.delete('/:messageId', authenticate, deleteMessage);
    return router;
};

export default configureMessageRoutes;
