const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  // Read the token from cookies
  try {
      const {token} = req.cookies;
      if (!token) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    // Validate and decode the token
    const decoded = jwt.verify(token, "DEV@Tinder$123");
    const { _id } = decoded;

    // Find the user by ID
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send("Unauthorized: " + error.message);
  }
};

module.exports = { 
  userAuth,
};