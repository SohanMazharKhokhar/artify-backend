// models/ChatRoom.js
const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema({
  chatRoomId: { // Unique ID for the chat room (e.g., sorted customerId_manufacturerId)
    type: String,
    required: true,
    unique: true, // Ensure only one document per chat room
  },
  participants: { // Array of participant IDs (customer and manufacturer)
    type: [String],
    required: true,
    index: true, // Index for faster participant lookups
  },
  lastMessage: { // Snippet of the last message
    type: String,
    default: '',
  },
  lastTimestamp: { // Timestamp of the last message
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ChatRoom', ChatRoomSchema);
