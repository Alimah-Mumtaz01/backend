const sequelize = require("../config/database");
const defineUserModel = require("./userModel");
const defineProductModel = require("./productModel");
const defineVarianModel = require("./varianModel");
const defineOrderModel = require("./orderModel");
const defineOrderItemModel = require("./orderItemModel");
const defineOrderItemVariantModel = require("./orderItemVariantModel");
const definePaymentModel = require("./paymentModel");
const defineReviewModel = require("./reviewModel");
const defineReviewImageModel = require("./reviewImageModel");

const User = defineUserModel(sequelize);
const Product = defineProductModel(sequelize);
const Varian = defineVarianModel(sequelize);
const Order = defineOrderModel(sequelize);
const OrderItem = defineOrderItemModel(sequelize);
const OrderItemVariant = defineOrderItemVariantModel(sequelize);
const Payment = definePaymentModel(sequelize);
const Review = defineReviewModel(sequelize);
const ReviewImage = defineReviewImageModel(sequelize);

const models = {
    User,
    Product,
    Varian,
    Order,
    OrderItem,
    OrderItemVariant,
    Payment,
    Review,
    ReviewImage,
};

Object.values(models).forEach((model) => {
    if (typeof model.associate === "function") {
        model.associate(models);
    }
});

module.exports = {
    sequelize,
    ...models,
};