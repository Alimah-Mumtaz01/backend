const jwt = require("jsonwebtoken");
const { User } = require("../models");
const env = require("../config/env");

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Token tidak ditemukan",
            });
        }
        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
            return res.status(401).json({
                success: false,
                message: "Format token tidak valid",
            });
        }
        const token = parts[1];
        const decoded = jwt.verify(token, env.jwt.secret);
        const user = await User.findByPk(decoded.id_user, {
            attributes: [
                "id_user",
                "nama",
                "email",
                "no_hp",
                "role",
                "createdAt",
                "updatedAt",
            ],
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User tidak ditemukan",
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token sudah kedaluwarsa",
            });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Token tidak valid",
            });
        }
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
        });
    }
};

module.exports = authenticate;