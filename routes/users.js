const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/database");

router.post("/register", (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        contact: req.body.contact
    });

    User.addUser(newUser, (err, user) => {
        if (err) {
            let message = "";
            if (err.errors.email) message = "Email is already taken. ";
            if (err.errors.username) message += "Username already exists.";
            return res.json({
                success: false,
                message
            });
        } else {
            return res.json({
                success: true,
                message: "User registration is successful"
            });
        }
    });
});

router.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({
                success: false,
                message: "User does not exists"
            });
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(
                    {
                        type: "user",
                        data: {
                            id: user._id,
                            username: user.username,
                            name: user.name,
                            email: user.email,
                            contact: user.contact
                        }
                    }, config.secret, {
                        expiresIn: 604800 // for 1 week time in milliseconds
                    }
                );

                return res.json({
                    success: true,
                    token: "JWT " + token
                });
            } else {
                return res.json({
                    success: false,
                    message: "Wrong Passwrod"
                });
            }
        });
    });
});

module.exports = router;