require("dotenv").config();

// Mengambil koordinat toko dari file .env
const latitude = Number(process.env.STORE_LATITUDE);
const longitude = Number(process.env.STORE_LONGITUDE);

// Memeriksa apakah koordinat sudah diisi dengan benar
if (
  process.env.STORE_LATITUDE === undefined ||
  process.env.STORE_LONGITUDE === undefined ||
  !Number.isFinite(latitude) ||
  !Number.isFinite(longitude) ||
  latitude < -90 ||
  latitude > 90 ||
  longitude < -180 ||
  longitude > 180
) {
  throw new Error(
    "Koordinat lokasi toko SoeSweet belum valid. Periksa STORE_LATITUDE dan STORE_LONGITUDE di file .env"
  );
}

// Menyediakan koordinat toko untuk digunakan file lain
const storeLocation = {
  latitude,
  longitude,
};

module.exports = storeLocation;