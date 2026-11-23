const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");

const {
    addressSchema,
} = require("../validations/addressValidation");

router.use(authMiddleware);
router.use(roleMiddleware("user"));

router.get("/", profileController.getProfile);

router.put(
    "/address",
    validate(addressSchema),
    profileController.savePrimaryAddress
);

module.exports = router;