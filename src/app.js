const express = require("express");
const userRoutes = require("./routes/userroutes");

const appRouter = express.Router();

appRouter.use("/users", userRoutes);

module.exports = appRouter;