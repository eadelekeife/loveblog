const express = require("express");
const blogController = require("../controllers/blogControllers");
const { protect } = require('../middleware/authMiddleware');

const blogRoutes = express.Router();

/**
 * @swagger
 * tags:
 *  - name: Blogs
 *    description: All of the blogs in the database
 */

/**
 * @swagger
 * /blog/add-blog:
 *   post:
 *     tags:
 *       - Blogs
 *     summary: Save Blog
 *     description: Save a new blog to DB with the following details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - body
 *             properties:
 *               title:
 *                 type: string
 *                 example: How to learn Javascript
 *                 description: The new blog's title
 *               description:
 *                 type: string
 *                 example: This is your first JS class
 *                 description: The new blog's category
 *               body:
 *                 type: string
 *                 example: Follow these steps to learn Javascript
 *                 description: The new blog's body
 */
blogRoutes.post("/add-blog", blogController.addNewBlog);
/**
 * @swagger
 * /users/fetch-all-blogs:
 *   get:
 *     tags:
 *       - Blogs
 *     summary: Fetch Blogs
 *     description: Fetch all of the blogs that have been saved in DB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 */
blogRoutes.get("/fetch-all-blogs", blogController.getAllBlogs);

module.exports = blogRoutes;