const {User, Product, Varian, Order, OrderItem, OrderItemVariant} = require("../models");
const {Op} = require("sequelize");

const STATUS_SELESAI = "selesai";

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getReportPeriod = (query = {}) => {
    const today = new Date();
    const defaultStart = new Date(today);
    defaultStart.setDate(defaultStart.getDate() - 6);
    defaultStart.setHours(0, 0, 0, 0);
    const defaultEnd = new Date(today);
    defaultEnd.setHours(23, 59, 59, 999);
    const parseDate = (value, endOfDay = false) => {
        if (!value) return null;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return null;
        }
        const [year, month, day] = value.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            return null;
        }
        if (endOfDay) {
            date.setHours(23, 59, 59, 999);
        } else {
            date.setHours(0, 0, 0, 0);
        }
        return date;
    };
    const startDate = query.startDate ? parseDate(query.startDate) : defaultStart;
    const endDate = query.endDate ? parseDate(query.endDate, true) : defaultEnd;
    if (!startDate || !endDate) {
        const error = new Error("Format tanggal harus YYYY-MM-DD dan tanggal harus valid");
        error.statusCode = 400;
        throw error;
    }
    if (startDate > endDate) {
        const error = new Error("Tanggal mulai tidak boleh melebihi tanggal akhir")
        error.statusCode = 400;
        throw error;
    }
    return { startDate, endDate };
};

const getPeriodWhere = (startDate, endDate) => ({
    createdAt: {
        [Op.between]: [startDate, endDate]
    }
});

const getCompletedOrders = async (startDate, endDate) => {
    return Order.findAll({
        where: {
            ...getPeriodWhere(startDate, endDate),
            status_order: STATUS_SELESAI
        },
        attributes: [
            "id_order",
            "id_user",
            "total_harga",
            "status_order",
            "createdAt"
        ],
        order: [["createdAt", "ASC"]]
    });
};
const getSalesReport = async (query = {}) => {
    try {
        const { startDate, endDate } = getReportPeriod(query);
        const completedOrders = await getCompletedOrders(startDate, endDate);
        const totalPenjualan = completedOrders.reduce(
            (total, order) => total + Number(order.total_harga || 0), 0
        );
        const salesMap = {};
        const currentDate = new Date(startDate);
        const lastDate = new Date(endDate);
        lastDate.setHours(0, 0, 0, 0);
        while (currentDate <= lastDate) {
            salesMap[formatDate(currentDate)] = {
                tanggal: formatDate(currentDate),
                jumlah_pesanan: 0,
                total_penjualan: 0
            };
            currentDate.setDate(currentDate.getDate() + 1);
        }
        completedOrders.forEach((order) => {
            const tanggal = formatDate(new Date(order.createdAt));
            if (!salesMap[tanggal]) {
                salesMap[tanggal] = {
                    tanggal,
                    jumlah_pesanan: 0,
                    total_penjualan: 0
                };
            }
            salesMap[tanggal].jumlah_pesanan += 1;
            salesMap[tanggal].total_penjualan += Number(order.total_harga || 0);
        });
        return {
            periode: {
                mulai: formatDate(startDate),
                sampai: formatDate(endDate)
            },
            jumlah_transaksi_selesai: completedOrders.length,
            total_penjualan: totalPenjualan,
            rata_rata_transaksi: completedOrders.length ? totalPenjualan / completedOrders.length : 0,
            grafik_penjualan: Object.values(salesMap)
        };
    } catch (error) {
        throw error;
    }
};

const getOrdersReport = async (query = {}) => {
    try {
        const { startDate, endDate } = getReportPeriod(query);
        const orders = await Order.findAll({
            where: getPeriodWhere(startDate, endDate),
            attributes: [
                "id_order",
                "id_user",
                "tipe_pengiriman",
                "total_harga",
                "status_order",
                "createdAt"
            ],
            order: [["createdAt", "DESC"]]
        });
        const statistikStatus = {};
        orders.forEach((order) => {
            const status = order.status_order || "tidak_diketahui";
            statistikStatus[status] = (statistikStatus[status] || 0) + 1;
        });
        const userIds = [...new Set(orders.map((order) => order.id_user))];
        const users = userIds.length ? await User.findAll({
            where: { id_user: { [Op.in]: userIds } },
            attributes: ["id_user", "nama", "email"]
        }) : [];
        const userMap = new Map(
            users.map((user) => [
                user.id_user,
                {
                    nama: user.nama,
                    email: user.email
                }
            ])
        );
        const daftarPesanan = orders.map((order) => ({
            id_order: order.id_order,
            pelanggan: userMap.get(order.id_user) || null,
            tipe_pengiriman: order.tipe_pengiriman,
            total_harga: Number(order.total_harga || 0),
            status_order: order.status_order,
            createdAt: order.createdAt
        }));
        return {
            periode: {
                mulai: formatDate(startDate),
                sampai: formatDate(endDate)
            },
            total_pesanan: orders.length,
            statistik_status: statistikStatus,
            daftar_pesanan: daftarPesanan
        };
    } catch (error) {
        throw error;
    }
};

