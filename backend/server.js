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

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Terhubung ke MongoDB via Mongoose');
    // Drop old index if exists to avoid E11000 duplicate key error on null google_id
    mongoose.connection.collection('users').dropIndex('google_id_1')
      .catch(() => {});
  })
  .catch(err => console.error('Koneksi MongoDB gagal:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Jalankan Server
app.listen(PORT, () => {
    console.log(`🚀 Server Backend berjalan di http://localhost:${PORT}`);
});
