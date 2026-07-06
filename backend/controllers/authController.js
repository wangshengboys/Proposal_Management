const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token tidak disediakan' });

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        
        const email = payload.email;
        const name = payload.name;
        const googleId = payload.sub;

        let user = await User.findOne({ email });

        if (user) {
            if (!user.google_id) {
                user.google_id = googleId;
                await user.save();
            }
        } else {
            // Cek apakah ini user pertama di database
            const userCount = await User.countDocuments();
            const role = userCount === 0 ? 'superadmin' : 'dosen_tetap';

            user = await User.create({
                name,
                email,
                google_id: googleId,
                role,
                is_profile_complete: role === 'superadmin'
            });
        }

        const jwtToken = jwt.sign(
            { id: user._id, name: user.name, email: user.email, role: user.role, is_profile_complete: user.is_profile_complete },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ success: true, token: jwtToken, user: { name: user.name, role: user.role, email: user.email, is_profile_complete: user.is_profile_complete } });
    } catch (error) {
        console.error('Error verifikasi token Google:', error);
        res.status(401).json({ error: 'Otentikasi Google gagal' });
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Cek apakah email sudah dipakai
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'Email sudah terdaftar' });
        }

        // Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Cek superadmin
        const userCount = await User.countDocuments();
        const role = userCount === 0 ? 'superadmin' : 'dosen_tetap';

        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            is_profile_complete: role === 'superadmin'
        });

        res.status(201).json({ success: true, message: 'Pendaftaran berhasil, silakan login.' });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Gagal mendaftar' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Email tidak ditemukan' });

        if (!user.password) return res.status(400).json({ error: 'Akun ini terdaftar via Google. Silakan login dengan Google.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Password salah' });

        const jwtToken = jwt.sign(
            { id: user._id, name: user.name, email: user.email, role: user.role, is_profile_complete: user.is_profile_complete },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ success: true, token: jwtToken, user: { name: user.name, role: user.role, email: user.email, is_profile_complete: user.is_profile_complete } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat login' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
