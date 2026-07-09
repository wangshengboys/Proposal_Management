import React, { useState } from 'react';
import axios from 'axios';

const ProposalReviewView = ({ proposal, user, onBack }) => {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReview = async (action) => {
    if ((action === 'reject' || action === 'revise') && !note.trim()) {
      alert('Catatan wajib diisi untuk Revisi atau Penolakan.');
      return;
    }
    if (!window.confirm(`Anda yakin ingin memberikan keputusan: ${action}?`)) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/api/proposals/${proposal._id}/review`, 
      { action, note }, 
      {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Keputusan berhasil disimpan!');
      onBack(); // Return to list and refresh
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Gagal menyimpan keputusan');
    } finally {
      setLoading(false);
    }
  };

  const getAnggota = () => {
    if (!proposal.anggota) return [];
    if (Array.isArray(proposal.anggota)) return proposal.anggota;
    try { return JSON.parse(proposal.anggota); } catch (e) { return []; }
  };

  const getMitra = () => {
    if (!proposal.mitra) return [];
    if (Array.isArray(proposal.mitra)) return proposal.mitra;
    try { return JSON.parse(proposal.mitra); } catch (e) { return []; }
  };

  const canReview = () => {
    if (user.role === 'admin') return false;
    if (user.role === 'kaprodi' && proposal.statusSaatIni === 'Menunggu Kaprodi') return true;
    if (user.role === 'fakultas' && proposal.statusSaatIni === 'Menunggu Fakultas') return true;
    if (user.role === 'lppm' && proposal.statusSaatIni === 'Menunggu LPPM') return true;
    return false;
  };

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
            {proposal.judul}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full uppercase tracking-wide">
              {proposal.statusSaatIni}
            </span>
            <span className="text-sm text-gray-500 font-medium">Skema: {proposal.skema}</span>
          </div>
        </div>
        
        {/* Actions for Approval Roles */}
        {canReview() && (
          <div className="flex gap-2">
             <button onClick={() => handleReview('reject')} disabled={loading} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm rounded-lg border border-red-200 transition disabled:opacity-50">Tolak</button>
             <button onClick={() => handleReview('revise')} disabled={loading} className="px-4 py-2 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 font-medium text-sm rounded-lg border border-yellow-200 transition disabled:opacity-50">Revisi</button>
             <button onClick={() => handleReview('approve')} disabled={loading} className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 shadow-sm font-medium text-sm rounded-lg transition disabled:opacity-50">Setujui Proposal</button>
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
                <div className="font-semibold text-gray-800">{proposal.pengusul ? proposal.pengusul.name : 'Unknown'}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Program Studi / Fakultas</div>
                <div className="font-semibold text-gray-800">{proposal.pengusul ? `${proposal.pengusul.program_studi} / ${proposal.pengusul.fakultas}` : 'Unknown'}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Rumpun Ilmu</div>
                <div className="font-semibold text-gray-800">{proposal.rumpunIlmu}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Kata Kunci</div>
                <div className="font-semibold text-gray-800">{proposal.kataKunci || '-'}</div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-500 mb-1">Abstrak</div>
                <div className="text-gray-700 leading-relaxed text-justify bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-line">
                  {proposal.abstrak}
                </div>
              </div>
            </div>
          </div>

          {/* Anggota & Mitra */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-md font-bold text-gray-800 mb-3">Daftar Anggota</h3>
                {getAnggota().length === 0 ? (
                  <p className="text-sm text-gray-500">Tidak ada anggota tim.</p>
                ) : (
                  <ul className="space-y-3">
                    {getAnggota().map((a, idx) => (
                      <li key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                        <span className="font-medium text-gray-700">{a.nama}</span>
                        <span className="text-gray-500">{a.peran}</span>
                      </li>
                    ))}
                  </ul>
                )}
             </div>
             <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-md font-bold text-gray-800 mb-3">Daftar Mitra</h3>
                {getMitra().length === 0 ? (
                  <p className="text-sm text-gray-500">Tidak ada mitra.</p>
                ) : (
                  <ul className="space-y-3">
                    {getMitra().map((m, idx) => (
                      <li key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                        <span className="font-medium text-gray-700">{m.namaMitra}</span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-semibold">Rp {m.kontribusiDana?.toLocaleString('id-ID')}</span>
                      </li>
                    ))}
                  </ul>
                )}
             </div>
          </div>

          {/* RAB & Dokumen */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">RAB & Lampiran</h3>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 bg-green-50 rounded-xl p-4 border border-green-100 flex items-center justify-between">
                <div>
                  <div className="text-green-600 font-medium text-sm">Total Anggaran (RAB)</div>
                  <div className="text-2xl font-bold text-green-800 mt-1">Rp {proposal.totalAnggaran?.toLocaleString('id-ID')}</div>
                </div>
                <div className="p-3 bg-green-200 text-green-800 rounded-lg">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700 mb-2">Dokumen Proposal (PDF)</div>
                {proposal.dokumenUrl ? (
                  <a href={`${import.meta.env.VITE_API_URL}${proposal.dokumenUrl}`} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-blue-300 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition font-medium text-sm">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Lihat Dokumen
                  </a>
                ) : (
                  <div className="w-full text-center py-3 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">Tidak ada dokumen dilampirkan</div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Content: Tracking & Notes */}
        <div className="space-y-6">
           
           {/* Form Catatan (Muncul jika punya hak akses dan proposal menunggu) */}
           {canReview() ? (
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
               <h3 className="font-bold text-purple-900 mb-1">{user.role === 'admin' ? 'Mode Pemantauan' : 'Tidak Ada Tindakan'}</h3>
               <p className="text-xs text-purple-700">
                 {user.role === 'admin' ? 'Sebagai Admin Unit, Anda hanya memiliki hak untuk memantau detail dan riwayat usulan, bukan memberikan persetujuan.' : 'Proposal ini tidak sedang menunggu tindakan dari peran Anda saat ini.'}
               </p>
             </div>
           )}

           {/* Tracking History */}
           <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-5">Riwayat Persetujuan</h3>
              
              <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
                 {proposal.trackingHistory.length === 0 ? (
                   <p className="text-sm text-gray-500 italic ml-4">Belum ada riwayat peninjauan.</p>
                 ) : proposal.trackingHistory.map((track, idx) => (
                   <div key={idx} className="relative pl-6">
                      {/* Circle Indicator */}
                      <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white 
                        ${track.status === 'Disetujui' ? 'bg-green-500' : 
                          track.status === 'Revisi' ? 'bg-amber-500' : 
                          track.status === 'Ditolak' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                      
                      <div className="font-bold text-sm text-gray-800 uppercase tracking-wider">{track.role}</div>
                      <div className="text-xs font-semibold text-gray-500 mb-1">{track.status} • {new Date(track.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                      {track.note && track.note !== '-' && (
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
