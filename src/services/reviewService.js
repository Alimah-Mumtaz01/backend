const {sequelize, Review, ReviewImage, Order, OrderItem, Product, User} = require("../models");

const createReview = async (id_user, reviewData, files = []) => {
    const transaction = await sequelize.transaction();
    try {
        const {id_order, id_product, rating, komentar} = reviewData;
        const order = await Order.findOne({
            where: {id_order, id_user},
            transaction,
            lock: transaction.LOCK.UPDATE
        });
        if (!order) {
            const error = new Error("Pesanan tidak ditemukan atau bukan milik anda");
            error.statusCode = 404;
            throw error;
        }
        if (order.status_order !== "selesai") {
            const error = new Error("Review hanya dapat diberikan untuk pesanan yang sudah selesai");
            error.statusCode = 400;
            throw error;
        }
        const orderItem = await OrderItem.findOne({
            where: {id_order, id_product},
            transaction
        });
        if (!orderItem) {
            const error = new Error("Produk ini tidak ditemukan dalam pesanan tersebut");
            error.statusCode = 400;
            throw error;
        }
        const product = await Product.findByPk(id_product, {transaction});
        if (!product) {
            const error = new Error("Produk tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }
        const existingReview = await Review.findOne({
            where: {id_order},
            transaction
        });
        if (existingReview) {
            const error = new Error("Pesanan ini sudah memiliki review");
            error.statusCode = 409;
            throw error;
        }
        const review = await Review.create(
            {
                id_user,
                id_order,
                id_product,
                rating,
                komentar: komentar?.trim() || null
            },
            {transaction}
        );
        for (const file of files) {
            await ReviewImage.create(
                {
                    id_review: review.id_review,
                    image: file.filename
                },
                {transaction}
            );
        }
        await transaction.commit();
        return await getReviewById(review.id_review);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const getReviewById = async (id_review) => {
    const review = await Review.findByPk(id_review, {
        include: [
            {
                model: User,
                as: "user",
                attributes: ["id_user", "nama"]
            },
            {
                model: Product,
                as: "product",
                attributes: ["id_product", "nama_product"]
            },
            {
                model: ReviewImage,
                as: "images",
                attributes: ["id_review_image", "image"]
            }
        ]
    });
    if (!review) {
        const error = new Error("Review tidak ditemukan");
        error.statusCode = 404;
        throw error;
    }
    return review;
};

const getReviews = async (id_product = null) => {
    const where = {};
    if (id_product !== null && id_product !== undefined) {
        where.id_product = id_product;
    }
    const reviews = await Review.findAll({
        where,
        include: [
            {
                model: User,
                as: "user",
                attributes: ["id_user", "nama"]
            },
            {
                model: Product,
                as: "product",
                attributes: ["id_product", "nama_product"]
            },
            {
                model: ReviewImage,
                as: "images",
                attributes: ["id_review_image", "image"]
            }
        ],
        order: [["createdAt", "DESC"]]
    });
    return reviews;
};

const updateReview = async (id_review, id_user, reviewData, files = []) => {
    const transaction = await sequelize.transaction();
    try {
        const {rating, komentar} = reviewData;
        const review = await Review.findOne({
            where: {id_review, id_user},
            transaction,
            lock: transaction.LOCK.UPDATE
        });
        if (!review) {
            const error = new Error("Review tidak ditemukan atau bukan milik Anda");
            error.statusCode = 404;
            throw error;
        }
        const order = await Order.findByPk(review.id_order, {transaction});
        if (!order || order.status_order !== "selesai") {
            const error = new Error("Review hanya dapat diubah untuk pesanan yang sudah selesai");
            error.statusCode = 400;
            throw error;
        }
        await review.update(
            {
                rating,
                komentar: komentar?.trim() || null
            },
            {transaction}
        );
        const currentImageCount = await ReviewImage.count({
            where: {id_review},
            transaction
        });
        if (currentImageCount + files.length > 3) {
            const error = new Error("Foto review maksimal 3 gambar");
            error.statusCode = 400;
            throw error;
        }
        for (const file of files) {
            await ReviewImage.create(
                {
                    id_review, 
                    image: file.filename
                },
                {transaction}
            );
        }
        await transaction.commit();
        return await getReviewById(id_review);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const deleteReview = async (id_review, id_user) => {
    const transaction = await sequelize.transaction();
    try {
        const review = await Review.findOne({
            where: {id_review, id_user},
            transaction,
            lock: transaction.LOCK.UPDATE
        });
        if (!review) {
            const error = new Error("Review tidak ditemukan atau bukan milik Anda");
            error.statusCode = 404;
            throw error;
        }
        await ReviewImage.destroy({
            where: { id_review },
            transaction
        });
        await review.destroy({ transaction });
        await transaction.commit();
        return {message: "Review berhasil dihapus"};
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const getProductRating = async (id_product) => {
    const product = await Product.findByPk(id_product);
    if (!product) {
        const error = new Error("Produk tidak ditemukan");
        error.statusCode = 404;
        throw error;
    }
    const result = await Review.findOne({
        where: {id_product},
        attributes: [
            [
                sequelize.fn("AVG", sequelize.col("rating")),
                "rata_rata_rating"
            ],
            [
                sequelize.fn("COUNT", sequelize.col("id_review")),
                "jumlah_review"
            ]
        ],
        raw: true
    });
    return {
        id_product: Number(id_product),
        rata_rata_rating: Number(
            Number(result?.rata_rata_rating || 0).toFixed(1)
        ),
        jumlah_review: Number(result?.jumlah_review || 0)
    };
};

module.exports = {
    createReview,
    getReviewById,
    getReviews,
    updateReview,
    deleteReview,
    getProductRating
}