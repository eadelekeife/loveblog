require("dotenv").config();
const express = require("express");
const connectToDB = require("./src/config/db");

const appRouter = require("./src/app");

const app = express();
app.use(express.json());

connectToDB();

app.use("/api/v1", appRouter);

const port = process.env.PORT || 8080;
app.listen(port, console.log("App has started listening on port", port));