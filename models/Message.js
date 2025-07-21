// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chatRoomId: { // Unique ID for the chat room (e.g., sorted customerId_manufacturerId)
    type: String,
    required: true,
    index: true, // Index for faster queries
  },
  senderId: { // ID of the user who sent the message (customer or manufacturer)
    type: String,
    required: true,
  },
  receiverId: { // ID of the user who is the recipient of the message
    type: String,
    required: true,
  },
  text: { // The message content
    type: String,
    required: true,
  },
  timestamp: { // When the message was sent
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', MessageSchema);
