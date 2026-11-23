const profileService = require("../services/profileService");

/**
 * GET /api/profile
 * Mengambil profil customer yang sedang login.
 */
const getProfile = async (req, res) => {
    try {
        const profile = await profileService.getProfile(
            req.user.id_user
        );

        return res.status(200).json({
            success: true,
            message: "Profil berhasil diambil",
            data: profile,
        });
    } catch (error) {
        console.error("Get profile error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Gagal mengambil profil",
        });
    }
};

/**
 * PUT /api/profile/address
 * Menambahkan atau memperbarui alamat utama.
 */
const savePrimaryAddress = async (req, res) => {
    try {
        const address = await profileService.savePrimaryAddress(
            req.user.id_user,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Alamat utama berhasil disimpan",
            data: address,
        });
    } catch (error) {
        console.error("Save primary address error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Gagal menyimpan alamat",
        });
    }
};

module.exports = {
    getProfile,
    savePrimaryAddress,
};