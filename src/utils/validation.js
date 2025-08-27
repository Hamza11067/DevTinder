const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, email, password } = req.body;

  if (!firstName || firstName.length < 3 || firstName.length > 50) {
    throw new Error("First name must be between 3 and 50 characters");
  } else if (!email || !validator.isEmail(email)) {
    throw new Error("Invalid email format");
  } else if (
    !password ||
    password.length < 8 ||
    !validator.isStrongPassword(password)
  ) {
    throw new Error("Password must be at least 8 characters long and strong");
  }
};

const validateEditProfileData = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "about",
    "skills",
    "age",
    "gender",
    "photoURL",
  ];

  const isAllowed = Object.keys(req.body).every((field) =>
    allowedFields.includes(field)
  );

  return isAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
