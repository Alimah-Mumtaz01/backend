# Dokumentasi CRUD Varian dan Manajemen Stok

Fitur CRUD Varian dan Manajemen Stok digunakan untuk mengelola varian rasa kue SoeSweet, seperti Original, Strawberry, Cokelat, Durian, Mangga, Matcha, dan Blueberry. Admin dapat menambah, melihat, mengubah, menghapus varian, serta mengatur jumlah stok.

Data varian diantaranya: nama varian, stok, dan status (`aktif` atau `nonaktif`).

Validasi menggunakan Joi, authentication menggunakan JWT, dan authorization berdasarkan role admin. Stok tidak boleh kurang dari 0, sedangkan varian dengan stok 0 dianggap habis. Varian yang sudah digunakan dalam pesanan tidak dapat dihapus karena relasi `onDelete: RESTRICT`.

## Endpoint CRUD Varian dan Manajemen Stok

| Method | Endpoint                  | Fungsi                       |
| ------ | ------------------------- | ---------------------------- |
| GET    | `/varian`                 | Melihat semua varian         |
| GET    | `/varian/:id_varian`      | Melihat detail varian        |
| POST   | `/varian`                 | Menambahkan varian (admin)   |
| PUT    | `/varian/:id_varian`      | Mengubah data varian (admin) |
| PATCH  | `/varian/:id_varian/stok` | Mengubah stok varian (admin) |
| DELETE | `/varian/:id_varian`      | Menghapus varian (admin)     |

Endpoint POST, PUT, PATCH stok, dan DELETE memerlukan authentication serta role `admin`. Endpoint GET dapat diakses tanpa login.