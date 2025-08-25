const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

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
    validate(){
      if(!validator.isEmail(this.email)) {
        throw new Error("Invalid email format");
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate(){
      if(!validator.isStrongPassword(this.password)){
        throw new Error("Password must be strong");
      }
    }
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
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
    validate() {
      if (!validator.isURL(this.photoUrl)) {
        throw new Error("Invalid URL format for photo");
      }
    }
  },
  skills: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length <= 10;
      },
      message: "You can only have up to 10 skills.",
    },
  }
},
{
  timestamps: true,
});

userSchema.methods.getJWT = async function() {
  const user = this;
  const token = await jwt.sign({_id: user._id}, "DEV@Tinder$123", {expiresIn: "1d"});
  return token;
}

userSchema.methods.validatePassword = async function (password){
  const user = this; 
  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = User;
