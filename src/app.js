const express = require("express");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");

const appRouter = express.Router();

appRouter.use("/users", userRoutes);
appRouter.use("/blogs", blogRoutes);

module.exports = appRouter;