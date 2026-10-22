const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");
const {uploadReview} = require("../middleware/reviewUploadMiddleware");
const validate = require("../middleware/validateMiddleware");
const {createReviewSchema, updateReviewSchema} = require("../validations/reviewValidation");

router.get("/", reviewController.getReviews);
router.get("/:id_review", reviewController.getReviewById);
router.get("/product/:id_product/rating", reviewController.getProductRating);
router.post("/", authMiddleware, uploadReview.array("gambar", 3), validate(createReviewSchema), reviewController.createReview);
router.put("/:id_review", authMiddleware, uploadReview.array("gambar", 3), validate(updateReviewSchema), reviewController.updateReview);
router.delete("/:id_review", authMiddleware, reviewController.deleteReview);

module.exports = router