const express = require("express");
// const connection =require("./dbConnection");
const app = express();
require("dotenv").config();
const cors = require("cors");
const connection = require("./db/config");
var bodyParser = require("body-parser");

// require all routes

const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const toDoListRoutes = require("./routes/user/todolist.routes");

// DB-Connection
connection();

// middlewares

//  use  cors to run multiple servers
app.use(cors());

//  express's body parser to convetert data into JSON form
app.use(express.json());
// to parse data in json
app.use(bodyParser.json());

// api testing for default
app.get("/", (req, res) => {
  res.send("API is running...");
});

//user route
app.use("/api/user", userRoutes);

//admin route
app.use("/api/admin", adminRoutes);

// ToDoList route
app.use("/api/todolist", toDoListRoutes);

const PORT = process.env.PORT || 4000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
