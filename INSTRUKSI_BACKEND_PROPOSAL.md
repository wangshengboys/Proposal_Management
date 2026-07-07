# Panduan Integrasi Backend: Sistem Manajemen Proposal (Protaseis)

Dokumen ini disusun sebagai acuan komprehensif bagi Developer Backend dan AI Agent dalam mengembangkan fitur inti **Pengelolaan Proposal** beserta **Alur Persetujuan (Approval Workflow)**.

Analisis ini didasarkan pada antarmuka (UI) Frontend yang sudah dibangun, meliputi *form wizard* (5 langkah) untuk Dosen, serta *dashboard approval* untuk Kaprodi, Fakultas, LPPM, dan Admin.

---

## 1. Struktur Data (Model Database)

Berdasarkan *form* yang diisi oleh dosen di Frontend, berikut adalah rancangan skema Mongoose (`models/Proposal.js`) yang dibutuhkan:

```javascript
const mongoose = require('mongoose');

const anggotaSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  identifier: { type: String }, // NIDN / NIK / NIM
  institusi: { type: String },
  peran: { type: String, enum: ['Anggota Peneliti', 'Asisten Peneliti', 'Tenaga Ahli'] }
});

const mitraSchema = new mongoose.Schema({
  namaMitra: { type: String },
  pic: { type: String },
  email: { type: String },
  kontribusiDana: { type: Number, default: 0 }
});

const rabSchema = new mongoose.Schema({
  kategori: { type: String },
  item: { type: String },
  harga: { type: Number },
  volume: { type: Number },
  total: { type: Number }
});

const trackingSchema = new mongoose.Schema({
  role: { type: String, enum: ['kaprodi', 'fakultas', 'lppm'] },
  status: { type: String, enum: ['Disetujui', 'Revisi', 'Ditolak'] },
  note: { type: String },
  date: { type: Date, default: Date.now },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const proposalSchema = new mongoose.Schema({
  pengusul: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Step 1: Identitas
  skema: { type: String, enum: ['Penelitian', 'Pengabdian'], required: true },
  judul: { type: String, required: true },
  rumpunIlmu: { type: String, required: true },
  abstrak: { type: String, required: true },
  kataKunci: { type: String },
  
  // Step 2 & 3: Anggota & Mitra
  anggota: [anggotaSchema],
  mitra: [mitraSchema],
  
  // Step 4: RAB
  rab: [rabSchema],
  totalAnggaran: { type: Number, default: 0 },
  
  // Step 5: Dokumen Upload
  dokumenUrl: { type: String }, // Path file PDF di server / cloud
  
  // Status & Tracking
  statusSaatIni: { 
    type: String, 
    enum: [
      'Draft', 
      'Menunggu Kaprodi', 'Revisi Kaprodi', 'Ditolak Kaprodi',
      'Menunggu Fakultas', 'Revisi Fakultas', 'Ditolak Fakultas',
      'Menunggu LPPM', 'Revisi LPPM', 'Ditolak LPPM',
      'Disetujui LPPM'
    ],
    default: 'Menunggu Kaprodi' 
  },
  trackingHistory: [trackingSchema]

}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);
```

---

## 2. Hierarki dan Logika Otorisasi (Authorization Logic)

Setiap entitas *role* memiliki batasan penglihatan (*visibility*) dan hak aksi (*action rights*) yang sangat ketat:

### A. Dosen (Pengusul)
- **Visibility**: Hanya bisa melihat (`GET`) proposal yang ia buat sendiri (`pengusul === req.user._id`).
- **Aksi**: 
  - `POST`: Membuat proposal baru.
  - `PUT`: Mengedit proposal yang statusnya `Draft` atau `Revisi ...`. Tidak boleh mengedit jika statusnya `Menunggu ...` atau `Disetujui`.

### B. Kaprodi (Approval Tier 1)
- **Visibility**: Hanya bisa melihat proposal di mana program studi pengusul **sama dengan** program studi Kaprodi yang sedang *login*.
  - *Logic query*: `User.findById(proposal.pengusul).program_studi === req.user.program_studi`.
- **Aksi**: Bisa menyetujui, menolak, atau mengembalikan (revisi) proposal yang berstatus `Menunggu Kaprodi`.
- **Dampak Setuju**: Status berubah menjadi `Menunggu Fakultas`.

### C. Fakultas (Approval Tier 2)
- **Visibility**: Hanya bisa melihat proposal di mana fakultas pengusul **sama dengan** fakultas akun Fakultas yang sedang *login*, **DAN** status proposal minimal sudah melewati Kaprodi (atau sedang `Menunggu Fakultas`).
- **Aksi**: Bisa menyetujui, menolak, atau mengembalikan (revisi) proposal yang berstatus `Menunggu Fakultas`.
- **Dampak Setuju**: Status berubah menjadi `Menunggu LPPM`.

