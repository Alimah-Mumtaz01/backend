const userService = require("../services/userService");

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();

        return res.status(200).json({
            success: true,
            message: "Data user berhasil diambil",
            data: users,
        });
    } catch (error) {
        console.error("Get all users error:", error);

        return res.status(500).json({
            success: false,
            message: "Gagal mengambil data user",
            error: error.message,
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id_user } = req.params;

        const user = await userService.getUserById(id_user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Data user berhasil diambil",
            data: user,
        });
    } catch (error) {
        console.error("Get user by ID error:", error);

        return res.status(500).json({
            success: false,
            message: "Gagal mengambil data user",
        });
    }
};

const getAllCustomers = async (req, res) => {
    try {
        const { page, limit, search } = req.query;

        const result = await userService.getAllCustomers({
            page,
            limit,
            search: search || "",
        });

        return res.status(200).json({
            success: true,
            message: "Data pelanggan berhasil diambil",
            data: result,
        });
    } catch (error) {
        console.error("Get all customers error:", error);

        return res.status(500).json({
            success: false,
            message: "Gagal mengambil data pelanggan",
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    getAllCustomers,
};