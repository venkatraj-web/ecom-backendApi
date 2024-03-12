const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

const sendMail = async (email, subject, content) => {
    try {
        var mailOptions = { 
            from: process.env.SMTP_MAIL,
            to: email, 
            subject: subject, 
            html: content 
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if(err) {
                console.log(err);
            }
            console.log("Mail Sent", info.messageId);
        });
    } catch (error) {
        console.log(error.message);
    }
}

const sendMail2 = async (viewsData) => {
    try {
        console.log(viewsData);
        ejs.renderFile(path.join(__dirname, "../../views/templates/signup.ejs"), {viewsData}, (err, data) => {
            if(err) {
                console.log(err);
            } else {
                var mailOptions = {
                    from: process.env.SMTP_MAIL,
                    to: viewsData.email,
                    subject: "SignUp Mail",
                    html: data
                }
                // console.log(mailOptions);

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("Message send: %s", info.messageId);
                })
            }
        });
    } catch (e) {
        console.log(e.message)
    }
}

module.exports = {
    sendMail,
    sendMail2
}