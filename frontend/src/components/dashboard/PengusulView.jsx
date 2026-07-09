import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PengusulView = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchProposals();
  }, []);

  const totalPengajuan = proposals.length;
  const totalDisetujui = proposals.filter(p => p.statusSaatIni === 'Disetujui LPPM').length;
  const totalRevisi = proposals.filter(p => p.statusSaatIni.startsWith('Revisi')).length;

  if (loading) return <div className="py-10 text-center text-gray-500">Memuat data...</div>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
          <h3 className="text-sm font-medium text-blue-800 mb-1">Total Pengajuan</h3>
          <p className="text-3xl font-bold text-blue-900">{totalPengajuan}</p>
        </div>
        <div className="bg-green-50/50 border border-green-100 rounded-2xl p-6">
          <h3 className="text-sm font-medium text-green-800 mb-1">Proposal Disetujui (Final)</h3>
          <p className="text-3xl font-bold text-green-900">{totalDisetujui}</p>
        </div>
        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6">
          <h3 className="text-sm font-medium text-amber-800 mb-1">Menunggu Revisi</h3>
          <p className="text-3xl font-bold text-amber-900">{totalRevisi}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Daftar Proposal Anda</h3>
        <button 
          onClick={() => navigate('/pengajuan-proposal')}
          className="px-6 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl font-medium shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 text-sm"
        >
          + Buat Proposal Baru
        </button>
      </div>

      {proposals.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Proposal</h3>
          <p className="text-gray-500 max-w-md mx-auto">Anda belum pernah mengajukan proposal penelitian atau pengabdian.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Judul Penelitian</th>
                  <th className="px-6 py-4 font-medium">Skema</th>
                  <th className="px-6 py-4 font-medium">Tanggal Pengajuan</th>
                  <th className="px-6 py-4 font-medium">Status Saat Ini</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((item) => (
                  <tr key={item._id} className="border-b border-gray-50 hover:bg-blue-50/30 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {item.judul}
                    </td>
                    <td className="px-6 py-4">{item.skema}</td>
                    <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap 
                        ${item.statusSaatIni.startsWith('Revisi') ? 'bg-amber-100 text-amber-700' : 
                          item.statusSaatIni.startsWith('Ditolak') ? 'bg-red-100 text-red-700' : 
                          item.statusSaatIni === 'Disetujui LPPM' ? 'bg-green-100 text-green-700' : 
                          'bg-blue-100 text-blue-700'}`}>
                        {item.statusSaatIni}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default PengusulView;
