const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    google_id: { type: String, unique: true },
    role: { 
        type: String, 
        enum: ['superadmin', 'admin', 'dosen_tetap', 'dosen_lb', 'kaprodi', 'fakultas', 'lppm'],
        default: 'dosen_tetap'
    },
    password: { type: String }, // Opsional untuk Google Auth
    nidn: { type: String },
    program_studi: { type: String },
    fakultas: { type: String },
    jabatan_fungsional: { type: String },
    no_hp: { type: String },
    jenis_dosen: { type: String },
    is_profile_complete: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
