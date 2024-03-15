const { check } = require("express-validator");

exports.sendMailVerificationValidator = [
    check("email", "Please include a valid email address!").isEmail().normalizeEmail({gmail_remove_dots:false})
];

exports.sendOtpMailValidator = [
    check("email", "Please include a valid email address!").isEmail().normalizeEmail({gmail_remove_dots:false})
];

exports.verifyOtpValidator = [
    check("userId", "User Id is required!").notEmpty(),
    check("otp", "OTP is required!").notEmpty(),
];

exports.passwordResetValidator = [
    check("email", "Please include a valid email address!").isEmail().normalizeEmail({gmail_remove_dots:false})
];

exports.mobileOtpValidator = [
    check("phoneNumber", "Phone Number is required!").notEmpty().isLength({ min: 10, }),
];

exports.verifyMobileOtpValidator = [
    check("phoneNumber", "Phone Number is required!").notEmpty().isLength({ min: 10, }),
    check("otp", "Otp is required!").notEmpty()
];
