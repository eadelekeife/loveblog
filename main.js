require("dotenv").config();
const express = require("express");
const connectToDB = require("./src/config/db");
const { swaggerDocs, swaggerUi } = require('./swagger');

const appRouter = require("./src/app");

const app = express();
app.use(express.json());

connectToDB();

app.use("/api/v1", appRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


const port = process.env.PORT || 8080;
app.listen(port, console.log("App has started listening on port", port));