const getProductsReport = async (query = {}) => {
    try {
        const { startDate, endDate } = getReportPeriod(query);
        const completedOrders = await getCompletedOrders(startDate, endDate);
        const orderIds = completedOrders.map((order) => order.id_order);
        const orderItems = orderIds.length ? await OrderItem.findAll({
            where: { id_order: { [Op.in]: orderIds } },
            attributes: [
                "id_order_item",
                "id_order",
                "id_product",
                "quantity",
                "harga_satuan",
                "total_harga"
            ]
        }) : [];
        const productIds = [...new Set(orderItems.map((item) => item.id_product))];
        const products = productIds.length ? await Product.findAll({
            where: { id_product: { [Op.in]: productIds } },
            attributes: [
                "id_product",
                "nama_product",
                "harga",
                "gambar"
            ]
        }) : [];
        const productMap = new Map(
            products.map((product) => [product.id_product, product])
        );
        const salesMap = new Map();
        orderItems.forEach((item) => {
            const product = productMap.get(item.id_product);
            if (!product) return;
            const id = item.id_product;
            const quantity = Number(item.quantity || 0);
            if (!salesMap.has(id)) {
                salesMap.set(id, {
                    id_product: id,
                    nama_product: product.nama_product,
                    jumlah_paket_terjual: 0,
                    total_penjualan: 0
                });
            }
            const data = salesMap.get(id);
            data.jumlah_paket_terjual += quantity;
            data.total_penjualan += Number(
                item.total_harga ??
                (Number(item.harga_satuan || 0) * quantity)
            );
        });
        const produkTerlaris = [...salesMap.values()].sort(
            (a, b) => b.jumlah_paket_terjual - a.jumlah_paket_terjual
        );
        return {
            periode: {
                mulai: formatDate(startDate),
                sampai: formatDate(endDate)
            },
            total_produk_terjual: produkTerlaris.reduce(
                (total, item) => total + item.jumlah_paket_terjual, 0
            ),
            produk_terlaris: produkTerlaris
        };
    } catch (error) {
        throw error;
    }
};

const getVariantsReport = async (query = {}) => {
    try {
        const { startDate, endDate } = getReportPeriod(query);
        const completedOrders = await getCompletedOrders(startDate, endDate);
        const orderIds = completedOrders.map((order) => order.id_order);
        const orderItems = orderIds.length ? await OrderItem.findAll({
            where: { id_order: { [Op.in]: orderIds } },
            attributes: ["id_order_item", "quantity"]
        }) : [];
        const orderItemIds = orderItems.map(
            (item) => item.id_order_item
        );
        const variantItems = orderItemIds.length ? await OrderItemVariant.findAll({
            where: {id_order_item: { [Op.in]: orderItemIds }},
            attributes: [
                "id_order_item",
                "id_varian",
                "jumlah"
            ]
        }) : [];
        const variantIds = [...new Set(variantItems.map((item) => item.id_varian))];
        const variants = variantIds.length ? await Varian.findAll({
            where: { id_varian: { [Op.in]: variantIds } },
            attributes: ["id_varian", "nama_varian", "stok"]
        }) : [];
        const variantMap = new Map(
            variants.map((variant) => [variant.id_varian, variant])
        );
        const quantityMap = new Map(
            orderItems.map((item) => [
                item.id_order_item,
                Number(item.quantity || 0)
            ])
        );
        const salesMap = new Map();
        variantItems.forEach((item) => {
            const variant = variantMap.get(item.id_varian);
            if (!variant) return;
            const jumlahTerjual = Number(item.jumlah || 0) * (quantityMap.get(item.id_order_item) || 0);
            if (!salesMap.has(item.id_varian)) {
                salesMap.set(item.id_varian, {
                    id_varian: item.id_varian,
                    nama_varian: variant.nama_varian,
                    jumlah_terjual: 0,
                    stok_tersedia: Number(variant.stok || 0)
                });
            }
            salesMap.get(item.id_varian).jumlah_terjual += jumlahTerjual;
        });
        const varianTerlaris = [...salesMap.values()].sort(
            (a, b) => b.jumlah_terjual - a.jumlah_terjual
        );
        return {
            periode: {
                mulai: formatDate(startDate),
                sampai: formatDate(endDate)
            },
            varian_terlaris: varianTerlaris
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getSalesReport,
    getOrdersReport,
    getProductsReport,
    getVariantsReport
};