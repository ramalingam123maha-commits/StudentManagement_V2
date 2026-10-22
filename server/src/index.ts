import express, { Express, Request, Response } from 'express';
import cors from 'express-cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import connectDB from './config/database';
import authRoutes from './routes/auth.routes';
import studentRoutes from './routes/student.routes';
import enrollmentRoutes from './routes/enrollment.routes';
import reportRoutes from './routes/report.routes';
import hotelRoutes from './routes/hotel.routes';
import taskRoutes from './routes/task.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/hotel', hotelRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// WebSocket Connection
io.on('connection', (socket) => {
  console.log('New WebSocket connection:', socket.id);

  // Student Management events
  socket.on('student:enrolled', (data) => {
    io.emit('student:enrolled', data);
  });

  socket.on('student:progress-updated', (data) => {
    io.emit('student:progress-updated', data);
  });

  // Hotel Management events
  socket.on('room:booked', (data) => {
    io.emit('room:booked', data);
  });

  socket.on('room:checkin', (data) => {
    io.emit('room:checkin', data);
  });

  socket.on('room:checkout', (data) => {
    io.emit('room:checkout', data);
  });

  // Task Management events
  socket.on('task:created', (data) => {
    io.emit('task:created', data);
  });

  socket.on('task:updated', (data) => {
    io.emit('task:updated', data);
  });

  socket.on('task:assigned', (data) => {
    io.emit('task:assigned', data);
  });

  socket.on('disconnect', () => {
    console.log('WebSocket connection closed:', socket.id);
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Database: ${process.env.MONGODB_URI || 'mongodb://localhost:27017'}`);
});

export { io };
