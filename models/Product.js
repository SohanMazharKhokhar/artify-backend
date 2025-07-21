// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id: { // Using a simple ID for consistency with your frontend's product structure
    type: Number, // Or String, depending on your product IDs
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false, // Image URL can be optional
  },
  manufacturerId: { // This links the product to a specific manufacturer user
    type: String, // Will store the MongoDB _id of the manufacturer user
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', ProductSchema);
