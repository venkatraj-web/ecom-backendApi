const router = require('express').Router();
const roleValidator = require("../middlewares/user/role.validator");
const roleController = require("../controllers/user/role.controller");
const { verifyToken, rbac } = require('../middlewares/auth/verifyToken');


router.use(verifyToken);
router.post("/add", rbac("admin"), roleValidator.addRole, roleController.addRole);
router.get("/all", roleController.getAllRoles);
router.put("/update/:id", rbac("admin"), roleValidator.updateRole, roleController.updateRole);
router.get("/:id", roleController.getRoleById);
router.delete("/delete", rbac("admin"), roleController.deleteRole);


module.exports = router;