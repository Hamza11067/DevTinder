const express = require("express");
const app = express();
const connectDB = require("./config/databases");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

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
