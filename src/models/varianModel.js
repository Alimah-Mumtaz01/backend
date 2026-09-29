const { DataTypes } = require("sequelize");

const defineVarianModel = (sequelize) => {
    const Varian = sequelize.define(
        "Varian",
        {
            id_varian: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            nama_varian: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },

            stok: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    min: 0,
                },
            },

            status: {
                type: DataTypes.ENUM("aktif", "nonaktif"),
                allowNull: false,
                defaultValue: "aktif",
            },
        },
        {
            tableName: "varian",
            timestamps: true,
        }
    );

    Varian.associate = (models) => {
        Varian.hasMany(models.OrderItemVariant, {
            foreignKey: "id_varian",
            as: "orderItemVariants",
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        });
    };
    return Varian;
};

module.exports = defineVarianModel;