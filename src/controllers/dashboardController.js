const dashboardService = require("../services/dashboardService");

const getDashboard = async (req, res) => {
    try {
        const dashboard = await dashboardService.getDashboardData({
            startDate: req.query.startDate,
            endDate: req.query.endDate
        });
        return res.status(200).json({
            success: true,
            message: "Data dashboard admin berhasil diambil",
            data: dashboard
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Gagal mengambil data dashboard"
        });
    }
};

module.exports = {getDashboard};