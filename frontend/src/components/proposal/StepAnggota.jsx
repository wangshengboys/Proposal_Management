const StepAnggota = ({ data, updateData }) => {
  const addAnggota = () => {
    updateData([...data, { nama: '', identifier: '', peran: 'Anggota Peneliti', institusi: '' }]);
  };

  const removeAnggota = (index) => {
    const newData = data.filter((_, i) => i !== index);
    updateData(newData);
  };

  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    updateData(newData);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">2. Susunan Anggota Tim</h2>
          <p className="text-sm text-gray-500 mt-1">Ketua pengusul otomatis diambil dari akun Anda. Tambahkan anggota peneliti di bawah ini.</p>
        </div>
        <button 
          onClick={addAnggota}
          className="px-4 py-2 bg-blue-50 text-[#007aff] hover:bg-blue-100 rounded-lg text-sm font-semibold flex items-center gap-2 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Tambah Anggota
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada anggota tambahan</h3>
          <p className="mt-1 text-sm text-gray-500">Penelitian mandiri? Anda bisa lanjut ke tahap berikutnya.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((anggota, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative group transition hover:border-blue-300">
              <button 
                onClick={() => removeAnggota(index)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-full p-1.5 transition opacity-0 group-hover:opacity-100"
                title="Hapus Anggota"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nama Lengkap</label>
                  <input type="text" value={anggota.nama} onChange={(e) => handleChange(index, 'nama', e.target.value)} placeholder="Contoh: Budi Santoso" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#007aff] outline-none text-sm transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">NIDN / NIK / NIM</label>
                  <input type="text" value={anggota.identifier} onChange={(e) => handleChange(index, 'identifier', e.target.value)} placeholder="Nomor Induk" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#007aff] outline-none text-sm transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Institusi / Fakultas</label>
                  <input type="text" value={anggota.institusi} onChange={(e) => handleChange(index, 'institusi', e.target.value)} placeholder="Nama Fakultas/Kampus" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#007aff] outline-none text-sm transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Peran dalam Tim</label>
                  <select value={anggota.peran} onChange={(e) => handleChange(index, 'peran', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#007aff] outline-none text-sm transition">
                    <option value="Anggota Peneliti">Anggota Peneliti (Dosen)</option>
                    <option value="Asisten Peneliti">Asisten Peneliti (Mahasiswa)</option>
                    <option value="Tenaga Ahli">Tenaga Ahli</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepAnggota;
