const { Admin } = require("../models/admin.model");

var ObjectId = require("mongodb").ObjectId;

const env = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailvalidator = require("email-validator");

module.exports = {
  registerAdmin: async (req, res) => {
    try {
      let { adminname, email, password, confirmPassword } = req.body;

      // check all fields are filled or not
      if (!adminname || !email || !password || !confirmPassword) {
        return res.status(400).send({ message: "All Fields are Required" });
      } else {
        // Check email formate (vaildation)
        if (emailvalidator.validate(req.body.email)) {
          // check entered email is exist in our database or not
          let admin = await Admin.findOne({ email: email });
          if (admin) {
            res.status(400).send({ message: "Email already exist" });
            console.log("Email already exist");
          } else {
            // check password and confirm are same Or not
            if (password !== confirmPassword) {
              res.status(400).send({
                message: "Password must match with Confirm Password",
              });
              console.log("Password must match with Confirm Password");
            } else {
              // encrypt the admin passsword for securituy and save New admin Successfully
              const salt = await bcrypt.genSalt(Number(process.env.SALT));
              const hashpswd = await bcrypt.hash(password, salt);
              const requestData = {
                adminname,
                email,
                password: hashpswd,
                // role: req.body.role || "admin",
              };
              //   if (req?.body?.role) {
              //     requestData.role = req.body.role;
              //   }
              const newAdmin = new Admin(requestData);
              await newAdmin.save();
              console.log("Admin Added");

              res.status(200).send({
                message: "Registered Successfully",
                admin: newAdmin,
              });
            }
          }
        } else {
          res.status(400).send({
            message: "Invalid Email",
          });
          console.log("Invalid Email");
        }
      }
    } catch (e) {
      console.log(e, "error");
      res.status(500).send({ message: "Server Error", Error: e });
    }
  },

  // login
  loginAdmin: async (req, res) => {
    try {
      const { email, password } = req.body;

      console.log(email);
      console.log(password);
      //   if (email && password) {

      if (!email || !password) {
        return res.status(400).send({ message: "All fields are Required" });
      } else {
        if (emailvalidator.validate(req.body.email)) {
          let admin = await Admin.findOne({ email: email });
          if (admin != null) {
            // check given password match with DB password of particular admin OR not and return true/false
            const isMatch = await bcrypt.compare(password, admin.password);
            console.log("Password match", isMatch);

            if (admin.email === email && isMatch) {
              // Generate JWT Token
              const token = jwt.sign(
                { admin_id: admin._id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "2d" }
              );

              // Send the token in the response header
              // console.log("token", token);
              res.setHeader("Authorization", `Bearer ${token}`);

              // console.log("headerToken", req.headers["authorization"]);

              res.status(200).send({
                message: "Login Success",
                token: token,
                admin: admin,
              });
            } else {
              res.status(400).send({
                message: "Email or password is not Valid",
              });
            }
          } else {
            res.status(404).send({
              message: "Email or password is not Valid",
            });
            // this log generated for debuging that tell email not found in admin collection
            console.log("Email not Found");
          }
        } else {
          res.status(400).send({
            message: "Invalid Email",
          });
          console.log("Invalid Email Formate");
        }
      }
    } catch (e) {
      console.log(e);
      res.status(500).send({ message: e.message, Error: e });
    }
  },
};
