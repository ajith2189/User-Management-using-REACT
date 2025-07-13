// routes/userRoutes.js

const express = require("express");
const user_router = express.Router();

const{registerUser,loginUser,uploadImage} = require("../controllers/userController");
const { verifyToken } = require("../middlewares/auth.js");


// POST /api/users/register
user_router.post("/register", registerUser);
user_router.post("/login", loginUser);
user_router.post("/upload-image",verifyToken,uploadImage);


module.exports = user_router;
