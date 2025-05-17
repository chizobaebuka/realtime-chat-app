import { Server, Socket } from 'socket.io';
import { deleteMessageById, getMessagesByRoom, saveMessage } from '../../repositories/message.repo';
import * as RoomService from '../../services/room.service';
export const handleChat = (io: Server, socket: Socket) => {
    socket.on('joinRoom', async ({ roomId }) => {
        // Ensure the room exists in the database
        const room = await RoomService.getRoomById(roomId);
        if (!room) {
            socket.emit('error', { message: 'Room not found' });
            return;
        }
        // Check if the user is a member of the room
        const isMember = room.members.some((member) => member.toString() === socket.id);
        if (!isMember) {
            socket.emit('error', { message: 'You are not a member of this room' });
            return;
        }
        // Check if the user is already in the room
        if (socket.rooms.has(roomId)) {
            socket.emit('error', { message: 'You are already in this room' });
            return;
        }
        // Join the room
        for (const room of socket.rooms) {
            if (room !== socket.id) { // Avoid leaving the default room (socket.id)
                socket.leave(room);
            }
        }
        socket.rooms.clear(); // Clear the rooms set
        socket.rooms.add(roomId); // Add the new room
        socket.join(roomId); // Join the room
        socket.to(roomId).emit('userJoined', { userId: socket.id });
    });

    socket.on('sendMessage', async (data) => {
        const { content, sender, receiver, roomId } = data;
        const message = await saveMessage({ content, sender, receiver, roomId });
        io.to(roomId).emit('newMessage', message);
    });

    socket.on('getMessages', async ({ roomId }) => {
        const messages = await getMessagesByRoom(roomId);
        socket.emit('messages', messages);
    });

    socket.on('deleteMessage', async ({ messageId }) => {
        const message = await deleteMessageById(messageId);
        if (message && message.roomId) {
            io.to(message.roomId.toString()).emit('messageDeleted', message);
        }
    });

    socket.on('typing', ({ roomId, user }) => {
        socket.to(roomId).emit('userTyping', { user });
    });

    socket.on('leaveRoom', ({ roomId }) => {
        socket.leave(roomId);
        socket.to(roomId).emit('userLeft', { userId: socket.id });
    });
};