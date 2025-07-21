// routes/bids.js
const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid'); // Import the new Bid model
const User = require('../models/User'); // Assuming you have a User model to fetch user details by ID

// POST /api/bids - Customer submits a new bid request
router.post('/', async (req, res) => {
  const { customerId, orderItems, customerProposedPrice, designType } = req.body;

  // Basic validation for essential fields
  if (!customerId || !orderItems || orderItems.length === 0 || customerProposedPrice === undefined || designType === undefined) {
    return res.status(400).json({ message: 'Missing required bid details: customerId, orderItems, customerProposedPrice, or designType.' });
  }

  // Ensure each item in orderItems has necessary fields, including manufacturerId
  const isValidItems = orderItems.every(item =>
    item.productId && item.name && item.price !== undefined && item.quantity !== undefined && item.manufacturerId
  );
  if (!isValidItems) {
    return res.status(400).json({ message: 'Each order item must have productId, name, price, quantity, and manufacturerId.' });
  }

  try {
    // Fetch customer's name using their ID
    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    const customerName = customer.name;

    const newBid = new Bid({
      customerId,
      customerName,
      orderItems,
      customerProposedPrice,
      designType,
      status: 'Pending', // Initial status when customer creates it
    });
    await newBid.save();

    // Emit a Socket.IO event to notify manufacturers about the new bid
    // The 'io' object is assumed to be available via req.app.get('io')
    if (req.app.get('io')) {
      req.app.get('io').emit('newBidCreated', newBid);
      console.log('New bid created and emitted via Socket.IO:', newBid._id);
    } else {
      console.warn('Socket.IO instance not available in req.app. Bids won\'t be emitted in real-time.');
    }

    res.status(201).json({ message: 'Your bid has been submitted successfully!', bid: newBid });
  } catch (error) {
    console.error('Error submitting bid:', error);
    res.status(500).json({ message: 'Server error submitting bid.' });
  }
});

// GET /api/bids/customer/:customerId - Get all bids submitted by a specific customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const bids = await Bid.find({ customerId: req.params.customerId }).sort({ createdAt: -1 });
    res.json(bids);
  } catch (error) {
    console.error('Error fetching customer bids:', error);
    res.status(500).json({ message: 'Server error fetching customer bids.' });
  }
});

// GET /api/bids/manufacturer/:manufacturerId - Get bids relevant to a specific manufacturer
// This includes 'Pending' bids (open for response) and bids they have already responded to or accepted.
router.get('/manufacturer/:manufacturerId', async (req, res) => {
  try {
    const manufacturerId = req.params.manufacturerId;
    const bids = await Bid.find({
      $or: [
        { status: 'Pending' }, // All pending bids are visible to any manufacturer
        { 'manufacturerResponses.manufacturerId': manufacturerId }, // Bids they have already responded to
        { acceptedManufacturerId: manufacturerId } // Bids they won and were accepted by the customer
      ]
    }).sort({ createdAt: -1 }); // Sort by creation date, newest first
    res.json(bids);
  } catch (error) {
    console.error('Error fetching manufacturer bids:', error);
    res.status(500).json({ message: 'Server error fetching manufacturer bids.' });
  }
});

