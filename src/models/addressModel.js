const { DataTypes } = require("sequelize");

const defineAddressModel = (sequelize) => {
    const Address = sequelize.define(
        "Address",
        {
            id_address: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            id_user: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            },

            nama_penerima: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },

            no_hp: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },

            alamat: {
                type: DataTypes.TEXT,
                allowNull: false,
            },

            latitude: {
                type: DataTypes.DECIMAL(10, 7),
                allowNull: true,
            },

            longitude: {
                type: DataTypes.DECIMAL(10, 7),
                allowNull: true,
            },

            catatan: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: "addresses",
            timestamps: true,
        }
    );

    Address.associate = (models) => {
        Address.belongsTo(models.User, {
            foreignKey: "id_user",
            as: "user",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });
    };

    return Address;
};

module.exports = defineAddressModel;