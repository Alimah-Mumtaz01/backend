const { DataTypes } = require("sequelize");

const defineProductModel = (sequelize) => {
    const Product = sequelize.define(
        "Product",
        {
            id_product: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            nama_product: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },

            jumlah_isi: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                },
            },

            harga: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: false,
                validate: {
                    min: 0,
                },
            },

            deskripsi: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            gambar: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },

            status: {
                type: DataTypes.ENUM("aktif", "nonaktif"),
                allowNull: false,
                defaultValue: "aktif",
            },
        },
        {
            tableName: "products",
            timestamps: true,
        }
    );

    Product.associate = (models) => {
        Product.hasMany(models.OrderItem, {
            foreignKey: "id_product",
            as: "orderItems",
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        });
    };
    return Product;
};

module.exports = defineProductModel;