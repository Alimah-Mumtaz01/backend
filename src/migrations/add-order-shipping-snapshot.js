const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const addOrderShippingSnapshot = async () => {
    try {
        console.log("Memulai migrasi snapshot pengiriman...");

        // Memastikan koneksi database tersedia.
        await sequelize.authenticate();

        const queryInterface = sequelize.getQueryInterface();

        // Memeriksa apakah tabel orders tersedia.
        const columns = await queryInterface.describeTable("orders");

        // Daftar kolom baru yang akan ditambahkan.
        const newColumns = {
            nama_penerima: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },

            no_hp_penerima: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },

            latitude_pengiriman: {
                type: DataTypes.DECIMAL(10, 7),
                allowNull: true,
            },

            longitude_pengiriman: {
                type: DataTypes.DECIMAL(10, 7),
                allowNull: true,
            },

            jarak_pengiriman: {
                type: DataTypes.DECIMAL(8, 2),
                allowNull: true,
            },

            catatan_alamat_pengiriman: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        };

        // Menambahkan kolom yang belum tersedia.
        for (const [columnName, columnDefinition] of Object.entries(
            newColumns
        )) {
            if (columns[columnName]) {
                console.log(
                    `Kolom ${columnName} sudah tersedia, dilewati.`
                );
                continue;
            }

            await queryInterface.addColumn(
                "orders",
                columnName,
                columnDefinition
            );

            console.log(`Kolom ${columnName} berhasil ditambahkan.`);
        }

        console.log("Migrasi snapshot pengiriman berhasil.");
    } catch (error) {
        console.error("Migrasi snapshot pengiriman gagal:", error);
        process.exitCode = 1;
    } finally {
        await sequelize.close();
    }
};

addOrderShippingSnapshot();