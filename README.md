# SoeSweet Backend

Backend dari aplikasi **SoeSweet**, yaitu aplikasi penjualan kue soes berbasis web yang menyediakan berbagai pilihan ukuran paket dan varian rasa. Backend ini berfungsi untuk mengelola data aplikasi, menjalankan proses bisnis, menangani autentikasi pengguna, serta menyediakan API yang digunakan oleh frontend SoeSweet.

## Deskripsi Proyek

SoeSweet merupakan aplikasi penjualan kue soes yang memiliki dua jenis pengguna, yaitu customer dan admin.

Backend SoeSweet dikembangkan menggunakan Node.js dan Express.js dengan database MySQL. Komunikasi antara frontend dan backend dilakukan melalui REST API, sedangkan pengelolaan database menggunakan Sequelize ORM.

Sistem ini menyediakan berbagai layanan, mulai dari pengelolaan pengguna, produk, varian rasa, keranjang dan checkout, pesanan, pembayaran, ulasan, dashboard admin, hingga laporan penjualan.

## Teknologi yang Digunakan

| Teknologi | Fungsi |
|---|---|
| Node.js | Menjalankan aplikasi backend |
| Express.js | Membangun server dan REST API |
| MySQL | Menyimpan data aplikasi |
| Sequelize | Mengelola database menggunakan ORM |
| mysql2 | Menghubungkan aplikasi dengan MySQL |
| JSON Web Token (JWT) | Autentikasi dan otorisasi pengguna |
| bcrypt | Melakukan hashing password |
| Joi | Validasi data request |
| Multer | Menangani upload file |
| dotenv | Mengelola environment variables |
| Helmet | Menambahkan perlindungan HTTP |
| Morgan | Mencatat aktivitas HTTP request |
| Nodemon | Membantu proses development |

## Fitur Backend

### 1. Autentikasi dan Pengguna
- Registrasi akun customer.
- Login menggunakan email dan password.
- Password disimpan dalam bentuk hash menggunakan bcrypt.
- Autentikasi menggunakan JSON Web Token (JWT).
- Pembatasan akses berdasarkan role customer dan admin.
- Pengelolaan data pengguna.

### 2. Manajemen Produk
- Menambahkan produk baru.
- Menampilkan daftar produk.
- Menampilkan detail produk.
- Mengubah informasi produk.
- Menghapus atau menonaktifkan produk.
- Mengelola gambar produk.

### 3. Manajemen Varian
- Menambahkan varian rasa.
- Menampilkan daftar varian.
- Mengubah informasi varian.
- Menghapus atau menonaktifkan varian.
- Mengelola stok setiap varian.

### 4. Checkout dan Pesanan
- Menampilkan ringkasan checkout.
- Memvalidasi produk dan varian yang dipesan.
- Memeriksa ketersediaan stok.
- Membuat pesanan customer.
- Mengelola detail item pesanan.
- Mendukung metode pengambilan langsung dan pengiriman.
- Menghitung biaya pengiriman sesuai ketentuan.

### 5. Pembayaran
- Mendukung pembayaran manual melalui transfer bank dan e-wallet.
- Menerima upload bukti pembayaran.
- Mengelola pemeriksaan pembayaran oleh admin.
- Mendukung persetujuan dan penolakan pembayaran.

### 6. Status Pesanan
- Mengelola perubahan status pesanan.
- Menangani proses konfirmasi pesanan.
- Mengelola proses pembayaran.
- Mengelola proses produksi dan pengiriman.
- Menyelesaikan atau membatalkan pesanan.

### 7. Ulasan dan Rating
- Menyimpan rating dan komentar customer.
- Mendukung upload foto ulasan.
- Menghubungkan ulasan dengan pesanan.
- Menampilkan data ulasan berdasarkan produk dan pesanan.

### 8. Admin Dashboard
- Menampilkan jumlah pelanggan.
- Menampilkan statistik penjualan.
- Menampilkan produk terlaris.
- Menampilkan varian terlaris.
- Menampilkan pesanan terbaru.
- Mendukung filter periode statistik.

### 9. Laporan
- Mengambil data laporan penjualan.
- Menampilkan informasi pesanan.
- Menyediakan data pendukung laporan untuk admin.

## Endpoint API

Berikut kelompok endpoint utama yang tersedia pada backend SoeSweet.

| Modul | Base Route | Fungsi |
|---|---|---|
| Authentication | `/auth` | Registrasi dan login |
| Users | `/users` | Pengelolaan pengguna |
| Products | `/products` | Pengelolaan produk |
| Variants | `/varian` | Pengelolaan varian dan stok |
| Orders | `/orders` | Pengelolaan pesanan |
| Checkout | `/checkout` | Preview checkout |
| Reviews | `/review` | Pengelolaan ulasan |
| Dashboard | `/admin/dashboard` | Statistik dashboard admin |
| Reports | `/admin/reports` | Data laporan |

Endpoint lengkap beserta method, parameter, autentikasi, dan penjelasan setiap fitur dapat dilihat pada dokumentasi di folder `docs`.

## Pengelolaan File Upload

Backend SoeSweet menggunakan Multer untuk menangani proses upload file.

File yang diunggah meliputi:

- Gambar produk.
- Bukti pembayaran.
- Foto ulasan customer.

Format file dan batas ukuran upload mengikuti validasi yang diterapkan pada masing-masing fitur.

## Keamanan Aplikasi

Beberapa mekanisme keamanan yang diterapkan pada backend SoeSweet:

- Password pengguna di-hash menggunakan bcrypt.
- Autentikasi menggunakan JWT.
- Otorisasi berdasarkan role pengguna.
- Validasi input menggunakan Joi.
- Penggunaan Helmet untuk perlindungan HTTP.
- Pengaturan CORS untuk membatasi akses frontend.
- Penggunaan environment variables untuk menyimpan konfigurasi sensitif.
- Pembatasan format dan ukuran file upload.

## Pengembangan

Backend SoeSweet dikembangkan secara terpisah dari frontend sehingga keduanya memiliki repository masing-masing.

Frontend berkomunikasi dengan backend melalui REST API menggunakan alamat server yang telah dikonfigurasi.

---

**SoeSweet Backend**

*Backend API untuk aplikasi penjualan kue SoeSweet.*