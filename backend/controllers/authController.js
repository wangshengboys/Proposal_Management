const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
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
                role
            });
        }

        const jwtToken = jwt.sign(
            { id: user._id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ success: true, token: jwtToken, user: { name: user.name, role: user.role, email: user.email } });
    } catch (error) {
        console.error('Error verifikasi token Google:', error);
        res.status(401).json({ error: 'Otentikasi Google gagal' });
    }
};

exports.getMe = (req, res) => {
    res.json({ user: req.user });
};
