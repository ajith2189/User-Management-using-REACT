const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");
const { decode } = require("jsonwebtoken");

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

    const refreshToken = generateRefreshToken({ id: savedUser._id });

    // this refresh token can be stored in a separate collection in the future for more advance use cases
    savedUser.refreshToken = refreshToken;
    await savedUser.save();

    //  refreshToken in HTTP-only cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None", // required for cross-site cookies (e.g., if frontend is on another port/domain)
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Generate JWT accessToken for the new user
    const accessToken = generateAccessToken(savedUser._id);
    console.log("🔑 JWT accessToken generated:", accessToken);

    // Send response with user data (excluding password)
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        accessToken: accessToken,
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

    // ✅ Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // ✅ Find user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    // ✅ Validate password
    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate access tokens
    
    const accessToken = generateAccessToken({
      id: existingUser._id,
    });
        console.log("generating access token in login : ", accessToken);


    // refresh token
    const refreshToken = generateRefreshToken({ id: existingUser._id });

    // this refresh token can be stored in a separate collection in the future for more advance use cases
    existingUser.refreshToken = refreshToken;
    await existingUser.save();

    //  refreshToken in HTTP-only cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None", // required for cross-site cookies (e.g., if frontend is on another port/domain)
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    
    // ✅ Send back accessToken (used in headers), plus basic user info
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
      accessToken, // frontend stores this in memory / Redux
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const refreshAccessToken = async (req, res) => {
  console.log(" refresh token controller is called");

  try {
    if (req.cookies?.jwt) {
      const refreshToken = req.cookies.jwt;

      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      // decode contains the id of the payload
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.refreshToken !== refreshToken) {
        return res.status(403).json({ message: "Token mismatch" });
      }

      const accessToken = generateAccessToken({ id: user._id });

      return res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        accessToken,
      });
    } else {
      return res.status(401).json({ message: "Refresh token cookie missing" });
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

const logOutUser = async (req, res) => {
  try {
    if (req.cookie?.jwt) {
      return res.sendStatus(204);
    }

    const refreshToken = req.cookies.jwt;

    const user = await User.findOne({ refreshToken });

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.status(200).json({message: "user logged out successfully"})
  } catch (error) {

    res.status(404).json({message: "logout Unsuccessful"})
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

const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.params.id;

    // Basic input validation
    if (!name || !email) {
      return res.status(400).json({ message: "name or email is invalid" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Perform update
    const updated = await User.updateOne(
      { _id: userId },
      {
        $set: {
          name,
          email,
        },
      }
    );

    res
      .status(200)
      .json({ message: "User updated successfully", result: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  uploadImage,
  refreshAccessToken,
  logOutUser
};
