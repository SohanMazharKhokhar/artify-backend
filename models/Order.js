// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   items: [
//     {
//       id: Number,
//       name: String,
//       price: Number,
//       quantity: Number,
//       image: String,
//     },
//   ],
//   totalAmount: Number,
//   status: { type: String, default: 'Pending' },
//   date: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Order', orderSchema);
// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { // The ID of the customer who placed the order
    type: String, // Will store the MongoDB _id of the customer user
    required: true,
  },
  items: [ // Array of products in the order
    {
      productId: { type: Number, required: true }, // The product's original ID
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: false },
      manufacturerId: { type: String, required: true }, // Crucial for linking to chat
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', OrderSchema);
