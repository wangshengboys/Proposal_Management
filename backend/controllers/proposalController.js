const Proposal = require('../models/Proposal');
const User = require('../models/User');

const parseJSONField = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    return JSON.parse(val);
  } catch (err) {
    return [];
  }
};

const calcTotalAnggaran = (rabArr) => {
  if (!Array.isArray(rabArr)) return 0;
  return rabArr.reduce((sum, it) => {
    const total = typeof it.total === 'number' ? it.total : (Number(it.harga || 0) * Number(it.volume || 0));
    return sum + (isNaN(total) ? 0 : total);
  }, 0);
};

exports.createProposal = async (req, res) => {
  try {
    const body = req.body || {};

    const anggota = parseJSONField(body.anggota);
    const mitra = parseJSONField(body.mitra);
    const rab = parseJSONField(body.rab);

    const totalAnggaran = calcTotalAnggaran(rab);

    const dokumenUrl = req.file ? `/uploads/${req.file.filename}` : body.dokumenUrl || '';

    const proposal = await Proposal.create({
      pengusul: req.user.id,
      skema: body.skema,
      judul: body.judul,
      rumpunIlmu: body.rumpunIlmu,
      abstrak: body.abstrak,
      kataKunci: body.kataKunci,
      anggota,
      mitra,
      rab,
      totalAnggaran,
      dokumenUrl,
      statusSaatIni: 'Menunggu Kaprodi'
    });

    res.status(201).json({ success: true, proposal });
  } catch (error) {
    console.error('createProposal error', error);
    res.status(500).json({ error: 'Gagal membuat proposal' });
  }
};

exports.getProposals = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const all = await Proposal.find().populate('pengusul', 'name program_studi fakultas');

    let filtered = all;

    if (['dosen_tetap', 'dosen_lb'].includes(user.role)) {
      filtered = all.filter(p => p.pengusul && String(p.pengusul._id) === String(user.id));
    } else if (user.role === 'kaprodi') {
      filtered = all.filter(p => p.pengusul && p.pengusul.program_studi === user.program_studi);
    } else if (user.role === 'fakultas') {
      filtered = all.filter(p => p.pengusul && p.pengusul.fakultas === user.fakultas && (
        p.statusSaatIni.includes('Fakultas') || p.statusSaatIni.includes('LPPM') || p.statusSaatIni === 'Disetujui LPPM' || p.statusSaatIni.includes('Menunggu Fakultas')
      ));
    } else if (['lppm', 'admin', 'superadmin'].includes(user.role)) {
      // LPPM and admin see all (admin read-only)
      filtered = all;
    } else {
      filtered = [];
    }

    res.json({ success: true, proposals: filtered });
  } catch (error) {
    console.error('getProposals error', error);
    res.status(500).json({ error: 'Gagal mengambil daftar proposal' });
  }
};

exports.getProposalById = async (req, res) => {
  try {
    const id = req.params.id;
    const proposal = await Proposal.findById(id).populate('pengusul', 'name program_studi fakultas');
    if (!proposal) return res.status(404).json({ error: 'Proposal tidak ditemukan' });

    const user = await User.findById(req.user.id);

    // Authorization checks
    if (['dosen_tetap', 'dosen_lb'].includes(user.role)) {
      if (String(proposal.pengusul._id) !== String(user.id)) return res.status(403).json({ error: 'Tidak boleh melihat proposal lain' });
    } else if (user.role === 'kaprodi') {
      if (proposal.pengusul.program_studi !== user.program_studi) return res.status(403).json({ error: 'Hanya untuk anggota program studi yang sama' });
    } else if (user.role === 'fakultas') {
      if (proposal.pengusul.fakultas !== user.fakultas) return res.status(403).json({ error: 'Hanya untuk fakultas yang sama' });
      if (!(proposal.statusSaatIni.includes('Fakultas') || proposal.statusSaatIni.includes('LPPM') || proposal.statusSaatIni === 'Menunggu Fakultas' || proposal.statusSaatIni === 'Disetujui LPPM')) {
        return res.status(403).json({ error: 'Proposal belum melewati tahap Kaprodi' });
      }
    } else if (['lppm', 'admin', 'superadmin'].includes(user.role)) {
      // allowed
    } else {
      return res.status(403).json({ error: 'Tidak memiliki akses' });
    }

    res.json({ success: true, proposal });
  } catch (error) {
    console.error('getProposalById error', error);
    res.status(500).json({ error: 'Gagal mengambil data proposal' });
  }
};

