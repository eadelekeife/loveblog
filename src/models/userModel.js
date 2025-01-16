const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "loan-officer"]
    },
    signupOTP: {
        type: String,
    },
    otpCreatedAt: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    }
}, {
    timestamps
});

const Users = mongoose.model("user", userSchema);

module.exports = Users;