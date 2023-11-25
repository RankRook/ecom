const jwt = require("jsonwebtoken");

const expiresIn = 7 * 24 * 60 * 60; // 7 days in seconds
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn});
};

module.exports = { generateToken };