exports.updateProposal = async (req, res) => {
  try {
    const id = req.params.id;
    const proposal = await Proposal.findById(id);
    if (!proposal) return res.status(404).json({ error: 'Proposal tidak ditemukan' });

    if (String(proposal.pengusul) !== String(req.user.id)) return res.status(403).json({ error: 'Hanya pemilik yang boleh mengedit' });

    const allowedToEdit = proposal.statusSaatIni === 'Draft' || proposal.statusSaatIni.startsWith('Revisi');
    if (!allowedToEdit) return res.status(400).json({ error: 'Proposal tidak bisa diedit pada status saat ini' });

    const body = req.body || {};
    const anggota = parseJSONField(body.anggota);
    const mitra = parseJSONField(body.mitra);
    const rab = parseJSONField(body.rab);
    const totalAnggaran = calcTotalAnggaran(rab);

    if (req.file) {
      body.dokumenUrl = `/uploads/${req.file.filename}`;
    }

    proposal.skema = body.skema || proposal.skema;
    proposal.judul = body.judul || proposal.judul;
    proposal.rumpunIlmu = body.rumpunIlmu || proposal.rumpunIlmu;
    proposal.abstrak = body.abstrak || proposal.abstrak;
    proposal.kataKunci = body.kataKunci || proposal.kataKunci;
    proposal.anggota = anggota.length ? anggota : proposal.anggota;
    proposal.mitra = mitra.length ? mitra : proposal.mitra;
    proposal.rab = rab.length ? rab : proposal.rab;
    proposal.totalAnggaran = totalAnggaran || proposal.totalAnggaran;
    if (body.dokumenUrl) proposal.dokumenUrl = body.dokumenUrl;

    // Reset approval cycle
    proposal.statusSaatIni = 'Menunggu Kaprodi';

    await proposal.save();
    res.json({ success: true, proposal });
  } catch (error) {
    console.error('updateProposal error', error);
    res.status(500).json({ error: 'Gagal memperbarui proposal' });
  }
};

exports.reviewProposal = async (req, res) => {
  try {
    const id = req.params.id;
    const { action, note } = req.body; // action: approve|reject|revise
    const user = req.user;
    const proposal = await Proposal.findById(id).populate('pengusul', 'name program_studi fakultas');
    if (!proposal) return res.status(404).json({ error: 'Proposal tidak ditemukan' });

    const role = user.role; // 'kaprodi'|'fakultas'|'lppm'

    // Map role names from User.role to tracking role
    const roleMap = {
      kaprodi: 'kaprodi',
      fakultas: 'fakultas',
      lppm: 'lppm'
    };

    const currentStatus = proposal.statusSaatIni;

    // Validate reviewer can act on this stage
    if (role === 'kaprodi' && currentStatus !== 'Menunggu Kaprodi') return res.status(403).json({ error: 'Tidak ada tugas review untuk Kaprodi pada proposal ini' });
    if (role === 'fakultas' && currentStatus !== 'Menunggu Fakultas') return res.status(403).json({ error: 'Tidak ada tugas review untuk Fakultas pada proposal ini' });
    if (role === 'lppm' && currentStatus !== 'Menunggu LPPM') return res.status(403).json({ error: 'Tidak ada tugas review untuk LPPM pada proposal ini' });

    let nextStatus = currentStatus;
    let trackingStatus = '';

    if (action === 'approve') {
      trackingStatus = 'Disetujui';
      if (role === 'kaprodi') nextStatus = 'Menunggu Fakultas';
      if (role === 'fakultas') nextStatus = 'Menunggu LPPM';
      if (role === 'lppm') nextStatus = 'Disetujui LPPM';
    } else if (action === 'reject') {
      trackingStatus = 'Ditolak';
      if (role === 'kaprodi') nextStatus = 'Ditolak Kaprodi';
      if (role === 'fakultas') nextStatus = 'Ditolak Fakultas';
      if (role === 'lppm') nextStatus = 'Ditolak LPPM';
    } else if (action === 'revise' || action === 'revision' || action === 'revisi') {
      trackingStatus = 'Revisi';
      if (role === 'kaprodi') nextStatus = 'Revisi Kaprodi';
      if (role === 'fakultas') nextStatus = 'Revisi Fakultas';
      if (role === 'lppm') nextStatus = 'Revisi LPPM';
    } else {
      return res.status(400).json({ error: 'Aksi tidak dikenal' });
    }

    // Append tracking
    proposal.trackingHistory.push({
      role: roleMap[role] || role,
      status: trackingStatus,
      note: note || '',
      reviewerId: user.id
    });

    proposal.statusSaatIni = nextStatus;
    await proposal.save();

    res.json({ success: true, proposal });
  } catch (error) {
    console.error('reviewProposal error', error);
    res.status(500).json({ error: 'Gagal melakukan review' });
  }
};
