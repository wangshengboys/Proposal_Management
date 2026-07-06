const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-__v').sort({ createdAt: -1 });
        res.json({ success: true, data: users });
    } catch (error) {
        console.error('Error get users:', error);
        res.status(500).json({ error: 'Gagal mengambil data pengguna' });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const validRoles = ['superadmin', 'admin', 'dosen_tetap', 'dosen_lb', 'kaprodi', 'fakultas', 'lppm'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: 'Role tidak valid' });
        }

        const user = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
        }

        res.json({ success: true, message: 'Role berhasil diperbarui', data: user });
    } catch (error) {
        console.error('Error update role:', error);
        res.status(500).json({ error: 'Gagal memperbarui role' });
    }
};

const bcrypt = require('bcryptjs');

exports.completeProfile = async (req, res) => {
    try {
        const { nidn, program_studi, fakultas, jabatan_fungsional, no_hp, jenis_dosen, password } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'Pengguna tidak ditemukan' });

        // Update fields
        user.nidn = nidn;
        user.program_studi = program_studi;
        user.fakultas = fakultas;
        user.jabatan_fungsional = jabatan_fungsional;
        user.no_hp = no_hp;
        user.jenis_dosen = jenis_dosen;
        user.is_profile_complete = true;

        // If user came from Google and doesn't have a password yet, save the new password
        if (password && !user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        
        // Buat JWT token baru dengan is_profile_complete = true
        const jwt = require('jsonwebtoken');
        const jwtToken = jwt.sign(
            { id: user._id, name: user.name, email: user.email, role: user.role, is_profile_complete: user.is_profile_complete },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ success: true, message: 'Profil berhasil dilengkapi', token: jwtToken });
    } catch (error) {
        console.error('Error complete profile:', error);
        res.status(500).json({ error: 'Gagal melengkapi profil' });
    }
};

exports.updateMyProfile = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'Pengguna tidak ditemukan' });

        user.name = name;
        await user.save();

        // Buat JWT token baru karena nama (di dalam payload JWT) berubah
        const jwt = require('jsonwebtoken');
        const jwtToken = jwt.sign(
            { id: user._id, name: user.name, email: user.email, role: user.role, is_profile_complete: user.is_profile_complete },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ success: true, message: 'Nama berhasil diubah', token: jwtToken });
    } catch (error) {
        console.error('Error update profile:', error);
        res.status(500).json({ error: 'Gagal merubah nama profil' });
    }
};

exports.updateMyPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'Pengguna tidak ditemukan' });

        if (!user.password) {
            return res.status(400).json({ error: 'Akun Anda tidak memiliki password lokal (Mendaftar via Google tanpa set password).' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Password lama salah' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ success: true, message: 'Password berhasil diubah' });
    } catch (error) {
        console.error('Error update password:', error);
        res.status(500).json({ error: 'Gagal merubah password' });
    }
};
