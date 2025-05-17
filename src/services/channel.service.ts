import { IChannel } from '../models/channel';
import * as repo from '../repositories/channel.repo';
import { Types } from 'mongoose';

export const create = (data: Partial<IChannel>): Promise<IChannel> => {
    return repo.createChannel({
        ...data,
        createdBy: new Types.ObjectId(data.createdBy)
    });
};

export const findAll = (): Promise<IChannel[]> => repo.getAllChannels();
export const findById = (id: string): Promise<IChannel | null> => repo.getChannelById(id);
export const update = (id: string, data: Partial<IChannel>): Promise<IChannel | null> => repo.updateChannel(id, data);
export const remove = (id: string): Promise<IChannel | null> => repo.deleteChannel(id);

export const addMember = (channelId: string, userId: string): Promise<IChannel | null> => repo.addMemberToChannel(channelId, userId);
export const removeMember = (channelId: string, userId: string): Promise<IChannel | null> => repo.removeMemberFromChannel(channelId, userId);
export const promoteModerator = (channelId: string, userId: string): Promise<IChannel | null> => repo.assignModerator(channelId, userId);
export const demoteModerator = (channelId: string, userId: string): Promise<IChannel | null> => repo.revokeModerator(channelId, userId);
