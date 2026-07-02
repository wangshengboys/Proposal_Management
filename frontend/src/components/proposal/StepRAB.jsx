import { useMemo } from 'react';

const StepRAB = ({ data, updateData }) => {
  const addRAB = () => {
    updateData([...data, { kategori: 'Bahan Habis Pakai', item: '', harga: '', volume: '' }]);
  };

  const removeRAB = (index) => {
    const newData = data.filter((_, i) => i !== index);
    updateData(newData);
  };

  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    updateData(newData);
  };

  // Kalkulasi total otomatis
  const totalAnggaran = useMemo(() => {
    return data.reduce((acc, curr) => {
      const harga = parseFloat(curr.harga) || 0;
      const volume = parseFloat(curr.volume) || 0;
      return acc + (harga * volume);
    }, 0);
  }, [data]);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">4. Rencana Anggaran Biaya (RAB)</h2>
          <p className="text-sm text-gray-500 mt-1">Rincikan kebutuhan biaya untuk proposal penelitian/pengabdian ini.</p>
        </div>
        <button 
          onClick={addRAB}
          className="px-4 py-2 bg-blue-50 text-[#007aff] hover:bg-blue-100 rounded-lg text-sm font-semibold flex items-center gap-2 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Tambah Item RAB
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-xl mb-6">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3 w-48">Kategori</th>
              <th className="px-4 py-3">Nama Item / Kegiatan</th>
              <th className="px-4 py-3 w-32">Harga Satuan</th>
              <th className="px-4 py-3 w-24">Volume</th>
              <th className="px-4 py-3 w-36 text-right">Total</th>
              <th className="px-4 py-3 w-16 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500 italic">
                  Belum ada item anggaran. Silakan klik "Tambah Item RAB".
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const totalItem = (parseFloat(item.harga) || 0) * (parseFloat(item.volume) || 0);
                
                return (
                  <tr key={index} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <select value={item.kategori} onChange={(e) => handleChange(index, 'kategori', e.target.value)} className="w-full bg-transparent border-none outline-none focus:ring-0 cursor-pointer">
                        <option value="Bahan Habis Pakai">Bahan Habis Pakai</option>
                        <option value="Peralatan">Peralatan</option>
                        <option value="Perjalanan">Perjalanan Dinas</option>
                        <option value="Honorarium">Honorarium</option>
                        <option value="Lain-lain">Lain-lain</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input type="text" value={item.item} onChange={(e) => handleChange(index, 'item', e.target.value)} placeholder="Contoh: Kertas A4, Tiket PP" className="w-full bg-transparent border-none outline-none focus:ring-0" />
                    </td>
                    <td className="px-4 py-3">
                      <input type="number" value={item.harga} onChange={(e) => handleChange(index, 'harga', e.target.value)} placeholder="0" className="w-full bg-transparent border-none outline-none focus:ring-0" />
                    </td>
                    <td className="px-4 py-3">
                      <input type="number" value={item.volume} onChange={(e) => handleChange(index, 'volume', e.target.value)} placeholder="0" className="w-full bg-transparent border-none outline-none focus:ring-0" />
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">
                      {formatRupiah(totalItem)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => removeRAB(index)} className="text-gray-400 hover:text-red-500 transition">
                        <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="bg-[#007aff] text-white rounded-xl px-6 py-4 shadow-lg shadow-blue-500/20 flex flex-col items-end">
          <span className="text-blue-100 text-sm font-medium">Total Anggaran Diajukan</span>
          <span className="text-2xl font-bold tracking-tight">{formatRupiah(totalAnggaran)}</span>
        </div>
      </div>
    </div>
  );
};

export default StepRAB;
