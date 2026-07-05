const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // URL Frontend Vite
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Konfigurasi MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Terhubung ke MongoDB via Mongoose'))
    .catch(err => console.error('❌ Gagal terhubung ke MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Jalankan Server
app.listen(PORT, () => {
    console.log(`🚀 Server Backend berjalan di http://localhost:${PORT}`);
});
