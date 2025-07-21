// const mongoose = require('mongoose');

// const cartItemSchema = new mongoose.Schema({
//   id: { type: Number, required: true }, // product ID
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   image: String,
//   quantity: { type: Number, default: 1 },
// });

// module.exports = mongoose.model('CartItem', cartItemSchema);
// models/CartItem.js
const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  id: { // This is the product's original ID (e.g., 101, 201)
    type: String,
    required: true,
    unique: true, // Ensures only one entry per product ID in the cart at a time
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  manufacturerId: { // Storing manufacturerId with the cart item is crucial for chat
    type: String,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CartItem', CartItemSchema);
