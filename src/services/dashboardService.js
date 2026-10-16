const {sequelize, User, Product, Varian, Order, OrderItem, OrderItemVariant} = require("../models");
const {Op} = require("sequelize");

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getDashboardData = async (query = {}) => {
    try {
        const now = new Date();
        const defaultStart = new Date(now);
        defaultStart.setDate(defaultStart.getDate() - 6);
        defaultStart.setHours(0, 0, 0, 0);
        const defaultEnd = new Date(now);
        defaultEnd.setHours(23, 59, 59, 999);
        const startDate = query.startDate ? new Date(`${query.startDate}T00:00:00`) : defaultStart;
        const endDate = query.endDate ? new Date(`${query.endDate}T23:59:59.999`) : defaultEnd;
        if (
            Number.isNaN(startDate.getTime()) ||
            Number.isNaN(endDate.getTime()) ||
            startDate > endDate
        ) {
            const error = new Error("Rentang tanggal dashboard tidak valid");
            error.statusCode = 400;
            throw error;
        }
        const periodWhere = {
            status_order: "selesai",
            createdAt: {
                [Op.between]: [startDate, endDate]
            }
        };
        const [
            totalProduk,
            totalVarian, 
            totalPelanggan, 
            totalPesanan, 
            pesananMenunggu, 
            pesananDiproses, 
            pesananSelesai, 
            totalPenjualan, 
            penjualanPeriode, 
            pesananTerbaru
        ] = await Promise.all([
            Product.count(),
            Varian.count(),
            User.count({
                where: {
                    role: "user"
                }
            }),
            Order.count(),
            Order.count({
                where: {
                    status_order: {
                        [Op.in]: [
                            "menunggu_konfirmasi",
                            "pesanan_diterima",
                            "menunggu_pembayaran",
                            "pembayaran_diperiksa"
                        ]
                    }
                }
            }),
            Order.count({
                where: {
                    status_order: {
                        [Op.in]: [
                            "diproses",
                            "siap_diambil",
                            "sedang_dikirim"
                        ]
                    }
                }
            }),
            Order.count({
                where: {
                    status_order: "selesai"
                }
            }),
            Order.sum("total_harga", {
                where: {
                    status_order: "selesai"
                }
            }),
            Order.findAll({
                where: periodWhere,
                attributes: [
                    "id_order",
                    "total_harga",
                    "createdAt"
                ],
                order: [["createdAt", "ASC"]]
            }),
            Order.findAll({
                attributes: [
                    "id_order",
                    "id_user",
                    "total_harga",
                    "status_order",
                    "tipe_pengiriman",
                    "createdAt"
                ],
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ["id_user", "nama"]
                    }
                ],
                order: [["createdAt", "DESC"]],
                limit: 10
            })
        ]);
        const salesMap = {};
        const cursor = new Date(startDate);
        cursor.setHours(0, 0, 0, 0);
        const lastDay = new Date(endDate);
        lastDay.setHours(0, 0, 0, 0);
        while (cursor <= lastDay) {
            salesMap[formatDate(cursor)] = 0;
            cursor.setDate(cursor.getDate() + 1);
        }
        for (const order of penjualanPeriode) {
            const dateKey = formatDate(new Date(order.createdAt));
            if (Object.prototype.hasOwnProperty.call(salesMap, dateKey)) {
                salesMap[dateKey] += Number(order.total_harga || 0);
            }
        }
        const grafikPenjualan = Object.entries(salesMap).map(
            ([tanggal, total]) => ({tanggal, total})
        );
        const orderItems = await OrderItem.findAll({
            attributes: [
                "id_product",
                "quantity"
            ],
            include: [
                {
                    model: Order,
                    as: "order",
                    attributes: [],
                    where: {
                        status_order: "selesai"
                    },
                    required: true
                },
                {
                    model: Product,
                    as: "product",
                    attributes: [
                        "id_product",
                        "nama_product"
                    ],
                    required: true
                }
            ]
        });
        const productSales = {};
        for (const item of orderItems) {
            const id = item.product.id_product;
            if (!productSales[id]) {
                productSales[id] = {
                    id_product: id,
                    nama_product: item.product.nama_product,
                    jumlah_terjual: 0
                };
            }
            productSales[id].jumlah_terjual += Number(item.quantity || 0);
        }
        const produkTerlaris = Object.values(productSales)
        .sort((a, b) => b.jumlah_terjual - a.jumlah_terjual)
        .slice(0, 5);
        const orderItemVariants = await OrderItemVariant.findAll({
            attributes: [
                "id_varian",
                "jumlah"
            ],
            include: [
                {
                    model: OrderItem,
                    as: "orderItem",
                    attributes: [],
                    required: true,
                    include: [
                        {
                            model: Order,
                            as: "order",
                            attributes: [],
                            where: {
                                status_order: "selesai"
                            },
                            required: true
                        }
                    ]
                },
                {
                    model: Varian,
                    as: "varian",
                    attributes: [
                        "id_varian",
                        "nama_varian"
                    ],
                    required: true
                }
            ]
        });
        const variantSales = {};
        for (const item of orderItemVariants) {
            const id = item.varian.id_varian;
            if (!variantSales[id]) {
                variantSales[id] = {
                    id_varian: id,
                    nama_varian: item.varian.nama_varian,
                    jumlah_terjual: 0
                };
            }
            variantSales[id].jumlah_terjual += Number(item.jumlah || 0);
        }
        const varianTerlaris = Object.values(variantSales)
        .sort((a, b) => b.jumlah_terjual - a.jumlah_terjual)
        .slice(0, 5);
        return {
            ringkasan: {
                total_produk: totalProduk,
                total_varian: totalVarian,
                total_pelanggan: totalPelanggan,
                total_pesanan: totalPesanan,
                pesanan_menunggu: pesananMenunggu,
                pesanan_diproses: pesananDiproses,
                pesanan_selesai: pesananSelesai,
                total_penjualan: Number(totalPenjualan || 0)
            },
            periode: {
                mulai: formatDate(startDate),
                sampai: formatDate(endDate),
                total_penjualan: penjualanPeriode.reduce(
                    (total, order) =>
                        total + Number(order.total_harga || 0),
                    0
                ),
                grafik_penjualan: grafikPenjualan
            },
            produk_terlaris: produkTerlaris,
            varian_terlaris: varianTerlaris,
            pesanan_terbaru: pesananTerbaru
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getDashboardData
};