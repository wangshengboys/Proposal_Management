# Sistem Manajemen Proposal Penelitian

Aplikasi berbasis web untuk memfasilitasi pengajuan, peninjauan, dan pengelolaan proposal penelitian secara hierarkis (Dosen -> Kaprodi -> Fakultas -> LPPM).

## Teknologi yang Digunakan
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js + Mongoose
- **Database**: MongoDB
- **Autentikasi**: JSON Web Token (JWT) + Google OAuth2
- **File Upload**: Multer (Local File System)

## Alur Persetujuan Proposal
1. **Pengajuan (Dosen)**: Dosen mengajukan proposal (beserta RAB, rincian anggota, mitra, dan PDF dokumen). Status: `Menunggu Kaprodi`.
2. **Review Kaprodi**: Kaprodi dapat menyetujui, meminta revisi, atau menolak. Status: `Menunggu Fakultas`.
3. **Review Fakultas**: Fakultas meninjau dan memberikan keputusan. Status: `Menunggu LPPM`.
4. **Review LPPM**: Validasi akhir. Status: `Disetujui LPPM` atau ditolak/revisi.
5. **Revisi**: Jika kaprodi/fakultas/lppm meminta revisi, proposal kembali ke Dosen. Saat Dosen memperbaikinya, status akan kembali berulang dari tahap 1 (`Menunggu Kaprodi`).

## Panduan Instalasi (Development)

### Prasyarat
- Node.js (v18 atau lebih baru disarankan)
- MongoDB Server berjalan di `localhost:27017`

### 1. Setup Backend
```bash
cd backend
npm install
```
Buat file `.env` di dalam folder `backend/` dengan struktur:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/ProposalManagement
JWT_SECRET=rahasia_super_aman
GOOGLE_CLIENT_ID=client_id_anda
```
Jalankan server backend:
```bash
npm run dev
```

### 2. Setup Frontend
Buka terminal baru:
```bash
cd frontend
npm install
```
Buat file `.env` di dalam folder `frontend/` dengan struktur:
```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=client_id_anda
```
Jalankan development server:
```bash
npm run dev
```

### Catatan Penting
- Admin Unit dapat mengakses `/admin` untuk mendaftarkan akun Kaprodi, Fakultas, dan LPPM secara manual.
- Password default untuk pengguna yang didaftarkan secara manual adalah: `password123`.
