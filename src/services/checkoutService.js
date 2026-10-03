const {Order, OrderItem, Product, OrderItemVariant, Varian} = require('../models');

const getCheckoutByOrderId = async (id_order, id_user) => {
    try {
        const checkout = await Order.findOne({
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
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        if (!checkout) {
            throw new Error('Order tidak ditemukan');
        }
        if (!checkout.orderItems || checkout.orderItems.length === 0) {
            throw new Error('Order tidak memiliki item');
        }
        const checkoutItems = [];
        for (const orderItem of checkout.orderItems) {
            if (!orderItem.product) {
                throw new Error(`Produk pada order item ${orderItem.id_order_item} tidak ditemukan`);
            }

            if (orderItem.product.status !== 'aktif' && checkout.status_order === 'menunggu_konfirmasi') {
                throw new Error(`Produk ${orderItem.product.nama_product} sudah tidak aktif`);
            }

            const variants = [];
            for (const itemVariant of orderItem.variants || []) {
                if (!itemVariant.varian) {
                    throw new Error(`Varian pada order item ${orderItem.id_order_item} tidak ditemukan`);
                }
                variants.push({
                    id_varian: itemVariant.id_varian,
                    nama_varian: itemVariant.varian.nama_varian,
                    jumlah: itemVariant.jumlah,
                    stok_tersedia: itemVariant.varian.stok,
                    status: itemVariant.varian.status,
                    stok_cukup: Number(itemVariant.varian.stok) >= Number(itemVariant.jumlah)
                });
            }

            checkoutItems.push({
                id_order_item: orderItem.id_order_item,
                id_product: orderItem.id_product,
                nama_product: orderItem.product.nama_product,
                jumlah_isi: orderItem.product.jumlah_isi,
                quantity: orderItem.quantity,
                harga_satuan: Number(orderItem.harga_satuan),
                total_harga: Number(orderItem.total_harga),
                variants
            });
        }

        return {
            id_order: checkout.id_order,
            id_user: checkout.id_user,
            tipe_pengiriman: checkout.tipe_pengiriman,
            alamat_pengiriman: checkout.alamat_pengiriman,
            catatan: checkout.catatan,
            subtotal: Number(checkout.subtotal),
            ongkir: Number(checkout.ongkir),
            total_harga: Number(checkout.total_harga),
            status_order: checkout.status_order,
            items: checkoutItems
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getCheckoutByOrderId
};