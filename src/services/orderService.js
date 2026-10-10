const {sequelize, Order, OrderItem, OrderItemVariant, Product, Varian, Payment} = require('../models');
const env = require('../config/env');

const createOrder = async (id_user, orderData) => {
    const transaction = await sequelize.transaction();
    try {
        const {tipe_pengiriman, alamat_pengiriman, catatan, items} = orderData;
        if (!items || items.length === 0) {
            const error = new Error("Minimal harus ada satu produk dalam pesanan");
            error.statusCode = 400;
            throw error;
        }
        if (tipe_pengiriman === 'delivery' && !alamat_pengiriman) {
            const error = new Error("Alamat pengiriman harus diisi untuk tipe pengiriman delivery");
            error.statusCode = 400;
            throw error;
        }
        let subtotal = 0;
        const preparedItems = [];
        for (const item of items) {
            const product = await Product.findByPk(item.id_product, {transaction});
            if (!product) {
                const error = new Error(`Produk dengan id ${item.id_product} tidak ditemukan`);
                error.statusCode = 404;
                throw error;
            }
            if (product.status !== 'aktif') {
                const error = new Error(`Produk ${product.nama_product} sedang tidak aktif`);
                error.statusCode = 400;
                throw error;
            }
            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                const error = new Error(`Quantity produk ${product.nama_product} tidak valid`);
                error.statusCode = 400;
                throw error;
            }
            if (!item.variants || item.variants.length === 0) {
                const error = new Error(`Varian untuk produk ${product.nama_product} harus dipilih`);
                error.statusCode = 400;
                throw error;
            }
            const expectedVariantAmount = Number(product.jumlah_isi) * Number(item.quantity);
            const selectedVariantAmount = item.variants.reduce((total, variant) => total + Number(variant.jumlah), 0);
            if (selectedVariantAmount !== expectedVariantAmount) {
                const error = new Error(`Jumlah variant untuk produk ${product.nama_product} harus ${expectedVariantAmount} pcs`);
                error.statusCode = 400;
                throw error;
            }
            const preparedVariants = [];
            for (const itemVariant of item.variants) {
                const varian = await Varian.findByPk(itemVariant.id_varian, {transaction});
                if (!varian) {
                    const error = new Error(`Varian dengan id ${itemVariant.id_varian} tidak ditemukan`);
                    error.statusCode = 404;
                    throw error;
                }
                if (varian.status !== 'aktif') {
                    const error = new Error(`Varian ${varian.nama_varian} sedang tidak aktif`);
                    error.statusCode = 400;
                    throw error;
                }
                if (varian.stok < itemVariant.jumlah) {
                    const error = new Error(`Stok varian ${varian.nama_varian} tidak mencukupi`);
                    error.statusCode = 400;
                    throw error;
                }
                preparedVariants.push({
                    id_varian: varian.id_varian,
                    jumlah: itemVariant.jumlah
                });
            }
            const hargaSatuan = Number(product.harga);
            const totalHargaItem = hargaSatuan * Number(item.quantity);
            subtotal += totalHargaItem;
            preparedItems.push({
                product,
                quantity: item.quantity,
                harga_satuan: hargaSatuan,
                total_harga: totalHargaItem,
                variants: preparedVariants
            });
        }
        let ongkir = 0;
        if (tipe_pengiriman === 'delivery') {
            if (subtotal < 50000) {
                const error = new Error("Minimal pembelian untuk pengiriman delivery adalah Rp 50.000");
                error.statusCode = 400;
                throw error;
            }
            ongkir = 0;
        }
        const total_harga = subtotal + ongkir;
        const order = await Order.create({
            id_user,
            tipe_pengiriman,
            alamat_pengiriman:
            tipe_pengiriman === 'delivery' ? alamat_pengiriman : null,
            catatan,
            subtotal,
            ongkir,
            total_harga,
            status_order: 'menunggu_konfirmasi'
        }, {transaction});
        for (const item of preparedItems) {
            const orderItem = await OrderItem.create({
                id_order: order.id_order,
                id_product: item.product.id_product,
                quantity: item.quantity,
                harga_satuan: item.harga_satuan,
                total_harga: item.total_harga
            }, {transaction});
            for (const variant of item.variants) {
                await OrderItemVariant.create({
                    id_order_item: orderItem.id_order_item,
                    id_varian: variant.id_varian,
                    jumlah: variant.jumlah
                }, {transaction});
            }
        }
        await transaction.commit();
        return getOrderById(order.id_order, id_user);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const getOrdersByUser = async (id_user) => {
    try {
        const orders = await Order.findAll({
            where: {id_user},
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: [
                        {
                            model: Product,
                            as: 'product'
                        },
                        {
                            model: OrderItemVariant,
                            as: 'variants',
                            include: [
                                {
                                    model: Varian,
                                    as: 'varian'
                                },
                            ],
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
        return orders;
    } catch (error) {
        throw error;
    }
};

const getOrderById = async (id_order, id_user) => {
    try {
        const order = await Order.findOne({
            where: {id_order, id_user},
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: [
                        {
                            model: Product,
                            as: 'product'
                        },
                        {
                            model: OrderItemVariant,
                            as: 'variants',
                            include: [
                                {
                                    model: Varian,
                                    as: 'varian'
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        if (!order) {
            const error = new Error("Order tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }
        return order;
    } catch (error) {
        throw error;
    }
};

const updateShipping = async (id_order, id_user, shippingData) => {
    const transaction = await sequelize.transaction();
    try {
        const {tipe_pengiriman, alamat_pengiriman} = shippingData;
        const order = await Order.findOne({
            where: {id_order, id_user},
            transaction,
            lock: transaction.LOCK.UPDATE
        });
        if (!order) {
            const error = new Error("Order tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }
        if (order.status_order !== 'menunggu_konfirmasi') {
            throw new Error("Metode pengiriman hanya dapat diubah saat status order adalah 'menunggu_konfirmasi'");
        }
        const subtotal = Number(order.subtotal);
        let ongkir = 0;
        let alamatPengiriman = null;
        if (tipe_pengiriman === 'pickup') {
            ongkir = 0;
            alamatPengiriman = null;
        }
        if (tipe_pengiriman === 'delivery') {
            if (!alamat_pengiriman || alamat_pengiriman.trim().length === 0) {
                throw new Error("Alamat pengiriman harus diisi untuk tipe pengiriman delivery");
            }
            if (subtotal < 50000) {
                throw new Error("Minimal pembelian untuk pengiriman delivery adalah Rp 50.000");
            }
            ongkir = env.deliveryFee;
            alamatPengiriman = alamat_pengiriman.trim();
        }
        const total_harga = subtotal + ongkir;
        await order.update({
            tipe_pengiriman,
            alamat_pengiriman: alamatPengiriman,
            ongkir,
            total_harga: total_harga
        }, { transaction });
        await transaction.commit();
        return {
            id_order: order.id_order,
            tipe_pengiriman: order.tipe_pengiriman,
            alamat_pengiriman: order.alamat_pengiriman,
            subtotal: order.subtotal,
            ongkir: order.ongkir,
            total_harga: order.total_harga
        }
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const allowedTransitions = {
    menunggu_konfirmasi: [
        "pesanan_diterima",
        "dibatalkan",
    ],
    pesanan_diterima: [
        "menunggu_pembayaran",
        "dibatalkan"
    ],
    menunggu_pembayaran: [
        "dibatalkan"
    ],
    diprosess: [
        "siap_diambil",
        "sedang_dikirim"
    ],
    siap_diambil: [
        "selesai"
    ],
    sedang_dikirim: [
        "selesai"
    ]
}

const cancelableStatus = [
    "menunggu_konfirmasi",
    "pesanan_diterima",
    "menunggu_pembayaran",
    "pembayaran_ditolak"
];

const updateOrderStatus = async (id_order, status_order_baru) => {
    const transaction = await sequelize.transaction();
    try {
        const order = await Order.findByPk(id_order, {
            transaction,
            lock: transaction.LOCK.UPDATE,
        });
        if (!order) {
            const error = new Error("Order tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }
        const status_sekarang = order.status_order;
        if (
            !Order.prototype.hasOwnProperty.call(
                allowedTransitions,
                status_sekarang
            ) &&
            !cancelableStatus.includes(status_sekarang)
        ) {
            const error = new Error("Status order saat ini tidak dapat diubah melalui endpoint ini");
            error.statusCode = 400;
            throw error;
        }
        if (status_order_baru === "dibatalkan") {
            if (!cancelableStatus.includes(status_sekarang)) {
                const error = new Error("Order tidak dapat dibatalkan pada tahap ini");
                error.statusCode = 400;
                throw error;
            }
            const payment = await Payment.findOne({
                where: {
                    id_order,
                },
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (payment && payment.status.payment === "verified") {
                const error = new Error("Order dengan pembayaran terverifikasi tidak dapat dibatalkan melalui endpoint ini");
                error.statusCode = 400;
                throw error;
            }
        } else {
            const allowed = allowedTransitions[status_sekarang] || [];
            if (!allowed.includes(status_order_baru)) {
                const error = new Error(`Perubahan status dari ${status_sekarang} ke ${status_order_baru} tidak diizinkan`);
                error.statusCode = 400;
                throw error;
            }
        }
        if (status_order_baru === "siap_diambil") {
            if (order.tipe_pengiriman !== "pickup") {
                const error = new Error("Status siap_diambil hanya berlaku untuk pesanan pickup");
                error.statusCode = 400;
                throw error;
            }
        }
        if (status_order_baru === "sedang_dikirim") {
            if (order.tipe_pengiriman !== "delivery") {
                const error = new Error("Status sedang_dikirim hanya berlaku untuk pesanan delivery");
                error.statusCode = 400;
                throw error;
            }
        }
        order.status_order = status_order_baru;
        await order.save({
            transaction
        });
        await transaction.commit();
        return order;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const getOrderStatusByUser = async (id_order, id_user) => {
    const order = await Order.findOne({
        where: {
            id_order,
            id_user
        },
        attributes: [
            "id_order",
            "id_user",
            "status_order",
            "tipe_pengiriman",
            "total_harga",
            "createdAt",
            "updatedAt"
        ]
    });
    if (!order) {
        const error = new Error("Order tidak ditemukan");
        error.statusCode = 404;
        throw error;
    }
    return order;
};

module.exports = {
    createOrder,
    getOrdersByUser,
    getOrderById,
    updateShipping,
    updateOrderStatus,
    getOrderStatusByUser
};