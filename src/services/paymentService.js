const {
    sequelize,
    Payment,
    PaymentMethod,
    Order,
    OrderItem,
    OrderItemVariant,
    Varian,
} = require("../models");

/**
 * Membuat error dengan status HTTP.
 */
const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

/**
 * Mengambil seluruh metode pembayaran untuk admin.
 */
const getAllPaymentMethods = async () => {
    return await PaymentMethod.findAll({
        order: [
            ["createdAt", "DESC"],
        ],
    });
};

/**
 * Mengambil metode pembayaran aktif untuk customer.
 */
const getActivePaymentMethods = async () => {
    return await PaymentMethod.findAll({
        where: {
            status: "aktif",
        },
        order: [
            ["jenis_metode", "ASC"],
            ["nama_bank", "ASC"],
            ["jenis_e_wallet", "ASC"],
        ],
    });
};

/**
 * Menambahkan metode pembayaran.
 */
const createPaymentMethod = async (data) => {
    const {
        jenis_metode,
        nama_bank,
        jenis_e_wallet,
        nomor_rekening,
        username,
    } = data;

    const paymentMethod = await PaymentMethod.create({
        jenis_metode,

        nama_bank:
            jenis_metode === "transfer_bank"
                ? nama_bank
                : null,

        jenis_e_wallet:
            jenis_metode === "e-wallet"
                ? jenis_e_wallet
                : null,

        nomor_rekening,
        username,
        status: "aktif",
    });

    return paymentMethod;
};

/**
 * Memperbarui metode pembayaran.
 */
const updatePaymentMethod = async (
    id_metode_pembayaran,
    data
) => {
    const paymentMethod = await PaymentMethod.findByPk(
        id_metode_pembayaran
    );

    if (!paymentMethod) {
        throw createError(
            "Metode pembayaran tidak ditemukan",
            404
        );
    }

    const {
        jenis_metode,
        nama_bank,
        jenis_e_wallet,
        nomor_rekening,
        username,
    } = data;

    await paymentMethod.update({
        jenis_metode,

        nama_bank:
            jenis_metode === "transfer_bank"
                ? nama_bank
                : null,

        jenis_e_wallet:
            jenis_metode === "e-wallet"
                ? jenis_e_wallet
                : null,

        nomor_rekening,
        username,
    });

    return paymentMethod;
};

/**
 * Mengubah status metode pembayaran.
 */
const updatePaymentMethodStatus = async (
    id_metode_pembayaran,
    status
) => {
    const paymentMethod = await PaymentMethod.findByPk(
        id_metode_pembayaran
    );

    if (!paymentMethod) {
        throw createError(
            "Metode pembayaran tidak ditemukan",
            404
        );
    }

    await paymentMethod.update({
        status,
    });

    return paymentMethod;
};

/**
 * Menghapus metode pembayaran.
 * Jika sudah pernah digunakan, metode akan dinonaktifkan.
 */
