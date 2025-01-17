const Users = require("../models/userModel");
const generateOtp = require('../utils/generateOTP');
// const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const apiResponse = require('../utils/apiResponse');

exports.signupUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (firstName, lastName, email, password) {
        try {
            //check if email exists in DB
            let user = await Users.findOne({ email });
            if (user) {
                return res.json(apiResponse({
                    success: false,
                    status: 409,
                    message: "User already exists. Please sign in instead or reset password",
                    error: ""
                }));
            };
            //email does not exist
            let hashPassword = "";
            hashPassword = await bcrypt.hash(password, 10);
            user = new Users({
                firstName,
                lastName,
                email,
                password: hashPassword
            });

            user.signupOTP = generateOtp();
            user.otpCreatedAt = new Date();

            await user.save();
            // await sendEmail(user.email, 'OTP Verification', `Your OTP is ${user.signupOTP}`);
            res.json(apiResponse({
                success: false,
                status: 200,
                message: `User signup successful. Please check your mail for OTP. Your OTP is ${user.signupOTP}`,
                data: {
                    userId: user._id,
                    firstName, lastName, email
                }
            }))
        } catch (error) {
            res.json(apiResponse({
                success: false,
                status: 500,
                message: "Server Error",
                error: error.message
            }))
        }
    } else {
        res.json(apiResponse({
            success: false,
            status: 400,
            message: "Please enter all fields",
            error: ""
        }))
    }
}

exports.verifyUser = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user || user.signupOTP !== otp) {
            return res.json(apiResponse({
                success: false,
                status: 400,
                message: "Invalid OTP. Please try again"
            }))
        }
        user.isVerified = true;
        await user.save();

        res.json(apiResponse({
            success: true,
            status: 200,
            message: "User activated successfully. Please proceed to sign in.",
        }))
    } catch (error) {
        res.json(apiResponse({
            success: false,
            status: 500,
            message: "Server Error",
            error: error.message
        }))
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.json(apiResponse({
                success: false,
                status: 400,
                message: "Invalid credentials. Please check and try again",
                error: ""
            }))
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json(apiResponse({
                success: false,
                status: 400,
                message: "Invalid credentials. Please check and try again",
                error: ""
            }))
        };

        if (!user.isVerified) {
            return res.json(apiResponse({
                success: false,
                status: 400,
                message: "Account not verified. Please check your mail and verify your account",
                error: ""
            }))
        };

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.json(apiResponse({
            success: true,
            status: 200,
            message: "User login successful",
            data: {
                userId: user._id,
                token,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isVerified: user.isVerified
            }
        }))
    } catch (error) {
        console.error('Login error:', error);
        res.json(apiResponse({
            success: false,
            status: 500,
            message: "Server Error",
            error: error.message
        }))
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.json(apiResponse({
                success: false,
                status: 400,
                message: "User not found. Please check email and try again",
                error: ""
            }))
        }

        user.otp = generateOtp();
        user.otpCreatedAt = new Date();

        await user.save();

        // await sendEmail(user.email, 'Password Reset OTP', `Your OTP is ${user.otp}`);
        res.json(apiResponse({
            success: true,
            status: 200,
            message: `OTP sent to your email. Your OTP is ${user.otp}`,
        }))
    } catch (error) {
        res.json(apiResponse({
            success: false,
            status: 500,
            message: "Server Error",
            error: error.message
        }))
    }
};

exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user || user.otp !== otp) {
            return res.json(apiResponse({
                success: false,
                status: 400,
                message: "Invalid OTP. Please try again",
                error: ""
            }))
        }

        let saltRound = 10;
        let hashPassword = bcrypt.hash(newPassword, saltRound);
        user.password = hashPassword;
        user.otp = undefined;
        await user.save();

        res.json(apiResponse({
            success: true,
            status: 200,
            message: "Password reset successful",
        }))
    } catch (error) {
        res.json(apiResponse({
            success: false,
            status: 500,
            message: "Server Error",
            error: error.message
        }))
    }
};

exports.resendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.json(apiResponse({
                success: false,
                status: 400,
                message: "User not found",
                error: ""
            }))
        };

        if (!user.isVerified) {
            user.otp = generateOtp();
            user.otpCreatedAt = new Date();
            await user.save();

            // await sendEmail(user.email, 'OTP Verification', `Your new OTP is ${user.otp}`);
            res.json(apiResponse({
                success: true,
                status: 200,
                message: `New OTP sent to your email. It is ${user.otp}`,
            }))
        } else {
            res.json(apiResponse({
                success: false,
                status: 400,
                message: "Account is already verified",
                error: ""
            }))
        }
    } catch (error) {
        res.json(apiResponse({
            success: false,
            status: 500,
            message: "Server Error",
            error: error.message
        }))
    }
};

// exports.getUserDetails = async (req, res) => {
//     try {
//         const users = await Users.find({}, 'fullName email');
//         res.status(200).json(users);
//     } catch (error) {
//         console.error('Error fetching user details:', error);
//         res.json(apiResponse({
//             success: false,
//             status: 500,
//             message: "Server Error",
//             error: error.message
//         }))
//     }
// };

exports.updateProfile = async (req, res) => {
    const { firstName, lastName, email } = req.body;
    const userId = req.user.id;
    try {
        const user = await Users.findById(userId);
        if (!user) {
            return res.json(apiResponse({
                success: false,
                status: 404,
                message: 'User not found',
            }));
        }
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.json(apiResponse({
                    success: false,
                    status: 409,
                    message: 'Email already in use',
                }));
            }
        }
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;

        //   user.email = email || user.email;
        await user.save();
        res.json(apiResponse({
            success: true,
            status: 200,
            message: 'Profile updated successfully',
            data: {
                firstName: user.firstName, email: user.email
            }
        }));
    } catch (error) {
        res.json(apiResponse({
            success: false,
            status: 500,
            message: "Server Error",
            error: error.message
        }))
    }
};

exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    try {
        const user = await Users.findById(userId);
        if (!user) {
            return res.json(apiResponse({
                success: false,
                status: 404,
                message: 'User not found'
            }));
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.json(apiResponse({
                success: false,
                status: 400,
                message: 'Old password is incorrect'
            }));
        }
        let saltRound = 10;
        let hashPassword = bcrypt.hash(newPassword, saltRound);
        user.password = hashPassword;
        await user.save();
        res.json(apiResponse({
            success: true,
            status: 200,
            message: 'Password updated successfully'
        }));
    } catch (error) {
        res.json(apiResponse({
            success: false,
            status: 500,
            message: "Server Error",
            error: error.message
        }))
    }
};