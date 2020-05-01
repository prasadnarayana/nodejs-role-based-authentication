const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const path = require("path");

// Initialize the app
const app = express();

// Defining the PORT
const PORT = process.env.PORT || 5000;

// Defining the Middleware
app.use(cors());

// Set the static folder
// app.use(express.static(path.json(__dirname, "public")));

// BodyParser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    return res.json({
        message: "This is node.js role based authentication system"
    });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});