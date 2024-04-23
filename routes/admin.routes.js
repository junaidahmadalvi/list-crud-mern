const express = require("express");
const router = express.Router();

// require controller
const adminController = require("../controllers/admin.contoller");

// require middleware
const { authorizeAdmin } = require("../middlewares/admin.auth");
//----------------------------------------------------------------------------

//              User CRUD
//----------------------------------------------------------------------------

router.post("/signup", adminController.registerAdmin);

router.post("/login", adminController.loginAdmin);

module.exports = router;
