// Mengimpor fungsi untuk menghitung jarak perjalanan
const {
  calculateRoute,
} = require("./routingService");

// Mengatur tarif ongkir berdasarkan jarak perjalanan
const shippingRates = [
  {
    maxDistance: 3,
    cost: 5000,
  },
  {
    maxDistance: 5,
    cost: 8000,
  },
  {
    maxDistance: 10,
    cost: 12000,
  },
  {
    maxDistance: 15,
    cost: 15000,
  },
  {
    maxDistance: 20,
    cost: 17000,
  },
];

// Fungsi untuk menghitung ongkir customer
const calculateShippingCost = async (customerLocation) => {
  // Menghitung jarak perjalanan dari toko ke customer
  const route = await calculateRoute(customerLocation);

  // Mengambil jarak perjalanan dalam kilometer
  const distanceKm = route.distanceKm;

  // Memeriksa apakah jarak melebihi batas layanan
  if (distanceKm > 20) {
    return {
      available: false,
      distanceKm,
      shippingCost: null,
      message:
        "Maaf, alamat customer berada di luar jangkauan pengiriman SoeSweet.",
    };
  }

  // Mencari tarif ongkir sesuai jarak perjalanan
  const selectedRate = shippingRates.find(
    (rate) => distanceKm <= rate.maxDistance
  );

  // Memastikan tarif ongkir ditemukan
  if (!selectedRate) {
    return {
      available: false,
      distanceKm,
      shippingCost: null,
      message:
        "Ongkir untuk alamat tersebut tidak tersedia.",
    };
  }

  // Mengembalikan hasil perhitungan ongkir
  return {
    available: true,
    distanceKm,
    shippingCost: selectedRate.cost,
    message: "Alamat tersedia untuk pengiriman SoeSweet.",
  };
};

// Mengekspor fungsi agar bisa digunakan file lain
module.exports = {
  calculateShippingCost,
};