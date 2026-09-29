const app = require("./app");
const { sequelize } = require("./models");
const env = require("./config/env");

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database berhasil terhubung.");
        await sequelize.sync();
        console.log("Semua model berhasil disinkronkan.");
        app.listen(env.port, () => {
            console.log(`SoeSweet API berjalan di http://localhost:${env.port}`);
        });
    } catch (error) {
        console.error("Gagal menjalankan server:");
        console.error(error.message);
        process.exit(1);
    }
};
startServer();