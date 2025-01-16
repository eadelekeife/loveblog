const express = require("express");
const userRoutes = require("./routes/userRoutes");

const appRouter = express.Router();

appRouter.use("/users", userRoutes);

module.exports = appRouter;