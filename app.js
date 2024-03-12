const express = require("express");
const db = require("./models");
const bodyParser = require("body-parser");
const multer = require("multer");
const multer_fields = require("./utils/multer_fields");
const globalErrorHandler = require("./utils/globalErrorHandler");
const createError = require("./utils/createError");

const app = express();

// for parsing application/json
app.use(express.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true}));
//form-data
app.use(multer().fields(multer_fields));

//static Images Folder
app.use("/public", express.static('./public'));

app.set('view engine', 'ejs');
app.set('views', './views');

//Routes
const userRoutes = require("./routes/user.router");
const authRoutes = require("./routes/auth.router");

app.use("/api/user", userRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to Home page");
});

app.all("*", async(req, res, next) => {
    next(createError(404, `can't find ${req.originalUrl} on this server!!`));
});

app.use(globalErrorHandler);

module.exports = app;