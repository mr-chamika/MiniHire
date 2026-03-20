import { Server } from "socket.io";
import { createServer } from "http";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('join', (studentId) => {
        socket.join(studentId);
        console.log(`User ${socket.id} joined room ${studentId}`);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

httpServer.listen(3001, () => {
    console.log('Socket.io server running on port 3001');
});

export { io };