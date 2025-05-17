import { Router } from 'express';
import * as RoomController from '../controllers/room.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.post('/add', RoomController.createRoom);
router.get('/:id', RoomController.getRoomById);
router.get('/', RoomController.getAllRooms);
router.put('/:id', RoomController.updateRoom);
router.delete('/:id', RoomController.deleteRoom);
router.post('/:roomId/members/:memberId', RoomController.addMemberToRoom);
router.delete('/:roomId/members/:memberId', RoomController.removeMemberFromRoom);
router.get('/:roomId/members', RoomController.getRoomMembers);

export default router;