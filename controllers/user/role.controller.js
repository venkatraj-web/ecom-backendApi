const { validationResult } = require("express-validator")
const Role = require("../../models").roles;
const catchAsync = require("../../utils/catchAsync");
const createError = require("../../utils/createError");
const db = require("../../models");
const addRole = catchAsync(async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            status:false,
            error: errors.array()
        });
    }

    if(await Role.findOne({ where: { role:req.body.role } })){
        return next(createError(422, "Role Name is Unique!! its already in use"));
    }

    await Role.create({
        role: req.body.role.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
    }).then(role => {
        return res.status(200).json({
            status:true,
            msg: "Role Data Created Successfully!!",
            role
        });
    });

});

const getAllRoles = catchAsync(async(req, res, next) => {
    const q = req.query;
    const roles = await Role.findAll( 
        q.user && { include: [{ model: db.users, as: 'user', attributes: { exclude: ["password", "roleId"]}}], } 
    );
    if(!roles.length > 0) {
        return next(createError(404, "Roles Data is Empty!!"));
    }
    res.status(200).json({
        status: true,
        roles
    })

});

const getRoleById = catchAsync(async(req, res, next) => {
    const roleId = req.params.id;
    await Role.findByPk(roleId, { include: { model: db.users, as: 'user'} }).then((role) => {
        if(!role) return next(createError(404, "Role not found!"));

        return res.status(200).json({
            status: true,
            role
        });
    })
});

const updateRole = catchAsync(async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            error: errors.array()
        });
    }

    const roleId = req.params.id;
    let isDuplicate = false;

    // Checking Duplicated RoleName
    const duplicateRole = await Role.findOne({ where: { role: req.body.role } });
    if(!duplicateRole || duplicateRole.id == roleId) {
        isDuplicate = false;
        // console.log("Not a duplicate role");
    }else {
        isDuplicate = true;
        // console.log("Duplicate role");
    }

    if(!isDuplicate){
        await Role.findByPk(roleId).then((role) => {
            if(!role){
                return next(createError(422, "No Role Data found at this ID!!"));
            }

            role.role = req.body.role.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
            role.save().then(result => {
                return res.status(200).json({
                    status: true,
                    msg: "Role Data Updated Successfully!",
                    result
                });
            });
        });
    } else {
        return next(createError(422, "Role is Unique!! it's already there!!"));
    }
});

const deleteRole = catchAsync(async (req, res, next) => {
    const q = req.query;
    let msg;
    const roleId = q.roleId;
    const permanentDelete = q.permanent ? JSON.parse(q.permanent.toLowerCase()) : false;
    await Role.findByPk(roleId).then(async (role) => {
        if(!role){
            return next(createError(422, "Role data not found!"));
        }

        if(!permanentDelete) {
            role.status = !role.status;
            await role.save(); 
            msg = `Role ${role.status ? "Activated" : "Soft Deleted"} successfully!`;
        }else { 
            await role.destroy();
            msg = "Role Permanent Deleted successfully!";
        }
        // console.log(typeof permanentDelete);
        return res.status(200).json({
            status: true,
            msg
        });

    });
});

module.exports = {
    addRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole,
}