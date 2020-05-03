const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// mongoose-unique-validator is a plugin which adds pre-save validation for unique fields within a Mongoose schema. This makes error handling much easier, since you will get a Mongoose validation error when you attempt to violate a unique constraint
const uniqueValidator = require("mongoose-unique-validator");

// User Schema
const UserSchema = mongoose.Schema({
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
    }
});

UserSchema.plugin(uniqueValidator);

const User = module.exports = mongoose.model("User", UserSchema);

// Find the user by ID
module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
};

// Find the user by his/her username
module.exports.getUserByUsername = (username, callback) => {
    const query = { username: username };
    User.findOne(query, callback);
};

// To register the user
module.exports.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;

        bcrypt.hash(newUser.password, salt, (err, hashedPassword) => {
            if (err) throw err;
            newUser.password = hashedPassword;
            newUser.save(callback);
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