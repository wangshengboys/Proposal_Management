const StepIdentitas = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ ...data, [name]: value });
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">1. Identitas Usulan</h2>
      
      <div className="space-y-6">
        {/* Skema */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Skema Pengajuan</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${data.skema === 'Penelitian' ? 'border-[#007aff] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input type="radio" name="skema" value="Penelitian" checked={data.skema === 'Penelitian'} onChange={handleChange} className="w-5 h-5 text-[#007aff] focus:ring-[#007aff]" />
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">Penelitian</span>
                <span className="text-xs text-gray-500">Hibah penelitian fundamental & terapan</span>
              </div>
            </label>
            <label className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${data.skema === 'Pengabdian' ? 'border-green-500 bg-green-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input type="radio" name="skema" value="Pengabdian" checked={data.skema === 'Pengabdian'} onChange={handleChange} className="w-5 h-5 text-green-500 focus:ring-green-500" />
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">Pengabdian Masyarakat</span>
                <span className="text-xs text-gray-500">Hibah PKM dan pemberdayaan</span>
              </div>
            </label>
          </div>
        </div>

        {/* Judul */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Judul Proposal</label>
          <textarea
            name="judul"
            value={data.judul}
            onChange={handleChange}
            rows={2}
            placeholder="Masukkan judul lengkap proposal Anda..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#007aff] focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
          ></textarea>
        </div>

        {/* Rumpun Ilmu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rumpun Ilmu</label>
          <select
            name="rumpunIlmu"
            value={data.rumpunIlmu}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#007aff] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          >
            <option value="">-- Pilih Rumpun Ilmu --</option>
            <option value="Sains & Teknologi">Sains & Teknologi</option>
            <option value="Sosial Humaniora">Sosial Humaniora</option>
            <option value="Kesehatan">Kesehatan</option>
            <option value="Agrokompleks">Agrokompleks</option>
          </select>
        </div>

        {/* Abstrak */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Abstrak Singkat</label>
          <textarea
            name="abstrak"
            value={data.abstrak}
            onChange={handleChange}
            rows={4}
            placeholder="Tuliskan ringkasan latar belakang, tujuan, dan luaran yang diharapkan..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#007aff] focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
          ></textarea>
          <p className="text-xs text-gray-400 mt-2 text-right">Maksimal 500 kata.</p>
        </div>

        {/* Kata Kunci */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kata Kunci (Keywords)</label>
          <input
            type="text"
            name="kataKunci"
            value={data.kataKunci}
            onChange={handleChange}
            placeholder="Pisahkan dengan koma (contoh: AI, Machine Learning, Pendidikan)"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#007aff] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default StepIdentitas;
