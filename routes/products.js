// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Import the Product Mongoose model

// Seed initial products (for demonstration, you can remove this after first run)
const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const initialProducts = [
        // T-Shirts (10)
        { id: 111, name: 'Minimalist White Tee', price: 849, type: 'T-Shirts', image: 'https://images.pexels.com/photos/1261422/pexels-photo-1261422.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 112, name: 'Urban Style White Tee', price: 799, type: 'T-Shirts', image: 'https://images.pexels.com/photos/1304647/pexels-photo-1304647.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 113, name: 'Everyday Comfort Tee', price: 699, type: 'T-Shirts', image: 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 114, name: 'Motivational Quote Tee', price: 899, type: 'T-Shirts', image: 'https://images.pexels.com/photos/1566412/pexels-photo-1566412.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 115, name: 'Nature Explorer Shirt', price: 999, type: 'T-Shirts', image: 'https://images.pexels.com/photos/1887975/pexels-photo-1887975.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 116, name: 'Bright Casual Tee', price: 749, type: 'T-Shirts', image: 'https://images.pexels.com/photos/1311590/pexels-photo-1311590.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 117, name: 'Relax Fit Tee for Women', price: 899, type: 'T-Shirts', image: 'https://images.pexels.com/photos/1861907/pexels-photo-1861907.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 118, name: 'Vintage Camera Tee', price: 799, type: 'T-Shirts', image: 'https://images.pexels.com/photos/2062324/pexels-photo-2062324.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 119, name: 'Floral Field Tee', price: 949, type: 'T-Shirts', image: 'https://images.pexels.com/photos/220139/pexels-photo-220139.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 120, name: 'Studio White Tee', price: 879, type: 'T-Shirts', image: 'https://images.pexels.com/photos/1261422/pexels-photo-1261422.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 105, name: 'Custom Summer Shirt - Wave', price: 999, type: 'T-Shirts', image: 'https://images.pexels.com/photos/1484807/pexels-photo-1484807.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 106, name: 'Custom Summer Shirt - Surf', price: 899, type: 'T-Shirts', image: 'https://images.pexels.com/photos/3631430/pexels-photo-3631430.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 107, name: 'Custom Summer Shirt - Island', price: 799, type: 'T-Shirts', image: 'https://images.pexels.com/photos/325521/pexels-photo-325521.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 108, name: 'Custom Summer Shirt - Coconut', price: 949, type: 'T-Shirts', image: 'https://images.pexels.com/photos/3731256/pexels-photo-3731256.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 109, name: 'Custom Summer Shirt - Ocean', price: 899, type: 'T-Shirts', image: 'https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 110, name: 'Custom Summer Shirt - Sand', price: 699, type: 'T-Shirts', image: 'https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg', manufacturerId: 'seed_manufacturer_id' },

        // Mugs (20)
        { id: 201, name: 'Classic Coffee Mug', price: 349, type: 'Mugs', image: 'https://images.pexels.com/photos/4792391/pexels-photo-4792391.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 202, name: 'Nescafe Gold Mug', price: 399, type: 'Mugs', image: 'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 203, name: 'Minimalist Coffee Mug', price: 299, type: 'Mugs', image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 204, name: 'Vintage Nescafe Mug', price: 449, type: 'Mugs', image: 'https://images.pexels.com/photos/905485/pexels-photo-905485.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 205, name: 'Ceramic Coffee Mug', price: 379, type: 'Mugs', image: 'https://images.pexels.com/photos/1727123/pexels-photo-1727123.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 206, name: 'Black Nescafe Mug', price: 499, type: 'Mugs', image: 'https://images.pexels.com/photos/887751/pexels-photo-887751.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 207, name: 'Glass Coffee Mug', price: 599, type: 'Mugs', image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 208, name: 'Travel Coffee Mug', price: 699, type: 'Mugs', image: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 209, name: 'Espresso Nescafe Mug', price: 549, type: 'Mugs', image: 'https://images.pexels.com/photos/5587028/pexels-photo-5587028.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 210, name: 'Double-Wall Coffee Mug', price: 649, type: 'Mugs', image: 'https://images.pexels.com/photos/374147/pexels-photo-374147.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 211, name: 'Classic White Mug', price: 399, type: 'Mugs', image: 'https://images.pexels.com/photos/939833/pexels-photo-939833.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 212, name: 'Soft Focus Mug Shot', price: 449, type: 'Mugs', image: 'https://images.pexels.com/photos/1755215/pexels-photo-1755215.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 213, name: 'Coffee Beans Mug', price: 499, type: 'Mugs', image: 'https://images.pexels.com/photos/585753/pexels-photo-585753.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 214, name: 'No Caffeine Mug', price: 479, type: 'Mugs', image: 'https://images.pexels.com/photos/1925534/pexels-photo-1925534.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 215, name: 'Minimal Black Mug', price: 519, type: 'Mugs', image: 'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 216, name: 'Goal-Oriented Mug', price: 429, type: 'Mugs', image: 'https://images.pexels.com/photos/714093/pexels-photo-714093.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 217, name: 'Red Mug Set', price: 549, type: 'Mugs', image: 'https://images.pexels.com/photos/1187317/pexels-photo-1187317.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 218, name: 'Natural Toned Mug', price: 379, type: 'Mugs', image: 'https://images.pexels.com/photos/894010/pexels-photo-894010.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 219, name: 'Elegant Black Mug', price: 599, type: 'Mugs', image: 'https://images.pexels.com/photos/3483967/pexels-photo-3483967.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 220, name: 'Moody Ceramic Mug', price: 639, type: 'Mugs', image: 'https://images.pexels.com/photos/3806690/pexels-photo-3806690.jpeg', manufacturerId: 'seed_manufacturer_id' },

        // Posters (10)
        { id: 301, name: 'Vintage Movie Poster', price: 499, type: 'Posters', image: 'https://images.pexels.com/photos/33129/popcorn-movie-party-entertainment.jpg', manufacturerId: 'seed_manufacturer_id' },
        { id: 302, name: 'Motivational Quote Poster', price: 399, type: 'Posters', image: 'https://images.pexels.com/photos/733856/pexels-photo-733856.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 303, name: 'Space Exploration Poster', price: 599, type: 'Posters', image: 'https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg', manufacturerId: 'seed_manufacturer_id' },
        { id: 304, name: 'Abstract Art Poster', price: 449, type: 'Posters', image: 'https://images.pexels.com/photos/1021876/pexels-photo-1021876.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 305, name: 'Travel Destination Poster', price: 549, type: 'Posters', image: 'https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 306, name: 'Music Band Poster', price: 499, type: 'Posters', image: 'https://images.pexels.com/photos/167491/pexels-photo-167491.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 307, name: 'Minimalist Landscape Poster', price: 399, type: 'Posters', image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 308, name: 'Wildlife Photography Poster', price: 649, type: 'Posters', image: 'https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 309, name: 'Retro Gaming Poster', price: 599, type: 'Posters', image: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 310, name: 'Galaxy Nebula Poster', price: 699, type: 'Posters', image: 'https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg', manufacturerId: 'seed_manufacturer_id' },

        // Stickers (10)
        { id: 401, name: 'Funny Cat Sticker Pack', price: 199, type: 'Stickers', image: 'https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 402, name: 'Boho Floral Stickers', price: 149, type: 'Stickers', image: 'https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 403, name: 'Space-Themed Stickers', price: 249, type: 'Stickers', image: 'https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg', manufacturerId: 'seed_manufacturer_id' },
        { id: 404, name: 'Waterproof Laptop Stickers', price: 299, type: 'Stickers', image: 'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 405, name: 'Vinyl Decal Stickers', price: 179, type: 'Stickers', image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 406, name: 'Cartoon Character Stickers', price: 219, type: 'Stickers', image: 'https://images.pexels.com/photos/161559/background-bitter-breakfast-bright-161559.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 407, name: 'Glow-in-the-Dark Stickers', price: 349, type: 'Stickers', image: 'https://images.pexels.com/photos/1021876/pexels-photo-1021876.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 408, name: 'Holographic Sticker Pack', price: 399, type: 'Stickers', image: 'https://images.pexels.com/photos/3266700/pexels-photo-3266700.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 409, name: 'Custom Name Stickers', price: 279, type: 'Stickers', image: 'https://images.pexels.com/photos/2735981/pexels-photo-2735981.jpeg', manufacturerId: 'seed_manufacturer_id' },
        { id: 410, name: 'Emoji Sticker Collection', price: 199, type: 'Stickers', image: 'https://images.pexels.com/photos/2377565/pexels-photo-2377565.jpeg', manufacturerId: 'seed_manufacturer_id' },
        // Manufacturer 1's products
        { "id": 501, "name": "Custom Mug Design 1", "price": 399, "type": "Mugs", "image": "https://images.pexels.com/photos/939833/pexels-photo-939833.jpeg", "manufacturerId": "mfg1" },
        { "id": 502, "name": "Custom Mug Design 2", "price": 409, "type": "Mugs", "image": "https://images.pexels.com/photos/1755215/pexels-photo-1755215.jpeg", "manufacturerId": "mfg1" },
        { "id": 503, "name": "Custom Mug Design 3", "price": 419, "type": "Mugs", "image": "https://images.pexels.com/photos/585753/pexels-photo-585753.jpeg", "manufacturerId": "mfg1" },
        { "id": 504, "name": "Custom Mug Design 4", "price": 429, "type": "Mugs", "image": "https://images.pexels.com/photos/1925534/pexels-photo-1925534.jpeg", "manufacturerId": "mfg1" },
        { "id": 505, "name": "Custom Mug Design 5", "price": 439, "type": "Mugs", "image": "https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg", "manufacturerId": "mfg1" },
        { "id": 506, "name": "Custom Mug Design 6", "price": 449, "type": "Mugs", "image": "https://images.pexels.com/photos/714093/pexels-photo-714093.jpeg", "manufacturerId": "mfg1" },
        { "id": 507, "name": "Custom Mug Design 7", "price": 459, "type": "Mugs", "image": "https://images.pexels.com/photos/1187317/pexels-photo-1187317.jpeg", "manufacturerId": "mfg1" },
        { "id": 508, "name": "Custom Mug Design 8", "price": 469, "type": "Mugs", "image": "https://images.pexels.com/photos/894010/pexels-photo-894010.jpeg", "manufacturerId": "mfg1" },
        { "id": 509, "name": "Custom Mug Design 9", "price": 479, "type": "Mugs", "image": "https://images.pexels.com/photos/3483967/pexels-photo-3483967.jpeg", "manufacturerId": "mfg1" },
        { "id": 510, "name": "Custom Mug Design 10", "price": 489, "type": "Mugs", "image": "https://images.pexels.com/photos/3806690/pexels-photo-3806690.jpeg", "manufacturerId": "mfg1" },
        { "id": 511, "name": "Custom Mug Design 11", "price": 499, "type": "Mugs", "image": "https://images.pexels.com/photos/1382905/pexels-photo-1382905.jpeg", "manufacturerId": "mfg1" },
        { "id": 512, "name": "Custom Mug Design 12", "price": 509, "type": "Mugs", "image": "https://images.pexels.com/photos/762092/pexels-photo-762092.jpeg", "manufacturerId": "mfg1" },
        { "id": 513, "name": "Custom Mug Design 13", "price": 519, "type": "Mugs", "image": "https://images.pexels.com/photos/41135/pexels-photo-41135.jpeg", "manufacturerId": "mfg1" },
        { "id": 514, "name": "Custom Mug Design 14", "price": 529, "type": "Mugs", "image": "https://images.pexels.com/photos/2478341/pexels-photo-2478341.jpeg", "manufacturerId": "mfg1" },
        { "id": 601, "name": "Custom T-Shirt Style 1", "price": 799, "type": "T-Shirts", "image": "https://images.pexels.com/photos/1261422/pexels-photo-1261422.jpeg", "manufacturerId": "mfg1" },
        { "id": 602, "name": "Custom T-Shirt Style 2", "price": 819, "type": "T-Shirts", "image": "https://images.pexels.com/photos/1304647/pexels-photo-1304647.jpeg", "manufacturerId": "mfg1" },
        { "id": 603, "name": "Custom T-Shirt Style 3", "price": 839, "type": "T-Shirts", "image": "https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg", "manufacturerId": "mfg1" },
        { "id": 604, "name": "Custom T-Shirt Style 4", "price": 859, "type": "T-Shirts", "image": "https://images.pexels.com/photos/1566412/pexels-photo-1566412.jpeg", "manufacturerId": "mfg1" },
        { "id": 605, "name": "Custom T-Shirt Style 5", "price": 879, "type": "T-Shirts", "image": "https://images.pexels.com/photos/1887975/pexels-photo-1887975.jpeg", "manufacturerId": "mfg1" },
        { "id": 606, "name": "Custom T-Shirt Style 6", "price": 899, "type": "T-Shirts", "image": "https://images.pexels.com/photos/1311590/pexels-photo-1311590.jpeg", "manufacturerId": "mfg1" },
        { "id": 607, "name": "Custom T-Shirt Style 7", "price": 919, "type": "T-Shirts", "image": "https://images.pexels.com/photos/1861907/pexels-photo-1861907.jpeg", "manufacturerId": "mfg1" },
        { "id": 608, "name": "Custom T-Shirt Style 8", "price": 939, "type": "T-Shirts", "image": "https://images.pexels.com/photos/2062324/pexels-photo-2062324.jpeg", "manufacturerId": "mfg1" },
        { "id": 609, "name": "Custom T-Shirt Style 9", "price": 959, "type": "T-Shirts", "image": "https://images.pexels.com/photos/220139/pexels-photo-220139.jpeg", "manufacturerId": "mfg1" }
      ];
      // Map over initialProducts to ensure manufacturerId is explicitly set for all
      // Even if already present, this ensures consistency and prevents validation errors
      const productsWithMfgId = initialProducts.map(p => ({ ...p, manufacturerId: p.manufacturerId || 'seed_manufacturer_id' }));
      await Product.insertMany(productsWithMfgId);
      console.log('Products seeded successfully!');
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};
seedProducts(); // Call the seeding function when the route file is loaded

// GET /api/products - Get all products with optional filtering and searching
router.get('/', async (req, res) => {
  try {
    let { type, search, manufacturerId } = req.query;
    let filter = {};

    if (type && type.toLowerCase() !== 'all') {
      filter.type = new RegExp(type, 'i'); // Case-insensitive type filter
    }

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') }, // Case-insensitive name search
        { type: new RegExp(search, 'i') }  // Case-insensitive type search
      ];
    }

    // Add manufacturerId filter if provided
    if (manufacturerId) {
      filter.manufacturerId = manufacturerId;
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error fetching products.' });
  }
});

// GET /api/products/:id - Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Server error fetching product.' });
  }
});

