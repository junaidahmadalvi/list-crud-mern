const { Admin } = require("../models/admin.model");

var ObjectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "jd897#$%dsjY*%#ldEddwmQ";

const env = require("dotenv").config();
const bcrypt = require("bcrypt");

const emailvalidator = require("email-validator");

module.exports = {
  //----------< Authentification>  ------------------

  authorizeAdmin: async (req, res, next) => {
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

          const admin_id = decode.admin_id;
          req.admin_id = admin_id;
          console.log("admin at auth", req.admin_id);
          const admin = await Admin.findById(admin_id);
          console.log("admin", admin);
          if (admin) {
            console.log("Admin Authoriazed");
            next();
          } else {
            res
              .status(403)
              .send({ status: "failed", message: "Rout Not Authorized" });
            console.log("Admin Not Authoriazed");
            console.log("Invalid User OR Authentication failed");
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
