const express = require("express");
const connectDB = require("./config/databases");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async(req, res) => {
  const user = new User(req.body);

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
