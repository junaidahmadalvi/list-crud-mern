const express = require("express");
const router = express.Router();

// require controller
const userController = require("../controllers/user.contoller");

// require middleware
const { authenticateUser } = require("../middlewares/user.auth");
const { authorizeAdmin } = require("../middlewares/admin.auth");
//----------------------------------------------------------------------------

//              User CRUD
//----------------------------------------------------------------------------

router.post("/signup", userController.registerUser);

router.post("/login", userController.loginUser);

//-----put all admin routes in admin file---------------

router.get("/", authorizeAdmin, userController.getAllUsers);

router.get("/:user_id", authenticateUser, userController.getUserById); // id noit

// //-----------Update Data----------------------

// ---------------- user only update username(change this in controller)-----------------
router.put("/", authenticateUser, userController.updateUser);
//-------update User STATUS --------------
router.patch(
  "/status/:user_id",
  authorizeAdmin,
  userController.updateUserStatus
);

//----------Delete Records -----------------------

router.delete("/:user_id", authorizeAdmin, userController.deleteUser);
module.exports = router;
