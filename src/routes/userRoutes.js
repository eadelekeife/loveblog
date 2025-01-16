const express = require("express");
const userController = require("../controllers/userControllers");
const { protect } = require('../middleware/authMiddleware');

const userRoutes = express.Router();

/**
 * @swagger
 * tags:
 *  - name: Users
 *    description: operations related to user management
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     tags:
 *       - Users
 *     summary: Sign a new user up
 *     description: Sign up new user (user, loan officer, admin) with the following details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *                 description: The user's first name
 *               lastName:
 *                 type: string
 *                 example: Doe
 *                 description: The user's last name
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securepassword123
 *                 description: The user's password
 *               role:
 *                 type: string
 *                 example: user
 *                 description: The new user's role
 */
userRoutes.post("signup-user", userController.signupUser);
/**
 * @swagger
 * /users/signin:
 *   post:
 *     tags:
 *       - Users
 *     summary: Sign a user in
 *     description: Sign in a user (user, loan officer, admin) with the following details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - source
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *                 description: The user's email address
 *               source:
 *                 type: string
 *                 example: user
 *                 description: Where the request is coming from
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securepassword123
 *                 description: The user's password
 */
userRoutes.post("signin-user", userController.login);
/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     tags:
 *       - Users
 *     summary: Reset Password
 *     description: Send otp to user email to reset account password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *                 description: The user's email address
 */
userRoutes.post('/forgot-password', userController.forgotPassword);
/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     tags:
 *       - Users
 *     summary: Reset user password
 *     description: Reset a user's password using OTP sent to mail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *               - newPassword
 *               - email
 *             properties:
 *               otp:
 *                 type: string
 *                 example: 293732
 *                 description: OTP that was sent to user email
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: password123
 *                 description: The user's new password
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *                 description: The user's email address
 */
userRoutes.post('/reset-password', userController.resetPassword);
/**
 * @swagger
 * /users/resend-otp/:email:
 *   post:
 *     tags:
 *       - Users
 *     summary: Resend OTP for verification
 *     description: Resend otp to user email to verify account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *                 description: The user's email address
 */
userRoutes.get('/resend-otp/:email', userController.resendOtp);
// userRoutes.get('/users', userController.getUserDetails);
/**
 * @swagger
 * /users/update-profile:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update User Profile
 *     description: Update user profile from account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *                 description: The user's first name
 *               lastName:
 *                 type: string
 *                 example: Doe
 *                 description: The user's last name
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *                 description: The user's email address
 */
userRoutes.patch('/update-profile', protect, userController.updateProfile);
/**
 * @swagger
 * /users/change-password:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update User Password
 *     description: Update user password from account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: password123
 *                 description: The user's old password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: password123
 *                 description: The user's old password
 */
userRoutes.patch('/change-password', protect, userController.changePassword);

module.exports = userRoutes;