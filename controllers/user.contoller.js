const { User } = require("../models/user.model");

var ObjectId = require("mongodb").ObjectId;

const env = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailvalidator = require("email-validator");

module.exports = {
  registerUser: async (req, res) => {
    try {
      let { username, email, password, confirmPassword } = req.body;

      // check all fields are filled or not
      if (!username || !email || !password || !confirmPassword) {
        return res.status(400).send({ message: "All Fields are Required" });
      } else {
        // Check email formate (vaildation)
        if (emailvalidator.validate(req.body.email)) {
          // check entered email is exist in our database or not
          let user = await User.findOne({ email: email });
          if (user) {
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
              // encrypt the user passsword for securituy and save New User Successfully
              const salt = await bcrypt.genSalt(Number(process.env.SALT));
              const hashpswd = await bcrypt.hash(password, salt);
              const requestData = {
                username: username,
                email: email,
                password: hashpswd,
                // role: req.body.role || "user",
              };
              //   if (req?.body?.role) {
              //     requestData.role = req.body.role;
              //   }
              const newUser = new User(requestData);
              await newUser.save();
              console.log("User Added");

              res.status(200).send({
                message: "Registered Successfully",
                user: newUser,
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
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      console.log(email);
      console.log(password);
      //   if (email && password) {

      if (!email || !password) {
        return res.status(400).send({ message: "All fields are Required" });
      } else {
        if (emailvalidator.validate(req.body.email)) {
          let user = await User.findOne({ email: email });
          if (user != null) {
            // check given password match with DB password of particular user OR not and return true/false
            const isMatch = await bcrypt.compare(password, user.password);
            console.log("Password match", isMatch);

            if (user.email === email && isMatch) {
              if (user.status === "enable") {
                // Generate JWT Token
                const token = jwt.sign(
                  { user_id: user._id },
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
                  user: user,
                });
              } else {
                res.status(403).send({
                  message: "Access Denied by Admin",
                });
                console.log("User Access Denied by Admin");
              }
            } else {
              res.status(400).send({
                message: "Email or password is not Valid",
              });
            }
          } else {
            res.status(404).send({
              message: "Email or password is not Valid",
            });
            // this log generated for debuging that tell email not found in user collection
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
      res
        .status(e.status)
        .send({ message: e.message + "(Server Error)", Error: e });
    }
  },

  // show  all users
  getAllUsers: async (req, res) => {
    try {
      let users = await User.find();
      // console.log(getresult);

      if (users) {
        // filter users from all users and remove adminUser from given array
        // const filteredUsers = users.filter((user) => user.role == "user");

        res.status(200).send({ users });
      } else {
        res.status(400).send({ message: "User not found" });
      }
    } catch (e) {
      res.status(500).send({ message: "Server Error", Error: e });
      console.log(e);
    }
  },

  getUserById: async (req, res) => {
    try {
      // get id from auth middleware by jwt token
      const user_id = req.params.user_id;

      let user = await User.findById(user_id);

      if (user) {
        res.status(200).send({ user });
      } else {
        res.status(400).send({ message: "User not found" });
      }
    } catch (e) {
      res.status(500).send({ message: "Server Error", Error: e });
      console.log(e);
    }
  },

  //--------------------------------------- checked pending------------------------
  updateUser: async (req, res) => {
    try {
      const user_id = req.user_id;

      let { username, email } = req.body;

      if (!username || !email) {
        return res.status(400).send({ message: "All Fields are Required" });
      } else {
        if (emailvalidator.validate(req.body.email)) {
          console.log("enterd eamil", email);

          let privious_user = await User.findById(user_id);
          // check entered email is exist in our database or not
          let user = await User.findOne({ email: email });

          console.log("existed eamil", privious_user.email);

          if (user && email === privious_user.email) {
            res.status(400).send({ message: "Email already exist" });
            console.log("Email already exist");
          } else {
            const updateResult = await User.updateOne(
              { _id: user_id },
              { $set: { username: username, email: email } }
            );
            console.log(updateResult, "updateResult");
            if (updateResult.modifiedCount === 1) {
              res.status(200).send({
                message: "User updated",
                user: updateResult,
              });
            } else {
              res.status(400).send({ message: "User not found" });
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
      res.status(500).send({
        message: "Server Error",
        Error: e,
      });
    }
  },

  updateUserStatus: async (req, res) => {
    try {
      // const adminId = req.params.adminId;
      const user_id = req.user_id;

      if (req?.body?.status === "enable") {
        const updateResult = await User.updateOne(
          { _id: user_id },
          { $set: { status: "disable" } }
        );
        console.log(updateResult, "updateResult");
        if (updateResult.modifiedCount === 1) {
          res.status(200).send({
            message: "User updated",
            user: updateResult,
          });
        } else {
          res.status(400).send({ message: "User not found" });
        }
      } else if (req?.body?.status === "disable") {
        const updateResult = await User.updateOne(
          { _id: user_id },
          { $set: { status: "enable" } }
        );

        if (updateResult.modifiedCount === 1) {
          res.status(200).send({
            message: "User updated",
            user: updateResult,
          });
        } else {
          res.status(400).send({ message: "User not found" });
        }
      } else {
        res.status(400).send({ message: "Invalid Input" });
      }
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        Error: e,
      });
      console.log(e, "error");
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user_id = req.params.user_id;

      let deletedResult = await User.findByIdAndDelete(user_id);
      if (deletedResult) {
        res.status(200).send({
          message: "User deleted",
          User: deletedResult,
        });
      } else {
        res.status(400).send({ message: "User not found" });
      }
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        Error: e,
      });
    }
  },
};
