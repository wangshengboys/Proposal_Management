import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SuperAdminView from '../components/dashboard/SuperAdminView';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(res.data.user);
      } catch (error) {
        console.error('Gagal mengambil data user', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-8 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user.role === 'superadmin' ? 'Dashboard Super Admin' : 'Dashboard Pengusul'}
            </h1>
            <p className="text-gray-500">
              Selamat datang, <strong>{user.name}</strong>! 
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 uppercase tracking-wider">
                {user.role.replace('_', ' ')}
              </span>
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-xl transition"
          >
            Logout
          </button>
        </div>
        {user.role === 'superadmin' ? (
          <SuperAdminView />
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
