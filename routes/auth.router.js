const router = require("express").Router();

const authController = require("../controllers/user/auth.controller");
const { sendMailVerificationValidator, sendOtpMailValidator, verifyOtpValidator, passwordResetValidator } = require("../middlewares/auth/mail.validator");

// Demo Mail Verification Routes
router.post("/send-mail", authController.sendMail2);

// Mail Verify on MailBOX Routes
router.get("/mail-verification", authController.mailVerification);
router.post("/send-mail-verification", sendMailVerificationValidator, authController.sendMailVerificationLink);

// Send OTP on MailBOX Verification Routes
router.post("/send-otp", sendOtpMailValidator, authController.sendOtp);
router.post("/verify-otp", verifyOtpValidator, authController.verifyOtp);

router.post("/forgot-password", passwordResetValidator, authController.forgotPassword);
router.get("/reset-password", authController.resetPassword);
router.post("/reset-password", authController.updatePassword);
router.get("/reset-success", authController.resetSuccess);

// One Time OTP Verification Routes
router.post("/verify-onetime-otp", verifyOtpValidator, authController.verifyOneTimeOtp);

module.exports = router;