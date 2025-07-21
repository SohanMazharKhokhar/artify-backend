// models/Bid.js
const mongoose = require('mongoose');

// Define the schema for a single manufacturer's response to a bid
const ManufacturerResponseSchema = new mongoose.Schema({
  manufacturerId: {
    type: String, // ID of the manufacturer
    required: true,
  },
  manufacturerName: {
    type: String,
    required: true,
  },
  proposedPrice: { // Manufacturer's offered price (if countering)
    type: Number,
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'], // Status of *this specific manufacturer's response* by the customer
    default: 'Pending',
  },
  responseDate: {
    type: Date,
    default: Date.now,
  },
});

// Define the main Bid Schema
const BidSchema = new mongoose.Schema({
  customerId: {
    type: String, // ID of the customer who placed the bid
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  orderItems: [ // Details of the products included in this bid request
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String },
      manufacturerId: { type: String, required: true }, // Original manufacturer of the product
    },
  ],
  customerProposedPrice: { // The initial price the customer is bidding for the entire order
    type: Number,
    required: true,
  },
  designType: {
    type: String, // E.g., 'Custom', 'Predefined' - from customer.html example
    required: true,
  },
  status: { // Overall status of the bid
    type: String,
    enum: [
      'Pending',                  // Customer has submitted, waiting for manufacturers
      'Manufacturer Countered',   // At least one manufacturer has countered
      'Manufacturer Accepted',    // At least one manufacturer has accepted the customer's original bid
      'Customer Accepted',        // Customer has accepted a specific manufacturer's proposal
      'Customer Rejected',        // Customer has rejected all proposals (or the overall bid)
      'Cancelled',                // Bid was cancelled
    ],
    default: 'Pending',
  },
  manufacturerResponses: [ManufacturerResponseSchema], // Array of responses from different manufacturers
  acceptedManufacturerId: { // ID of the manufacturer whose bid was accepted by the customer
    type: String,
    default: null,
  },
  finalPrice: { // The final agreed-upon price for the bid
    type: Number,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `updatedAt` field before saving
BidSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Bid', BidSchema);
