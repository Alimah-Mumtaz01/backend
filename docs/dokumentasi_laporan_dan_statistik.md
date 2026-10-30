# Dokumentasi Fitur Laporan dan Statistik

Fitur laporan dan statistik digunakan untuk membantu admin memantau dan menganalisis performa penjualan serta aktivitas pesanan SoeSweet. Laporan mencakup pendapatan, rata-rata transaksi, statistik pesanan berdasarkan status, serta produk dan varian terlaris.

Laporan dan Statistik pada lebih fokus pada penyajian data secara rinci untuk membantu admin menganalisis performa bisnis. Dashboard menampilkan informasi umum seperti total produk, pelanggan, pesanan, grafik penjualan, dan pesanan terbaru. Sementara itu, Laporan dan Statistik menyediakan informasi penjualan, rata-rata transaksi, serta performa produk dan varian berdasarkan periode tanggal yang dipilih.

Sistem menggunakan model dan tabel yang sudah tersedia tanpa membuat model baru. Data laporan diolah menggunakan Sequelize dan MySQL, dengan periode laporan berdasarkan tanggal pembuatan pesanan (`createdAt`). Akses seluruh endpoint dibatasi menggunakan JWT dan role admin.

## Endpoint Laporan dan Statistik

| Method | Endpoint                  | Fungsi                                           |
| ------ | ------------------------- | ------------------------------------------------ |
| GET    | `/admin/reports/sales`    | Menampilkan laporan penjualan                    |
| GET    | `/admin/reports/orders`   | Menampilkan statistik pesanan berdasarkan status |
| GET    | `/admin/reports/products` | Menampilkan laporan produk terlaris              |
| GET    | `/admin/reports/variants` | Menampilkan laporan varian terlaris              |

- Seluruh endpoint hanya dapat diakses oleh admin yang sudah login.
- Pendapatan hanya dihitung dari pesanan berstatus `selesai`.
- Pesanan yang belum selesai tidak dihitung sebagai pendapatan.
- Filter periode menggunakan parameter `startDate` dan `endDate` dengan format `YYYY-MM-DD`.
- Periode laporan berdasarkan tanggal pembuatan pesanan (`createdAt`).
- Laporan menggunakan data dari model dan tabel yang sudah tersedia.