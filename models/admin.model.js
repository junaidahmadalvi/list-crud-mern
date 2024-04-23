const mongoose = require("mongoose");

const adminModel = new mongoose.Schema(
  {
    adminname: {
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
  },
  { timestamps: true }
);

// <============create collection============>
const Admin = new mongoose.model("Admin", adminModel);

module.exports = { Admin };
