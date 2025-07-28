const express = require("express");
const connectDB = require("./config/databases");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully...");
  } catch (err) {
    res.status(400).send("Error in saving user : " + err.message);
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

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body
  try {
    const user = await User.findByIdAndUpdate(userId, data, {runValidators: true} )
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
