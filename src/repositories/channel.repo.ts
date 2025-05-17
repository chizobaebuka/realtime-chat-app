import { ChannelModel, IChannel } from "../models/channel";


export const createChannel = (data: Partial<IChannel>): Promise<IChannel> => {
    return ChannelModel.create(data);
};

export const getAllChannels = (): Promise<IChannel[]> => {
    return ChannelModel.find();
};

export const getChannelById = (id: string): Promise<IChannel | null> => {
    return ChannelModel.findById(id);
};

export const updateChannel = (id: string, data: Partial<IChannel>): Promise<IChannel | null> => {
    return ChannelModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteChannel = (id: string): Promise<IChannel | null> => {
    return ChannelModel.findByIdAndDelete(id);
};

export const addMemberToChannel = (channelId: string, userId: string): Promise<IChannel | null> => {
    return ChannelModel.findByIdAndUpdate(
        channelId,
        { $addToSet: { members: userId } },
        { new: true }
    );
};

export const removeMemberFromChannel = (channelId: string, userId: string): Promise<IChannel | null> => {
    return ChannelModel.findByIdAndUpdate(
        channelId,
        { $pull: { members: userId } },
        { new: true }
    );
};

export const assignModerator = (channelId: string, userId: string): Promise<IChannel | null> => {
    return ChannelModel.findByIdAndUpdate(
        channelId,
        { $addToSet: { moderators: userId } },
        { new: true }
    );
};

export const revokeModerator = (channelId: string, userId: string): Promise<IChannel | null> => {
    return ChannelModel.findByIdAndUpdate(
        channelId,
        { $pull: { moderators: userId } },
        { new: true }
    );
};