const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  // Read the token from cookies
  try {
      const {token} = req.cookies;
      console.log("Token from cookies:", token);
      if (!token) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    // Validate and decode the token
    const decoded = jwt.verify(token, "DEV@Tinder$123");
    const { _id } = decoded;

    // Find the user by ID
    const user = await User.findById(_id);
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: "Unauthorized: User not found" });
    }

    // Attach the user object to the request
    req.user = user;
    next();
  } catch (error) {
    // Handle invalid tokens or other errors
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = { userAuth };