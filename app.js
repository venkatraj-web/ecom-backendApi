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

// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const verifySid = "VAea436514179bbdaf3e71126acf12334e";
// const client = require("twilio")(accountSid, authToken);

// client.verify.v2
//   .services(verifySid)
//   .verifications.create({ to: "+919659858301", channel: "sms" })
//   .then((verification) => console.log(verification.status))
//   .then(() => {
//     const readline = require("readline").createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     readline.question("Please enter the OTP:", (otpCode) => {
//       client.verify.v2
//         .services(verifySid)
//         .verificationChecks.create({ to: "+919659858301", code: otpCode })
//         .then((verification_check) => console.log(verification_check.status))
//         .then(() => readline.close());
//     });
//   });

module.exports = app;