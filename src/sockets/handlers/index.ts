import { Server, Socket } from 'socket.io';

export const registerSocketHandlers = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`🔌 New client connected: ${socket.id}`);
        console.log('Socket rooms:', socket.rooms); // Debugging rooms
        console.log('Socket handshake:', socket.handshake); // Debugging handshake details

        // Join room
        socket.on('joinRoom', (roomId: string) => {
            socket.join(roomId);
            console.log(`👥 ${socket.id} joined room: ${roomId}`);
            socket.to(roomId).emit('userJoined', { socketId: socket.id });
        });

        // Handle chat message
        socket.on('sendMessage', (data: { roomId: string; message: string; sender: string }) => {
            io.to(data.roomId).emit('receiveMessage', {
                sender: data.sender,
                message: data.message,
                timestamp: new Date()
            });
        });

        // Typing indicator
        socket.on('typing', (roomId: string) => {
            socket.to(roomId).emit('userTyping', { socketId: socket.id });
        });

        socket.on('stopTyping', (roomId: string) => {
            socket.to(roomId).emit('userStopTyping', { socketId: socket.id });
        });

        socket.on('disconnect', (reason) => {
            console.log('❌ Client disconnected:', socket.id, 'Reason:', reason);
        });
    });
};