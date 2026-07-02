const StepMitra = ({ data, updateData }) => {
  const addMitra = () => {
    updateData([...data, { namaMitra: '', pic: '', email: '', kontribusiDana: '' }]);
  };

  const removeMitra = (index) => {
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
          <h2 className="text-2xl font-bold text-gray-800">3. Mitra Kerjasama</h2>
          <p className="text-sm text-gray-500 mt-1">Tambahkan institusi mitra jika penelitian/pengabdian Anda melibatkan pihak luar (opsional).</p>
        </div>
        <button 
          onClick={addMitra}
          className="px-4 py-2 bg-blue-50 text-[#007aff] hover:bg-blue-100 rounded-lg text-sm font-semibold flex items-center gap-2 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Tambah Mitra
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada institusi mitra</h3>
          <p className="mt-1 text-sm text-gray-500">Jika tidak ada mitra, Anda bisa langsung lanjut ke bagian Rencana Anggaran.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((mitra, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative group transition hover:border-blue-300">
              <button 
                onClick={() => removeMitra(index)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-full p-1.5 transition opacity-0 group-hover:opacity-100"
                title="Hapus Mitra"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nama Institusi Mitra</label>
                  <input type="text" value={mitra.namaMitra} onChange={(e) => handleChange(index, 'namaMitra', e.target.value)} placeholder="Contoh: PT. Inovasi Bangsa" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#007aff] outline-none text-sm transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nama PIC (Penanggung Jawab)</label>
                  <input type="text" value={mitra.pic} onChange={(e) => handleChange(index, 'pic', e.target.value)} placeholder="Contoh: Bapak Ahmad" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#007aff] outline-none text-sm transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email / Kontak</label>
                  <input type="email" value={mitra.email} onChange={(e) => handleChange(index, 'email', e.target.value)} placeholder="email@mitra.com" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#007aff] outline-none text-sm transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Rencana Kontribusi Dana (Rp)</label>
                  <input type="number" value={mitra.kontribusiDana} onChange={(e) => handleChange(index, 'kontribusiDana', e.target.value)} placeholder="Contoh: 15000000" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#007aff] outline-none text-sm transition" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepMitra;
