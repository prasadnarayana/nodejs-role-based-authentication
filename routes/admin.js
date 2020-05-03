const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const config = require("../config/database");

router.post("/register", (req, res) => {
    const newAdmin = new Admin({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        contact: req.body.contact,
        job_profile: req.body.job_profile
    });

    Admin.addAdmin(newAdmin, (err, admin) => {
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
                message: "Admin registration is successful"
            });
        }
    });
});

router.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    Admin.getAdminByUsername(username, (err, admin) => {
        if (err) throw err;
        if (!admin) {
            return res.json({
                success: false,
                message: "Admin does not exists"
            });
        }
        Admin.comparePassword(password, admin.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(
                    {
                        type: "admin",
                        data: {
                            id: admin._id,
                            username: admin.username,
                            name: admin.name,
                            email: admin.email,
                            contact: admin.contact
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

/**
 * Get authenticated admin profile
 */
router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
    return res.json(req.user);
});

module.exports = router;