const express = require("express");
const app = express();

app.get("/user", (req, res) => {
  res.send({ firstname: "Hamza", lastname: "Khalid" });
});

app.post("/user", (req, res) => {
  console.log("User data received:");
  res.send({ message: "User created successfully" });
});

app.put("/user", (req, res) => {
  console.log("User data updated");
  res.send({ message: "User updated successfully" });
});

app.patch("/user", (req, res) => {
  console.log("User data updated");
  res.send({ message: "User updated successfully" });
});

app.delete("/user", (req, res) => {
  console.log("User deleted");
  res.send({ message: "User deleted successfully" });
});

// Order of routes matters, so ensure the test route is defined before the main route

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
