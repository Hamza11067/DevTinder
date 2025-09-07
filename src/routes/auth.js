const express = require('express');
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");


authRouter.post("/signup", async (req, res) => {
  try {
    // Validate incoming signup data
    validateSignUpData(req);

    const { password } = req.body;
    const saltRounds = 10;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with the hashed password
    const user = new User({
      ...req.body,
      password: hashedPassword,
    });

    // Save user to the database
    await user.save();

    res.send("User added successfully...");
  } catch (err) {
    res.status(400).send("Error in saving user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    // Compare the provided password with the hashed password
    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }
    const token = await user.getJWT();
    res.cookie("token", token, { httpOnly: true });

    res.send(user);
  } catch (error) {
    return res.status(500).send("Error logging in: " + error.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  })

  res.send("Logged out successfully");
});

module.exports = authRouter;