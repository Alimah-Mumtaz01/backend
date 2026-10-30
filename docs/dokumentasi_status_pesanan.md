# Dokumentasi Fitur Manajemen Status Pesanan

Fitur manajemen status pesanan digunakan untuk mengatur perkembangan pesanan mulai dari menunggu konfirmasi admin hingga pesanan selesai. Admin dapat mengubah status pesanan sesuai alur bisnis, sedangkan customer dapat melihat perkembangan status pesanan miliknya.

Sistem menggunakan model `Order`, `Payment`, dan `User` tanpa membuat model baru. Perubahan status divalidasi berdasarkan status sebelumnya, metode pengiriman, dan hak akses pengguna. Proses perubahan status menggunakan Sequelize transaction agar data tetap konsisten.

## Alur Status Pesanan

- `menunggu_konfirmasi` → `pesanan_diterima` atau `dibatalkan`.
- `pesanan_diterima` → `menunggu_pembayaran` atau `dibatalkan`.
- `menunggu_pembayaran` → `dibatalkan`.
- `diproses` → `siap_diambil` (pickup) atau `sedang_dikirim` (delivery).
- `siap_diambil` → `selesai`.
- `sedang_dikirim` → `selesai`.

## Endpoint Update Status

| Method | Endpoint                             | Fungsi                                |
| ------ | ------------------------------------ | ------------------------------------- |
| PUT    | `/orders/:id_order/status`           | Mengubah status pesanan oleh admin    |
| GET    | `/orders/my-orders/:id_order/status` | Melihat status pesanan milik customer |