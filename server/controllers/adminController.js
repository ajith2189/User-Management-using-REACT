const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../utils/generateToken");
const hashPassword = require("../utils/hashPassword"); 
//some are the most important are the most important 

const loginAdmin = async (req, res) => {
  console.log("admin login called");
// try
  try {
    const { email, password } = req.body;
    

    // Basic input validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user
    const admin = await User.findOne({ email });
    console.log("admin data recieved from mongo",admin);
    

    if (!admin) {
      return res.status(404).json({ message: "User not found" });
    }

    // Password check
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Admin privilege check
    if (!admin.isAdmin) {
      return res.status(403).json({ message: "Access denied: Not an admin" });
    }

    // Generate JWT
    const accessToken = generateAccessToken({ id: admin._id });
    console.log("access token in login controller :", accessToken);
    return res.status(200).json({
      user: {
        name: admin.name,
        email: admin.email,
        profileImage: admin?.profileImage || null,
        isAdmin: admin.isAdmin,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  console.log("getting all users controller called");

  try {
    const users = await User.find().sort({ createdAt: -1 });
    console.log(users);
    return res.status(200).json(users);
    
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const searchUser = async (req, res) => {
  const searchTerm = req.query.searchTerm;

  const users = await User.find({
    $or: [
      { name: { $regex: searchTerm, $options: "i" } },
      { email: { $regex: searchTerm, $options: "i" } },
    ],
  });

  res.json( users );
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

const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    console.log("admin add aki");

    await newUser.save();

    console.log(newUser, "puthiya aaala");

    const createdUser = await User.findOne({ email });
    res.status(200).json({ createdUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // while receiving id user params instead of body are

    await User.findByIdAndDelete(id);

    return res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  loginAdmin,
  getAllUsers,
  updateUser,
  addUser,
  deleteUser,
  searchUser,
};
