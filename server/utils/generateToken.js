const jwt = require("jsonwebtoken");

const generateAccessToken = (userID) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables");
  }
  
  return jwt.sign({ id: userID }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20m",
  });
};



const generateRefreshToken = (userID) => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id: userID }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};


module.exports = {generateAccessToken, generateRefreshToken};

