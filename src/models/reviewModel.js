const { DataTypes } = require("sequelize");

const defineReviewModel = (sequelize) => {
    const Review = sequelize.define(
        "Review",
        {
            id_review: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            id_user: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            id_order: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            },

            id_product: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5,
                },
            },

            komentar: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: "reviews",
            timestamps: true,
        }
    );

    Review.associate = (models) => {
        Review.belongsTo(models.User, {
            foreignKey: "id_user",
            as: "user",
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        });

        Review.belongsTo(models.Order, {
            foreignKey: "id_order",
            as: "order",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });

        Review.belongsTo(models.Product, {
            foreignKey: "id_product",
            as: "product"
        });

        Review.hasMany(models.ReviewImage, {
            foreignKey: "id_review",
            as: "images",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });
    };
    return Review;
};

module.exports = defineReviewModel;