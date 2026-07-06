import { useNavigate } from 'react-router-dom';

const PengusulView = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
          <h3 className="text-sm font-medium text-blue-800 mb-1">Total Pengajuan</h3>
          <p className="text-3xl font-bold text-blue-900">0</p>
        </div>
        <div className="bg-green-50/50 border border-green-100 rounded-2xl p-6">
          <h3 className="text-sm font-medium text-green-800 mb-1">Proposal Disetujui</h3>
          <p className="text-3xl font-bold text-green-900">0</p>
        </div>
        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6">
          <h3 className="text-sm font-medium text-amber-800 mb-1">Menunggu Revisi</h3>
          <p className="text-3xl font-bold text-amber-900">0</p>
        </div>
      </div>

      <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Proposal</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">Anda belum pernah mengajukan proposal penelitian atau pengabdian. Klik tombol di bawah untuk mulai mengisi form pengajuan baru.</p>
        <button 
          onClick={() => navigate('/pengajuan-proposal')}
          className="px-8 py-3 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
        >
          + Buat Proposal Baru
        </button>
      </div>
    </>
  );
};

export default PengusulView;
