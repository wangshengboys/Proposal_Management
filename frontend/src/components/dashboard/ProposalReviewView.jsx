import React, { useState } from 'react';

const ProposalReviewView = ({ proposal, user, onBack }) => {
  const [note, setNote] = useState('');

  // Dummy tracking data
  const trackingHistory = [
    { role: 'Kaprodi', status: 'Disetujui', date: '06 Jul 2026, 14:30', note: 'Sudah sesuai format prodi.' },
    { role: 'Fakultas', status: 'Menunggu Review', date: '-', note: '-' },
    { role: 'LPPM', status: 'Menunggu Review', date: '-', note: '-' },
  ];

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium mb-2 transition"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Kembali ke Daftar
          </button>
          <h2 className="text-2xl font-bold text-gray-800 leading-tight">
            {proposal.title}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full uppercase tracking-wide">
              {proposal.status}
            </span>
            <span className="text-sm text-gray-500 font-medium">ID: {proposal.id}</span>
          </div>
        </div>
        {/* Actions for Approval Roles */}
        {user.role !== 'admin' && (
          <div className="flex gap-2">
             <button className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm rounded-lg border border-red-200 transition">Tolak</button>
             <button className="px-4 py-2 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 font-medium text-sm rounded-lg border border-yellow-200 transition">Revisi</button>
             <button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 shadow-sm font-medium text-sm rounded-lg transition">Setujui Proposal</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Content: Proposal Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Identitas */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Identitas Usulan</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <div className="text-gray-500 mb-1">Ketua Pengusul</div>
                <div className="font-semibold text-gray-800">{proposal.pengusul}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Program Studi</div>
                <div className="font-semibold text-gray-800">{proposal.prodi}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Skema Penelitian</div>
                <div className="font-semibold text-gray-800">Penelitian Terapan Unggulan Perguruan Tinggi (PTUPT)</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Lama Kegiatan</div>
                <div className="font-semibold text-gray-800">1 Tahun</div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-500 mb-1">Abstrak</div>
                <div className="text-gray-700 leading-relaxed text-justify bg-gray-50 p-4 rounded-xl border border-gray-100">
                  Penelitian ini bertujuan untuk merancang sebuah sistem deteksi dini kebakaran hutan berbasis Internet of Things (IoT) yang mengintegrasikan sensor suhu, kelembaban, dan gas. Sistem ini diklaim mampu memberikan notifikasi secara real-time ke perangkat mobile otoritas terkait.
                </div>
              </div>
            </div>
          </div>

          {/* Anggota & Mitra */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-md font-bold text-gray-800 mb-3">Daftar Anggota</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                    <span className="font-medium text-gray-700">Dr. Andi (Dosen)</span>
                    <span className="text-gray-500">Anggota 1</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700">Rina S.Kom (Mahasiswa)</span>
                    <span className="text-gray-500">Anggota 2</span>
                  </li>
                </ul>
             </div>
             <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-md font-bold text-gray-800 mb-3">Daftar Mitra</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                    <span className="font-medium text-gray-700">PT Maju Bersama</span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-semibold">In-Kind</span>
                  </li>
                </ul>
             </div>
          </div>

          {/* RAB & Dokumen */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">RAB & Lampiran</h3>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 bg-green-50 rounded-xl p-4 border border-green-100 flex items-center justify-between">
                <div>
                  <div className="text-green-600 font-medium text-sm">Total Anggaran (RAB)</div>
                  <div className="text-2xl font-bold text-green-800 mt-1">Rp 45.500.000</div>
                </div>
                <div className="p-3 bg-green-200 text-green-800 rounded-lg">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700 mb-2">Dokumen Proposal (PDF)</div>
                <button className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-blue-300 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition font-medium text-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Unduh Proposal Lengkap
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Content: Tracking & Notes */}
        <div className="space-y-6">
           
           {/* Form Catatan (Muncul jika punya hak akses) */}
           {user.role !== 'admin' ? (
             <div className="bg-white border border-blue-200 rounded-2xl shadow-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Tindakan Anda</h3>
                <p className="text-xs text-gray-500 mb-4">Berikan catatan khusus jika proposal ini memerlukan revisi atau ditolak.</p>
                <textarea 
                  rows="4" 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none resize-none mb-4 bg-gray-50 focus:bg-white transition"
                  placeholder="Ketik catatan di sini..."
                ></textarea>
                <div className="text-xs text-gray-400">Gunakan tombol aksi di atas halaman untuk mengirim keputusan.</div>
             </div>
           ) : (
             <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 text-center">
               <svg className="w-10 h-10 text-purple-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
               <h3 className="font-bold text-purple-900 mb-1">Mode Pemantauan</h3>
               <p className="text-xs text-purple-700">Sebagai Admin Unit, Anda hanya memiliki hak untuk memantau detail dan riwayat usulan, bukan memberikan persetujuan.</p>
             </div>
           )}

           {/* Tracking History */}
           <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-5">Riwayat Persetujuan</h3>
              
              <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
                 {trackingHistory.map((track, idx) => (
                   <div key={idx} className="relative pl-6">
                      {/* Circle Indicator */}
                      <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${track.status === 'Disetujui' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      
                      <div className="font-bold text-sm text-gray-800">{track.role}</div>
                      <div className="text-xs font-semibold text-gray-500 mb-1">{track.status} • {track.date}</div>
                      {track.note !== '-' && (
                        <div className="text-xs bg-gray-50 p-2 rounded-lg border border-gray-100 text-gray-600 mt-2">
                          <span className="font-semibold">Catatan:</span> {track.note}
                        </div>
                      )}
                   </div>
                 ))}
              </div>

           </div>

        </div>
      </div>
    </div>
  );
};

export default ProposalReviewView;
