# Dokumentasi Sistem Pickup dan Delivery

Fitur Pickup dan Delivery digunakan untuk mengatur metode pengiriman pesanan pada aplikasi SoeSweet. Customer dapat memilih metode pengambilan pesanan secara langsung (pickup) atau pengiriman ke alamat customer (delivery).

Data pengiriman disimpan pada model `Order` tanpa membuat model baru. Untuk pickup, alamat pengiriman bernilai `null` dan ongkir Rp0. Untuk delivery, customer wajib mengisi alamat dan memenuhi minimal pembelian Rp50.000. Ongkir delivery diatur melalui environment variable `DELIVERY_FEE` pada file `.env`.

Backend menghitung total harga berdasarkan subtotal dan ongkir. Perubahan metode pengiriman hanya dapat dilakukan oleh pemilik order ketika status pesanan masih `menunggu_konfirmasi`. Proses perubahan menggunakan transaction Sequelize agar seluruh perubahan data order tersimpan secara bersamaan. Pemilihan pickup atau delivery tidak mengubah status order dan tidak mengurangi stok varian.

## Endpoint Pickup dan Delivery

| Method | Endpoint                             | Fungsi                                          |
| ------ | ------------------------------------ | ----------------------------------------------- |
| PUT    |`/orders/my-orders/:id_order/shipping`| Mengubah metode pengiriman pickup atau delivery |

Endpoint memerlukan autentikasi menggunakan `authMiddleware`. Customer hanya dapat mengubah metode pengiriman pada order miliknya sendiri dengan status `menunggu_konfirmasi`.