# Dokumentasi Sistem Cart dan Order

Fitur Cart dan Order digunakan agar customer dapat memilih produk, menentukan jumlah paket, memilih varian rasa, dan membuat pesanan. Cart digunakan sebagai data sementara sebelum order dibuat sehingga tidak memerlukan model Cart baru.

Sistem menggunakan model `Product`, `Varian`, `Order`, `OrderItem`, dan `OrderItemVariant`. Backend melakukan validasi jumlah varian sesuai `jumlah_isi` produk, memeriksa ketersediaan stok, serta menghitung harga langsung dari database.

Pembuatan order menggunakan transaction Sequelize agar proses penyimpanan Order, OrderItem, dan OrderItemVariant berjalan secara bersamaan. Customer wajib login untuk membuat dan melihat order miliknya sendiri. Setiap order baru memiliki status awal `menunggu_konfirmasi`.

## Endpoint Cart dan Order

| Method | Endpoint                      | Fungsi                       |
| ------ | ----------------------------- | ---------------------------- |
| POST   | `/orders`                     | Membuat order                |
| GET    | `/orders/my-orders`           | Melihat daftar order sendiri |
| GET    | `/orders/my-orders/:id_order` | Melihat detail order         |

Semua endpoint memerlukan autentikasi menggunakan `authMiddleware`. Customer hanya dapat melihat order miliknya sendiri.