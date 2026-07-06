import { useState } from 'react';
import axios from 'axios';

const ProfileView = ({ user, setUser }) => {
  const [name, setName] = useState(user.name);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loadingName, setLoadingName] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setLoadingName(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/me/profile`, { name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        alert(res.data.message);
        localStorage.setItem('token', res.data.token);
        setUser({ ...user, name });
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Gagal mengubah nama');
    } finally {
      setLoadingName(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoadingPass(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/me/password`, { oldPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        alert(res.data.message);
        setOldPassword('');
        setNewPassword('');
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Gagal mengubah password');
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Informasi Akun</h3>
        <form onSubmit={handleUpdateName} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (Tidak bisa diubah)</label>
            <input type="email" value={user.email} disabled className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all text-sm" />
          </div>
          <button type="submit" disabled={loadingName} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm text-sm transition-all disabled:opacity-70">
            {loadingName ? 'Menyimpan...' : 'Simpan Nama'}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Keamanan</h3>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all text-sm" />
          </div>
          <button type="submit" disabled={loadingPass} className="px-6 py-2 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg shadow-sm text-sm transition-all disabled:opacity-70">
            {loadingPass ? 'Menyimpan...' : 'Ganti Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileView;
