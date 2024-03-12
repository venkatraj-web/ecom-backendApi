const { validationResult } = require("express-validator");
const db = require("../../models");
const User = db.users;
// const Role = db.roles;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createError = require("../../utils/createError");
const catchAsync = require("../../utils/catchAsync");
const path = require("path");
const fs = require("fs");
const emailHelper = require("../../utils/mail/email");

// EBS (Elastic Block Storage) Method
const imageUpload = require("../../utils/imageUpload");
// S3 (Simple Storage Service) Method
const AwsS3 = require("../../utils/aws/s3Handler");

const storeUser = catchAsync( async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            status: false,
            error: errors.array()
        });
    }
    var userAvatarUrl = "";
    if(req.files.userAvatar) {
        // EBS (Elastic Block Storage) Method
        // userAvatarUrl = await imageUpload.uploadImage(req.files.userAvatar[0], 'user');

        // S3 (Simple Storage Service) Method
        let userAvatar = req.files.userAvatar[0];
        let destinationPath = `uploads/user/avatar/`;
        let imgName = Date.now() + '-' + userAvatar.originalname;
        userAvatarUrl = destinationPath + imgName;
        await AwsS3.s3Upload(userAvatar, userAvatarUrl);
    }

    await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        userAvatar: userAvatarUrl,
        roleId: 1
    }).then(async user => {
        // await user.addRole(role);

        // when u need Mail Verification UnComment Below this 2 line! 
        // const msg = `Hi ${user.firstName}, Please <a href="http://127.0.0.1:3006/auth/mail-verification?id=${user.id}">Verify</a> Your Mail!.`;
        // emailHelper.sendMail(user.email, "Mail Verification!", msg);

        return res.status(201).json({
            status: true,
            msg: "User created successfully",
            user
        });
    });
});

const loginUser = catchAsync( async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            status: false,
            error: errors.array(),
        });
    }

    const user = await User.findOne({ where: { email: req.body.email }, include: [{ model: db.roles, as: "role" }], attributes: { exclude: [ "createdAt", "updatedAt"] } });
    // console.log(await user.getRole());
    if(!user){
        return next(createError(422, 'User not found'));
    }
    await bcrypt.compare(req.body.password, user.password).then((doMatch) => {
        if(!doMatch){
            return next(createError(401, "Password Wrong!"));
        }

        const token = jwt.sign({
            id: user.id,
            name: user.firstName,
            role: user.role.role
        }, process.env.JWT_SECRET_KEY, {
             expiresIn: process.env.JWT_EXPIRES_IN
        });
        
        return res.status(200).json({
            status: true,
            msg:"User successfully Logged in",
            auth_token: token,
            user
        });
    });
});

const userProfile = catchAsync( async (req, res, next) => {
    const user = await User.findByPk(req.user.id, { include: [{ model: db.roles, as: "role"}]});

    return res.status(200).json({
        status: true,
        user
    });
});

const updateProfile = catchAsync( async (req, res, next) => {
    // 1) Create error if User POSTs Password data 
    if(req.body.password || req.body.confirmPassword){
        return next(createError(400, "This route is not password update. Please use /update-password"));
    }
    // 2) Update Casual Document
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            status: false,
            error: errors.array()
        });
    }

    await User.findByPk(req.user.id).then(async (userData) => {
        if(!userData) {
            return next(createError(422, "No User Data Found With This ID or Token!!"));
        }
        userData.firstName = req.body.firstName.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        userData.lastName = req.body.lastName.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        // EBS (Elastic Block Storage) Method
        // if(req.files.userAvatar) {
        //     const userAvatar = req.files.userAvatar[0];
        //     if(!imageUpload.fileFilter(userAvatar)){
        //         return next(createError(422, "Please upload an Image .jpeg, .png"));
        //     }
        //     // console.log(path.join(__dirname, "../../"+userData.userAvatar));
        //     console.log(path.join(__dirname, "../../public/user/1709716123189-5.jpg"));
        //     let oldFilePath = path.join(__dirname, "../../public/user/1709716123189-5.jpg");
        //     if(fs.existsSync(oldFilePath)){
        //         console.log("File already exists. so, Deleting Now!!!");
        //         fs.unlinkSync(oldFilePath);
        //     }else {
        //         console.log("File not found. so, Not Deleting!!");
        //     }            
        //     let userAvatarUrl = await imageUpload.uploadImage(userAvatar, 'user');
        //     // userData.userAvatar = userAvatarUrl;
        //     console.log(userAvatarUrl);
        // }

        // S3 (Simple Storage Service) Method
        if(req.files.userAvatar){
            const userAvatar = req.files.userAvatar[0];
            if(!imageUpload.fileFilter(userAvatar)){
                return next(createError(422, "Please upload an Image .jpeg, .png"));
            }
            // Delete the OLD file if it exists
            if(userData.userAvatar) {
                await AwsS3.s3Delete(userData.userAvatar);
            }
            let destinationPath = "uploads/user/avatar/";
            let imgName = Date.now() + "-" + userAvatar.originalname;
            let userAvatarUrl = destinationPath + imgName;
            // New File Upload to S3
            await AwsS3.s3Upload(userAvatar, userAvatarUrl);
            // Update file Path
            userData.userAvatar = userAvatarUrl;
        }

        return userData.save();
    }).then((result) => {
        res.status(200).json({
            status: true,
            msg: "Profile updated successfully!",
            user: result
        });
    });
});

const getAllUsers = catchAsync( async (req, res, err) => {
    const users = await User.findAll({
        include: [{
            model: db.roles,
            as: 'role'
        }]
    });

    res.status(200).json({
        status: true,
        users
    });
});

module.exports = {
    storeUser,
    loginUser,
    getAllUsers,
    userProfile,
    updateProfile
}