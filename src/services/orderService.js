const {sequelize, Order, OrderItem, OrderItemVariant, Product, Varian} = require('../models');

const createOrder = async (id_user, orderData) => {
    const transaction = await sequelize.transaction();
    try {
        const {tipe_pengiriman, alamat_pengiriman, catatan, items} = orderData;
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
            const expectedVariantAmount = product.jumlah_isi * item.quantity;
            const selectedVariantAmount = item.variants.reduce((total, variant) => total + variant.jumlah, 0);
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
                if (varian.stock < itemVariant.jumlah) {
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
            const totalHargaItem = hargaSatuan * item.quantity;
            subtotal += totalHargaItem;
            preparedItems.push({
                product,
                quantity: item.quantity,
                harga_satuan: hargaSatuan,
                total_harga: totalHargaItem,
                variants: preparedVariants
            });
        }
        const ongkir = 0;
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
            status: 'waiting_verification'
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

module.exports = {
    createOrder,
    getOrdersByUser,
    getOrderById
};