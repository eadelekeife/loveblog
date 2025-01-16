const express = require("express");
const userController = require("../controllers/userControllers");

const userRoutes = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users.
 */
userRoutes.post("signup-user", userController.signupUser);
// userRoutes.post("signin-user", userController.login);
// userRoutes.post('/verify-otp', userController.verifyOtp);
// userRoutes.post('/forgot-password', userController.forgotPassword);
// userRoutes.post('/reset-password', userController.resetPassword);
userRoutes.get('/resend-otp/:email', userController.resendOtp);
userRoutes.get('/users', userController.getUserDetails);
// userRoutes.patch('/update-profile', protect, userController.updateProfile);
// userRoutes.patch('/change-password', protect, userController.changePassword);

module.exports = userRoutes;