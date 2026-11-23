const {
  geocodeAddress,
} = require("../services/geocodingService");

const {
  calculateShippingCost,
} = require("../services/shippingCostService");

// Fungsi untuk menghitung ongkir berdasarkan alamat customer
const calculateShipping = async (req, res) => {
  try {
    // Mengambil alamat dari request body
    const { address } = req.body;

    // Memeriksa apakah alamat sudah dikirim
    if (
      !address ||
      typeof address !== "string" ||
      address.trim().length < 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Alamat customer wajib diisi dengan benar.",
      });
    }

    // Mengubah alamat customer menjadi koordinat
    const customerLocation = await geocodeAddress(
      address.trim()
    );

    // Memeriksa apakah alamat berhasil ditemukan
    if (!customerLocation) {
      return res.status(404).json({
        success: false,
        message:
          "Alamat customer tidak ditemukan. Periksa kembali alamat yang dimasukkan.",
      });
    }

    // Menghitung jarak perjalanan dan ongkir
    const shippingResult = await calculateShippingCost({
      latitude: customerLocation.latitude,
      longitude: customerLocation.longitude,
    });

    // Mengirim hasil perhitungan kepada frontend
    return res.status(200).json({
      success: true,
      data: {
        available: shippingResult.available,
        address: customerLocation.displayName,
        distanceKm: shippingResult.distanceKm,
        shippingCost: shippingResult.shippingCost,
        message: shippingResult.message,
      },
    });

  } catch (error) {
    console.error("Calculate Shipping Error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghitung ongkir.",
    });
  }
};

// Mengekspor controller
module.exports = {
  calculateShipping,
};