# Dokumentasi fitur Register dan Login

## A. Tujuan

Membuat sistem login dan register pada aplikasi SoeSweet agar pengguna dapat masuk sesuai akun dan hak aksesnya.

## B. Fitur yang Dibuat

* Register pengguna
* Login pengguna
* Hash password menggunakan bcrypt
* JWT untuk autentikasi
* Middleware authentication
* Middleware authorization berdasarkan role
* Validasi input menggunakan Joi

## C. Register

Pengguna dapat membuat akun dengan mengirimkan:
* Nama
* Email
* No HP
* Password

Password tidak disimpan dalam bentuk asli, tetapi di-hash menggunakan **bcrypt**.

Role pengguna saat register otomatis menjadi `user`.

## D. Login

Pengguna login menggunakan email dan password.

Jika data benar, sistem memberikan **JWT token** yang digunakan untuk mengakses endpoint yang membutuhkan login.

## E. JWT

JWT berisi informasi dasar pengguna seperti:
* `id_user`
* `email`
* `role`

Masa berlaku token diatur melalui `.env`:
`JWT_EXPIRES_IN=1d`

## F. Authentication Middleware

Middleware digunakan untuk memeriksa apakah token yang dikirim pengguna valid.

Format header:
`Authorization: Bearer {{TOKEN}}`

Jika token valid, data pengguna disimpan ke `req.user`.

## G. Authorization

Authorization digunakan untuk membatasi akses berdasarkan role.

Contohnya:
* `user` hanya dapat mengakses fitur pengguna.
* `admin` dapat mengakses fitur administrasi.

Jika role tidak sesuai, server memberikan status **403 Forbidden**.

## H. Validasi Joi

Input register dan login diperiksa menggunakan Joi.

Contohnya:
* Nama wajib diisi.
* Email harus memiliki format email.
* Password minimal 6 karakter.

Jika validasi gagal, server memberikan status **400 Bad Request**.

## I. Service

Proses register dan login dibuat di `authService.js`.

Try/catch digunakan untuk menangani error sehingga error dapat diteruskan ke controller dan memberikan response yang sesuai.

## J. Endpoint

| Method | Endpoint         | Fungsi       |
| ------ | ---------------- | ------------ |
| POST   | `/auth/register` | Membuat akun |
| POST   | `/auth/login`    | Login        |

## K. Struktur File

```text
backend/
├── controllers/
│   └── authController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── validateMiddleware.js
├── routes/
│   └── authRoutes.js
├── services/
│   └── authService.js
├── validations/
│   └── authValidation.js
└── models/
    └── userModel.js
```

## L. Hasil Progress

Authentication dan Authorization pada SoeSweet sudah dibuat dengan:
* Register dan login
* bcrypt
* JWT
* Joi
* Authentication middleware
* Authorization berdasarkan role

## M. Kesimpulan

Progress ini berhasil membuat sistem Authentication dan Authorization sebagai dasar keamanan aplikasi SoeSweet. Pengguna dapat melakukan register dan login, sedangkan akses fitur dapat dibatasi berdasarkan role `user` dan `admin`.