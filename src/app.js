const express = require("express");
const connectDB = require("./config/databases");
const cookieParser = require("cookie-parser");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(cookieParser());

const { userAuth } = require("./middlewares/auth");

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

    res.send("Login successful");
  } catch (error) {
    return res.status(500).send("Error logging in: " + error.message);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send("Error fetching users: " + err.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({});

    if (!user) {
      return res.status(404).send("No user found");
    }
    res.send(user);
  } catch (error) {
    res.status(500).send("Error fetching user: " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);

  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(`Connection request sent by ${user.firstName}`);
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("User updated successfully...");
  } catch (error) {
    res.status(500).send("Error updating user: " + error.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    // const user = await User.findOneAndDelete({_id: userId});
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send("No user found to delete");
    }
    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting user: " + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