// POST /api/products - Add a new product (requires authentication/authorization)
router.post('/', async (req, res) => {
  const { id, name, price, type, image, manufacturerId } = req.body; // Ensure manufacturerId is sent from frontend

  if (!id || !name || !price || !type || !manufacturerId) {
    return res.status(400).json({ message: 'Please provide ID, name, price, type, and manufacturerId.' });
  }

  try {
    const existingProduct = await Product.findOne({ id });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this ID already exists.' });
    }

    const newProduct = new Product({
      id,
      name,
      price,
      type,
      image,
      manufacturerId, // Save the manufacturer ID with the product
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Server error adding product.' });
  }
});

// NEW ENDPOINT: POST /api/products/bulk - Add multiple new products at once
router.post('/bulk', async (req, res) => {
  const productsToAdd = req.body; // Expecting an array of product objects

  if (!Array.isArray(productsToAdd) || productsToAdd.length === 0) {
    return res.status(400).json({ message: 'Request body must be a non-empty array of products.' });
  }

  const results = {
    addedCount: 0,
    skippedCount: 0,
    errors: [],
    addedProducts: [],
  };

  for (const productData of productsToAdd) {
    const { id, name, price, type, image, manufacturerId } = productData;

    // Basic validation for each product in the array
    if (!id || !name || !price || !type || !manufacturerId) {
      results.errors.push({ product: productData, message: 'Missing required fields (id, name, price, type, manufacturerId).' });
      results.skippedCount++;
      continue; // Skip to the next product in the loop
    }

    try {
      const existingProduct = await Product.findOne({ id });
      if (existingProduct) {
        results.errors.push({ product: productData, message: `Product with ID ${id} already exists, skipped.` });
        results.skippedCount++;
        continue; // Skip to the next product in the loop
      }

      const newProduct = new Product({
        id,
        name,
        price,
        type,
        image,
        manufacturerId,
      });
      await newProduct.save();
      results.addedCount++;
      results.addedProducts.push(newProduct);
    } catch (error) {
      console.error(`Error adding product with ID ${id}:`, error);
      results.errors.push({ product: productData, message: `Server error adding product with ID ${id}: ${error.message}` });
      results.skippedCount++; // Treat as skipped due to error
    }
  }

  res.status(200).json({
    message: 'Bulk product operation completed.',
    results: results,
  });
});


// PUT /api/products/:id - Update a product by ID (requires authentication/authorization)
router.put('/:id', async (req, res) => {
  const { name, price, type, image, manufacturerId } = req.body; // Allow updating manufacturerId if needed
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id }, // Find by 'id' field
      { name, price, type, image, manufacturerId },
      { new: true } // Return the updated document
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error updating product.' });
  }
});

// DELETE /api/products/:id - Delete a product by ID (requires authentication/authorization)
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: req.params.id }); // Find by 'id' field
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error deleting product.' });
  }
});

module.exports = router;
