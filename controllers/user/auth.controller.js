const { validationResult } = require("express-validator");
const db = require("../../models");
const emailHelper = require("../../utils/mail/email");
const catchAsync = require("../../utils/catchAsync");
const createError = require("../../utils/createError");
const randomstring = require("randomstring");
const { generateOtpDigit, oneMinuteExpiry, threeMinuteExpiry, customMinuteExpiry, checkOtpIsExpired } = require("../../utils/otpHandler");
const bcrypt = require("bcryptjs");
const generateAccessToken = require("../../utils/tokenHandler");

// Demo Mail Verification
const sendMail2 = async (req, res, next) => {
    try {
        const user = await db.users.findByPk(1);
        const viewsData = {
            user,
            name: req.body.name,
            email: req.body.email,
            content: req.body.content
        }
        emailHelper.sendMail2(viewsData);
        res.status(200).json({
            status: true,
            msg: "Mail Sent successfully!!"
        })

    } catch (err) {
        res.status(400).status({
            status: false,
            msg: err.message
        })
    }
}

// Click Verify link on Mail box!!
const mailVerification = async (req, res, next) => {
    try {
        if(req.query.id == undefined) {
            return res.render('404');
        }
        const userData = await db.users.findByPk(req.query.id);

        if(userData){
            if(userData.isVerified) {
                return res.render('templates/mail-verification', { message: "Your mail already verified Successfully!" });
            }
            
            userData.isVerified = true;
            await userData.save();
            return res.render('templates/mail-verification', { message: "Mail has been verified Successfully!" });

        }else{
            return res.render('templates/mail-verification', { message: "User Not Found!" });
        }

    } catch (err) {
        console.log(err.message);
        return res.render('404');
    }
}
// Send Verify link on Mail box!!
const sendMailVerificationLink = catchAsync( async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            status: false,
            error: errors.array()
        });
    }

    const { email } = req.body;
    const userData = await db.users.findOne({ where: { email } });
    if(!userData) {
        // console.log(userData, email);
        return next(createError(422, "Email does not exist!"));
    }
    if(userData.isVerified) {
        return res.status(200).json({
            status: true,
            msg: userData.email + " mail is already verified!"
        });
    }
    const msg = `<p> Hi ${userData.firstName}, Please <a href="http://127.0.0.1:3006/auth/mail-verification?id=${userData.id}">Verify</a> your Mail!!`;
    emailHelper.sendMail(userData.email, "Mail Verification!", msg);
    return res.status(200).json({
        status: true,
        msg: "Verification Link sent to your mail, please check!"
    });
});
// Send OTP on Mail box!!
const sendOtp = catchAsync(async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            status: false,
            error: errors.array()
        });
    }

    const { email } = req.body;
    const userData = await db.users.findOne({ where: { email: email } });
    if(!userData){
        return next(createError(422, 'Email does not exist!'));
    }
    if(userData.isVerified){
       return res.status(200).json({
            status: true,
            msg: userData.email + " mail is already verified!"
       }); 
    }
    // Generate Random  4 digit 
    const g_otp = await generateOtpDigit();
    const oldOtpData = await db.otps.findOne({ where: { userId: userData.id }});
    if(oldOtpData){
        // Waiting 1 Minutes for Resending OTP!
        const sendNextOtp = await oneMinuteExpiry(oldOtpData.updatedAt);
        if(!sendNextOtp) {
            return next(createError(400, "Pls try after some time!"));
        }
        // if otp is expired in 1 minute then send next!
        oldOtpData.otp = g_otp;
        await oldOtpData.save();
    } else {
        await db.otps.create({
            userId: userData.id,
            otp: g_otp
        });
    }
    // when u need to send UnComment it!
    const msg = `<p>Hi <b>${userData.firstName}</b>, </br> <h4>${g_otp}</h4> </p>`;
    // emailHelper.sendMail(userData.email, "OTP Verification", msg);

    return res.status(200).json({
        status: true,
        msg: "OTP has been sent to your mail, please check!!",
        g_otp,
    });
});

