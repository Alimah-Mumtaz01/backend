const { DataTypes } = require("sequelize");

const definePaymentModel = (sequelize) => {
    const Payment = sequelize.define(
        "Payment",
        {
            id_payment: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            id_order: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            },

            // Metode pembayaran yang digunakan.
            metode_pembayaran: {
                type: DataTypes.ENUM("transfer_bank", "e-wallet"),
                allowNull: false,
            },

            // Relasi ke tabel metode_pembayaran.
            id_metode_pembayaran: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            // Snapshot informasi metode pembayaran.
            nama_metode_snapshot: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },

            nomor_rekening_snapshot: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },

            username_snapshot: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },

            bukti_pembayaran: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },

            status_payment: {
                type: DataTypes.ENUM(
                    "pending",
                    "verified",
                    "rejected"
                ),
                allowNull: false,
                defaultValue: "pending",
            },

            verified_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            verified_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            catatan_verifikasi: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: "payments",
            timestamps: true,
        }
    );

    Payment.associate = (models) => {
        Payment.belongsTo(models.Order, {
            foreignKey: "id_order",
            as: "order",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });

        Payment.belongsTo(models.User, {
            foreignKey: "verified_by",
            as: "verifier",
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });

        // Relasi ke metode pembayaran.
        Payment.belongsTo(models.PaymentMethod, {
            foreignKey: "id_metode_pembayaran",
            as: "paymentMethod",
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
    };

    return Payment;
};

module.exports = definePaymentModel;