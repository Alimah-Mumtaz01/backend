# Dokumentasi Fitur Checkout

Fitur Checkout digunakan sebagai tahap preview dan validasi sebelum pesanan dibuat secara permanen ke database. Customer dapat melihat ringkasan pesanan, sedangkan backend memvalidasi produk, varian, quantity, stok, metode pengiriman, alamat, serta menghitung subtotal, ongkir, dan total harga.

Checkout menggunakan model `Product` dan `Varian` tanpa membuat model atau tabel Checkout baru. Proses preview hanya membaca data dan melakukan perhitungan, sehingga tidak menggunakan transaction dan tidak mengurangi stok.

Setelah customer melakukan konfirmasi pesanan, frontend mengirim data ke endpoint Order yang telah dibuat pada Progress 13 untuk menjalankan `createOrder()`. Proses tersebut menyimpan data ke tabel `Order`, `OrderItem`, dan `OrderItemVariant` menggunakan transaction Sequelize.

## Endpoint Checkout

| Method | Endpoint            | Fungsi                                                |
| ------ | ------------------- | ----------------------------------------------------- |
| POST   | `/checkout/preview` | Melakukan validasi dan menampilkan ringkasan checkout |

Endpoint checkout memerlukan autentikasi menggunakan `authMiddleware`. Checkout hanya melakukan preview dan perhitungan, belum membuat Order, serta tidak mengurangi stok.