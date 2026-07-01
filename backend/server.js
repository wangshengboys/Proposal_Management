const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // URL Frontend Vite
    credentials: true // Membolehkan pengiriman cookie
}));
app.use(express.json());
app.use(cookieParser());

// ==========================================
// Konfigurasi MongoDB & Mongoose
// ==========================================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Terhubung ke MongoDB via Mongoose'))
    .catch(err => console.error('❌ Gagal terhubung ke MongoDB:', err));

// Definisi Schema & Model User
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    google_id: { type: String, unique: true },
    role: { type: String, default: 'user', enum: ['user', 'admin'] }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);


// ==========================================
// Rute API
// ==========================================

// Endpoint Verifikasi Google Token
app.post('/api/auth/google', async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token tidak disediakan' });

    try {
        // 1. Verifikasi token menggunakan library resmi Google
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        
        const email = payload.email;
        const name = payload.name;
        const googleId = payload.sub;

        // 2. Cek apakah user sudah ada di MongoDB
        let user = await User.findOne({ email });

        if (user) {
            // Update google_id jika user sudah ada namun belum memiliki google_id
            if (!user.google_id) {
                user.google_id = googleId;
                await user.save();
            }
        } else {
            // Buat user baru di MongoDB
            user = await User.create({
                name,
                email,
                google_id: googleId,
                role: 'user'
            });
        }

        // 3. Buat JWT Token
        const jwtToken = jwt.sign(
            { id: user._id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        // 4. Kirim response ke Frontend
        res.json({ success: true, token: jwtToken, user: { name: user.name, role: user.role } });
    } catch (error) {
        console.error('Error verifikasi token Google:', error);
        res.status(401).json({ error: 'Otentikasi Google gagal' });
    }
});

// Middleware untuk memverifikasi JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token tidak ada atau tidak valid' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token kedaluwarsa atau tidak valid' });
    }
};

// Endpoint untuk mengambil profil user yang sedang login
app.get('/api/auth/me', verifyToken, (req, res) => {
    res.json({ user: req.user });
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`🚀 Server Backend berjalan di http://localhost:${PORT}`);
});
