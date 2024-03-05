const catchAsync = require("../../utils/catchAsync");

const createError = require("../../utils/createError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../../models").users;


const verifyToken = catchAsync( async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token) {
        return next(createError(401, "You are not loggedIn. Please login to get Access!!"));
    }

    // 2) Verification Token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
    // console.log(decoded);

    // 3) Check if user still exists
    const user = await User.findOne({
        where: { id: decoded.id },
        attributes: { exclude: ["createdAt", "updatedAt", "password"] }
    });

    if(!user) {
        return next(createError(401, "The User belonging to this Token does no longer exist."));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = user;
    req.role = decoded.role;

    next();
});

const rbac = (...roles) => {
    return catchAsync(async (req, res, next) => {
        roles = roles.map((role) => role.toLowerCase());
        console.log(`roles: ${req.role}`);
        if(!roles.includes(req.role.toLowerCase())){
            return next(createError(403, "You do not have permission to perform this action!!"));
        }
        next();
    });
}

const exampleRoles = [
    { name: 'Admin' },
    { name: 'Customer' },
    { name: 'Manager' },
    { name: 'Supervisor' },
    { name: 'Employee' },
    { name: 'Vendor' },
    { name: 'Supplier' },
    { name: 'Partner' },
    { name: 'Guest' },
    { name: 'Subscriber' }
  ];

  const examplePermissions = [
    { name: 'CreateUser' },
    { name: 'EditUser' },
    { name: 'DeleteUser' },
    { name: 'CreateProduct' },
    { name: 'EditProduct' },
    { name: 'DeleteProduct' },
    { name: 'CreateOrder' },
    { name: 'EditOrder' },
    { name: 'DeleteOrder' },
    { name: 'ManageRoles' }
  ];

module.exports = {
    verifyToken,
    rbac,
};