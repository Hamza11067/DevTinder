const express = require("express");
const connectDB = require("./config/databases");
const app = express();
const User = require("./models/user");

app.post("/signup", async(req, res) => {
  const user = new User({
    firstName: "Harry",
    lastName: "Potter",
    email: "harry@potter",
    password: "harry123",
  });

  try {
    await user.save();
    res.send("User added successfully...");
  } catch (err) {
    res.status(400).send("Error in saving user : " + err.message);
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
