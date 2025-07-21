// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model defined

const router = express.Router();
// IMPORTANT: Use an environment variable for JWT_SECRET in production!
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Fallback for development

// Signup Route
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'Customer', // Default role to 'Customer' if not provided
    });

    await user.save();

    // Do NOT send token on signup for security reasons; prompt user to login
    res.status(201).json({ message: 'User registered successfully. Please log in.', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Signup error:', err);
    if (err.name === 'ValidationError') {
      let errors = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return res.status(400).json({ message: 'Validation error', errors });
    }
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body; // Expecting role from frontend

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials: User not found.' });
    }

    // Check if the role matches the user's role in the database (optional but good for specific dashboards)
    if (role && user.role !== role) {
        return res.status(403).json({ message: `Access denied. You are registered as a ${user.role}, not ${role}.` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials: Incorrect password.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Include user ID and role in token payload
      JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // Send token and user details upon successful login
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id, // Send MongoDB _id as 'id'
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;