import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RevisiView = () => {
  const navigate = useNavigate();
  const [selectedRevisi, setSelectedRevisi] = useState(null);

  const dummyRevisi = [
    { 
      id: 'PRP-2026-015', 
      title: 'Pengembangan Aplikasi Mobile untuk Pemasaran Produk UMKM Lokal',
      status: 'Revisi Kaprodi',
      date: '06 Jul 2026',
      notes: [
        { role: 'Kaprodi', note: 'Mohon sesuaikan format RAB dengan standar fakultas terbaru. Hindari pembelian hardware yang tidak berkaitan langsung dengan software.', date: '07 Jul 2026, 10:15' }
      ]
    },
    { 
      id: 'PRP-2026-022', 
      title: 'Penerapan Algoritma Deep Learning pada Klasifikasi Kualitas Biji Kopi',
      status: 'Revisi Fakultas',
      date: '01 Jul 2026',
      notes: [
        { role: 'Kaprodi', note: 'Usulan sudah bagus, setuju.', date: '02 Jul 2026, 09:00' },
        { role: 'Fakultas', note: 'Tolong tambahkan mitra industri yang relevan agar luaran penelitian lebih aplikatif. RAB bagian honorarium asisten terlalu besar.', date: '04 Jul 2026, 14:30' }
      ]
    }
  ];

  if (selectedRevisi) {
    return (
      <div className="animate-fade-in-up">
        <button 
          onClick={() => setSelectedRevisi(null)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium mb-6 transition"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Kembali ke Daftar Revisi
        </button>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6">
           <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-start">
             <div>
               <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedRevisi.title}</h2>
               <div className="flex items-center gap-3">
                 <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                   {selectedRevisi.status}
                 </span>
                 <span className="text-sm text-gray-500 font-medium">ID: {selectedRevisi.id}</span>
               </div>
             </div>
             <button 
               onClick={() => navigate('/pengajuan-proposal')}
               className="px-6 py-2.5 bg-[#007aff] hover:bg-blue-600 text-white font-medium text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
             >
               Perbaiki Proposal
             </button>
           </div>
           
           <div className="p-6">
             <h3 className="text-lg font-bold text-gray-800 mb-4">Catatan Revisi</h3>
             <div className="space-y-4">
               {selectedRevisi.notes.map((note, idx) => (
                 <div key={idx} className={`p-4 rounded-xl border ${note.note.includes('setuju') || note.note.includes('bagus') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                   <div className="flex justify-between items-center mb-2">
                     <span className="font-bold text-gray-800">{note.role}</span>
                     <span className="text-xs text-gray-500">{note.date}</span>
                   </div>
                   <p className="text-sm text-gray-700 leading-relaxed">{note.note}</p>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Revisi Proposal</h2>
        <p className="text-sm text-gray-500 mt-1">
          Daftar proposal Anda yang membutuhkan perbaikan berdasarkan tinjauan Kaprodi, Fakultas, atau LPPM.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium">ID Proposal</th>
                <th className="px-6 py-4 font-medium w-1/2">Judul Penelitian</th>
                <th className="px-6 py-4 font-medium">Tanggal Pengajuan</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dummyRevisi.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-amber-50/30 transition">
                  <td className="px-6 py-4 font-medium text-blue-600">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800 line-clamp-2" title={item.title}>
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{item.date}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full whitespace-nowrap">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setSelectedRevisi(item)}
                      className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 shadow-sm transition whitespace-nowrap"
                    >
                      Lihat Catatan
                    </button>
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

export default RevisiView;
