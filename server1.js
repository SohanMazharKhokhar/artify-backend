// // server.js (Main Backend Entry Point - Updated)
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const http = require('http'); // Required for Socket.IO
// const { Server } = require('socket.io'); // Socket.IO Server
// const path = require('path'); // Added for serving static files

// // Load environment variables from .env file
// require('dotenv').config();

// // Import the database connection function
// const connectDB = require('./db');

// // Import Mongoose Models for chat and bids
// const Message = require('./models/Message');
// const ChatRoom = require('./models/ChatRoom');
// const Bid = require('./models/Bid'); // Import new Bid model

// const app = express();
// const server = http.createServer(app); // Create HTTP server for Express
// const io = new Server(server, {
//   cors: {
//     origin: "*", // Allow all origins for development (be more specific in production)
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true
//   }
// });

// // Set the 'io' instance on the app object so it can be accessed in routes
// app.set('io', io);

// // Connect to MongoDB using the external db.js function
// connectDB();

// // Middleware
// app.use(cors({
//   origin: "*", // Allow all origins for development (be more specific in production)
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));
// app.use(express.json()); // For parsing application/json bodies

// // Serve static files from the 'public' directory (if you want to serve the simple HTML bidding frontends)
// app.use(express.static(path.join(__dirname, 'public')));

// // Use your API routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/products', require('./routes/products'));
// app.use('/api/cart', require('./routes/cart'));
// app.use('/api/orders', require('./routes/orders')); // This will be updated to trigger bids
// app.use('/api/bids', require('./routes/bids'));     // New bids route

// // Socket.IO connection handling
// io.on('connection', (socket) => {
//   console.log(`Socket connected: ${socket.id}`);

//   // Join a chat room
//   socket.on('joinRoom', ({ chatRoomId }) => {
//     socket.join(chatRoomId);
//     console.log(`Socket ${socket.id} joined room: ${chatRoomId}`);
//   });

//   // Handle new messages
//   socket.on('sendMessage', async ({ chatRoomId, senderId, receiverId, text }) => {
//     try {
//       const newMessage = new Message({ chatRoomId, senderId, receiverId, text });
//       await newMessage.save();

//       // Update last message and timestamp in ChatRoom
//       await ChatRoom.findOneAndUpdate(
//         { chatRoomId },
//         { lastMessage: text, lastTimestamp: newMessage.timestamp },
//         { upsert: true, new: true } // Create if not exists, return updated doc
//       );

//       // Emit message to everyone in the room
//       io.to(chatRoomId).emit('receiveMessage', newMessage);
//       console.log(`Message sent in room ${chatRoomId}: ${text}`);
//     } catch (error) {
//       console.error('Socket.IO: Error sending message:', error);
//     }
//   });

//   // Handle bid updates (real-time notification for manufacturers and customers)
//   // These events are now emitted directly from the bids route using req.app.get('io')
//   // We keep the listeners here for the client-side to connect to.
//   socket.on('disconnect', () => {
//     console.log(`Socket disconnected: ${socket.id}`);
//   });
// });

// // API endpoint to get all messages for a specific chat room
// app.get('/api/chat/messages/:chatRoomId', async (req, res) => {
//   try {
//     const { chatRoomId } = req.params;
//     const messages = await Message.find({ chatRoomId }).sort({ timestamp: 1 }); // Sort by time ascending
//     res.json(messages);
//   } catch (error) {
//     console.error('API: Error fetching historical messages:', error);
//     res.status(500).json({ message: 'Server error fetching chat messages.' });
//   }
// });

// // Get active chat rooms for a specific manufacturer
// app.get('/api/chat/manufacturer-rooms/:manufacturerId', async (req, res) => {
//   try {
//     const { manufacturerId } = req.params;
//     // Find chat rooms where the manufacturerId is a participant
//     const chatRooms = await ChatRoom.find({ participants: manufacturerId }).sort({ lastTimestamp: -1 });
//     res.json(chatRooms);
//   } catch (error) {
//     console.error('API: Error fetching manufacturer chat rooms:', error);
//     res.status(500).json({ message: 'Server error fetching manufacturer chat rooms.' });
//   }
// });

// // Basic route for testing server
// app.get('/', (req, res) => {
//   res.send('Artify Prints Backend is running!');
// });

// // Error handling middleware
// app.use((err, _req, res, _next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Or https if you reverted to HTTPS
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
const server = http.createServer(app); // Or https.createServer if you're using HTTPS
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET','POST','PUT','DELETE'], credentials: true }
});
app.set('io', io);

// Connect to MongoDB
connectDB();

// Middleware
// --- MODIFIED: Simplified CORS configuration for troubleshooting ---
app.use(cors()); // Use the most basic CORS configuration first

app.use(express.json({ limit: '50mb' })); // Allows larger JSON bodies for image data
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Good practice to include if you ever parse URL-encoded data too

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
