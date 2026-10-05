const userService = require('../services/userService');

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({
            success: true,
            message: 'Data user berhasil diambil',
            data: users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data user',
            error: error.message
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
                message: 'User tidak ditemukan'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Data user berhasil diambil',
            data: user
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data user',
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById
};