const verifyOtp = catchAsync( async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            status: false,
            error: errors.array()
        });
    }
    // Check User & its verified or not!
    const { userId, otp } = req.body;
    const userData = await db.users.findByPk(userId);
    if(!userData){
        return next(createError(422, 'User does not exist!'));
    }
    if(userData.isVerified){
       return res.status(200).json({
            status: true,
            msg: userData.email + " mail is already verified!"
       }); 
    }
    // Get OTP Data
    const otpData = await db.otps.findOne({ where: { userId: userId, otp: otp } });
    if(!otpData){
        return next(createError(422, 'You Entered Wrong OTP!'));
    }
    // if otp is not expired in 3 minute then Veify User Account!
    const isOtpExpired = await threeMinuteExpiry(otpData.updatedAt);
    if(isOtpExpired){
        return next(createError(422, 'Your OTP has been Expired!!'));
    }
    // update & delete otp data!
    userData.isVerified = true;
    await userData.save();
    await otpData.destroy();

    return res.status(200).json({
        status: true,
        msg: 'Account Verified Successfully!'
    });
});

const forgotPassword = catchAsync( async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            status: false,
            error: errors.array()
        });
    }

    const { email } = req.body;
    const PasswordReset = db.passwordResets; 
    const userData = await db.users.findOne({ where: { email: email } });
    if(!userData){
        return next(createError(422, 'Email does not exist!'));
    }
    const resetData= await PasswordReset.findOne({ where: { userId: userData.id }});
    const randomString = randomstring.generate();
    
    if(resetData){
        const isExpiry = await threeMinuteExpiry(resetData.updatedAt);
        if(!isExpiry){
            return next(createError(400, "plz try after some times!"));
        }
        resetData.token = randomString;
        await resetData.save();
    }
    else{
        await PasswordReset.create({
            userId: userData.id,
            token: randomString
        });
    }

    const msg = '<p>Hi '+ userData.firstName + ', Please click <a href="http://127.0.0.1:3006/auth/reset-password?token='+ randomString +'">here</a> to Reset your Password!!</p>';
    emailHelper.sendMail(userData.email, "Reset Password", msg);

    return res.status(200).json({
        status: true,
        msg: "Reset Password Link send to your mail, please check!",
    });
});

const resetPassword = async (req, res, next) => {
    try {
        const token = req.query.token;
        if(token == undefined) {
            return res.render("404");
        }
    
        const resetData = await db.passwordResets.findOne({ where: { token: token }});
        if(!resetData) {
            return res.render("404");
        }
        const isExpiry = await customMinuteExpiry(resetData.updatedAt, 3);
        if(isExpiry) {
            return res.render("templates/reset-password", { resetData, error: "Token is Expired! so, plz generate new Link!!!", form: false });
        }
    
        return res.render("templates/reset-password", { resetData });
    } catch (error) {
        return res.render("404");
    }
};

const updatePassword = async ( req, res, next ) => {
    try {
        const { userId, password, confirmPassword } = req.body;
    
        const resetData = await db.passwordResets.findOne({ where: { userId: userId }});
        if(password != confirmPassword){
            return res.render("templates/reset-password", { resetData, error: "Confirm Password Not Matching!" });
        } 
    
        const hashedPassword = await bcrypt.hash(confirmPassword, 10);
        const userData = await db.users.findByPk(userId);
        userData.password = hashedPassword;
        await userData.save();
        await resetData.destroy();
        
        return res.redirect("/auth/reset-success");
    } catch (error) {
        return res.render("404");
    }
};

const resetSuccess = catchAsync( async (req, res, next) => {
    return res.render("templates/reset-success");
});

// Verify One Time OTP 
const verifyOneTimeOtp = catchAsync(async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            status: false,
            error: errors.array()
        });
    }
    const { userId, otp } = req.body;
    const otpData = await db.loginOtps.findOne({ where: { userId: userId, otp: otp }});
    if(!otpData) {
        return next(createError(422, "You have entered wrong OTP!"));
    }
    const isOtpExpired = await checkOtpIsExpired(otpData.updatedAt);
    if(isOtpExpired) {
        return next(createError(200, "Otp has been expired!"));
    }
    otpData.isVerified = true;
    await otpData.save();

    const userData = await db.users.findByPk(otpData.userId);
    if(!userData) {
        return next(createError(422, "user not found!"));
    }
    const token =await generateAccessToken(userData);
    return res.status(200).json({
        status: true,
        msg: "Login successfully!",
        user: userData,
        accessToken: token,
        tokenType: "Bearer",
    });
});

module.exports = {
    sendMail2,
    mailVerification,
    sendMailVerificationLink,
    sendOtp,
    verifyOtp,
    forgotPassword,
    resetPassword,
    updatePassword,
    resetSuccess,
    verifyOneTimeOtp
}