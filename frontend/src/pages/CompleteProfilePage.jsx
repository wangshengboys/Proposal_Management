import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const FAKULTAS_PRODI_MAP = {
  "Fakultas Rekayasa": ["DKV", "Teknik Informatika"],
  "Fakultas Bisnis": ["Manajemen", "Akuntansi"],
  "Fakultas Teknik": ["Teknik Sipil", "Teknik Mesin"]
};

const ALL_PRODIS = Object.values(FAKULTAS_PRODI_MAP).flat();

const getFakultasByProdi = (prodi) => {
  for (const [fakultas, prodis] of Object.entries(FAKULTAS_PRODI_MAP)) {
    if (prodis.includes(prodi)) return fakultas;
  }
  return "";
};

const CompleteProfilePage = () => {
  const [formData, setFormData] = useState({
    nidn: '',
    program_studi: '',
    fakultas: '',
    jabatan_fungsional: '',
    no_hp: '',
    jenis_dosen: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    const decoded = jwtDecode(token);
    if (decoded.is_profile_complete) {
      navigate('/dashboard'); 
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "fakultas") {
      // Jika Fakultas diganti, cek apakah prodi saat ini valid untuk fakultas baru
      const allowedProdis = FAKULTAS_PRODI_MAP[value] || [];
      if (value !== "" && !allowedProdis.includes(formData.program_studi)) {
        // Jika tidak valid, kosongkan prodi
        setFormData({ ...formData, fakultas: value, program_studi: "" });
      } else {
        setFormData({ ...formData, fakultas: value });
      }
    } else if (name === "program_studi") {
      // Jika Prodi dipilih, auto-fill Fakultas
      const autoFakultas = getFakultasByProdi(value);
      if (value !== "") {
        setFormData({ ...formData, program_studi: value, fakultas: autoFakultas });
      } else {
        setFormData({ ...formData, program_studi: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/profile/complete`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        alert('Profil berhasil disimpan!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan profil');
    } finally {
      setLoading(false);
    }
  };

  const availableProdis = formData.fakultas ? FAKULTAS_PRODI_MAP[formData.fakultas] : ALL_PRODIS;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Lengkapi Profil Anda</h2>
          <p className="text-gray-500">Sebelum memulai, Anda wajib melengkapi data diri Anda terlebih dahulu.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">NIDN</label>
              <input type="text" name="nidn" value={formData.nidn} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm" placeholder="Contoh: 0012345678" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Dosen</label>
              <select name="jenis_dosen" value={formData.jenis_dosen} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm">
                <option value="">Pilih Jenis</option>
                <option value="Dosen Tetap">Dosen Tetap</option>
                <option value="Dosen Luar Biasa">Dosen Luar Biasa</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fakultas</label>
              <select name="fakultas" value={formData.fakultas} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm">
                <option value="">Pilih Fakultas</option>
                {Object.keys(FAKULTAS_PRODI_MAP).map(fakultas => (
                  <option key={fakultas} value={fakultas}>{fakultas}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Program Studi</label>
              <select name="program_studi" value={formData.program_studi} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm">
                <option value="">Pilih Program Studi</option>
                {availableProdis.map(prodi => (
                  <option key={prodi} value={prodi}>{prodi}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jabatan Fungsional <span className="text-gray-400 font-normal">(Opsional)</span></label>
              <input type="text" name="jabatan_fungsional" value={formData.jabatan_fungsional} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm" placeholder="Contoh: Lektor" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No. HP <span className="text-gray-400 font-normal">(Opsional)</span></label>
              <input type="text" name="no_hp" value={formData.no_hp} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm" placeholder="Contoh: 08123456789" />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-1">Buat Password Lokal (Opsional)</h3>
            <p className="text-xs text-gray-500 mb-4">Jika Anda login via Google dan ingin bisa login manual menggunakan email, silakan buat password di sini.</p>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm" placeholder="Masukkan password baru..." />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all text-sm disabled:opacity-70"
          >
            {loading ? 'Menyimpan...' : 'Simpan Profil & Lanjutkan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
