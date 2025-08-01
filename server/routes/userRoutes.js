// routes/userRoutes.js

const express = require("express");
const user_router = express.Router();

const{registerUser,
    loginUser,
    uploadImage,
    refreshAccessToken,
    logOutUser
} = require("../controllers/userController");

const { verifyToken } = require("../middlewares/auth.js");


// POST /api/users/register
user_router.post("/register", registerUser);
user_router.post("/login", loginUser);
user_router.post("/upload-image",verifyToken,uploadImage);
user_router.post("/refresh", refreshAccessToken)
user_router.post("/logout",logOutUser)


module.exports = user_router;
