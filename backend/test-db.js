const mongoose = require('mongoose');
const User = require('./models/User');
const Proposal = require('./models/Proposal');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const users = await User.find({ role: 'kaprodi' });
  console.log('Kaprodi users:', users.map(u => ({ name: u.name, prodi: u.program_studi, fakultas: u.fakultas })));

  const proposals = await Proposal.find().populate('pengusul', 'name program_studi fakultas');
  console.log('Proposals:', proposals.map(p => ({
    id: p._id,
    judul: p.judul,
    pengusul: p.pengusul ? p.pengusul.name : 'null',
    pengusul_prodi: p.pengusul ? p.pengusul.program_studi : 'null',
    status: p.statusSaatIni
  })));

  process.exit(0);
}

check();
