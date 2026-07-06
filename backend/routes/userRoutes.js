const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Hanya superadmin yang bisa melihat semua user dan mengubah role
router.get('/', verifyToken, requireRole(['superadmin']), userController.getAllUsers);
router.put('/:id/role', verifyToken, requireRole(['superadmin']), userController.updateUserRole);

// Endpoint melengkapi profil
router.put('/profile/complete', verifyToken, userController.completeProfile);

// Endpoint update nama & password
router.put('/me/profile', verifyToken, userController.updateMyProfile);
router.put('/me/password', verifyToken, userController.updateMyPassword);

module.exports = router;
