// // // In-memory user store
// // const users = [];

// // module.exports = { users };
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, required: true, unique: true },
//   password: String,
// });

// module.exports = mongoose.model('User', userSchema);
// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: { // Defines if the user is a 'Customer', 'Manufacturer', or 'Admin'
    type: String,
    enum: ['Customer', 'Manufacturer', 'Admin'],
    default: 'Customer', // Default role for new signups
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
