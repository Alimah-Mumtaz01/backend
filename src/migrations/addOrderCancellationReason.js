const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const addOrderCancellationReason = async () => {
    try {
        console.log("Memulai migrasi alasan pembatalan pesanan...");

        // Memastikan koneksi database tersedia.
        await sequelize.authenticate();

        const queryInterface = sequelize.getQueryInterface();

        // Memeriksa apakah tabel orders tersedia.
        const columns = await queryInterface.describeTable("orders");

        // Memeriksa apakah kolom sudah tersedia.
        if (columns.alasan_pembatalan) {
            console.log(
                "Kolom alasan_pembatalan sudah tersedia, migrasi dilewati."
            );
        } else {
            // Menambahkan kolom alasan pembatalan.
            await queryInterface.addColumn(
                "orders",
                "alasan_pembatalan",
                {
                    type: DataTypes.TEXT,
                    allowNull: true,
                }
            );

            console.log(
                "Kolom alasan_pembatalan berhasil ditambahkan."
            );
        }

        console.log("Migrasi alasan pembatalan berhasil.");
    } catch (error) {
        console.error(
            "Migrasi alasan pembatalan gagal:",
            error
        );

        process.exitCode = 1;
    } finally {
        await sequelize.close();
    }
};

addOrderCancellationReason();