// POST /api/bids/:bidId/respond - Manufacturer responds to a bid (accept, reject, counter)
router.post('/:bidId/respond', async (req, res) => {
  const { manufacturerId, manufacturerName, action, proposedPrice } = req.body; // action can be 'Accept', 'Reject', 'Counter'
  const { bidId } = req.params;

  if (!manufacturerId || !manufacturerName || !action) {
    return res.status(400).json({ message: 'Missing manufacturer details or action.' });
  }
  // If action is 'Counter', proposedPrice is mandatory and must be a valid number
  if (action === 'Counter' && (proposedPrice === undefined || typeof proposedPrice !== 'number' || proposedPrice < 0)) {
    return res.status(400).json({ message: 'Proposed price is required and must be a valid number for a counter offer.' });
  }

  try {
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found.' });
    }

    // A manufacturer can only respond to a bid that is 'Pending' or if they have previously countered it.
    // If the bid is already accepted by the customer, no further responses are allowed.
    if (bid.status === 'Customer Accepted' || bid.status === 'Customer Rejected') {
      return res.status(400).json({ message: 'This bid has already been finalized by the customer.' });
    }

    let manufacturerResponseStatus = 'Pending'; // Default status for a new manufacturer response

    if (action === 'Accept') {
      // Manufacturer accepts customer's original price
      manufacturerResponseStatus = 'Accepted';
      // If a manufacturer accepts the customer's price, it becomes the final offer for this manufacturer
      newProposedPrice = bid.customerProposedPrice;
    } else if (action === 'Reject') {
      // Manufacturer rejects the bid
      manufacturerResponseStatus = 'Rejected';
    } else if (action === 'Counter') {
      // Manufacturer makes a counter offer
      manufacturerResponseStatus = 'Pending'; // This response is pending customer's review
      newProposedPrice = proposedPrice;
    } else {
      return res.status(400).json({ message: 'Invalid manufacturer action.' });
    }

    // Find if this manufacturer has already responded
    const existingResponseIndex = bid.manufacturerResponses.findIndex(
      (response) => response.manufacturerId === manufacturerId
    );

    const newResponse = {
      manufacturerId,
      manufacturerName,
      proposedPrice: newProposedPrice, // Use the determined proposed price
      status: manufacturerResponseStatus,
      responseDate: new Date(),
    };

    if (existingResponseIndex > -1) {
      // Update existing response
      bid.manufacturerResponses[existingResponseIndex] = newResponse;
    } else {
      // Add new response
      bid.manufacturerResponses.push(newResponse);
    }

    // Update the overall bid status based on manufacturer's action
    if (action === 'Accept') {
        // If a manufacturer accepts the original bid, set overall status to 'Manufacturer Accepted'
        // This means the customer's original terms were met by at least one manufacturer
        bid.status = 'Manufacturer Accepted';
        bid.acceptedManufacturerId = manufacturerId; // Temporarily mark who accepted
        bid.finalPrice = bid.customerProposedPrice;
    } else if (action === 'Counter') {
        // If a manufacturer counters, the overall bid moves to 'Manufacturer Countered'
        bid.status = 'Manufacturer Countered';
    }
    // If action is 'Reject', the overall status doesn't change yet unless all manufacturers reject.
    // We'll let the customer decide what to do with the overall bid based on responses.


    await bid.save();

    // Emit a Socket.IO event for bid update to notify relevant parties
    if (req.app.get('io')) {
        req.app.get('io').emit('bidUpdated', bid);
        console.log('Bid updated by manufacturer and emitted via Socket.IO:', bid._id);
    }

    res.json({ message: `Bid ${action} by manufacturer!`, bid });
  } catch (error) {
    console.error('Error responding to bid:', error);
    res.status(500).json({ message: 'Server error responding to bid.' });
  }
});


// POST /api/bids/:bidId/customer-action - Customer accepts/rejects a specific manufacturer's proposal
router.post('/:bidId/customer-action', async (req, res) => {
    const { action, manufacturerId } = req.body; // action: 'AcceptProposal' or 'RejectProposal'
    const { bidId } = req.params;

    if (!action || !manufacturerId) {
        return res.status(400).json({ message: 'Missing action or manufacturerId.' });
    }

    try {
        const bid = await Bid.findById(bidId);
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found.' });
        }

        // If the bid is already finalized, prevent further actions
        if (bid.status === 'Customer Accepted' || bid.status === 'Customer Rejected') {
            return res.status(400).json({ message: 'This bid has already been finalized.' });
        }

        const manufacturerResponse = bid.manufacturerResponses.find(
            (response) => response.manufacturerId === manufacturerId
        );

        if (!manufacturerResponse) {
            return res.status(404).json({ message: 'Manufacturer response not found for this bid.' });
        }

        if (action === 'AcceptProposal') {
            // Set overall bid status to 'Customer Accepted'
            bid.status = 'Customer Accepted';
            // Mark this specific manufacturer's response as 'Accepted'
            manufacturerResponse.status = 'Accepted';
            // Store the ID of the accepted manufacturer and the final agreed price
            bid.acceptedManufacturerId = manufacturerId;
            bid.finalPrice = manufacturerResponse.proposedPrice || bid.customerProposedPrice; // Use proposed price, fallback to customer's original
        } else if (action === 'RejectProposal') {
            // Mark this specific manufacturer's response as 'Rejected'
            manufacturerResponse.status = 'Rejected';
            // Check if all manufacturer responses are now rejected
            const allResponsesRejected = bid.manufacturerResponses.every(res => res.status === 'Rejected');
            if (allResponsesRejected) {
                bid.status = 'Customer Rejected'; // Overall bid status becomes 'Customer Rejected'
                bid.acceptedManufacturerId = null;
                bid.finalPrice = null;
            }
        } else {
            return res.status(400).json({ message: 'Invalid customer action for proposal.' });
        }

        await bid.save();

        // Emit a Socket.IO event for bid update to notify relevant parties
        if (req.app.get('io')) {
            req.app.get('io').emit('bidUpdated', bid);
            console.log('Bid updated by customer (action on proposal) and emitted via Socket.IO:', bid._id);
        }

        res.json({ message: `Customer ${action} for bid ${bidId} by manufacturer ${manufacturerName}!`, bid });
    } catch (error) {
        console.error('Error customer acting on bid proposal:', error);
        res.status(500).json({ message: 'Server error customer acting on bid proposal.' });
    }
});


module.exports = router;
