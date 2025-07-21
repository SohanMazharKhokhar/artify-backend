// models/db.js (Cleaned Up)
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error('ERROR: MONGO_URI is not defined in your .env file!');
      console.error('Please make sure you have a .env file in your backend root with MONGO_URI=your_connection_string');
      process.exit(1); // Exit process with failure
    }

    await mongoose.connect(mongoURI, {
      // useNewUrlParser: true,  // Deprecated - REMOVED
      // useUnifiedTopology: true, // Deprecated - REMOVED
      // Consider adding a longer timeout for debugging if you suspect slow connections
      // serverSelectionTimeoutMS: 30000, // Keep trying to connect for 30 seconds (default is 30s)
      // socketTimeoutMS: 45000,        // Close sockets after 45 seconds of inactivity (default is 30s)
    });

    console.log('✅ MongoDB connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed try again:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
