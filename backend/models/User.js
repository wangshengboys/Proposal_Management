const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    google_id: { type: String, unique: true },
    role: { 
        type: String, 
        enum: ['superadmin', 'admin', 'dosen_tetap', 'dosen_lb', 'kaprodi', 'fakultas', 'lppm'],
        default: 'dosen_tetap'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
