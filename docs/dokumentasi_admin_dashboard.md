# Dokumentasi Admin Dashboard

Fitur Admin Dashboard digunakan sebagai pusat pemantauan aktivitas toko SoeSweet. Dashboard menampilkan statistik produk, varian, pelanggan, pesanan, penjualan, produk terlaris, varian terlaris, dan pesanan terbaru dalam satu halaman. Data statistik diambil dari database, sedangkan akses dashboard dibatasi menggunakan JWT dan role admin.

## Endpoint Admin Dashboard

| Method | Endpoint           | Fungsi                                                 |
| ------ | ------------------ | ------------------------------------------------------ |
| GET    | `/admin/dashboard` | Mengambil data statistik dan informasi dashboard admin |

- Dashboard hanya dapat diakses oleh admin yang sudah login.
- Statistik diambil langsung dari database.
- Penjualan dihitung berdasarkan pesanan berstatus `selesai`.
- Produk terlaris dihitung berdasarkan jumlah paket terjual.
- Varian terlaris dihitung berdasarkan jumlah pcs terjual.
- Filter tanggal digunakan untuk menentukan periode penjualan.
- Dashboard hanya menampilkan data dan tidak mengubah stok, pembayaran, status pesanan, atau review.