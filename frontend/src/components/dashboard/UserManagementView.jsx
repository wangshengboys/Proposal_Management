import { useState, useEffect } from 'react';
import axios from 'axios';

const ROLES = [
  { value: 'admin', label: 'Admin Unit' },
  { value: 'kaprodi', label: 'Kaprodi' },
  { value: 'fakultas', label: 'Fakultas' },
  { value: 'lppm', label: 'LPPM' }
];

const SEMUA_FAKULTAS = ["Fakultas Rekayasa", "Fakultas Bisnis", "Fakultas Teknik"];
const SEMUA_PRODI = ["DKV", "Teknik Informatika", "Manajemen", "Akuntansi", "Teknik Sipil", "Teknik Mesin"];

const UserManagementView = ({ user: currentUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'kaprodi', program_studi: '', fakultas: '' });
  const [creatingUser, setCreatingUser] = useState(false);

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

  // Filter available options based on existing users
  const existingKaprodi = users.filter(u => u.role === 'kaprodi').map(u => u.program_studi);
  const availableProdi = SEMUA_PRODI.filter(p => !existingKaprodi.includes(p));

  const existingFakultas = users.filter(u => u.role === 'fakultas').map(u => u.fakultas);
  const availableFakultas = SEMUA_FAKULTAS.filter(f => !existingFakultas.includes(f));

  const isLppmExists = users.some(u => u.role === 'lppm');

  // Filter available roles in form based on current user role AND availability
  let availableRolesForCreation = currentUser.role === 'admin'
    ? ROLES.filter(r => r.value !== 'admin')
    : ROLES;

  if (isLppmExists) {
    availableRolesForCreation = availableRolesForCreation.filter(r => r.value !== 'lppm');
  }
  if (availableProdi.length === 0) {
    availableRolesForCreation = availableRolesForCreation.filter(r => r.value !== 'kaprodi');
  }
  if (availableFakultas.length === 0) {
    availableRolesForCreation = availableRolesForCreation.filter(r => r.value !== 'fakultas');
  }

  // Update default role selection if the current one becomes unavailable
  useEffect(() => {
    if (availableRolesForCreation.length > 0 && !availableRolesForCreation.find(r => r.value === newUser.role)) {
      setNewUser(prev => ({ ...prev, role: availableRolesForCreation[0].value }));
    }
  }, [availableRolesForCreation, newUser.role]);

  // Set default prodi/fakultas value
  useEffect(() => {
    if (newUser.role === 'kaprodi' && availableProdi.length > 0 && !newUser.program_studi) {
      setNewUser(prev => ({ ...prev, program_studi: availableProdi[0] }));
    } else if (newUser.role === 'fakultas' && availableFakultas.length > 0 && !newUser.fakultas) {
      setNewUser(prev => ({ ...prev, fakultas: availableFakultas[0] }));
    }
  }, [newUser.role, availableProdi, availableFakultas, newUser.program_studi, newUser.fakultas]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreatingUser(true);
    try {
      const token = localStorage.getItem('token');
      const payload = { ...newUser };

      // Clean up payload based on role
      if (payload.role !== 'kaprodi') delete payload.program_studi;
      if (payload.role !== 'fakultas') delete payload.fakultas;

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/managed`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        alert(res.data.message);
        setNewUser({ name: '', email: '', password: '', role: availableRolesForCreation[0]?.value || 'kaprodi', program_studi: '', fakultas: '' });
        setShowAddForm(false);
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal membuat pengguna');
    } finally {
      setCreatingUser(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus akun ${userName}?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Akun berhasil dihapus');
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal menghapus akun');
    }
  };

  if (loading) return <div className="py-12 text-center text-gray-500">Memuat data pengguna...</div>;
  if (error) return <div className="py-12 text-center text-red-500">{error}</div>;

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h2>
          <p className="text-sm text-gray-500">Kelola akun dan akses di dalam sistem.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={availableRolesForCreation.length === 0}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${availableRolesForCreation.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          {showAddForm ? 'Tutup Form' : availableRolesForCreation.length === 0 ? 'Semua Posisi Penuh' : '+ Tambah Pengguna Baru'}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl">
          <h3 className="text-lg font-bold text-blue-900 mb-4 border-b border-blue-200 pb-2">Buat Akun Approval / Admin</h3>
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">Nama / Instansi</label>
              <input type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm" placeholder="Contoh: Admin" />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">Email</label>
              <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm" placeholder="email@contoh.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">Password Lokal</label>
              <input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm" placeholder="Password" />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">Pilih Role</label>
              <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm cursor-pointer">
                {availableRolesForCreation.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {newUser.role === 'kaprodi' && (
              <div className="lg:col-span-4">
                <label className="block text-sm font-medium text-blue-800 mb-1">Pilih Program Studi</label>
                <select value={newUser.program_studi} onChange={(e) => setNewUser({ ...newUser, program_studi: e.target.value })} className="w-full md:w-1/4 px-4 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm cursor-pointer">
                  {availableProdi.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            )}

            {newUser.role === 'fakultas' && (
              <div className="lg:col-span-4">
                <label className="block text-sm font-medium text-blue-800 mb-1">Pilih Fakultas</label>
                <select value={newUser.fakultas} onChange={(e) => setNewUser({ ...newUser, fakultas: e.target.value })} className="w-full md:w-1/4 px-4 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm cursor-pointer">
                  {availableFakultas.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="lg:col-span-4 flex justify-end mt-2">
              <button type="submit" disabled={creatingUser || availableRolesForCreation.length === 0} className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-70">
                {creatingUser ? 'Menyimpan...' : 'Buat Akun'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Nama Pengguna</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role Saat Ini</th>
                <th className="px-6 py-4 w-32 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="bg-white border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      {u.name}
                      {(u.role === 'kaprodi' && u.program_studi) && <div className="text-xs text-gray-500 mt-0.5">{u.program_studi}</div>}
                      {(u.role === 'fakultas' && u.fakultas) && <div className="text-xs text-gray-500 mt-0.5">{u.fakultas}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block whitespace-nowrap
                        ${u.role === 'superadmin' ? 'bg-red-100 text-red-700' :
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          u.role.includes('dosen') ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-800'}`}>
                      {(() => {
                        if (u.role === 'kaprodi') {
                          switch (u.program_studi) {
                            case 'Teknik Informatika': return 'KAPRODI TI';
                            case 'DKV': return 'KAPRODI DKV';
                            case 'Manajemen': return 'KAPRODI MNJ';
                            case 'Akuntansi': return 'KAPRODI AK';
                            case 'Teknik Sipil': return 'KAPRODI TS';
                            case 'Teknik Mesin': return 'KAPRODI TM';
                            default: return 'KAPRODI';
                          }
                        }
                        if (u.role === 'fakultas') {
                          return `FAKULTAS ${u.fakultas ? u.fakultas.replace('Fakultas ', '').toUpperCase() : ''}`;
                        }
                        return u.role.replace('_', ' ').toUpperCase();
                      })()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* Admin tak bisa menghapus superadmin, dan pengguna tidak bisa menghapus dirinya sendiri */}
                    {(u._id !== currentUser._id) && !(currentUser.role === 'admin' && u.role === 'superadmin') && (
                      <button
                        onClick={() => handleDeleteUser(u._id, u.name)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                        title="Hapus Pengguna"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
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

export default UserManagementView;