### D. LPPM (Approval Tier 3 - Final)
- **Visibility**: Bisa melihat **semua** proposal dari seluruh fakultas, **asalkan** statusnya minimal sudah melewati Fakultas (atau sedang `Menunggu LPPM`).
- **Aksi**: Bisa menyetujui, menolak, atau mengembalikan (revisi) proposal yang berstatus `Menunggu LPPM`.
- **Dampak Setuju**: Status berubah menjadi `Disetujui LPPM` (Final).

### E. Admin Unit / Superadmin (Observer)
- **Visibility**: Bisa melihat **seluruh proposal tanpa terkecuali** beserta riwayatnya.
- **Aksi**: Hanya melihat (*Read-Only*). Tidak memiliki fungsi *approve* / *reject* API sama sekali.

---

## 3. Daftar Endpoints (API Routes) yang Harus Dibuat

Backend diharapkan menyediakan *endpoints* berikut di `routes/proposalRoutes.js`:

### 1. Membuat Proposal (Khusus Dosen)
- **Metode**: `POST /api/proposals`
- **Tugas**: 
  - Validasi *multipart/form-data* (karena ada *upload file* PDF di Step 5, sebaiknya gunakan **Multer**).
  - Ekstrak JSON data dari `req.body` untuk mengisi Step 1 - Step 4.
  - Set `pengusul = req.user._id` dan `statusSaatIni = 'Menunggu Kaprodi'`.

### 2. Mengambil Daftar Proposal (Sesuai Role)
- **Metode**: `GET /api/proposals`
- **Tugas Utama**: Mengimplementasikan *filtering logic* sangat ketat (Tidak boleh campur aduk antar prodi/fakultas).
  - **Dosen**: `Proposal.find({ pengusul: req.user._id })`
  - **Kaprodi TI**: HANYA boleh menerima dan melihat proposal yang diajukan oleh Dosen dari prodi "Teknik Informatika". 
    - *Solusi Backend*: Lakukan *join/lookup* (atau *populate*) ke *collection* `User`. Ambil proposal di mana `pengusul.program_studi === req.user.program_studi`.
  - **Fakultas Rekayasa**: HANYA boleh menerima proposal dari dosen di bawah Fakultas Rekayasa (TI, DKV, dsb) DAN statusnya sudah melewati Kaprodi.
    - *Solusi Backend*: Ambil proposal di mana `pengusul.fakultas === req.user.fakultas`.
  - **LPPM & Admin**: Bisa melihat keseluruhan proposal dari semua prodi dan fakultas. LPPM untuk menyetujui, Admin hanya untuk memantau.
- *Catatan Tambahan*: Pastikan melakukan `.populate('pengusul', 'name program_studi fakultas')` agar Frontend bisa menampilkan data identitas pengusul di tabel.

### 3. Melihat Detail Proposal
- **Metode**: `GET /api/proposals/:id`
- **Tugas**: Mengambil data lengkap proposal, termasuk array `anggota`, `mitra`, `rab`, dan `trackingHistory`. Lakukan validasi otorisasi (apakah user ini berhak melihat ID proposal ini).

### 4. Melakukan Review / Approval (Khusus Approval Roles)
- **Metode**: `PUT /api/proposals/:id/review`
- **Body**: `{ action: 'approve' | 'reject' | 'revise', note: 'Alasan lengkap...' }`
- **Tugas**: 
  1. Validasi apakah `req.user.role` berhak mereview pada tahap status proposal saat ini.
  2. Tambahkan *record* baru ke array `trackingHistory` (siapa yang mereview, tanggal, catatan).
  3. Ubah `statusSaatIni` proposal ke tahap berikutnya, atau kembalikan ke status revisi/ditolak sesuai algoritma di atas.

---

## 4. Saran Tambahan untuk AI Agent Backend

- **File Uploads**: Karena Frontend membutuhkan fitur unggah dokumen pendukung (Step 5), siapkan *middleware* Multer di Node.js untuk menyimpan PDF (bisa di folder `public/uploads/` atau ke *cloud storage* seperti Cloudinary/S3).
- **Transaksi Basis Data**: Saat Kaprodi melakukan *approval*, pastikan operasi penambahan `trackingHistory` dan perubahan `statusSaatIni` dilakukan dengan aman (jika perlu gunakan Mongoose *Session/Transaction* jika di masa depan akan ada operasi pengiriman email paralel).
- **Pengamanan (Security)**: Jangan pernah percayai pengiriman `statusSaatIni` dari sisi *client* (Frontend). Status harus di-*hardcode* perubahannya di dalam server Node.js berdasarkan `req.user.role` saat memanggil API `/review`.
