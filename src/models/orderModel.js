const { DataTypes } = require("sequelize");

const defineOrderModel = (sequelize) => {
    const Order = sequelize.define(
        "Order",
        {
            id_order: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            id_user: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            tipe_pengiriman: {
                type: DataTypes.ENUM("pickup", "delivery"),
                allowNull: false,
            },

            alamat_pengiriman: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            catatan: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            subtotal: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: false,
                defaultValue: 0,
            },

            ongkir: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: false,
                defaultValue: 0,
            },

            total_harga: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: false,
                defaultValue: 0,
            },

            status_order: {
                type: DataTypes.ENUM(
                    "pending_payment",
                    "waiting_verification",
                    "processing",
                    "ready",
                    "on_delivery",
                    "completed",
                    "cancelled"
                ),
                allowNull: false,
                defaultValue: "pending_payment",
            },
        },
        {
            tableName: "orders",
            timestamps: true,
        }
    );

    Order.associate = (models) => {
        Order.belongsTo(models.User, {
            foreignKey: "id_user",
            as: "user",
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        });

        Order.hasMany(models.OrderItem, {
            foreignKey: "id_order",
            as: "orderItems",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });

        Order.hasOne(models.Payment, {
            foreignKey: "id_order",
            as: "payment",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });

        Order.hasOne(models.Review, {
            foreignKey: "id_order",
            as: "review",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });
    };
    return Order;
};

module.exports = defineOrderModel;