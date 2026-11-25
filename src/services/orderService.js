const {
    sequelize,
    User,
    Order,
    OrderItem,
    OrderItemVariant,
    Product,
    Varian,
    Payment,
    PaymentMethod,
    Review
} = require('../models');

const env = require('../config/env');

const {
    resolveDeliveryDetails
} = require('./deliveryService');


const createOrder = async (id_user, orderData) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            tipe_pengiriman,
            address_source,
            nama_penerima,
            no_hp_penerima,
            alamat_pengiriman,
            catatan_alamat_pengiriman,
            catatan,
            items
        } = orderData;

        let subtotal = 0;
        const preparedItems = [];

        // ========================================
        // 1. VALIDASI PRODUK DAN VARIAN
        // ========================================

        for (const item of items) {
            const product = await Product.findByPk(
                item.id_product,
                { transaction }
            );

            if (!product) {
                const error = new Error(
                    `Produk dengan id ${item.id_product} tidak ditemukan`
                );
                error.statusCode = 404;
                throw error;
            }

            if (product.status !== 'aktif') {
                const error = new Error(
                    `Produk ${product.nama_product} sedang tidak aktif`
                );
                error.statusCode = 400;
                throw error;
            }

            const expectedVariantAmount =
                Number(product.jumlah_isi) *
                Number(item.quantity);

            const selectedVariantAmount =
                item.variants.reduce(
                    (total, variant) =>
                        total + Number(variant.jumlah),
                    0
                );

            if (
                selectedVariantAmount !== expectedVariantAmount
            ) {
                const error = new Error(
                    `Jumlah variant untuk produk ${product.nama_product} harus ${expectedVariantAmount} pcs`
                );
                error.statusCode = 400;
                throw error;
            }

            const preparedVariants = [];

            for (const itemVariant of item.variants) {
                const varian = await Varian.findByPk(
                    itemVariant.id_varian,
                    { transaction }
                );

                if (!varian) {
                    const error = new Error(
                        `Varian dengan id ${itemVariant.id_varian} tidak ditemukan`
                    );
                    error.statusCode = 404;
                    throw error;
                }

                if (varian.status !== 'aktif') {
                    const error = new Error(
                        `Varian ${varian.nama_varian} sedang tidak aktif`
                    );
                    error.statusCode = 400;
                    throw error;
                }

                if (
                    Number(varian.stok) <
                    Number(itemVariant.jumlah)
                ) {
                    const error = new Error(
                        `Stok varian ${varian.nama_varian} tidak mencukupi`
                    );
                    error.statusCode = 400;
                    throw error;
                }

                preparedVariants.push({
                    id_varian: varian.id_varian,
                    jumlah: itemVariant.jumlah
                });
            }

            const hargaSatuan = Number(product.harga);

            const totalHargaItem =
                hargaSatuan * Number(item.quantity);

            subtotal += totalHargaItem;

            preparedItems.push({
                product,
                quantity: item.quantity,
                harga_satuan: hargaSatuan,
                total_harga: totalHargaItem,
                variants: preparedVariants
            });
        }

        // ========================================
        // 2. MENGHITUNG ONGKIR
        // ========================================

        let ongkir = 0;
        let deliveryDetails = null;

        if (tipe_pengiriman === 'delivery') {

            // Minimal pembelian delivery Rp50.000.
            if (subtotal < 50000) {
                const error = new Error(
                    "Minimal pembelian untuk pengiriman delivery adalah Rp 50.000"
                );
                error.statusCode = 400;
                throw error;
            }

            deliveryDetails = await resolveDeliveryDetails(
                id_user,
                {
                    address_source,
                    nama_penerima,
                    no_hp_penerima,
                    alamat_pengiriman,
                    catatan_alamat_pengiriman
                },
                {
                    transaction
                }
            );

            ongkir = Number(deliveryDetails.ongkir);
        }

        // ========================================
        // 3. MENGHITUNG TOTAL PESANAN
        // ========================================

        const total_harga = subtotal + ongkir;

        // ========================================
        // 4. MENYIMPAN PESANAN
        // ========================================

        const order = await Order.create({
            id_user,

            tipe_pengiriman,

            alamat_pengiriman:
                deliveryDetails?.alamat_pengiriman || null,

            catatan_alamat_pengiriman:
                deliveryDetails?.catatan_alamat_pengiriman || null,

            nama_penerima:
                deliveryDetails?.nama_penerima || null,

            no_hp_penerima:
                deliveryDetails?.no_hp_penerima || null,

            latitude_pengiriman:
                deliveryDetails?.latitude_pengiriman ?? null,

            longitude_pengiriman:
                deliveryDetails?.longitude_pengiriman ?? null,

            jarak_pengiriman:
                deliveryDetails?.jarak_pengiriman ?? null,

            catatan: catatan || null,

            subtotal,
            ongkir,
            total_harga,

            status_order: 'menunggu_konfirmasi'

        }, { transaction });

        // ========================================
        // 5. MENYIMPAN ITEM PESANAN
        // ========================================

        for (const item of preparedItems) {
            const orderItem = await OrderItem.create({
                id_order: order.id_order,
                id_product: item.product.id_product,
                quantity: item.quantity,
                harga_satuan: item.harga_satuan,
                total_harga: item.total_harga
            }, { transaction });

            for (const variant of item.variants) {
                await OrderItemVariant.create({
                    id_order_item: orderItem.id_order_item,
                    id_varian: variant.id_varian,
                    jumlah: variant.jumlah
                }, { transaction });
            }
        }

        // ========================================
        // 6. COMMIT TRANSAKSI
        // ========================================

        await transaction.commit();

        return getOrderById(
            order.id_order,
            id_user
        );

    } catch (error) {

        await transaction.rollback();

        throw error;
    }
};

