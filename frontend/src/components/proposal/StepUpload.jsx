import { useRef } from 'react';

const StepUpload = ({ data, updateData }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Menyimpan file objek murni (dummy behavior, kita simpan nama dan ukurannya saja untuk display)
      const file = e.target.files[0];
      updateData({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      updateData({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type
      });
    }
  };

  const removeFile = () => {
    updateData(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">5. Unggah Dokumen Pendukung</h2>
      <p className="text-sm text-gray-500 mb-6 border-b pb-4">Unggah dokumen proposal lengkap dan lampiran sesuai format LPPM.</p>

      <div className="max-w-2xl mx-auto mt-8">
        {!data ? (
          <div 
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[#007aff] rounded-2xl bg-blue-50/30 hover:bg-blue-50/60 transition cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <svg className="w-12 h-12 text-[#007aff] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="mb-2 text-sm text-gray-600"><span className="font-semibold text-[#007aff]">Klik untuk upload</span> atau drag & drop</p>
            <p className="text-xs text-gray-500">PDF, DOCX, atau ZIP (Maks. 10MB)</p>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".pdf,.doc,.docx,.zip"
            />
          </div>
        ) : (
          <div className="bg-white border border-green-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 truncate max-w-xs sm:max-w-md">{data.name}</h4>
                <p className="text-xs text-gray-500">{data.size}</p>
              </div>
            </div>
            <button 
              onClick={removeFile}
              className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition"
              title="Hapus file"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        )}
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <svg className="w-6 h-6 text-[#007aff] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <p className="text-sm text-blue-900 leading-relaxed">
          <strong>Pernyataan:</strong> Dengan menekan tombol "Submit Proposal", saya menyatakan bahwa seluruh data yang diisikan adalah benar dan dapat dipertanggungjawabkan sesuai dengan panduan LPPM yang berlaku.
        </p>
      </div>
    </div>
  );
};

export default StepUpload;
