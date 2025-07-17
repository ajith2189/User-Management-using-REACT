const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  profileImage: {
    type: String,
  },
  refreshToken: {
    type: String, // renamed for clarity
  },
  createdAt: {
    type: Date,
    // no Date.now() because it will call the fn every time when the fn modal loaded
    default: Date.now,
  }
});
// always use Capital to start the name
module.exports = mongoose.model("User", userSchema);
