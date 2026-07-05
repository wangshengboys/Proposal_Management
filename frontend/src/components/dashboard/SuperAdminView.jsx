import { useState, useEffect } from 'react';
import axios from 'axios';

const ROLES = [
  { value: 'superadmin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin Unit' },
  { value: 'dosen_tetap', label: 'Dosen Tetap' },
  { value: 'dosen_lb', label: 'Dosen Luar Biasa' },
  { value: 'kaprodi', label: 'Kaprodi' },
  { value: 'fakultas', label: 'Fakultas' },
  { value: 'lppm', label: 'LPPM' }
];

const SuperAdminView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Gagal mengambil data pengguna');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update state lokal agar UI langsung berubah
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      
      alert('Role berhasil diperbarui!');
    } catch (err) {
      console.error(err);
      alert('Gagal memperbarui role');
    }
  };

  if (loading) return <div className="py-12 text-center text-gray-500">Memuat data pengguna...</div>;
  if (error) return <div className="py-12 text-center text-red-500">{error}</div>;

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Pengguna (Super Admin)</h2>
        <p className="text-sm text-gray-500">Kelola akses dan role seluruh pengguna di dalam sistem.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Nama Pengguna</th>
                <th className="px-6 py-4">Email (Google)</th>
                <th className="px-6 py-4">Bergabung Pada</th>
                <th className="px-6 py-4 w-48 text-right">Ubah Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="bg-white border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {u.name.charAt(0)}
                    </div>
                    {u.name}
                  </td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#007aff] focus:border-[#007aff] block w-full p-2.5 outline-none transition cursor-pointer font-medium"
                      style={{
                        backgroundColor: u.role === 'superadmin' ? '#fee2e2' : 
                                         u.role.includes('dosen') ? '#e0f2fe' : '#fef3c7'
                      }}
                    >
                      {ROLES.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
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

export default SuperAdminView;
