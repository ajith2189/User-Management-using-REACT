// routes/userRoutes.js
const express = require("express");
const admin_router = express.Router();
const {loginAdmin, getAllUsers, searchUser, updateUser, addUser , deleteUser} = require("../controllers/adminController.js")
const { verifyToken } = require("../middlewares/auth.js");


// POST /admin/register
admin_router.post("/login", loginAdmin);
admin_router.get("/allusers",verifyToken,  getAllUsers);
admin_router.get("/search",searchUser)
admin_router.patch("/update/:id", verifyToken, updateUser);
admin_router.post("/add", verifyToken, addUser); // tomorrow check this  or /admin/users/create
admin_router.delete("/delete/:id",verifyToken, deleteUser);


module.exports = admin_router;