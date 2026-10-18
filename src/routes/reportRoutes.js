const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.use(authMiddleware, roleMiddleware("admin"));

router.get("/sales", reportController.getSalesReport);
router.get("/orders", reportController.getOrdersReport);
router.get("/products", reportController.getProductsReport);
router.get("/variants", reportController.getVariantsReport);

module.exports = router;