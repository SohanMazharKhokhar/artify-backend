// // const express = require('express');
// // const router = express.Router();

// // let cart = [];

// // // GET cart items
// // router.get('/', (req, res) => {
// //   res.json(cart);
// // });

// // // ADD to cart
// // router.post('/', (req, res) => {
// //   const product = req.body;
  
// //   if (!product.id || !product.name || !product.price) {
// //     return res.status(400).json({ message: 'Invalid product data' });
// //   }

// //   cart.push(product);
// //   res.status(201).json(cart);
// // });

// // // REMOVE from cart
// // router.delete('/:id', (req, res) => {
// //   const { id } = req.params;
// //   cart = cart.filter(item => item.id !== parseInt(id));
// //   res.json(cart);
// // });

// // module.exports = router;
// //working 
// // const express = require('express');
// // const router = express.Router();

// // // A simple in-memory array to store cart items.
// // // In a real application, this would be a database.
// // let cart = [];

// // // GET cart items
// // router.get('/', (req, res) => {
// //     // When sending cart items, ensure 'quantity' is part of the object
// //     res.json(cart);
// // });

// // // ADD to cart or UPDATE quantity if item already exists
// // router.post('/', (req, res) => {
// //     const { id, name, price, image, quantity = 1 } = req.body; // Expect quantity from frontend

// //     if (!id || !name || price === undefined) { // Check for basic required product info
// //         return res.status(400).json({ message: 'Invalid product data: id, name, and price are required.' });
// //     }

// //     const existingItemIndex = cart.findIndex(item => item.id === id);

// //     if (existingItemIndex > -1) {
// //         // Item exists, update its quantity
// //         cart[existingItemIndex].quantity += quantity; // Add the new quantity to existing
// //         console.log(`Updated quantity for item ${name}. New quantity: ${cart[existingItemIndex].quantity}`);
// //     } else {
// //         // Item does not exist, add it to the cart
// //         cart.push({ id, name, price, image, quantity });
// //         console.log(`Added new item to cart: ${name}`);
// //     }
// //     res.status(201).json(cart);
// // });

// // // REMOVE from cart
// // router.delete('/:id', (req, res) => {
// //     const { id } = req.params;
// //     const initialLength = cart.length;
// //     cart = cart.filter(item => item.id !== parseInt(id)); // Ensure ID is parsed as integer
// //     if (cart.length < initialLength) {
// //         console.log(`Removed item with ID: ${id}`);
// //         res.json({ message: 'Item removed successfully', cart });
// //     } else {
// //         res.status(404).json({ message: 'Item not found in cart.' });
// //     }
// // });

// // // (Optional) Update quantity for a specific item (more robust for production)
// // router.put('/:id', (req, res) => {
// //     const { id } = req.params;
// //     const { quantity } = req.body;

// //     if (quantity === undefined || typeof quantity !== 'number' || quantity < 1) {
// //         return res.status(400).json({ message: 'Invalid quantity provided.' });
// //     }

// //     const itemIndex = cart.findIndex(item => item.id === parseInt(id));

// //     if (itemIndex > -1) {
// //         cart[itemIndex].quantity = quantity;
// //         res.json({ message: 'Quantity updated successfully', item: cart[itemIndex] });
// //     } else {
// //         res.status(404).json({ message: 'Item not found in cart.' });
// //     }
// // });


// // module.exports = router;
// //new 
// const express = require('express');
// const CartItem = require('../models/CartItem');
// const router = express.Router();

// // GET all cart items
// router.get('/', async (req, res) => {
//   const items = await CartItem.find();
//   res.json(items);
// });

// // ADD or update item in cart
// router.post('/', async (req, res) => {
//   const { id, name, price, image, quantity = 1 } = req.body;

//   if (!id || !name || price === undefined) {
//     return res.status(400).json({ message: 'Invalid product data.' });
//   }

//   let item = await CartItem.findOne({ id });

//   if (item) {
//     item.quantity += quantity;
//     await item.save();
//     console.log(`Updated quantity for ${item.name}`);
//   } else {
//     item = new CartItem({ id, name, price, image, quantity });
//     await item.save();
//     console.log(`Added new item to cart: ${name}`);
//   }

//   res.status(201).json(item);
// });

// // DELETE item from cart
// router.delete('/:id', async (req, res) => {
//   const id = parseInt(req.params.id);
//   const result = await CartItem.deleteOne({ id });

//   if (result.deletedCount === 1) {
//     res.json({ message: 'Item removed successfully' });
//   } else {
//     res.status(404).json({ message: 'Item not found' });
//   }
// });

// // UPDATE item quantity
// router.put('/:id', async (req, res) => {
//   const id = parseInt(req.params.id);
//   const { quantity } = req.body;

//   if (!quantity || typeof quantity !== 'number' || quantity < 1) {
//     return res.status(400).json({ message: 'Invalid quantity' });
//   }

//   const item = await CartItem.findOne({ id });

//   if (item) {
//     item.quantity = quantity;
//     await item.save();
//     res.json({ message: 'Quantity updated', item });
//   } else {
//     res.status(404).json({ message: 'Item not found' });
//   }
// });

// module.exports = router;
// routes/cart.js
const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');

// GET all cart items
router.get('/', async (req, res) => {
  try {
    const items = await CartItem.find({}); // Fetch all items
    res.json(items);
  } catch (err) {
    console.error('Error fetching cart items:', err);
    res.status(500).json({ message: 'Server error fetching cart.' });
  }
});

// ADD or update item in cart
router.post('/', async (req, res) => {
  const { id, name, price, image, quantity = 1, manufacturerId } = req.body;

  if (!id || !name || price === undefined || !manufacturerId) {
    return res.status(400).json({ message: 'Invalid product data: missing id, name, price, or manufacturerId.' });
  }

  try {
    let item = await CartItem.findOne({ id }); // Find item by product ID

    if (item) {
      item.quantity += quantity;
      await item.save();
      console.log(`Backend: Updated quantity for ${item.name} in cart.`);
    } else {
      item = new CartItem({
        id,
        name,
        price,
        image,
        quantity,
        manufacturerId, // Save the manufacturerId
      });
      await item.save();
      console.log(`Backend: Added new item to cart: ${name} with manufacturerId: ${manufacturerId}`);
    }

    res.status(201).json(item);
  } catch (err) {
    console.error('Error adding/updating cart item:', err);
    res.status(500).json({ message: 'Server error adding item to cart.' });
  }
});

// DELETE item from cart
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await CartItem.deleteOne({ id });
    if (result.deletedCount === 1) {
      res.json({ message: 'Item removed successfully from cart.' });
    } else {
      res.status(404).json({ message: 'Item not found in cart.' });
    }
  } catch (err) {
    console.error('Error deleting cart item:', err);
    res.status(500).json({ message: 'Server error removing item from cart.' });
  }
});

// UPDATE item quantity
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { quantity } = req.body;

  if (quantity === undefined || typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).json({ message: 'Invalid quantity provided.' });
  }

  try {
    const item = await CartItem.findOne({ id });
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    item.quantity = quantity;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error('Error updating cart item quantity:', err);
    res.status(500).json({ message: 'Server error updating item quantity.' });
  }
});

// DELETE all items from cart (useful after order submission)
router.delete('/clear', async (req, res) => {
  try {
    await CartItem.deleteMany({});
    res.json({ message: 'Cart cleared successfully.' });
  } catch (err) {
    console.error('Error clearing cart:', err);
    res.status(500).json({ message: 'Server error clearing cart.' });
  }
});

module.exports = router;
