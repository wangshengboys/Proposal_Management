const mongoose = require('mongoose');

const anggotaSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  identifier: { type: String },
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
  skema: { type: String, enum: ['Penelitian', 'Pengabdian'], required: true },
  judul: { type: String, required: true },
  rumpunIlmu: { type: String, required: true },
  abstrak: { type: String, required: true },
  kataKunci: { type: String },
  anggota: [anggotaSchema],
  mitra: [mitraSchema],
  rab: [rabSchema],
  totalAnggaran: { type: Number, default: 0 },
  dokumenUrl: { type: String },
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
