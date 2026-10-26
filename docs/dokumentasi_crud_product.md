# Dokumentasi Fitur CRUD Product

Fitur CRUD Product digunakan untuk mengelola data produk kue SoeSweet. Admin dapat menambah, melihat, mengubah, dan menghapus produk, sedangkan customer hanya dapat melihat produk.

Data produk diantaranya: nama produk, jumlah isi, harga, deskripsi, gambar, dan status (`aktif` atau `nonaktif`).

Validasi menggunakan Joi, authentication menggunakan JWT, dan authorization berdasarkan role admin. Produk yang sudah digunakan dalam pesanan tidak dapat dihapus karena relasi `onDelete: RESTRICT`, tetapi dapat dinonaktifkan.

## Endpoint CRUD Product

| Method | Endpoint                | Fungsi                       |
| ------ | ----------------------- | ---------------------------- |
| GET    | `/products`             | Melihat semua produk         |
| GET    | `/products/:id_product` | Melihat detail satu produk   |
| POST   | `/products`             | Menambahkan produk (admin)   |
| PUT    | `/products/:id_product` | Mengubah data produk (admin) |
| DELETE | `/products/:id_product` | Menghapus produk (admin)     |

Endpoint POST, PUT, dan DELETE perlu authentication serta role `admin`, sedangkan endpoint GET dapat diakses customer untuk melihat data produk.