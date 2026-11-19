const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/search";

// Cache untuk menyimpan hasil pencarian alamat
const geocodingCache = new Map();

// Mengatur antrean permintaan Nominatim
let lastRequestTime = 0;
let requestQueue = Promise.resolve();

// Fungsi untuk mengatur jeda setiap permintaan
const waitForRequestSlot = async () => {
  // Mengambil antrean permintaan sebelumnya
  const previousRequest = requestQueue;

  let release;

  // Membuat antrean baru
  requestQueue = new Promise((resolve) => {
    release = resolve;
  });

  // Menunggu permintaan sebelumnya selesai
  await previousRequest;

  // Menghitung jeda minimal 1 detik
  const waitTime = Math.max(
    0,
    1000 - (Date.now() - lastRequestTime)
  );

  // Menunggu jika jarak permintaan belum mencapai 1 detik
  if (waitTime > 0) {
    await new Promise((resolve) =>
      setTimeout(resolve, waitTime)
    );
  }

  // Mencatat waktu permintaan
  lastRequestTime = Date.now();

  // Membuka antrean untuk permintaan berikutnya
  release();
};

// Fungsi untuk mengubah alamat menjadi koordinat
const geocodeAddress = async (address) => {
  // Memeriksa alamat yang dikirim
  if (!address || typeof address !== "string") {
    throw new Error("Alamat customer wajib diisi.");
  }

  const cleanAddress = address.trim();

  if (cleanAddress.length < 5) {
    throw new Error("Alamat customer terlalu singkat.");
  }

  // Memeriksa apakah alamat sudah pernah dicari
  const cacheKey = cleanAddress.toLowerCase();

  if (geocodingCache.has(cacheKey)) {
    return geocodingCache.get(cacheKey);
  }

  // Membuat parameter pencarian
  const params = new URLSearchParams({
    q: cleanAddress,
    format: "jsonv2",
    limit: "1",
    countrycodes: "id",
  });

  // Menunggu giliran sebelum mengirim permintaan
  await waitForRequestSlot();

  // Mengirim permintaan ke Nominatim
  const response = await fetch(
    `${NOMINATIM_URL}?${params.toString()}`,
    {
      headers: {
        "User-Agent": `SoeSweet/1.0 (${process.env.APP_CONTACT_EMAIL})`,
        "Accept": "application/json",
      },
    }
  );

  // Memeriksa respons dari Nominatim
  if (!response.ok) {
    throw new Error(
      `Gagal mencari koordinat. Status: ${response.status}`
    );
  }

  const results = await response.json();

  // Memeriksa apakah alamat ditemukan
  if (!results || results.length === 0) {
    return null;
  }

  // Mengambil hasil pencarian pertama
  const location = results[0];

  // Mengubah koordinat menjadi tipe angka
  const result = {
    latitude: Number(location.lat),
    longitude: Number(location.lon),
    displayName: location.display_name,
  };

  // Memastikan koordinat valid
  if (
    !Number.isFinite(result.latitude) ||
    !Number.isFinite(result.longitude) ||
    result.latitude < -90 ||
    result.latitude > 90 ||
    result.longitude < -180 ||
    result.longitude > 180
  ) {
    throw new Error("Koordinat yang diterima tidak valid.");
  }

  // Menyimpan hasil pencarian ke cache
  geocodingCache.set(cacheKey, result);

  return result;
};

// Mengekspor fungsi agar bisa digunakan file lain
module.exports = {
  geocodeAddress,
};