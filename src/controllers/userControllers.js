const Users = require("../models/userModel");
const generateOtp = require('../utils/generateOTP');
// const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signupUser = async (req, res) => {
    const { role, firstName, lastName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ msg: 'Passwords do not match' });
    }

    try {
        //check if email exists in DB
        let user = await Users.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });
        //email does not exist
        let hashPassword = await bcrypt.hash(password, 10);
        user = new Users({
            role,
            firstName,
            lastName,
            email,
            password: hashPassword,
        });

        user.signupOTP = generateOtp();
        user.otpCreatedAt = new Date();

        await user.save();

        // await sendEmail(user.email, 'OTP Verification', `Your OTP is ${user.signupOTP}`);

        res.status(200).json({ msg: 'Registration successful, OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        if (!user.isVerified) return res.status(400).json({ msg: 'Account not verified' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({
            userId: user._id,
            token,
            fullName: user.fullName,
            email: user.email,
            isVerified: user.isVerified,
            accountType: user.accountType,
            professionalTitle: user.professionalTitle
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        user.otp = generateOtp();
        user.otpCreatedAt = new Date();

        await user.save();

        // await sendEmail(user.email, 'Password Reset OTP', `Your OTP is ${user.otp}`);

        res.status(200).json({ msg: 'OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user || user.otp !== otp) return res.status(400).json({ msg: 'Invalid OTP' });

        user.password = newPassword;
        user.otp = undefined;
        await user.save();

        res.status(200).json({ msg: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.resendOtp = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await Users.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        if (!user.isVerified) {
            user.otp = generateOtp();
            user.otpCreatedAt = new Date();
            await user.save();

            // await sendEmail(user.email, 'OTP Verification', `Your new OTP is ${user.otp}`);

            res.status(200).json({ msg: 'New OTP sent to your email' });
        } else {
            res.status(400).json({ msg: 'Account is already verified' });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const users = await Users.find({}, 'fullName email');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    const { fullName, email } = req.body;
    const userId = req.user.id;
    try {
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ msg: 'Email already in use' });
            }
        }
        user.fullName = fullName || user.fullName;
        //   user.email = email || user.email;
        await user.save();
        res.status(200).json({ msg: 'Profile updated successfully', user: { fullName: user.fullName, email: user.email } });
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    try {
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Old password is incorrect' });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ msg: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};