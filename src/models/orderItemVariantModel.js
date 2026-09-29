const { DataTypes } = require("sequelize");

const defineOrderItemVariantModel = (sequelize) => {
    const OrderItemVariant = sequelize.define(
        "OrderItemVariant",
        {
            id_order_item_variant: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            id_order_item: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            id_varian: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            jumlah: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                },
            },
        },
        {
            tableName: "order_item_variants",
            timestamps: true,
        }
    );

    OrderItemVariant.associate = (models) => {
        OrderItemVariant.belongsTo(models.OrderItem, {
            foreignKey: "id_order_item",
            as: "orderItem",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });

        OrderItemVariant.belongsTo(models.Varian, {
            foreignKey: "id_varian",
            as: "varian",
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        });
    };
    return OrderItemVariant;
};

module.exports = defineOrderItemVariantModel;