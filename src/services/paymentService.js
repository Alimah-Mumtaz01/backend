const {sequelize, Payment, Order, OrderItem, OrderItemVariant, Varian, User} = require("../models");

const uploadPayment = async (
    id_user, 
    id_order,
    metode_pembayaran,
    bukti_pembayaran
) => {
    const transaction = await sequelize.transaction();
    try {
        const order = await order.findone({
            where: {
                id_order,
                id_user
            },
            transaction,
        });
        if (!order) {
            const error = new Error("Pesanan tidak ditemukan atau bukan milik anda");
            error.statusCode = 404;
            throw error;
        }
        if (order.status_order !== "pending_payment")  {
            const error = new Error("Pesanan belum dapat melakukan pembayaran");
            error.statusCode = 400;
            throw error;
        }
        if (!bukti_pembayaran) {
            const error = new Error("Bukti pembayaran wajib diupload");
            error.statusCode = 400;
            throw error;
        }
        let payment = await Payment.findone({
            where: {
                id_order,
            },
            transaction,
        });
        if (payment) {
            if (payment.status_payment === "verified") {
                const error = new Error("Pembayaran sudah diverifikasi");
                error.statusCode = 400;
                throw error;
            }
            payment.metode_pembayaran = metode_pembayaran;
            payment.bukti_pembayaran = bukti_pembayaran;
            payment.status_payment = "pending";
            payment.verified_by = null;
            payment.verified_at = null;
            payment.catatan_verifikasi = null;
            await payment.save({
                transaction,
            });
        } else {
            payment = await Payment.create(
                {
                    id_order,
                    metode_pembayaran,
                    bukti_pembayaran,
                    status_payment: "pending"
                },
                {
                    transaction,
                }
            );
        }
        order.status = "pembayaran_diperiksa";
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

const verifyPayment = async (
    id_admin,
    id_order,
    status_payment,
    catatan_verifikasi
) => {
    const transaction = await sequelize.transaction();
    try {
        const payment = await Payment.findone({
            where: {
                id_order
            },
            transaction,
        });
        if (!payment) {
            const error = new Error("Data pembayaran tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }
        if (payment.status_payment === "verified") {
            const error = new Error("Pembayaran sudah diverifikasi sebelumnya");
            error.statusCode = 400;
            throw error;
        }
        const order = await Order.findone({
            where: {
                id_order,
            },
            transaction
        });
        if (!order) {
            const error = new Error("Pesanan tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }
        if (order.status_order !== "pending_payment") {
            const error = new Error("Pesanan belum berada pada tahap pemeriksaan pembayaran");
            error.statusCode = 400;
            throw error;
        }
        if (
            !["verified", "rejected"].includes(status_payment)
        ) {
            const error = new Error("Status pembayaran tidak valid");
            error.statusCode = 400;
            throw error;
        }
        if (status_payment === "verified") {
            const orderItems = await OrderItem.findAll({
                where: {
                    id_order,
                },
                include: [
                    {
                        model: OrderItemVariant,
                        as: "variants"
                    },
                ],
                transaction,
            });
            for (const orderItem of orderItems) {
                for (const itemVariant of orderItem.variants) {
                    const varian = await varian.findOne({
                        where: {
                            id_varian: itemVariant.id_varian,
                        },
                        transaction,
                        lock: transaction.LOCK.UPDATE,
                    });
                    if (!varian) {
                        const error = new Error(`Varian dengan ID ${itemVariant.id_varian} tidak ditemukan`);
                        error.statusCode = 404;
                        throw error;
                    }
                    if (varian.stok < itemVariant.jumlah) {
                        const error = new Error(`Stok varian ${varian.nama_varian} tidak mencukupi`);
                        error.statusCode = 400;
                        throw error;
                    }
                    varian.stok = varian.stok - itemVariant.jumlah;
                    await varian.save({
                        transaction,
                    });
                }
            }
            payment.status_payment = "verified";
            payment.verified_by = id_admin;
            payment.verified_at = new Date();
            payment.catatan_verifikasi = catatan_verifikasi || null;
            order.status = "diproses";
        }
        if (status_payment === "rejected") {
            if (
                !catatan_verifikasi ||
                catatan_verifikasi.trim() === ""
            ) {
                const error = new Error("Alasan penolakan pembayaran harus diisi");
                error.statusCode = 400;
                throw error;
            }
            payment.status_payment = "rejected";
            payment.verified_by = id_admin;
            payment.verified_at = new Date();
            payment.catatan_verifikasi = catatan_verifikasi;
            order.status_order = "cancelled";
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
    uploadPayment,
    verifyPayment
};