const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://hamzakhalid1067:Hamza1067@cluster0.wargw.mongodb.net/DevTinder"
  );
};

module.exports = connectDB;

