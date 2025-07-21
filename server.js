const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

// Import DB connection
const connectDB = require('./db');

// Import models
const Message = require('./models/Message');
const ChatRoom = require('./models/ChatRoom');
const Bid = require('./models/Bid');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const bidRoutes = require('./routes/bids');
const aiRoutes = require('./routes/ai');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET','POST','PUT','DELETE'], credentials: true }
});
app.set('io', io);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/ai', aiRoutes);

// Socket.IO handlers
io.on('connection', socket => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on('joinRoom', ({ chatRoomId }) => socket.join(chatRoomId));
  socket.on('sendMessage', async ({ chatRoomId, senderId, receiverId, text }) => {
    try {
      const msg = new Message({ chatRoomId, senderId, receiverId, text });
      await msg.save();
      await ChatRoom.findOneAndUpdate(
        { chatRoomId },
        { lastMessage: text, lastTimestamp: msg.timestamp },
        { upsert: true, new: true }
      );
      io.to(chatRoomId).emit('receiveMessage', msg);
    } catch (e) {
      console.error('Error sending message:', e);
    }
  });
  socket.on('disconnect', () => console.log(`Socket disconnected: ${socket.id}`));
});

// Historical messages
app.get('/api/chat/messages/:chatRoomId', async (req, res) => {
  try {
    const msgs = await Message.find({ chatRoomId: req.params.chatRoomId }).sort({ timestamp: 1 });
    res.json(msgs);
  } catch (e) {
    console.error('Fetch messages error:', e);
    res.status(500).json({ message: 'Server error fetching messages.' });
  }
});

// Manufacturer chat rooms
app.get('/api/chat/manufacturer-rooms/:manufacturerId', async (req, res) => {
  try {
    const rooms = await ChatRoom.find({ participants: req.params.manufacturerId }).sort({ lastTimestamp: -1 });
    res.json(rooms);
  } catch (e) {
    console.error('Fetch rooms error:', e);
    res.status(500).json({ message: 'Server error fetching chat rooms.' });
  }
});

app.get('/', (req, res) => res.send('Artify Prints Backend is running!'));

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
