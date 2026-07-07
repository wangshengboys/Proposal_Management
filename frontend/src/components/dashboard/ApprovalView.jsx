import { useState } from 'react';
import ProposalReviewView from './ProposalReviewView';

const ApprovalView = ({ user }) => {
  const [selectedProposal, setSelectedProposal] = useState(null);

  // Mock data for UI presentation
  const stats = [
    { label: 'Menunggu Persetujuan', count: 12, color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
    { label: 'Sudah Disetujui', count: 45, color: 'bg-green-50 text-green-600 border-green-200' },
    { label: 'Perlu Revisi', count: 8, color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { label: 'Ditolak', count: 2, color: 'bg-red-50 text-red-600 border-red-200' }
  ];

  const dummyProposals = [
    { id: 'PRP-2026-001', title: 'Pengembangan Sistem AI untuk Deteksi Dini Kebakaran Hutan Berbasis IoT', pengusul: 'Dr. Budi Santoso', prodi: 'Teknik Informatika', status: 'Menunggu', date: '05 Jul 2026' },
    { id: 'PRP-2026-002', title: 'Analisis Sentimen Masyarakat Terhadap Kebijakan Kendaraan Listrik', pengusul: 'Siti Aminah, M.Kom.', prodi: 'DKV', status: 'Menunggu', date: '04 Jul 2026' },
    { id: 'PRP-2026-003', title: 'Rancang Bangun Jembatan Tahan Gempa Menggunakan Material Komposit', pengusul: 'Ir. Hendra Gunawan', prodi: 'Teknik Sipil', status: 'Menunggu', date: '03 Jul 2026' },
    { id: 'PRP-2026-004', title: 'Evaluasi Kinerja Keuangan UMKM Pasca Pandemi', pengusul: 'Dra. Ratna Megawati', prodi: 'Akuntansi', status: 'Menunggu', date: '02 Jul 2026' },
  ];

  if (selectedProposal) {
    return <ProposalReviewView proposal={selectedProposal} user={user} onBack={() => setSelectedProposal(null)} />;
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {user.role === 'admin' ? 'Pantau Aktivitas Proposal' : 'Dashboard Approval'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Selamat datang di panel {user.role === 'admin' ? 'pemantauan' : 'persetujuan'}. Anda bertindak sebagai <span className="font-semibold text-blue-600 uppercase">{user.role.replace('_', ' ')}</span>.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-center items-center text-center ${stat.color} transition-transform hover:scale-105 cursor-pointer`}>
            <div className="text-3xl font-bold mb-1">{stat.count}</div>
            <div className="text-sm font-medium opacity-80">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Daftar Antrean Proposal</h3>
          <div className="relative">
            <input type="text" placeholder="Cari judul / pengusul..." className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none w-64" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium">ID Proposal</th>
                <th className="px-6 py-4 font-medium w-1/3">Judul Penelitian</th>
                <th className="px-6 py-4 font-medium">Pengusul</th>
                <th className="px-6 py-4 font-medium">Tanggal Masuk</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dummyProposals.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-blue-50/30 transition">
                  <td className="px-6 py-4 font-medium text-blue-600">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800 line-clamp-2" title={item.title}>
                    {item.title}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{item.pengusul}</div>
                    <div className="text-xs text-gray-500">{item.prodi}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{item.date}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setSelectedProposal(item)}
                      className="px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 shadow-sm transition"
                    >
                      {user.role === 'admin' ? 'Detail' : 'Review'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 text-center text-sm text-gray-500 bg-gray-50">
          Menampilkan 4 dari 12 antrean proposal.
        </div>
      </div>
    </div>
  );
};

export default ApprovalView;
