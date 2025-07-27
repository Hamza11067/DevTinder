const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  lastName: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(male|female|other)$/i.test(v);
      },
    },
  },
  about: {
    type: String,
    trim: true,
    maxlength: 500,
    default: "No information provided.",
  },
  photoUrl: {
    type: String,
    default: "https://med.gov.bz/wp-content/uploads/2020/08/dummy-profile-pic.jpg",
    validate: {
      validator: function (v) {
        return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
},
{
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
