const reviewService = require("../services/reviewService");

const createReview = async (req, res) => {
    try {
        const review = await reviewService.createReview(
            req.user.id_user,
            req.body,
            req.files || []
        );
        return res.status(201).json({
            success: true,
            message: "Review berhasil dibuat",
            data: review
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Gagal membuat review"
        });
    }
};

const getReviews = async (req, res) => {
    try {
        const {id_product} = req.query;
        const reviews = await reviewService.getReviews(
            id_product || null
        );
        return res.status(200).json({
            success: true,
            message: "Data review berhasil diambil",
            data: reviews
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Gagal mengambil review"
        });
    }
};

const getReviewById = async (req, res) => {
    try {
        const review = await reviewService.getReviewById(req.params.id_review);
        return res.status(200).json({
            success: true,
            message: "Review berhasil diambil",
            data: review
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Gagal mengambil review"
        });
    }
};

const updateReview = async (req, res) => {
    try {
        const review = await reviewService.updateReview(
            req.params.id_review,
            req.user.id_user,
            req.body,
            req.files || []
        );
        return res.status(200).json({
            success: true,
            message: "Review berhasil diperbarui",
            data: review
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Gagal memperbarui review"
        });
    }
};

const deleteReview = async (req, res) => {
    try {
        const result = await reviewService.deleteReview(
            req.params.id_review,
            req.user.id_user
        );
        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Gagal menghapus review"
        });
    }
};

const getProductRating = async (req, res) => {
    try {
        const result = await reviewService.getProductRating(req.params.id_product);
        return res.status(200).json({
            success: true,
            message: "Rating produk berhasil diambil",
            data: result
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Gagal mengambil rating produk"
        });
    }
};

module.exports = {
    createReview,
    getReviews,
    getReviewById,
    updateReview,
    deleteReview,
    getProductRating
}