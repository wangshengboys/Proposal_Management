const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const proposalController = require('../controllers/proposalController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Multer setup for PDF uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.pdf';
    cb(null, `${unique}${ext}`);
  }
});

const upload = multer({ storage, fileFilter: (req, file, cb) => {
  if (!file.mimetype.includes('pdf') && path.extname(file.originalname).toLowerCase() !== '.pdf') {
    return cb(new Error('Hanya PDF yang diizinkan'));
  }
  cb(null, true);
}});

// Create proposal (dosen)
router.post('/', verifyToken, requireRole(['dosen_tetap','dosen_lb']), upload.single('dokumen'), proposalController.createProposal);

// Get proposals (role-sensitive)
router.get('/', verifyToken, proposalController.getProposals);

// Get proposal detail
router.get('/:id', verifyToken, proposalController.getProposalById);

// Update proposal (owner)
router.put('/:id', verifyToken, upload.single('dokumen'), proposalController.updateProposal);

// Review / approval (kaprodi, fakultas, lppm)
router.put('/:id/review', verifyToken, requireRole(['kaprodi','fakultas','lppm']), proposalController.reviewProposal);

module.exports = router;