const deletePaymentMethod = async (
    id_metode_pembayaran
) => {
    const transaction = await sequelize.transaction();

    try {
        const paymentMethod = await PaymentMethod.findByPk(
            id_metode_pembayaran,
            {
                transaction,
                lock: transaction.LOCK.UPDATE,
            }
        );

        if (!paymentMethod) {
            throw createError(
                "Metode pembayaran tidak ditemukan",
                404
            );
        }

        const totalPayments = await Payment.count({
            where: {
                id_metode_pembayaran,
            },
            transaction,
        });

        if (totalPayments > 0) {
            await paymentMethod.update(
                {
                    status: "nonaktif",
                },
                {
                    transaction,
                }
            );

            await transaction.commit();

            return {
                deleted: false,
                deactivated: true,
                message:
                    "Metode pembayaran sudah digunakan dalam transaksi sehingga dinonaktifkan, bukan dihapus.",
            };
        }

        await paymentMethod.destroy({
            transaction,
        });

        await transaction.commit();

        return {
            deleted: true,
            deactivated: false,
            message: "Metode pembayaran berhasil dihapus",
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/**
 * Customer mengunggah bukti pembayaran
 * menggunakan metode pembayaran dari database.
 */
const uploadPayment = async (
    id_user,
    id_order,
    id_metode_pembayaran,
    bukti_pembayaran
) => {
    const transaction = await sequelize.transaction();

    try {
        // 1. Memeriksa pesanan milik customer.
        const order = await Order.findOne({
            where: {
                id_order,
                id_user,
            },
            transaction,
        });

        if (!order) {
            throw createError(
                "Pesanan tidak ditemukan atau bukan milik anda",
                404
            );
        }

        // 2. Memeriksa status pesanan.
        if (order.status_order !== "menunggu_pembayaran") {
            throw createError(
                "Pesanan belum dapat melakukan pembayaran",
                400
            );
        }

        // 3. Memeriksa bukti pembayaran.
        if (!bukti_pembayaran) {
            throw createError(
                "Bukti pembayaran wajib diupload",
                400
            );
        }

        // 4. Mengambil metode pembayaran dari database.
        const paymentMethod = await PaymentMethod.findOne({
            where: {
                id_metode_pembayaran,
                status: "aktif",
            },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        if (!paymentMethod) {
            throw createError(
                "Metode pembayaran tidak ditemukan atau sudah tidak aktif",
                404
            );
        }

        // 5. Menentukan nama metode untuk snapshot.
        const namaMetode =
            paymentMethod.jenis_metode === "transfer_bank"
                ? paymentMethod.nama_bank
                : paymentMethod.jenis_e_wallet;

        // 6. Mencari pembayaran berdasarkan pesanan.
        let payment = await Payment.findOne({
            where: {
                id_order,
            },
            transaction,
        });

        // Data metode pembayaran yang digunakan.
        const paymentData = {
            id_metode_pembayaran:
                paymentMethod.id_metode_pembayaran,

            // Tetap mengisi kolom lama untuk kompatibilitas.
            metode_pembayaran: paymentMethod.jenis_metode,

            // Snapshot agar detail rekening tetap tercatat.
            nama_metode_snapshot: namaMetode,
            nomor_rekening_snapshot: paymentMethod.nomor_rekening,
            username_snapshot: paymentMethod.username,

            bukti_pembayaran,
            status_payment: "pending",
            verified_by: null,
            verified_at: null,
            catatan_verifikasi: null,
        };

        if (payment) {
            // Pembayaran yang sudah diverifikasi tidak dapat diganti.
            if (payment.status_payment === "verified") {
                throw createError(
                    "Pembayaran sudah diverifikasi",
                    400
                );
            }

            // Memperbarui pembayaran yang sudah ada.
            await payment.update(
                paymentData,
                {
                    transaction,
                }
            );
        } else {
            // Membuat data pembayaran baru.
            payment = await Payment.create(
                {
                    id_order,
                    ...paymentData,
                },
                {
                    transaction,
                }
            );
        }

        // 7. Mengubah status pesanan.
        order.status_order = "pembayaran_diperiksa";

        await order.save({
            transaction,
        });

        await transaction.commit();

        return payment;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/**
 * Admin memverifikasi atau menolak pembayaran.
 */
const verifyPayment = async (
    id_admin,
    id_order,
    status_payment,
    catatan_verifikasi
) => {
    const transaction = await sequelize.transaction();

    try {
        const payment = await Payment.findOne({
            where: {
                id_order,
            },
            transaction,
        });

        if (!payment) {
            throw createError(
                "Data pembayaran tidak ditemukan",
                404
            );
        }

        if (payment.status_payment === "verified") {
            throw createError(
                "Pembayaran sudah diverifikasi sebelumnya",
                400
            );
        }

        const order = await Order.findOne({
            where: {
                id_order,
            },
            transaction,
        });

        if (!order) {
            throw createError(
                "Pesanan tidak ditemukan",
                404
            );
        }

        if (order.status_order !== "pembayaran_diperiksa") {
            throw createError(
                "Pesanan belum berada pada tahap pemeriksaan pembayaran",
                400
            );
        }

        if (status_payment === "verified") {
            const orderItems = await OrderItem.findAll({
                where: {
                    id_order,
                },
                include: [
                    {
                        model: OrderItemVariant,
                        as: "variants",
                    },
                ],
                transaction,
            });

            for (const orderItem of orderItems) {
                for (const itemVariant of orderItem.variants) {
                    const varian = await Varian.findOne({
                        where: {
                            id_varian: itemVariant.id_varian,
                        },
                        transaction,
                        lock: transaction.LOCK.UPDATE,
                    });

                    if (!varian) {
                        throw createError(
                            `Varian dengan ID ${itemVariant.id_varian} tidak ditemukan`,
                            404
                        );
                    }

                    if (varian.stok < itemVariant.jumlah) {
                        throw createError(
                            `Stok varian ${varian.nama_varian} tidak mencukupi`,
                            400
                        );
                    }

                    varian.stok =
                        varian.stok - itemVariant.jumlah;

                    await varian.save({
                        transaction,
                    });
                }
            }

            payment.status_payment = "verified";
            payment.verified_by = id_admin;
            payment.verified_at = new Date();
            payment.catatan_verifikasi =
                catatan_verifikasi || null;

            order.status_order = "diproses";
        }

        if (status_payment === "rejected") {
            payment.status_payment = "rejected";
            payment.verified_by = id_admin;
            payment.verified_at = new Date();
            payment.catatan_verifikasi = catatan_verifikasi;

            order.status_order = "pembayaran_ditolak";
        }

        await payment.save({
            transaction,
        });

        await order.save({
            transaction,
        });

        await transaction.commit();

        return {
            payment,
            order,
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    // CRUD metode pembayaran.
    getAllPaymentMethods,
    getActivePaymentMethods,
    createPaymentMethod,
    updatePaymentMethod,
    updatePaymentMethodStatus,
    deletePaymentMethod,

    // Proses pembayaran.
    uploadPayment,
    verifyPayment,
};