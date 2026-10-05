const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const router = express.Router();

router.get("/", authMiddleware, authorize("admin"), userController.getAllUsers);
router.get("/:id_user", authMiddleware, authorize("admin"), userController.getUserById);

module.exports = router;