const getAllOrders = async () => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: [
                        'id_user',
                        'nama',
                        'email',
                        'no_hp',
                        'role',
                    ],
                },
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                        },
                        {
                            model: OrderItemVariant,
                            as: 'variants',
                            include: [
                                {
                                    model: Varian,
                                    as: 'varian',
                                },
                            ],
                        },
                    ],
                },
                {
                    model: Payment,
                    as: 'payment',
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        return orders;
    } catch (error) {
        throw error;
    }
};

const getOrderDetailByIdAdmin = async (id_order) => {
    try {
        const order = await Order.findByPk(id_order, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: [
                        'id_user',
                        'nama',
                        'email',
                        'no_hp',
                        'role',
                    ],
                },
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                        },
                        {
                            model: OrderItemVariant,
                            as: 'variants',
                            include: [
                                {
                                    model: Varian,
                                    as: 'varian',
                                },
                            ],
                        },
                    ],
                },
                {
                    model: Payment,
                    as: 'payment',
                    include: [
                        {
                            model: PaymentMethod,
                            as: 'paymentMethod',
                            attributes: [
                                'nama_bank',
                                'jenis_e_wallet',
                            ],
                        },
                    ],
                },
            ],
        });

        if (!order) {
            const error = new Error('Pesanan tidak ditemukan');
            error.statusCode = 404;
            throw error;
        }

        return order;
    } catch (error) {
        throw error;
    }
};

