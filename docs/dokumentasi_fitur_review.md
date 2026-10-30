# Dokumentasi Fitur Rating dan Review

Fitur rating dan review digunakan agar pelanggan dapat memberikan penilaian terhadap produk yang telah dibeli melalui rating, komentar, dan foto. Review hanya dapat dibuat untuk pesanan yang sudah berstatus `selesai` dan dimiliki oleh pelanggan yang sedang login.

Sistem menggunakan model `Review` dan `ReviewImage`. Backend memvalidasi kepemilikan pesanan, memastikan produk terdapat dalam detail pesanan, serta membatasi satu review untuk setiap pesanan. Rating wajib berupa bilangan bulat 1–5, sedangkan foto maksimal tiga foto. File foto disimpan di folder `uploads/reviews/`.

## Endpoint Review

| Method | Endpoint                              | Fungsi                              |
| ------ | ------------------------------------- | ----------------------------------- |
| GET    | `/reviews`                            | Menampilkan seluruh review          |
| GET    | `/reviews/:id_review`                 | Menampilkan detail review           |
| GET    | `/reviews/product/:id_product/rating` | Menampilkan rata-rata rating produk |
| POST   | `/reviews`                            | Membuat review baru                 |
| PUT    | `/reviews/:id_review`                 | Mengubah review                     |
| DELETE | `/reviews/:id_review`                 | Menghapus review                    |

- Endpoint GET dapat diakses tanpa login.
- Endpoint POST, PUT, dan DELETE membutuhkan JWT.
- Pelanggan hanya dapat mereview pesanan miliknya sendiri.
- Review hanya dapat dibuat jika pesanan berstatus `selesai`.
- Rating harus bernilai 1–5.
- Foto review maksimal tiga file.
- Pelanggan hanya dapat mengubah dan menghapus review miliknya sendiri.

Dengan fitur ini, pelanggan dapat memberikan penilaian terhadap produk SoeSweet, sedangkan backend memastikan review yang disimpan sesuai dengan aturan dan data pesanan.