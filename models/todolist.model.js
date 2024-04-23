const mongoose = require("mongoose");

const todolistModel = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// <============create collection============>
const ToDoList = new mongoose.model("ToDoList", todolistModel);

module.exports = { ToDoList };
