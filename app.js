const express = require("express");
const db = require("./models");
const app = express();

const userRoutes = require("./routes/user.router");
const globalErrorHandler = require("./utils/globalErrorHandler");
const createError = require("./utils/createError");

app.use(express.json());

app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to Home page");
});

app.all("*", async(req, res, next) => {
    next(createError(404, `can't find ${req.originalUrl} on this server!!`));
});

app.use(globalErrorHandler);

module.exports = app;