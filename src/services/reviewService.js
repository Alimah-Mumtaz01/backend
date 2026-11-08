const {
    sequelize,
    Review,
    ReviewImage,
    Order,
    OrderItem,
    Product,
    User
} = require("../models");

const reviewInclude = [
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
    },
    {
        model: Order,
        as: "order",
        attributes: [
            "id_order",
            "id_user",
            "tipe_pengiriman",
            "alamat_pengiriman",
            "subtotal",
            "ongkir",
            "total_harga",
            "status_order",
            "createdAt"
        ],
        include: [
            {
                model: OrderItem,
                as: "orderItems",
                attributes: [
                    "id_order_item",
                    "id_product",
                    "quantity",
                    "harga_satuan",
                    "total_harga"
                ],
                include: [
                    {
                        model: Product,
                        as: "product",
                        attributes: [
                            "id_product",
                            "nama_product",
                            "jumlah_isi",
                            "gambar"
                        ]
                    },
                    {
                        model: require("../models").OrderItemVariant,
                        as: "variants",
                        attributes: [
                            "id_order_item_variant",
                            "id_varian",
                            "jumlah"
                        ],
                        include: [
                            {
                                model: require("../models").Varian,
                                as: "varian",
                                attributes: [
                                    "id_varian",
                                    "nama_varian"
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

const createReview = async (id_user, reviewData, files = []) => {
    const transaction = await sequelize.transaction();

    try {
        const { id_order, rating, komentar } = reviewData;

        const order = await Order.findOne({
            where: { id_order, id_user },
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!order) {
            const error = new Error(
                "Pesanan tidak ditemukan atau bukan milik anda"
            );
            error.statusCode = 404;
            throw error;
        }

        if (order.status_order !== "selesai") {
            const error = new Error(
                "Review hanya dapat diberikan untuk pesanan yang sudah selesai"
            );
            error.statusCode = 400;
            throw error;
        }

        const orderItem = await OrderItem.findOne({
            where: { id_order },
            order: [["id_order_item", "ASC"]],
            transaction
        });

        if (!orderItem) {
            const error = new Error(
                "Produk dalam pesanan tidak ditemukan"
            );
            error.statusCode = 400;
            throw error;
        }

        const product = await Product.findByPk(
            orderItem.id_product,
            { transaction }
        );

        if (!product) {
            const error = new Error("Produk tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }

        const existingReview = await Review.findOne({
            where: { id_order },
            transaction
        });

        if (existingReview) {
            const error = new Error(
                "Pesanan ini sudah memiliki review"
            );
            error.statusCode = 409;
            throw error;
        }

        const review = await Review.create(
            {
                id_user,
                id_order,
                id_product: orderItem.id_product,
                rating,
                komentar: komentar?.trim() || null
            },
            { transaction }
        );

        for (const file of files) {
            await ReviewImage.create(
                {
                    id_review: review.id_review,
                    image: file.filename
                },
                { transaction }
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
        include: reviewInclude
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
        const orderItems = await OrderItem.findAll({
            where: { id_product },
            attributes: ["id_order"],
            raw: true
        });

        const orderIds = [
            ...new Set(orderItems.map(item => item.id_order))
        ];

        if (orderIds.length === 0) {
            return [];
        }

        where.id_order = orderIds;
    }

    return await Review.findAll({
        where,
        include: reviewInclude,
        order: [["createdAt", "DESC"]]
    });
};

const getMyReviews = async (id_user) => {
    return await Review.findAll({
        where: { id_user },
        include: reviewInclude,
        order: [["createdAt", "DESC"]]
    });
};

const updateReview = async (
    id_review,
    id_user,
    reviewData,
    files = []
) => {
    const transaction = await sequelize.transaction();

    try {
        const { rating, komentar } = reviewData;

        const review = await Review.findOne({
            where: { id_review, id_user },
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!review) {
            const error = new Error(
                "Review tidak ditemukan atau bukan milik Anda"
            );
            error.statusCode = 404;
            throw error;
        }

        const order = await Order.findByPk(
            review.id_order,
            { transaction }
        );

        if (!order || order.status_order !== "selesai") {
            const error = new Error(
                "Review hanya dapat diubah untuk pesanan yang sudah selesai"
            );
            error.statusCode = 400;
            throw error;
        }

        const currentImageCount = await ReviewImage.count({
            where: { id_review },
            transaction
        });

        if (currentImageCount + files.length > 3) {
            const error = new Error(
                "Foto review maksimal 3 gambar"
            );
            error.statusCode = 400;
            throw error;
        }

        await review.update(
            {
                rating,
                komentar: komentar?.trim() || null
            },
            { transaction }
        );

        for (const file of files) {
            await ReviewImage.create(
                {
                    id_review,
                    image: file.filename
                },
                { transaction }
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
            where: { id_review, id_user },
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!review) {
            const error = new Error(
                "Review tidak ditemukan atau bukan milik Anda"
            );
            error.statusCode = 404;
            throw error;
        }

        await ReviewImage.destroy({
            where: { id_review },
            transaction
        });

        await review.destroy({ transaction });

        await transaction.commit();

        return {
            message: "Review berhasil dihapus"
        };

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

    const orderItems = await OrderItem.findAll({
        where: { id_product },
        attributes: ["id_order"],
        raw: true
    });

    const orderIds = [
        ...new Set(orderItems.map(item => item.id_order))
    ];

    if (orderIds.length === 0) {
        return {
            id_product: Number(id_product),
            rata_rata_rating: 0,
            jumlah_review: 0
        };
    }

    const reviews = await Review.findAll({
        where: {
            id_order: orderIds
        },
        attributes: ["id_review", "rating"],
        raw: true
    });

    const jumlahReview = reviews.length;

    const totalRating = reviews.reduce(
        (total, review) => total + Number(review.rating),
        0
    );

    const rataRataRating = jumlahReview > 0
        ? totalRating / jumlahReview
        : 0;

    return {
        id_product: Number(id_product),
        rata_rata_rating: Number(rataRataRating.toFixed(1)),
        jumlah_review: jumlahReview
    };
};

module.exports = {
    createReview,
    getReviewById,
    getReviews,
    getMyReviews,
    updateReview,
    deleteReview,
    getProductRating
};