// // routes/orders.js (Updated)
// const express = require('express');
// const router = express.Router();
// const Order = require('../models/Order'); // Still keep Order model for historical purposes if needed
// const CartItem = require('../models/CartItem'); // To clear cart after order
// const Bid = require('../models/Bid'); // Import the Bid model
// const User = require('../models/User'); // Import User model to get customer name
// // No need for Firebase auth here if using JWT in auth.js for user identification

// // GET all orders (for admin/testing)
// router.get('/', async (req, res) => {
//   try {
//     const orders = await Order.find({});
//     res.json(orders);
//   } catch (err) {
//     console.error('Error fetching orders:', err);
//     res.status(500).json({ message: 'Server error fetching orders.' });
//   }
// });

// // GET a single order by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found.' });
//     }
//     res.json(order);
//   } catch (err) {
//     console.error('Error fetching order by ID:', err);
//     res.status(500).json({ message: 'Server error fetching order.' });
//   }
// });

// // POST a new "order" - this endpoint now initiates a bidding process
// // Instead of creating a direct order, it creates a new bid request
// router.post('/', async (req, res) => {
//   const { userId, orderItems, customerProposedPrice, designType } = req.body;

//   // Basic validation
//   if (!userId) {
//     return res.status(400).json({ message: 'User ID is required to initiate a bid.' });
//   }
//   if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
//     return res.status(400).json({ message: 'Bid must contain items from your cart.' });
//   }
//   if (customerProposedPrice === undefined || typeof customerProposedPrice !== 'number' || customerProposedPrice < 0) {
//     return res.status(400).json({ message: 'A valid proposed price is required for your bid.' });
//   }
//   if (!designType) {
//       return res.status(400).json({ message: 'Design type is required for your bid.' });
//   }

//   // Ensure each item in orderItems has manufacturerId for later chat and order fulfillment
//   const isValidItems = orderItems.every(item =>
//     item.productId && item.name && item.price !== undefined && item.quantity !== undefined && item.manufacturerId
//   );

//   if (!isValidItems) {
//     return res.status(400).json({ message: 'Each item in your bid request must have a product ID, name, price, quantity, and manufacturer ID.' });
//   }

//   try {
//     // Fetch customer's name using their userId from the User model
//     const customer = await User.findById(userId);
//     if (!customer) {
//         return res.status(404).json({ message: 'Customer not found. Cannot place bid.' });
//     }
//     const customerName = customer.name;

//     // Create a new bid document in the database
//     const newBid = new Bid({
//       customerId,
//       customerName,
//       orderItems,
//       customerProposedPrice,
//       designType,
//       status: 'Pending', // Initial status: waiting for manufacturer responses
//     });

//     await newBid.save();

//     // Clear the customer's cart after the bid has been successfully placed
//     await CartItem.deleteMany({});

//     // Emit a Socket.IO event to all connected clients (especially manufacturers)
//     // to notify them about the new bid. Access 'io' via req.app.get('io').
//     if (req.app.get('io')) {
//         req.app.get('io').emit('newBidCreated', newBid);
//         console.log(`New bid created and emitted via Socket.IO: Bid ID ${newBid._id}`);
//     } else {
//         console.warn('Socket.IO instance not available in req.app. New bid notification might be missed.');
//     }

//     console.log(`New bid initiated from order: Bid ID ${newBid._id}, Customer Proposed Price: Rs.${newBid.customerProposedPrice}`);
//     res.status(201).json({
//       message: 'Your bid request has been placed successfully! Manufacturers will review it.',
//       bid: newBid
//     });
//   } catch (err) {
//     console.error('Error initiating bid from order:', err);
//     res.status(500).json({ message: 'Server error initiating bid from order.' });
//   }
// });

// module.exports = router;
// routes/orders.js (Updated with Debugging)
const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Still keep Order model for historical purposes if needed
const CartItem = require('../models/CartItem'); // To clear cart after order
const Bid = require('../models/Bid'); // Import the Bid model
const User = require('../models/User'); // Import User model to get customer name

// GET all orders (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Server error fetching orders.' });
  }
});

// GET a single order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.json(order);
  } catch (err) {
    console.error('Error fetching order by ID:', err);
    res.status(500).json({ message: 'Server error fetching order.' });
  }
});

// POST a new "order" - this endpoint now initiates a bidding process
// Instead of creating a direct order, it creates a new bid request
router.post('/', async (req, res) => {
  const { userId, orderItems, customerProposedPrice, designType } = req.body;

  console.log('Received bid request body:', req.body); // Log incoming request body

  // Basic validation
  if (!userId) {
    console.error('Bid initiation failed: User ID is required.');
    return res.status(400).json({ message: 'User ID is required to initiate a bid.' });
  }
  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    console.error('Bid initiation failed: Bid must contain items from your cart.');
    return res.status(400).json({ message: 'Bid must contain items from your cart.' });
  }
  if (customerProposedPrice === undefined || typeof customerProposedPrice !== 'number' || customerProposedPrice < 0) {
    console.error('Bid initiation failed: Invalid proposed price.');
    return res.status(400).json({ message: 'A valid proposed price is required for your bid.' });
  }
  if (!designType) {
      console.error('Bid initiation failed: Design type is required.');
      return res.status(400).json({ message: 'Design type is required for your bid.' });
  }

  // Ensure each item in orderItems has manufacturerId for later chat and order fulfillment
  const isValidItems = orderItems.every(item =>
    item.productId && item.name && item.price !== undefined && item.quantity !== undefined && item.manufacturerId
  );

  if (!isValidItems) {
    console.error('Bid initiation failed: Each item missing required fields.');
    return res.status(400).json({ message: 'Each item in your bid request must have a product ID, name, price, quantity, and manufacturer ID.' });
  }

  try {
    // Fetch customer's name using their userId from the User model
    console.log(`Attempting to find customer with ID: ${userId}`);
    const customer = await User.findById(userId);
    if (!customer) {
        console.error(`Bid initiation failed: Customer with ID ${userId} not found.`);
        return res.status(404).json({ message: 'Customer not found. Cannot place bid.' });
    }
    const customerName = customer.name;
    console.log(`Found customer: ${customerName}`);

    // Create a new bid document in the database
    const newBid = new Bid({
      customerId: userId, // Use userId from request body
      customerName: customerName,
      orderItems: orderItems,
      customerProposedPrice: customerProposedPrice,
      designType: designType,
      status: 'Pending', // Initial status: waiting for manufacturer responses
    });

    console.log('Attempting to save new bid to DB:', newBid);
    await newBid.save();
    console.log('New bid saved successfully. Bid ID:', newBid._id);

    // Clear the customer's cart after the bid has been successfully placed
    console.log('Attempting to clear cart items...');
    await CartItem.deleteMany({});
    console.log('Cart items cleared successfully.');

    // Emit a Socket.IO event to all connected clients (especially manufacturers)
    if (req.app.get('io')) {
        req.app.get('io').emit('newBidCreated', newBid);
        console.log(`New bid created and emitted via Socket.IO: Bid ID ${newBid._id}`);
    } else {
        console.warn('Socket.IO instance not available in req.app. New bid notification might be missed.');
    }

    console.log(`New bid initiated from order: Bid ID ${newBid._id}, Customer Proposed Price: Rs.${newBid.customerProposedPrice}`);
    res.status(201).json({
      message: 'Your bid request has been placed successfully! Manufacturers will review it.',
      bid: newBid
    });
  } catch (err) {
    console.error('Detailed error during bid initiation (routes/orders.js):', err); // Detailed error log
    res.status(500).json({ message: 'Server error initiating bid from order.' });
  }
});

module.exports = router;
