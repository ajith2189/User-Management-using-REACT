const jwt = require("jsonwebtoken");

const generateAccessToken = (userID) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables");
  }
  
  return jwt.sign({ id: userID }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20h",
  });
};

module.exports = generateAccessToken;