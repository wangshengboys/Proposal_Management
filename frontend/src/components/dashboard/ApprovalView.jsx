import { useState, useEffect } from 'react';
import axios from 'axios';
import ProposalReviewView from './ProposalReviewView';

const ApprovalView = ({ user }) => {
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProposals = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/proposals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProposals(res.data.proposals);
    } catch (error) {
      console.error('Failed to fetch proposals', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleBackFromReview = () => {
    setSelectedProposal(null);
    fetchProposals(); // refresh data after review
  };

  if (selectedProposal) {
    return <ProposalReviewView proposal={selectedProposal} user={user} onBack={handleBackFromReview} />;
  }

  // Calculate dynamic stats
  const rolePrefix = user.role === 'kaprodi' ? 'Kaprodi' : user.role === 'fakultas' ? 'Fakultas' : 'LPPM';
  const filteredProposals = proposals.filter(p => p.judul.toLowerCase().includes(search.toLowerCase()) || (p.pengusul && p.pengusul.name.toLowerCase().includes(search.toLowerCase())));
  
  const totalMenunggu = proposals.filter(p => p.statusSaatIni === `Menunggu ${rolePrefix}`).length;
  const totalDisetujui = proposals.filter(p => p.statusSaatIni === 'Disetujui LPPM' || p.trackingHistory.some(t => t.role.toLowerCase() === rolePrefix.toLowerCase() && t.status === 'Disetujui')).length;
  const totalRevisi = proposals.filter(p => p.statusSaatIni === `Revisi ${rolePrefix}`).length;
  const totalDitolak = proposals.filter(p => p.statusSaatIni === `Ditolak ${rolePrefix}`).length;

  const stats = [
    { label: 'Antrean Anda', count: totalMenunggu, color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
    { label: 'Disetujui', count: totalDisetujui, color: 'bg-green-50 text-green-600 border-green-200' },
    { label: 'Perlu Revisi', count: totalRevisi, color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { label: 'Ditolak', count: totalDitolak, color: 'bg-red-50 text-red-600 border-red-200' }
  ];

  if (loading) return <div className="py-10 text-center text-gray-500">Memuat antrean...</div>;

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
          <h3 className="text-lg font-bold text-gray-800">Daftar Proposal</h3>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Cari judul / pengusul..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none w-64" 
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium w-1/3">Judul Penelitian</th>
                <th className="px-6 py-4 font-medium">Pengusul</th>
                <th className="px-6 py-4 font-medium">Tanggal Masuk</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProposals.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Tidak ada proposal yang sesuai pencarian.</td>
                </tr>
              ) : filteredProposals.map((item) => (
                <tr key={item._id} className="border-b border-gray-50 hover:bg-blue-50/30 transition">
                  <td className="px-6 py-4 font-medium text-gray-800 line-clamp-2" title={item.judul}>
                    {item.judul}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{item.pengusul ? item.pengusul.name : 'Unknown'}</div>
                    <div className="text-xs text-gray-500">{item.pengusul ? item.pengusul.program_studi : ''}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(item.createdAt).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap 
                      ${item.statusSaatIni.includes('Menunggu') ? 'bg-yellow-100 text-yellow-700' : 
                        item.statusSaatIni.startsWith('Revisi') ? 'bg-blue-100 text-blue-700' : 
                        item.statusSaatIni.startsWith('Ditolak') ? 'bg-red-100 text-red-700' : 
                        'bg-green-100 text-green-700'}`}>
                      {item.statusSaatIni}
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
          Menampilkan {filteredProposals.length} proposal.
        </div>
      </div>
    </div>
  );
};

export default ApprovalView;