const getOrdersByUser = async (id_user) => {
    try {
        const orders = await Order.findAll({
            where: { id_user },
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                        },
                        {
                            model: OrderItemVariant,
                            as: 'variants',
                            include: [
                                {
                                    model: Varian,
                                    as: 'varian',
                                },
                            ],
                        },
                    ],
                },
                {
                    model: Payment,
                    as: 'payment',
                },
                {
                    model: Review,
                    as: 'review',
                    attributes: [
                        'id_review',
                        'rating',
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
            where: {
                id_order,
                id_user,
            },
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                        },
                        {
                            model: OrderItemVariant,
                            as: 'variants',
                            include: [
                                {
                                    model: Varian,
                                    as: 'varian',
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if (!order) {
            const error = new Error('Order tidak ditemukan');
            error.statusCode = 404;
            throw error;
        }

        return order;
    } catch (error) {
        throw error;
    }
};

const updateShipping = async (
    id_order,
    id_user,
    shippingData
) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            tipe_pengiriman,
            address_source,
            nama_penerima,
            no_hp_penerima,
            alamat_pengiriman,
            catatan_alamat_pengiriman
        } = shippingData;

        // 1. Mencari pesanan berdasarkan ID pesanan dan customer.
        const order = await Order.findOne({
            where: {
                id_order,
                id_user,
            },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        if (!order) {
            const error = new Error('Order tidak ditemukan');
            error.statusCode = 404;
            throw error;
        }

        // 2. Memastikan status pesanan masih dapat diubah.
        if (order.status_order !== 'menunggu_konfirmasi') {
            const error = new Error(
                "Metode pengiriman hanya dapat diubah saat status order adalah 'menunggu_konfirmasi'"
            );

            error.statusCode = 400;
            throw error;
        }

        const subtotal = Number(order.subtotal);

        let ongkir = 0;
        let deliveryDetails = null;

        // 3. Memproses pilihan pengiriman.
        if (tipe_pengiriman === 'pickup') {
            ongkir = 0;
        } else if (tipe_pengiriman === 'delivery') {

            // Memeriksa minimal pembelian.
            if (subtotal < 50000) {
                const error = new Error(
                    'Minimal pembelian untuk pengiriman delivery adalah Rp 50.000'
                );

                error.statusCode = 400;
                throw error;
            }

            // Mengambil alamat dan menghitung ongkir terbaru.
            deliveryDetails = await resolveDeliveryDetails(
                id_user,
                {
                    address_source,
                    nama_penerima,
                    no_hp_penerima,
                    alamat_pengiriman,
                    catatan_alamat_pengiriman
                },
                {
                    transaction,
                }
            );

            ongkir = Number(deliveryDetails.ongkir);
        } else {
            const error = new Error(
                'Tipe pengiriman harus delivery atau pickup'
            );

            error.statusCode = 400;
            throw error;
        }

        // 4. Menghitung total terbaru.
        const total_harga = subtotal + ongkir;

        // 5. Memperbarui data pesanan.
        await order.update(
            {
                tipe_pengiriman,

                alamat_pengiriman:
                    deliveryDetails?.alamat_pengiriman || null,

                catatan_alamat_pengiriman:
                    deliveryDetails?.catatan_alamat_pengiriman || null,

                nama_penerima:
                    deliveryDetails?.nama_penerima || null,

                no_hp_penerima:
                    deliveryDetails?.no_hp_penerima || null,

                latitude_pengiriman:
                    deliveryDetails?.latitude_pengiriman ?? null,

                longitude_pengiriman:
                    deliveryDetails?.longitude_pengiriman ?? null,

                jarak_pengiriman:
                    deliveryDetails?.jarak_pengiriman ?? null,

                ongkir,
                total_harga,
            },
            { transaction }
        );

        // 6. Menyimpan perubahan.
        await transaction.commit();

        return {
            id_order: order.id_order,
            tipe_pengiriman: order.tipe_pengiriman,
            alamat_pengiriman: order.alamat_pengiriman,
            catatan_alamat_pengiriman: order.catatan_alamat_pengiriman,
            nama_penerima: order.nama_penerima,
            no_hp_penerima: order.no_hp_penerima,
            latitude_pengiriman: order.latitude_pengiriman,
            longitude_pengiriman: order.longitude_pengiriman,
            jarak_pengiriman: order.jarak_pengiriman,
            subtotal: order.subtotal,
            ongkir: order.ongkir,
            total_harga: order.total_harga,
        };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const allowedTransitions = {
    menunggu_konfirmasi: [
        'pesanan_diterima',
        'dibatalkan',
    ],

    pesanan_diterima: [
        'menunggu_pembayaran',
        'dibatalkan',
    ],

    menunggu_pembayaran: [
        'dibatalkan',
    ],

    diproses: [
        'siap_diambil',
        'sedang_dikirim',
    ],

    siap_diambil: [
        'selesai',
    ],

    sedang_dikirim: [
        'selesai',
    ],
};

const cancelableStatus = [
    'menunggu_konfirmasi',
    'pesanan_diterima',
    'menunggu_pembayaran',
    'pembayaran_ditolak',
];


const updateOrderStatus = async (
    id_order,
    status_order_baru,
    alasan_pembatalan = null
) => {
    const transaction = await sequelize.transaction();

    try {
        const order = await Order.findByPk(id_order, {
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        if (!order) {
            const error = new Error('Order tidak ditemukan');
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
            const error = new Error(
                'Status order saat ini tidak dapat diubah melalui endpoint ini'
            );

            error.statusCode = 400;
            throw error;
        }

        if (status_order_baru === 'dibatalkan') {

            // 1. Memeriksa apakah pesanan dapat dibatalkan.
            if (!cancelableStatus.includes(status_sekarang)) {
                const error = new Error(
                    'Order tidak dapat dibatalkan pada tahap ini'
                );

                error.statusCode = 400;
                throw error;
            }

            // 2. Memvalidasi alasan pembatalan.
            if (
                typeof alasan_pembatalan !== 'string' ||
                !alasan_pembatalan.trim()
            ) {
                const error = new Error(
                    'Alasan pembatalan wajib diisi'
                );

                error.statusCode = 400;
                throw error;
            }

            // 3. Memeriksa status pembayaran.
            const payment = await Payment.findOne({
                where: {
                    id_order,
                },
                transaction,
                lock: transaction.LOCK.UPDATE,
            });

            if (payment && payment.status_payment === 'verified') {
                const error = new Error(
                    'Order dengan pembayaran terverifikasi tidak dapat dibatalkan melalui endpoint ini'
                );

                error.statusCode = 400;
                throw error;
            }

        } else {
            const allowed = allowedTransitions[status_sekarang] || [];

            if (!allowed.includes(status_order_baru)) {
                const error = new Error(
                    `Perubahan status dari ${status_sekarang} ke ${status_order_baru} tidak diizinkan`
                );

                error.statusCode = 400;
                throw error;
            }
        }

        // 4. Validasi khusus status pickup.
        if (status_order_baru === 'siap_diambil') {
            if (order.tipe_pengiriman !== 'pickup') {
                const error = new Error(
                    'Status siap_diambil hanya berlaku untuk pesanan pickup'
                );

                error.statusCode = 400;
                throw error;
            }
        }

        // 5. Validasi khusus status delivery.
        if (status_order_baru === 'sedang_dikirim') {
            if (order.tipe_pengiriman !== 'delivery') {
                const error = new Error(
                    'Status sedang_dikirim hanya berlaku untuk pesanan delivery'
                );

                error.statusCode = 400;
                throw error;
            }
        }

        // 6. Memperbarui status pesanan.
        order.status_order = status_order_baru;

        // 7. Menyimpan alasan jika pesanan dibatalkan.
        if (status_order_baru === 'dibatalkan') {
            order.alasan_pembatalan = alasan_pembatalan.trim();
        }

        await order.save({ transaction });

        await transaction.commit();

        return order;

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const getOrderStatusByUser = async (
    id_order,
    id_user
) => {
    const order = await Order.findOne({
        where: {
            id_order,
            id_user,
        },
        attributes: [
            'id_order',
            'id_user',
            'status_order',
            'tipe_pengiriman',
            'total_harga',
            'createdAt',
            'updatedAt',
        ],
    });

    if (!order) {
        const error = new Error('Order tidak ditemukan');
        error.statusCode = 404;
        throw error;
    }

    return order;
};

const getCustomerOrderHistoryAdmin = async (id_user) => {
    try {
        const customer = await User.findOne({
            where: {
                id_user,
                role: "user",
            },
            attributes: [
                "id_user",
                "nama",
                "email",
                "no_hp",
                "role",
                "createdAt",
            ],
        });

        if (!customer) {
            const error = new Error("Pelanggan tidak ditemukan.");
            error.statusCode = 404;
            throw error;
        }

        const orders = await Order.findAll({
            where: {
                id_user,
            },
            include: [
                {
                    model: OrderItem,
                    as: "orderItems",
                    include: [
                        {
                            model: Product,
                            as: "product",
                        },
                        {
                            model: OrderItemVariant,
                            as: "variants",
                            include: [
                                {
                                    model: Varian,
                                    as: "varian",
                                },
                            ],
                        },
                    ],
                },
                {
                    model: Payment,
                    as: "payment",
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return {
            customer,
            orders,
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderDetailByIdAdmin,
    getCustomerOrderHistoryAdmin,
    getOrdersByUser,
    getOrderById,
    updateShipping,
    getOrderStatusByUser,
    updateOrderStatus,
};