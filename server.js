require("dotenv").config();
const app = require("./app");

const port = 3006;

app.listen(port, () => {
    console.log(`The application is listening on ${port}`);
});