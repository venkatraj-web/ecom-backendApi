const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Welcome to Home page");
});

app.listen(5000, () => {
    console.log("listening on 5000 post ");
});