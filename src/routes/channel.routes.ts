import { Router } from 'express';
import * as ChannelController from '../controllers/channel.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.post('/add', ChannelController.createChannel);
router.get('/:id', ChannelController.getChannelById);
router.get('/', ChannelController.getChannels);
router.put('/:id', ChannelController.updateChannel);
router.delete('/:id', ChannelController.deleteChannel);
router.post('/add-member', authenticate, authorize('admin'), ChannelController.addMember);
router.post('/remove-member', authenticate, authorize('admin'), ChannelController.removeMember);
router.post('/promote-moderator', authenticate, authorize('admin'), ChannelController.promoteModerator);
router.post('/demote-moderator', authenticate, authorize('admin'), ChannelController.demoteModerator);

export default router;