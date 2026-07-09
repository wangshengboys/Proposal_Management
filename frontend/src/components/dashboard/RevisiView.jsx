import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RevisiView = () => {
  const navigate = useNavigate();
  const [selectedRevisi, setSelectedRevisi] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/proposals`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Filter only those that need revision
        const revisiList = res.data.proposals.filter(p => p.statusSaatIni.startsWith('Revisi'));
        setProposals(revisiList);
      } catch (error) {
        console.error('Failed to fetch proposals', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  if (loading) return <div className="py-10 text-center text-gray-500">Memuat data revisi...</div>;

  if (selectedRevisi) {
    // Only show notes with status 'Revisi' or 'Ditolak'
    const notes = selectedRevisi.trackingHistory.filter(t => t.note && t.note.trim() !== '');

    return (
      <div className="animate-fade-in-up">
        <button 
          onClick={() => setSelectedRevisi(null)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium mb-6 transition"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Kembali ke Daftar Revisi
        </button>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6">
           <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-start">
             <div>
               <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedRevisi.judul}</h2>
               <div className="flex items-center gap-3">
                 <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                   {selectedRevisi.statusSaatIni}
                 </span>
                 <span className="text-sm text-gray-500 font-medium">Skema: {selectedRevisi.skema}</span>
               </div>
             </div>
             <button 
               onClick={() => navigate(`/pengajuan-proposal/${selectedRevisi._id}`)}
               className="px-6 py-2.5 bg-[#007aff] hover:bg-blue-600 text-white font-medium text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
             >
               Perbaiki Proposal
             </button>
           </div>
           
           <div className="p-6">
             <h3 className="text-lg font-bold text-gray-800 mb-4">Riwayat Peninjauan & Catatan Revisi</h3>
             {notes.length === 0 ? (
                <p className="text-gray-500 italic">Tidak ada catatan yang dilampirkan oleh peninjau.</p>
             ) : (
               <div className="space-y-4">
                 {notes.map((note, idx) => (
                   <div key={idx} className={`p-4 rounded-xl border ${note.status === 'Disetujui' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                     <div className="flex justify-between items-center mb-2">
                       <span className="font-bold text-gray-800 uppercase text-xs tracking-wider">{note.role} <span className="font-medium text-gray-500 ml-2">({note.status})</span></span>
                       <span className="text-xs text-gray-500">{new Date(note.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                     </div>
                     <p className="text-sm text-gray-700 leading-relaxed">{note.note}</p>
                   </div>
                 ))}
               </div>
             )}
           </div>
        </div>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-xl font-medium text-gray-900 mb-2">Belum Ada Revisi</h3>
        <p className="text-gray-500">Saat ini tidak ada proposal Anda yang memerlukan revisi.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Revisi Proposal</h2>
        <p className="text-sm text-gray-500 mt-1">
          Daftar proposal Anda yang membutuhkan perbaikan berdasarkan tinjauan Kaprodi, Fakultas, atau LPPM.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium w-1/2">Judul Penelitian</th>
                <th className="px-6 py-4 font-medium">Tanggal Pengajuan</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((item) => (
                <tr key={item._id} className="border-b border-gray-50 hover:bg-amber-50/30 transition">
                  <td className="px-6 py-4 font-medium text-gray-800 line-clamp-2" title={item.judul}>
                    {item.judul}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(item.createdAt).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full whitespace-nowrap">
                      {item.statusSaatIni}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setSelectedRevisi(item)}
                      className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 shadow-sm transition whitespace-nowrap"
                    >
                      Lihat Catatan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevisiView;
