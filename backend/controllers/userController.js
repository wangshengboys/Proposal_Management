const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        let filter = {};
        // Jika yang request admin, sembunyikan superadmin
        if (req.user.role === 'admin') {
            filter.role = { $ne: 'superadmin' };
        }

        const users = await User.find(filter, '-__v').sort({ createdAt: -1 });
        res.json({ success: true, data: users });
    } catch (error) {
        console.error('Error get users:', error);
        res.status(500).json({ error: 'Gagal mengambil data pengguna' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const targetUser = await User.findById(id);

        if (!targetUser) {
            return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
        }

        // Admin tidak bisa menghapus superadmin
        if (req.user.role === 'admin' && targetUser.role === 'superadmin') {
            return res.status(403).json({ error: 'Anda tidak memiliki akses menghapus Super Admin' });
        }

        await User.findByIdAndDelete(id);
        res.json({ success: true, message: 'Akun berhasil dihapus' });
    } catch (error) {
        console.error('Error delete user:', error);
        res.status(500).json({ error: 'Gagal menghapus akun' });
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

exports.createManagedUser = async (req, res) => {
    try {
        const { name, email, password, role, program_studi, fakultas } = req.body;
        
        const validRoles = ['admin', 'kaprodi', 'fakultas', 'lppm'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: 'Role tidak valid untuk pembuatan manual.' });
        }

        // Admin tidak boleh membuat admin lain
        if (req.user.role === 'admin' && role === 'admin') {
            return res.status(403).json({ error: 'Admin tidak memiliki hak akses membuat akun Admin lain.' });
        }

        // Validasi ketersediaan Kaprodi
        if (role === 'kaprodi') {
            if (!program_studi) return res.status(400).json({ error: 'Program Studi wajib diisi untuk Kaprodi' });
            const existing = await User.findOne({ role: 'kaprodi', program_studi });
            if (existing) return res.status(400).json({ error: `Akun Kaprodi untuk ${program_studi} sudah terdaftar` });
        }

        // Validasi ketersediaan Fakultas
        if (role === 'fakultas') {
            if (!fakultas) return res.status(400).json({ error: 'Fakultas wajib diisi' });
            const existing = await User.findOne({ role: 'fakultas', fakultas });
            if (existing) return res.status(400).json({ error: `Akun Fakultas untuk ${fakultas} sudah terdaftar` });
        }

        // Validasi ketersediaan LPPM
        if (role === 'lppm') {
            const existing = await User.findOne({ role: 'lppm' });
            if (existing) return res.status(400).json({ error: 'Akun LPPM maksimal hanya boleh 1 (satu) di dalam sistem.' });
        }

        // Cek apakah email sudah dipakai
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'Email sudah terdaftar' });
        }

        // Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            program_studi: role === 'kaprodi' ? program_studi : undefined,
            fakultas: role === 'fakultas' ? fakultas : undefined,
            is_profile_complete: true // Akun management ini tidak isi NIDN dsb
        });

        res.status(201).json({ success: true, message: `Akun ${role} berhasil dibuat.`, data: user });
    } catch (error) {
        console.error('Error create managed user:', error);
        res.status(500).json({ error: 'Gagal membuat akun' });
    }
};
