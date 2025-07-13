// server.js

require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require("body-parser");
const nocache = require("nocache");
const path = require('path');
const cors = require('cors');
const cookieparser = require('cookie-parser');



const app = express();

// Connect MongoDB
mongoose.connect(process.env.DB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Middleware
app.use(nocache());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.json())

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}));



//user Routes
const userRoutes = require("./routes/userRoutes");
app.use("/user", userRoutes);  

// admin Routes
const adminRoutes = require("./routes/adminRoutes");
app.use("/admin",adminRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
