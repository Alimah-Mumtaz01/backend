const { DataTypes } = require("sequelize");

const defineUserModel = (sequelize) => {
    const User = sequelize.define(
        "User",
        {
            id_user: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            nama: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },

            email: {
                type: DataTypes.STRING(150),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },

            no_hp: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true,
            },

            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },

            role: {
                type: DataTypes.ENUM("user", "admin"),
                allowNull: false,
                defaultValue: "user",
            },
        },
        {
            tableName: "users",
            timestamps: true,
        }
    );

    User.associate = (models) => {
        User.hasMany(models.Order, {
            foreignKey: "id_user",
            as: "orders",
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        });

        User.hasMany(models.Review, {
            foreignKey: "id_user",
            as: "reviews",
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        });

        User.hasMany(models.Payment, {
            foreignKey: "verified_by",
            as: "verifiedPayments",
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
    };
    return User;
};

module.exports = defineUserModel;