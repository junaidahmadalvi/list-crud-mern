const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
    },
    status: {
      type: String,
      default: "enable",
    },
  },
  { timestamps: true }
);

// <============create collection============>
const User = new mongoose.model("User", userModel);

module.exports = { User };
