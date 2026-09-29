const { DataTypes } = require("sequelize");

const defineReviewImageModel = (sequelize) => {
    const ReviewImage = sequelize.define(
        "ReviewImage",
        {
            id_review_image: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            id_review: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            image: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
        },
        {
            tableName: "review_images",
            timestamps: true,
        }
    );

    ReviewImage.associate = (models) => {
        ReviewImage.belongsTo(models.Review, {
            foreignKey: "id_review",
            as: "review",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });
    };
    return ReviewImage;
};

module.exports = defineReviewImageModel;