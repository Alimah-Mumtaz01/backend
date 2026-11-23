const { Product, Varian } = require("../models");

// Service untuk menghitung ongkir berdasarkan alamat dan jarak.
const { resolveDeliveryDetails } = require("./deliveryService");

/**
 * Preview checkout sebelum customer membuat pesanan.
 *
 * @param {number} id_user - ID customer yang sedang login.
 * @param {object} orderData - Data checkout dari frontend.
 */
const previewCheckout = async (id_user, orderData) => {
    const {
        tipe_pengiriman,
        address_source,
        nama_penerima,
        no_hp_penerima,
        alamat_pengiriman,
        catatan,
        items,
    } = orderData;

    let subtotal = 0;
    const checkoutItems = [];

    // ========================================
    // 1. VALIDASI PRODUK DAN VARIAN
    // ========================================

    for (const item of items) {
        const product = await Product.findByPk(
            item.id_product
        );

        if (!product) {
            const error = new Error(
                `Produk dengan ID ${item.id_product} tidak ditemukan`
            );
            error.statusCode = 404;
            throw error;
        }

        if (product.status !== "aktif") {
            const error = new Error(
                `Produk ${product.nama_product} sedang tidak aktif`
            );
            error.statusCode = 400;
            throw error;
        }

        // Jumlah varian harus sesuai isi paket dikali quantity.
        const expectedVariantAmount =
            Number(product.jumlah_isi) * item.quantity;

        const selectedVariantAmount = item.variants.reduce(
            (total, variant) =>
                total + Number(variant.jumlah),
            0
        );

        if (
            selectedVariantAmount !== expectedVariantAmount
        ) {
            const error = new Error(
                `Jumlah varian untuk produk ${product.nama_product} harus ${expectedVariantAmount} pcs`
            );
            error.statusCode = 400;
            throw error;
        }

        const checkoutVariants = [];

        // Memeriksa setiap varian yang dipilih.
        for (const itemVariant of item.variants) {
            const varian = await Varian.findByPk(
                itemVariant.id_varian
            );

            if (!varian) {
                const error = new Error(
                    `Varian dengan ID ${itemVariant.id_varian} tidak ditemukan`
                );
                error.statusCode = 404;
                throw error;
            }

            if (varian.status !== "aktif") {
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

            checkoutVariants.push({
                id_varian: varian.id_varian,
                nama_varian: varian.nama_varian,
                jumlah: itemVariant.jumlah,
                stok: varian.stok,
            });
        }

        // Menghitung harga produk.
        const hargaSatuan = Number(product.harga);

        const totalHargaItem =
            hargaSatuan * Number(item.quantity);

        subtotal += totalHargaItem;

        // Menyiapkan data produk untuk response preview.
        checkoutItems.push({
            product: {
                id_product: product.id_product,
                nama_product: product.nama_product,
                gambar: product.gambar,
                jumlah_isi: Number(product.jumlah_isi),
                quantity: item.quantity,
                harga_satuan: hargaSatuan,
                total_harga: totalHargaItem,
                variants: checkoutVariants,
            },
        });
    }

    // ========================================
    // 2. MENGHITUNG ONGKIR
    // ========================================

    let ongkir = 0;
    let deliveryDetails = null;

    if (tipe_pengiriman === "delivery") {

        // Minimal pembelian delivery Rp50.000.
        if (subtotal < 50000) {
            const error = new Error(
                "Minimal pembelian untuk pengiriman delivery adalah Rp 50.000"
            );
            error.statusCode = 400;
            throw error;
        }

        // Mengambil alamat dan menghitung ongkir
        // berdasarkan jarak rute dari toko.
        deliveryDetails = await resolveDeliveryDetails(
            id_user,
            {
                address_source,
                nama_penerima,
                no_hp_penerima,
                alamat_pengiriman,
                catatan_alamat_pengiriman: orderData.catatan_alamat_pengiriman,
            }
        );

        ongkir = deliveryDetails.ongkir;
    }

    // ========================================
    // 3. MENGHITUNG TOTAL
    // ========================================

    const total_harga = subtotal + ongkir;

    // ========================================
    // 4. RESPONSE PREVIEW CHECKOUT
    // ========================================

    return {
        tipe_pengiriman,

        // Informasi alamat pengiriman.
        address_source:
            tipe_pengiriman === "delivery"
                ? address_source
                : null,

        nama_penerima:
            deliveryDetails?.nama_penerima || null,

        no_hp_penerima:
            deliveryDetails?.no_hp_penerima || null,

        alamat_pengiriman:
            deliveryDetails?.alamat_pengiriman || null,

        catatan_alamat_pengiriman:
            deliveryDetails?.catatan_alamat_pengiriman || null,

        // Informasi hasil perhitungan ongkir.
        jarak_pengiriman:
            deliveryDetails?.jarak_pengiriman || null,

        displayName:
            deliveryDetails?.displayName || null,

        catatan: catatan || null,

        subtotal,
        ongkir,
        total_harga,

        items: checkoutItems,
    };
};

module.exports = {
    previewCheckout,
};