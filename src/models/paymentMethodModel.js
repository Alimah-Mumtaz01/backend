const { DataTypes } = require("sequelize");

const definePaymentMethodModel = (sequelize) => {
    const PaymentMethod = sequelize.define(
        "PaymentMethod",
        {
            id_metode_pembayaran: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            jenis_metode: {
                type: DataTypes.ENUM("transfer_bank", "e-wallet"),
                allowNull: false,
            },

            nama_bank: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },

            jenis_e_wallet: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },

            nomor_rekening: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },

            username: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },

            status: {
                type: DataTypes.ENUM("aktif", "nonaktif"),
                allowNull: false,
                defaultValue: "aktif",
            },
        },
        {
            tableName: "metode_pembayaran",
            timestamps: true,
        }
    );

    // Relasi metode pembayaran dengan transaksi.
    PaymentMethod.associate = (models) => {
        PaymentMethod.hasMany(models.Payment, {
            foreignKey: "id_metode_pembayaran",
            as: "payments",
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
    };

    return PaymentMethod;
};

module.exports = definePaymentMethodModel;