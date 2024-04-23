const express = require("express");
const router = express.Router();
const ToDoList = require("../../models/todolist.model");

// require controller
const todolistController = require("../../controllers/todolist.contoller");

// require middleware
const { authenticateUser } = require("../../middlewares/user.auth");

//-------- Routes--------------

router.post("/", authenticateUser, todolistController.addList);

//-----------Read Data----------------------

router.get("/:list_id", authenticateUser, todolistController.getSingleListItem);
router.get("/", authenticateUser, todolistController.getUserList);

//-----------Update Data----------------------

router.put("/:list_id", authenticateUser, todolistController.updateList);

//----------Delete Records -----------------------

router.delete("/:list_id", authenticateUser, todolistController.deleteList);

module.exports = router;
