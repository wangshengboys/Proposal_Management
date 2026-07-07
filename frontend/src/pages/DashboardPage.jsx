import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserManagementView from '../components/dashboard/UserManagementView';
import PengusulView from '../components/dashboard/PengusulView';
import ProfileView from '../components/dashboard/ProfileView';
import ApprovalView from '../components/dashboard/ApprovalView';
import RevisiView from '../components/dashboard/RevisiView';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(''); 
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
        
        if (!res.data.user.is_profile_complete) {
            navigate('/complete-profile');
            return;
        }

        const userData = res.data.user;
        setUser(userData);
        
        // Determine default tab based on role
        if (userData.role === 'superadmin') {
           setActiveTab('management');
        } else if (userData.role === 'admin') {
           setActiveTab('approval');
        } else if (['kaprodi', 'fakultas', 'lppm'].includes(userData.role)) {
           setActiveTab('approval');
        } else {
           // dosen
           setActiveTab('pengusul');
        }

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

  if (!user || !activeTab) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const isApprovalRole = ['admin', 'kaprodi', 'fakultas', 'lppm'].includes(user.role);
  const isDosenRole = user.role.includes('dosen');

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600 tracking-tight">Protaseis</h1>
        </div>
        
        <div className="px-6 mb-6">
           <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
           <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{user.role.replace('_', ' ')}</div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {['superadmin', 'admin'].includes(user.role) && (
            <button 
              onClick={() => setActiveTab('management')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'management' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              Manajemen Akun
            </button>
          )}

          {isApprovalRole && (
            <button 
              onClick={() => setActiveTab('approval')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'approval' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              {user.role === 'admin' ? 'Pantau Proposal' : 'Dashboard Persetujuan'}
            </button>
          )}

          {isDosenRole && (
            <>
              <button 
                onClick={() => setActiveTab('pengusul')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'pengusul' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                Dashboard Pengusul
              </button>
              
              <button 
                onClick={() => setActiveTab('revisi')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'revisi' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                Revisi Proposal
              </button>
            </>
          )}

          <button 
            onClick={() => setActiveTab('profil')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'profil' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            Profil Anda
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-xl transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'management' && <UserManagementView user={user} />}
          {activeTab === 'approval' && <ApprovalView user={user} />}
          {activeTab === 'profil' && <ProfileView user={user} setUser={setUser} />}
          {activeTab === 'pengusul' && <PengusulView />}
          {activeTab === 'revisi' && <RevisiView />}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
