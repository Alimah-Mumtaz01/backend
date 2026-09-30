const express = require("express");
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const {authorize} = require("../middleware/roleMiddleware");
const {validate} = require("../middleware/validateMiddleware");
const {createProductSchema, updateProductSchema} = require("../validations/productValidation");
const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id_product", productController.getProductById);
router.post("/", authMiddleware, authorize("admin"), validate(createProductSchema), productController.createProduct);
router.put("/:id_product", authMiddleware, authorize("admin"), validate(updateProductSchema), productController.updateProduct);
router.delete("/:id_product", authMiddleware, authorize("admin"), productController.deleteProduct);

module.exports = router;