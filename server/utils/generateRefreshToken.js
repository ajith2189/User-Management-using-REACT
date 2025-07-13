const jwt = require("jsonwebtoken");

const generateRefreshToken = (userID) => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id: userID }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "20h",
  });
};

module.exports = generateRefreshToken;