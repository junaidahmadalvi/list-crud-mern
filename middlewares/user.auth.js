const { User } = require("../models/user.model");

var ObjectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "jd897#$%dsjY*%#ldEddwmQ";

const env = require("dotenv").config();
const bcrypt = require("bcrypt");

const emailvalidator = require("email-validator");

module.exports = {
  authenticateUser: async (req, res, next) => {
    try {
      const authorizationHeader = req.headers["authorization"];
      console.log("Authoriazation", authorizationHeader);
      // Check if the Authorization header exists and starts with 'Bearer '
      if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
        // Extract the token (remove 'Bearer ' from the beginning)

        const token = authorizationHeader.slice(7);
        // Check if a token is provided
        console.log("token at middleware", token);
        if (!token) {
          return res
            .status(402)
            .json({ message: "Authentication token is missing." });
        } else {
          const decode = await jwt.verify(token, JWT_SECRET_KEY);

          const id = decode.user_id;
          req.user_id = id;
          console.log("user at auth", req.user_id);
          // Get User from Token
          const user = await User.findById(id);

          if (user) {
            console.log("user authenticated");
            next();
          } else {
            res
              .status(402)
              .json({ message: "Authentication failed. Invalid token." });
          }
        }
      } else {
        res.status(401).json({ message: "Authentication token is missing." });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
