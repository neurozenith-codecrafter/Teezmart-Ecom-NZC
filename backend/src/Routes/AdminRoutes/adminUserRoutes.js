const express = require("express");
const router = express.Router();
const { protect } = require("../../Middleware/authMiddleware");
const { authorizeRoles } = require("../../Middleware/authMiddleware");
const { getAllUsers } = require("../../Controllers/AdminUserControllers/getRoutes.js");
const { getUserById } = require("../../Controllers/AdminUserControllers/getRoutes.js");
const { updateUserRole } = require("../../Controllers/AdminUserControllers/putRoutes.js");
const { deleteUser } = require("../../Controllers/AdminUserControllers/deleteRoutes.js");

router.use(protect);

router.get("/", authorizeRoles("admin", "devAdmin"), getAllUsers);
router.get("/:id", authorizeRoles("admin", "devAdmin"), getUserById);

router.delete("/:id", authorizeRoles("devAdmin"), deleteUser);
router.put("/:id/role", authorizeRoles("devAdmin"), updateUserRole);


module.exports = router;