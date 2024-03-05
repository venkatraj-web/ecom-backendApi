const router = require('express').Router();
const userController = require("../controllers/user/user.controller");
const { verifyToken } = require('../middlewares/auth/verifyToken');
const userValidator = require("../middlewares/user/user.validator");
const roleRoutes = require("../routes/role.router");

router.use("/role", roleRoutes);

router.post("/store", userValidator.store, userController.storeUser);
router.post("/login", userValidator.login, userController.loginUser);
router.get("/all", userController.getAllUsers);
router.get("/profile", verifyToken, userController.userProfile);
router.put("/profile/update", verifyToken, userValidator.updateProfile, userController.updateProfile);


module.exports = router;