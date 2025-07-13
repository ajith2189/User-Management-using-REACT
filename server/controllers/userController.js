const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const generateAccessToken = require("../utils/generateAccessToken");

const registerUser = async (req, res) => {
  try {
    // Extract user input from the request body
    const { name, email, password } = req.body;
    console.log(`Received registration: name=${name}, email=${email}`);

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash the password with a salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("✅ User saved:", savedUser);

    // Generate JWT token for the new user
    const token = generateAccessToken(savedUser._id);
    console.log("🔑 JWT Token generated:", token);

    // Send response with user data (excluding password)
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        token: token,
      },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  console.log("login controller is called");
  try {
    const { email, password } = req.body;
    console.log("Received:", email, password);

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare passwords
    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = generateAccessToken(existingUser._id);

    // Respond with user data and token
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const uploadImage = async (req, res) => {
  console.log("uploadImage controller called");
  console.log("Request body:", req.body); // Add this for debugging

  try {
    const { email, profileImage } = req.body;

    if (!email || !profileImage) {
      return res.status(400).json({ message: "email or image is not valid" });
    }

    const result = await User.findOneAndUpdate(
      { email },
      { profileImage },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updated image URL:", result.profileImage);

    res.json({
      message: "Profile image URL saved successfully",
      user: result,
    });
  } catch (error) {
    console.error("Error saving image:", error);
    res.status(500).json({ error: "Server error while saving image" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  uploadImage,
};
