const { Address } = require("../models");
const { geocodeAddress } = require("./geocodingService");
const { calculateShippingCost } = require("./shippingCostService");

const resolveDeliveryDetails = async (
    id_user,
    deliveryData,
    options = {}
) => {
    const { transaction } = options;

    const {
        address_source,
        nama_penerima,
        no_hp_penerima,
        alamat_pengiriman,
        catatan_alamat_pengiriman,
    } = deliveryData;

    let recipientName;
    let recipientPhone;
    let addressText;
    let addressNote = null;

    if (address_source === "profile") {
        const savedAddress = await Address.findOne({
            where: { id_user },
            transaction,
        });

        if (!savedAddress) {
            const error = new Error(
                "Kamu belum memiliki alamat utama di profil."
            );

            error.statusCode = 400;
            throw error;
        }

        recipientName = savedAddress.nama_penerima;
        recipientPhone = savedAddress.no_hp;
        addressText = savedAddress.alamat;
        addressNote = savedAddress.catatan || null;
    }

    else if (address_source === "custom") {
        recipientName = nama_penerima;
        recipientPhone = no_hp_penerima;
        addressText = alamat_pengiriman;
        addressNote = catatan_alamat_pengiriman || null;
    }

    else {
        const error = new Error(
            "Sumber alamat pengiriman tidak valid."
        );

        error.statusCode = 400;
        throw error;
    }

    if (!recipientName || !recipientPhone || !addressText) {
        const error = new Error(
            "Nama penerima, nomor HP, dan alamat harus lengkap."
        );

        error.statusCode = 400;
        throw error;
    }

    addressText = addressText.trim();

    if (addressText.length < 10) {
        const error = new Error(
            "Alamat pengiriman terlalu pendek."
        );

        error.statusCode = 400;
        throw error;
    }

    if (typeof addressNote === "string") {
        addressNote = addressNote.trim() || null;
    } else {
        addressNote = null;
    }

    const location = await geocodeAddress(addressText);

    if (!location) {
        const error = new Error(
            "Alamat tidak ditemukan. Periksa kembali alamat pengiriman."
        );

        error.statusCode = 400;
        throw error;
    }

    const shippingResult = await calculateShippingCost({
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
    });

    if (!shippingResult.available) {
        const error = new Error(
            shippingResult.message ||
            "Alamat berada di luar jangkauan pengiriman SoeSweet."
        );

        error.statusCode = 400;
        error.shippingResult = shippingResult;

        throw error;
    }

    return {
        nama_penerima: recipientName,
        no_hp_penerima: recipientPhone,
        alamat_pengiriman: addressText,
        catatan_alamat_pengiriman: addressNote,

        latitude_pengiriman: Number(location.latitude),
        longitude_pengiriman: Number(location.longitude),

        jarak_pengiriman: Number(shippingResult.distanceKm),

        ongkir: Number(shippingResult.shippingCost),

        displayName: location.displayName,
    };
};

module.exports = {
    resolveDeliveryDetails,
};