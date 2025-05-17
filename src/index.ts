import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
// import { registerSocketHandlers } from './sockets/handlers';
import path from 'path';
import userRoutes from './routes/user.routes';
import { handleChat } from './sockets/handlers/chat.handler';
import configureMessageRoutes from './routes/message.routes';
import RoomRoutes from './routes/room.routes';
import ChannelRoutes from './routes/channel.routes';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

app.use(express.json());
app.use(cors());
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", 'https://cdn.socket.io', "'unsafe-inline'"],
                scriptSrcAttr: ["'unsafe-inline'"],
                connectSrc: ["'self'", "ws:", "wss:"],
            },
        },
    })
);

const PORT = process.env.PORT ?? 4401;
const MONGO_URI = process.env.MONGO_URI || '';

app.get('/test', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'test-client.html'));
});

// Register socket handlers
// registerSocketHandlers(io);
io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);
    // console.log('Socket handshake:', socket.handshake); // Debug handshake details

    handleChat(io, socket);

    socket.on('disconnect', (reason) => {
        console.log('❌ Client disconnected:', socket.id, 'Reason:', reason);
    });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', configureMessageRoutes(io));
app.use('/api/rooms', RoomRoutes);
app.use('/api/channels', ChannelRoutes);

mongoose.connect(MONGO_URI).then(() => {
    console.log('✅ MongoDB connected');

    server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('❌ MongoDB connection failed:', err);
});