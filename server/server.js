require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Import route files
const authRoutes = require('./routes/auth.routes');
const tourRoutes = require('./routes/tour.routes');
const eventRoutes = require('./routes/event.routes');
const venueRoutes = require('./routes/venue.routes');
const expenseRoutes = require('./routes/expense.routes');
const revenueRoutes = require('./routes/revenue.routes');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tour-planning-assistant';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join_tour', (tourId) => {
    socket.join(tourId);
    console.log(`User joined tour: ${tourId}`);
  });
  
  socket.on('leave_tour', (tourId) => {
    socket.leave(tourId);
    console.log(`User left tour: ${tourId}`);
  });
  
  socket.on('tour_update', (data) => {
    socket.to(data.tourId).emit('tour_updated', data);
  });
  
  socket.on('event_update', (data) => {
    socket.to(data.tourId).emit('event_updated', data);
  });
  
  socket.on('new_message', (data) => {
    socket.to(data.tourId).emit('message_received', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/revenue', revenueRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };