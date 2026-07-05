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
