const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

// Mengimpor koordinat lokasi toko SoeSweet
const storeLocation = require("../config/storeLocation");

// Fungsi untuk menghitung jarak perjalanan
const calculateRoute = async (customerLocation) => {
  // Memeriksa koordinat customer
  if (
    !customerLocation ||
    !Number.isFinite(customerLocation.latitude) ||
    !Number.isFinite(customerLocation.longitude)
  ) {
    throw new Error("Koordinat customer tidak valid.");
  }

  // Memeriksa rentang koordinat customer
  if (
    customerLocation.latitude < -90 ||
    customerLocation.latitude > 90 ||
    customerLocation.longitude < -180 ||
    customerLocation.longitude > 180
  ) {
    throw new Error("Koordinat customer berada di luar batas.");
  }

  // Mengambil koordinat toko
  const {
    latitude: storeLatitude,
    longitude: storeLongitude,
  } = storeLocation;

  // Menyusun koordinat dengan format longitude,latitude
  const coordinates = [
    `${storeLongitude},${storeLatitude}`,
    `${customerLocation.longitude},${customerLocation.latitude}`,
  ].join(";");

  // Membuat parameter permintaan OSRM
  const params = new URLSearchParams({
    overview: "false",
    steps: "false",
  });

  // Membuat URL permintaan routing
  const requestUrl =
    `${OSRM_URL}/${coordinates}?${params.toString()}`;

  // Mengirim permintaan ke OSRM
  const response = await fetch(requestUrl, {
    headers: {
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(15000),
  });

  // Memeriksa respons HTTP
  if (!response.ok) {
    throw new Error(
      `Gagal menghitung rute. Status: ${response.status}`
    );
  }

  // Mengambil data JSON dari OSRM
  const data = await response.json();

  // Memeriksa status hasil routing
  if (data.code !== "Ok") {
    if (data.code === "NoRoute") {
      throw new Error(
        "Rute perjalanan menuju alamat customer tidak ditemukan."
      );
    }

    if (data.code === "NoSegment") {
      throw new Error(
        "Lokasi toko atau customer tidak terhubung dengan jaringan jalan."
      );
    }

    throw new Error(
      `OSRM gagal menghitung rute: ${data.code}`
    );
  }

  // Memastikan data rute tersedia
  if (!data.routes || data.routes.length === 0) {
    throw new Error("Data rute perjalanan tidak tersedia.");
  }

  // Mengambil rute pertama
  const route = data.routes[0];

  // Mengambil jarak dalam meter
  const distanceMeters = route.distance;

  // Memastikan hasil perhitungan valid
  if (
    !Number.isFinite(distanceMeters) ||
    distanceMeters < 0
  ) {
    throw new Error("Hasil perhitungan rute tidak valid.");
  }

  // Mengubah jarak menjadi kilometer
  const distanceKm = distanceMeters / 1000;

  // Mengembalikan hasil perhitungan
  return {
    distanceMeters,
    distanceKm: Number(distanceKm.toFixed(2)),
  };
};

// Mengekspor fungsi agar dapat digunakan file lain
module.exports = {
  calculateRoute,
};