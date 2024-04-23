const { ToDoList } = require("../models/todolist.model");
const { User } = require("../models/user.model");

var ObjectId = require("mongodb").ObjectId;

const env = require("dotenv").config();

module.exports = {
  addList: async (req, res) => {
    try {
      const user_id = req.user_id;
      let { title, desc } = req.body;

      // check all fields are filled or not
      if (!title || !desc) {
        return res.status(400).send({ message: "All Fields Required" });
      } else {
        // check entered List is exist in our database or not

        let user = await User.findById(user_id);
        if (user) {
          const newList = new ToDoList({
            title,
            desc,
            user_id,
          });
          await newList.save();
          console.log("List Added");
          res.status(200).send({
            message: "List added Successfully",
            list: newList,
          });
        } else {
          res.status(400).send({ message: "User Not found" });
          console.log("User not found");
        }
      }
    } catch (e) {
      console.log(e);
      res.status(500).send({ message: "Server Error", Error: e });
    }
  },

  // show a single List
  getSingleListItem: async (req, res) => {
    try {
      const user_id = req.user_id;
      const list_id = req.params.list_id;
      // let list = c
      let listItem = await ToDoList.findOne({ _id: list_id, user_id: user_id });

      if (listItem) {
        res.status(200).send({ listItem: listItem });
      } else {
        res.status(400).send({ message: "No List Item found" });
      }
    } catch (e) {
      res.status(500).send({ message: "Server Error", Error: e });
      console.log(e);
    }
  },

  getUserList: async (req, res) => {
    try {
      const user_id = req.user_id;
      // let list = connection();
      let list = await ToDoList.find({ user_id: user_id });

      if (list) {
        res.status(200).send({ list });
      } else {
        res.status(400).send({ message: "No List found" });
      }
    } catch (e) {
      res.status(500).send({ message: "Server Error", Error: e });
      console.log(e);
    }
  },

  updateList: async (req, res) => {
    try {
      const user_id = req.user_id;
      const list_id = req.list_id;

      let { title, desc } = req.body;

      // check all fields are filled or not
      if (!title || !desc) {
        return res.status(400).send({ message: "All Fields Required" });
      } else {
        const updateResult = await User.updateOne(
          { _id: user_id },
          { $set: { title: title, desc: desc } }
        );

        if (updateResult.modifiedCount === 1) {
          res.status(200).send({
            message: "User updated",
            user: updateResult,
          });
        } else {
          res.status(400).send({ message: "User not found" });
        }
      }
    } catch (e) {
      res.status(500).send({ message: "Server Error", Error: e });
      console.log(e, "Error");
    }
  },

  deleteList: async (req, res) => {
    try {
      const user_id = req.user_id;
      const list_id = req.params.list_id;

      const deleteResult = await ToDoList.deleteOne({
        _id: list_id,
        user_id,
      });
      console.log(deleteResult, "deleted listItem");
      if (deleteResult.deletedCount === 1) {
        res.status(200).send({
          message: "List deleted",
          list: deleteResult,
        });
        console.log("List Deleted");
      } else {
        res.status(400).send({ message: "List not found" });
      }
    } catch (e) {
      res.status(500).send({ message: "Server Error", Error: e });
      console.log(e, "Error");
    }
  },
};
