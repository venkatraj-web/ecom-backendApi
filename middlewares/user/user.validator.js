const { check } = require("express-validator");
const User = require("../../models").users;

const store = [
    check("firstName", "firstName is required!").notEmpty().custom(value => value.match(/^[A-Za-z ]+$/)).withMessage("is Alpha"),
    check("lastName", "lastName is required!").notEmpty().custom(value => value.match(/^[A-Za-z ]+$/)).withMessage("is Alpha"),
    check("email", "email is required!").isEmail().custom(value => {
        return User.findOne({ where: { email: value } }).then((user) => {
            if(user){
                console.log(value);
                return Promise.reject("Email already in use!");
            }
        })
    }),
    check("password", "password is required!").notEmpty().isLength({ min: 5, max: 20}),
    check("passwordConfirmation", "passwordConfirmation is required!").custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error("Password Confirmation does not match password!");
        }
        return true;
    }),
    check("userAvatar").custom((value, {req}) => {
    //   console.log(req.files); 
      if(req.files.userAvatar[0].mimetype === 'image/jpeg' || req.files.userAvatar[0].mimetype === 'image/png' || req.files.userAvatar[0].mimetype === 'image/jpg') {
        return true;
      }else{
        return false;
      }
    }).withMessage("Please upload an Image .jpeg, .png")
];

const login = [
    check("email", "email is required!").isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check("password", "password is required!").isLength({ min: 5, max: 20})
];

const updateProfile = [
    check("firstName", "first name is required!").notEmpty().custom(value => value.match(/^[A-Za-z ]+$/)).withMessage("is Alpha"),
    check("lastName", "lastName is required!").notEmpty().custom(value => value.match(/^[A-Za-z ]+$/)).withMessage("is Alpha"),
    check("userAvatar").custom((value, {req}) => {
        // console.log(req.files);
        if(req.files.userAvatar[0].mimetype === "image/jpeg" || req.files.userAvatar[0].mimetype === "image/png" || req.files.userAvatar[0].mimetype === "image/jpg") {
            return true;
        }else {
            return false;
        }
    }).withMessage("Please upload an Image .jpeg, .png")
];

module.exports = {
    store,
    login,
    updateProfile,
}