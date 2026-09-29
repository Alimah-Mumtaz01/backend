const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, sequelize } = require("../models");
const env = require("../config/env");

const register = async ({ nama, email, password }) => {
    const transaction = await sequelize.transaction();
    try {
        const existingUser = await User.findOne({
            where: {
                email,
            },
            transaction,
        });
        if (existingUser) {
            const error = new Error("Email sudah terdaftar");
            error.statusCode = 409;
            throw error;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create(
            {
                nama,
                email,
                password: hashedPassword,
                role: "user",
            },
            {
                transaction,
            }
        );
        await transaction.commit();
        return {
            id_user: user.id_user,
            nama: user.nama,
            email: user.email,
            role: user.role,
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const login = async ({ email, password }) => {
    try {
        const user = await User.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            const error = new Error("Email atau password salah");
            error.statusCode = 401;
            throw error;
        }
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );
        if (!isPasswordValid) {
            const error = new Error("Email atau password salah");
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                id_user: user.id_user,
                email: user.email,
                role: user.role,
            },
            env.jwt.secret,
            {
                expiresIn: env.jwt.expiresIn,
            }
        );
        return {
            token,
            user: {
                id_user: user.id_user,
                nama: user.nama,
                email: user.email,
                role: user.role,
            },
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    register,
    login,
};