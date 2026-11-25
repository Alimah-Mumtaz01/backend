const sequelize = require("../config/database");

const defineUserModel = require("./userModel");
const defineAddressModel = require("./addressModel");
const defineProductModel = require("./productModel");
const defineVarianModel = require("./varianModel");
const defineOrderModel = require("./orderModel");
const defineOrderItemModel = require("./orderItemModel");
const defineOrderItemVariantModel = require("./orderItemVariantModel");
const definePaymentModel = require("./paymentModel");
const definePaymentMethodModel = require("./paymentMethodModel");
const defineReviewModel = require("./reviewModel");
const defineReviewImageModel = require("./reviewImageModel");

// Membuat seluruh model.
const User = defineUserModel(sequelize);
const Address = defineAddressModel(sequelize);
const Product = defineProductModel(sequelize);
const Varian = defineVarianModel(sequelize);
const Order = defineOrderModel(sequelize);
const OrderItem = defineOrderItemModel(sequelize);
const OrderItemVariant = defineOrderItemVariantModel(sequelize);
const Payment = definePaymentModel(sequelize);
const PaymentMethod = definePaymentMethodModel(sequelize);
const Review = defineReviewModel(sequelize);
const ReviewImage = defineReviewImageModel(sequelize);

// Mengumpulkan seluruh model.
const models = {
    User,
    Address,
    Product,
    Varian,
    Order,
    OrderItem,
    OrderItemVariant,
    Payment,
    PaymentMethod,
    Review,
    ReviewImage,
};

// Menjalankan relasi setiap model.
Object.values(models).forEach((model) => {
    if (typeof model.associate === "function") {
        model.associate(models);
    }
});

// Mengekspor sequelize dan seluruh model.
module.exports = {
    sequelize,
    ...models,
};