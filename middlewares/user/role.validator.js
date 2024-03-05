const { check } = require("express-validator");

const addRole = [
    check("role", "role is required").notEmpty().custom(value => value.match(/^[A-Za-z ]+$/)).withMessage("is Alpha")
];

const updateRole = [
    check("role", "role is required").notEmpty().custom(value => value.match(/^[A-Za-z ]+$/)).withMessage("is Alpha")
];

module.exports = {
    addRole,
    updateRole
}