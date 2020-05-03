const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// mongoose-unique-validator is a plugin which adds pre-save validation for unique fields within a Mongoose schema. This makes error handling much easier, since you will get a Mongoose validation error when you attempt to violate a unique constraint
const uniqueValidator = require("mongoose-unique-validator");

// Admin Schema
const AdminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    job_profile: {
        type: String,
        required: true
    }
});

AdminSchema.plugin(uniqueValidator);

const Admin = module.exports = mongoose.model("Admin", AdminSchema);

// Find the admin by ID
module.exports.getAdminById = (id, callback) => {
    Admin.findById(id, callback);
};

// Find the admin by his/her username
module.exports.getAdminByUsername = (username, callback) => {
    const query = { username: username };
    Admin.findOne(query, callback);
};

// To register the admin
module.exports.addAdmin = (newAdmin, callback) => {
    console.log(newAdmin);
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;

        bcrypt.hash(newAdmin.password, salt, (err, hashedPassword) => {
            if (err) throw err;
            newAdmin.password = hashedPassword;
            newAdmin.save(callback);
        });
    });
};

// Compare Password
module.exports.comparePassword = (password, hashedPassword, callback) => {
    bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}