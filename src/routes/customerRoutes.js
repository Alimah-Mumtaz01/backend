const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const router = express.Router();

router.get(
    "/",
    authMiddleware,
    authorize("admin"),
    userController.getAllCustomers
);

module.exports = router;
