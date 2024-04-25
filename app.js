const express = require("express");
const cors = require("cors");
const app = express();
const { error } = require("./middleware/error.js");
const dotenv = require("dotenv");

dotenv.config({
  path: "./config/config.env",
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// import routes
const userRoutes = require("./routes/userRoutes.js");
const bookRoutes = require("./routes/bookRoutes.js");

//import validators
const userValidator = require("./validator/userValidator.js");
const bookValidator = require("./validator/bookValidator.js");

// use routes
app.use("/api/user", userValidator, userRoutes);
app.use("/api/book", bookValidator, bookRoutes);

app.get("/", (req, res) =>
  res.send(`<h1>Its working. Click to visit Link.</h1>`)
);

app.all("*", (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;
app.use(error);
