# 🛒 E-Store — E-Commerce Sayuran & Bumbu Dapur

Aplikasi e-commerce modern untuk belanja kebutuhan dapur secara online. Dibangun dengan **React + Vite** (frontend) dan **Express + PostgreSQL + Sequelize** (backend), dilengkapi pembayaran **QRIS via Xendit**.

![E-Store Screenshot](https://img.shields.io/badge/Status-Development-green?style=flat-square)
![Node](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white&style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white&style=flat-square)

---

## ✨ Fitur Utama

### 🛍️ Pembeli
- Katalog produk dengan **filter kategori** (Sayuran, Bumbu Dapur, Buah-buahan, Bahan Pokok)
- Detail produk dengan deskripsi dan stok
- Keranjang belanja (tambah, hapus, ubah jumlah)
- **Checkout 3 langkah**:
  1. Review pesanan (jumlah & berat dalam kg)
  2. Alamat pengiriman lengkap + titik **Google Maps** (GPS)
  3. Pembayaran **QRIS** otomatis via Xendit
- QR Code QRIS **auto-generate** sesuai total belanja
- Polling status pembayaran real-time
- Registrasi & login akun

### 🔧 Admin Dashboard (`/admin`)
- **Manajemen Produk**: Tambah, edit, hapus produk
- **Manajemen Kategori**: Tambah, edit, hapus kategori
- **Manajemen Pesanan**: Lihat semua pesanan, update status (pending → paid → shipped → completed / cancelled)

---

## 🏗️ Tech Stack

| Layer      | Teknologi                                    |
|------------|----------------------------------------------|
| Frontend   | React 19, Vite, TailwindCSS v4, react-qr-code |
| Backend    | Express 5, Sequelize 6, Node.js              |
| Database   | PostgreSQL                                   |
| Auth       | JWT (JSON Web Token), bcrypt                 |
| Payment    | Xendit (QRIS via Payment Request API)        |

---

## 📁 Struktur Proyek

```
ECom/
├── backend/
│   ├── src/
│   │   ├── config/         # Konfigurasi database
│   │   ├── controllers/    # Logic API (auth, product, order, category, payment)
│   │   ├── middlewares/     # Auth middleware (JWT)
│   │   ├── models/          # Sequelize models (User, Product, Category, Order, OrderItem)
│   │   ├── routes/          # Express routes
│   │   ├── scripts/         # Seed script
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, ProductCard
│   │   ├── context/         # AuthContext, CartContext
│   │   ├── pages/           # Home, ProductDetail, Cart, Checkout, Login, Register, AdminDashboard
│   │   ├── services/        # Axios API client
│   │   ├── App.jsx
│   │   ├── index.css        # Design system & global styles
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

## 🚀 Cara Menjalankan

### Prasyarat
- **Node.js** v18+
- **PostgreSQL** terinstall dan berjalan
- **Git**

### 1. Clone Repository

```bash
git clone https://github.com/KangBasrengg/e-commerce_nuril.git
cd e-commerce_nuril
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` di folder `backend/`:

```env
DB_NAME=ecom_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret
PORT=5000
XENDIT_SECRET_KEY=your_xendit_secret_key
XENDIT_PUBLIC_KEY=your_xendit_public_key
```

Buat database dan jalankan seed:

```bash
# Buat database ecom_db di PostgreSQL terlebih dahulu, lalu:
node src/scripts/seed.js
```

Jalankan backend:

```bash
npm run dev
```

Backend berjalan di `http://localhost:5000`

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend berjalan di `http://localhost:5173`

---

## 🔑 Akun Default

| Role  | Email             | Password   |
|-------|-------------------|------------|
| Admin | admin@ecom.com    | admin123   |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint             | Deskripsi        |
|--------|----------------------|------------------|
| POST   | `/api/auth/register` | Registrasi user  |
| POST   | `/api/auth/login`    | Login user       |

### Produk
| Method | Endpoint           | Deskripsi                 | Auth     |
|--------|--------------------|---------------------------|----------|
| GET    | `/api/products`    | Semua produk              | Public   |
| GET    | `/api/products/:id`| Detail produk             | Public   |
| POST   | `/api/products`    | Tambah produk             | Admin    |
| PUT    | `/api/products/:id`| Edit produk               | Admin    |
| DELETE | `/api/products/:id`| Hapus produk              | Admin    |

### Kategori
| Method | Endpoint              | Deskripsi                 | Auth     |
|--------|-----------------------|---------------------------|----------|
| GET    | `/api/categories`     | Semua kategori            | Public   |
| POST   | `/api/categories`     | Tambah kategori           | Admin    |
| PUT    | `/api/categories/:id` | Edit kategori             | Admin    |
| DELETE | `/api/categories/:id` | Hapus kategori            | Admin    |

### Pesanan
| Method | Endpoint                  | Deskripsi                 | Auth     |
|--------|---------------------------|---------------------------|----------|
| POST   | `/api/orders`             | Buat pesanan              | User     |
| GET    | `/api/orders/user`        | Pesanan user login        | User     |
| GET    | `/api/orders`             | Semua pesanan             | Admin    |
| PUT    | `/api/orders/:id/status`  | Update status pesanan     | Admin    |

### Pembayaran
| Method | Endpoint                     | Deskripsi                | Auth     |
|--------|------------------------------|--------------------------|----------|
| POST   | `/api/payment/create-qris`   | Generate QRIS            | User     |
| GET    | `/api/payment/status/:id`    | Cek status pembayaran    | User     |
| POST   | `/api/payment/webhook`       | Webhook callback Xendit  | Public   |

---

## 🎨 Palet Warna

| Fungsi                | Warna       | Kode      |
|-----------------------|-------------|-----------|
| Latar Belakang        | Putih Hijau | `#F4F7F5` |
| Teks Utama            | Hijau Gelap | `#2C3E35` |
| Teks Sekunder         | Abu-abu     | `#7F8C8D` |
| Aksen Primer          | Hijau Segar | `#2DA96F` |
| Border                | Abu Lembut  | `#E2E8E4` |

---

## 📝 Lisensi

Proyek ini dibuat untuk keperluan tugas/pembelajaran.

---

**Dibuat dengan ❤️ oleh KangBasreng**
