const authService = require("../services/authService");

const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        return res.status(201).json({
            success: true,
            message: "Registrasi berhasil",
            data: user,
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Terjadi kesalahan pada server",
        });
    }
};

const login = async (req, res) => {
    try {
        const result = await authService.login(req.body);
        return res.status(200).json({
            success: true,
            message: "Login berhasil",
            data: result,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Terjadi kesalahan pada server",
        });
    }
};

module.exports = {
    register,
    login,
};