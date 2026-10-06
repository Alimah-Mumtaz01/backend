const {Product, Varian} = require("../models");

const previewCheckout = async (orderData) => {
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
        const checkoutItems = [];
        for (const item of items) {
            const product = await Product.findByPk(item.id_product);
            if (!product) {
                const error = new Error(`Produk dengan ID ${item.id_product} tidak ditemukan`);
                error.statusCode = 404;
                throw error;
            }
            if (product.status !== 'aktif') {
                const error = new Error(`Produk ${product.nama_product} sedang tidak aktif`);
                error.statusCode = 400;
                throw error;
            }
            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                const error = new Error(`Quantity produk ${product.nama_product} harus lebih dari 0`);
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
                const error = new Error(`Jumlah varian untuk produk ${product.nama_product} harus ${expectedVariantAmount} pcs`);
                error.statusCode = 400;
                throw error;
            }
            const checkoutVariants = [];
            for (const itemVariant of item.variants) {
                if (!Number.isInteger(itemVariant.jumlah) || itemVariant.jumlah <= 0) {
                    const error = new Error(`Jumlah varian untuk produk ${product.nama_product} harus lebih dari 0`);
                    error.statusCode = 400;
                    throw error;
                }
                const varian = await Varian.findByPk(itemVariant.id_varian);
                if (!varian) {
                    const error = new Error(`Varian dengan ID ${itemVariant.id_varian} tidak ditemukan`);
                    error.statusCode = 404;
                    throw error;
                }
                if (varian.status !== 'aktif') {
                    const error = new Error(`Varian ${varian.nama_varian} sedang tidak aktif`);
                    error.statusCode = 400;
                    throw error;
                }
                if (Number(varian.stok) < Number(itemVariant.jumlah)) {
                    const error = new Error(`Stok varian ${varian.nama_varian} tidak mencukupi`);
                    error.statusCode = 400;
                    throw error;
                }
                checkoutVariants.push({
                    id_varian: varian.id_varian,
                    nama_varian: varian.nama_varian,
                    jumlah: itemVariant.jumlah,
                    stok: varian.stok
                });
            }
            const hargaSatuan = Number(product.harga);
            const totalHargaItem = hargaSatuan * Number(item.quantity);
            subtotal += totalHargaItem;
            checkoutItems.push({
                product: {
                    id_product: product.id_product,
                    nama_product: product.nama_product,
                    jumlah_isi: Number(product.jumlah_isi),
                    quantity: Number(item.quantity),
                    harga_satuan: hargaSatuan,
                    total_harga: totalHargaItem,
                    variants: checkoutVariants
                }
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
        return {
            tipe_pengiriman,
            alamat_pengiriman: tipe_pengiriman === 'delivery' ? alamat_pengiriman : null,
            catatan: catatan || null,
            subtotal,
            ongkir,
            total_harga,
            items: checkoutItems
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    previewCheckout
};