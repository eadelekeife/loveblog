const Users = require("../models/userModel");
const generateOtp = require('../utils/generateOTP');
// const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const apiResponse = require('../utils/apiResponse');
const Blogs = require("../models/blogModel");

exports.addNewBlog = async (req, res) => {
    const { title, description, body } = req.body;
    if (title, description, body) {
        try {
            //check if email exists in DB
            let blog = await Blogs.findOne({ title });
            if (blog) {
                return res.json(apiResponse({
                    success: false,
                    status: 409,
                    message: "Blog already exists",
                    error: ""
                }));
            };
            blog = new Blogs({
                title,
                description,
                body
            });

            await blog.save();
            res.json(apiResponse({
                success: false,
                status: 200,
                message: `Blog added successfully`,
                data: {
                    title,
                    description,
                    body
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

exports.getAllBlogs = async (req, res) => {
    try {
        const blog = await Blogs.find({});

        res.json(apiResponse({
            success: true,
            status: 200,
            message: "Blogs fetched successfully",
            data: blog
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
