const { DataTypes } = require("sequelize");

const defineOrderItemModel = (sequelize) => {
    const OrderItem = sequelize.define(
        "OrderItem",
        {
            id_order_item: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            id_order: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            id_product: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                },
            },

            harga_satuan: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: false,
            },

            total_harga: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: false,
            },
        },
        {
            tableName: "order_items",
            timestamps: true,
        }
    );

    OrderItem.associate = (models) => {
        OrderItem.belongsTo(models.Order, {
            foreignKey: "id_order",
            as: "order",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });

        OrderItem.belongsTo(models.Product, {
            foreignKey: "id_product",
            as: "product",
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        });

        OrderItem.hasMany(models.OrderItemVariant, {
            foreignKey: "id_order_item",
            as: "variants",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });
    };
    return OrderItem;
};

module.exports = defineOrderItemModel;