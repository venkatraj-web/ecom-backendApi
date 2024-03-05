const { validationResult } = require("express-validator");
const db = require("../../models");
const User = db.users;
// const Role = db.roles;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createError = require("../../utils/createError");
const catchAsync = require("../../utils/catchAsync");

const storeUser = catchAsync( async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            status: false,
            error: errors.array()
        });
    }

    await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        roleId: 1
    }).then(async user => {
        // await user.addRole(role);
        return res.status(201).json({
            status: true,
            msg: "User created successfully",
            user
        });
    })
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

    await User.findByPk(req.user.id).then((userData) => {
        if(!userData) {
            return next(createError(422, "No User Data Found With This ID or Token!!"));
        }

        userData.firstName = req.body.firstName;
        userData.lastName = req.body.lastName;
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