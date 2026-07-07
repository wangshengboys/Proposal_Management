const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Endpoint melihat user (bisa admin & superadmin)
router.get('/', verifyToken, requireRole(['superadmin', 'admin']), userController.getAllUsers);

// Endpoint menghapus user
router.delete('/:id', verifyToken, requireRole(['superadmin', 'admin']), userController.deleteUser);

// Endpoint melengkapi profil
router.put('/profile/complete', verifyToken, userController.completeProfile);

// Endpoint update nama & password
router.put('/me/profile', verifyToken, userController.updateMyProfile);
router.put('/me/password', verifyToken, userController.updateMyPassword);

// Endpoint membuat akun terkelola (Admin, Kaprodi, Fakultas, LPPM)
router.post('/managed', verifyToken, requireRole(['superadmin', 'admin']), userController.createManagedUser);

module.exports = router;
