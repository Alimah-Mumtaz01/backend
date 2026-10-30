# Dokumentasi Fitur Pembayaran dan Upload Bukti Pembayaran

Fitur Pembayaran dan Upload Bukti Pembayaran digunakan untuk menangani pembayaran pesanan SoeSweet secara manual melalui transfer bank atau e-wallet tanpa menggunakan payment gateway.

Customer dapat mengupload bukti pembayaran setelah pesanan diterima admin dan status order berubah menjadi `menunggu_pembayaran`. Upload menggunakan Multer dengan format JPG, JPEG, PNG, dan WEBP serta ukuran maksimal 5 MB. Informasi pembayaran disimpan pada model `Payment` yang berelasi dengan `Order`, sedangkan file bukti pembayaran disimpan pada `uploads/payments/`.

Admin dapat memverifikasi pembayaran dengan menerima atau menolak bukti pembayaran. Jika diterima, status pembayaran menjadi `verified`, status order berubah menjadi `diproses`, dan stok varian dikurangi sesuai jumlah pesanan. Jika ditolak, status pembayaran menjadi `rejected`, status order berubah menjadi `pembayaran_ditolak`, dan alasan penolakan wajib diisi.

Seluruh perubahan database menggunakan transaction Sequelize untuk menjaga konsistensi data pembayaran, pesanan, dan stok.

## Endpoint Pembayaran

| Method | Endpoint                           | Fungsi                                        |
| ------ | ---------------------------------- | --------------------------------------------- |
| POST   | `/orders/:id_order/payment`        | Mengupload bukti pembayaran                   |
| PUT    | `/orders/:id_order/payment/verify` | Memverifikasi atau menolak pembayaran (admin) |

- Endpoint upload pembayaran memerlukan autentikasi `authMiddleware`. Customer hanya dapat mengupload bukti pembayaran untuk order miliknya sendiri.
- Endpoint verifikasi memerlukan autentikasi dan otorisasi `authorize("admin")`.
- Stok hanya dikurangi setelah pembayaran berhasil diverifikasi dan tidak dikurangi saat upload maupun penolakan pembayaran.