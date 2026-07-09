import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import StepIdentitas from '../components/proposal/StepIdentitas';
import StepAnggota from '../components/proposal/StepAnggota';
import StepMitra from '../components/proposal/StepMitra';
import StepRAB from '../components/proposal/StepRAB';
import StepUpload from '../components/proposal/StepUpload';

const steps = [
  { id: 1, title: 'Identitas Usulan' },
  { id: 2, title: 'Anggota Tim' },
  { id: 3, title: 'Mitra Kerjasama' },
  { id: 4, title: 'Rencana Anggaran' },
  { id: 5, title: 'Upload Dokumen' },
];

const ProposalForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(id ? true : false);
  
  // State global untuk menampung seluruh data form
  const [formData, setFormData] = useState({
    identitas: { skema: 'Penelitian', judul: '', abstrak: '', kataKunci: '', rumpunIlmu: '' },
    anggota: [],
    mitra: [],
    rab: [],
    dokumen: null
  });

  useEffect(() => {
    if (id) {
       const fetchProposal = async () => {
         try {
           const token = localStorage.getItem('token');
           const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/proposals/${id}`, {
             headers: { Authorization: `Bearer ${token}` }
           });
           const p = res.data.proposal;
           setFormData({
             identitas: { 
               skema: p.skema || 'Penelitian', 
               judul: p.judul || '', 
               abstrak: p.abstrak || '', 
               kataKunci: p.kataKunci || '', 
               rumpunIlmu: p.rumpunIlmu || '' 
             },
             anggota: p.anggota || [],
             mitra: p.mitra || [],
             rab: p.rab || [],
             dokumen: p.dokumenUrl ? { name: p.dokumenUrl.split('/').pop(), size: 'Tersimpan di server', type: 'PDF' } : null
           });
         } catch (error) {
           console.error('Fetch error', error);
           alert('Gagal mengambil data proposal');
           navigate('/dashboard');
         } finally {
           setFetching(false);
         }
       };
       fetchProposal();
    }
  }, [id, navigate]);

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const submitData = new FormData();
      
      submitData.append('skema', formData.identitas.skema);
      submitData.append('judul', formData.identitas.judul);
      submitData.append('abstrak', formData.identitas.abstrak);
      submitData.append('kataKunci', formData.identitas.kataKunci);
      submitData.append('rumpunIlmu', formData.identitas.rumpunIlmu);
      
      submitData.append('anggota', JSON.stringify(formData.anggota));
      submitData.append('mitra', JSON.stringify(formData.mitra));
      submitData.append('rab', JSON.stringify(formData.rab));
      
      if (formData.dokumen && formData.dokumen.file) {
        submitData.append('dokumen', formData.dokumen.file);
      }
      
      if (id) {
         await axios.put(`${import.meta.env.VITE_API_URL}/api/proposals/${id}`, submitData, {
           headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
         });
         alert("Proposal berhasil direvisi dan dikirim kembali!");
      } else {
         await axios.post(`${import.meta.env.VITE_API_URL}/api/proposals`, submitData, {
           headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
         });
         alert("Proposal berhasil diajukan!");
      }
      
      navigate('/dashboard');
    } catch (error) {
       console.error(error);
       alert(error.response?.data?.error || 'Terjadi kesalahan saat submit proposal');
    } finally {
       setLoading(false);
    }
  };

  // Fungsi untuk update state dari child component
  const updateFormData = (section, data) => {
    setFormData(prev => ({ ...prev, [section]: data }));
  };

  if (fetching) {
    return <div className="min-h-screen flex items-center justify-center font-medium text-gray-500">Memuat data proposal...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header & Back Button */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{id ? 'Revisi Proposal' : 'Pengajuan Proposal Baru'}</h1>
            <p className="mt-2 text-sm text-gray-500">{id ? 'Perbaiki data proposal berdasarkan catatan peninjau.' : 'Lengkapi data proposal penelitian atau pengabdian Anda langkah demi langkah.'}</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition"
          >
            Batal & Kembali
          </button>
        </div>

        {/* Stepper UI */}
        <div className="mb-10 bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 relative">
            {/* Background line for stepper */}
            <div className="hidden sm:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
            
            {steps.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex flex-row sm:flex-col items-center gap-3 sm:gap-2 bg-white px-2 sm:px-4 z-10">
                  <div 
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 shadow-sm
                      ${isActive ? 'bg-[#007aff] text-white ring-4 ring-blue-100' : 
                        isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 border border-gray-200'}
                    `}
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content Area */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-10 mb-8 transition-all duration-500 min-h-[400px]">
          {currentStep === 1 && <StepIdentitas data={formData.identitas} updateData={(d) => updateFormData('identitas', d)} />}
          {currentStep === 2 && <StepAnggota data={formData.anggota} updateData={(d) => updateFormData('anggota', d)} />}
          {currentStep === 3 && <StepMitra data={formData.mitra} updateData={(d) => updateFormData('mitra', d)} />}
          {currentStep === 4 && <StepRAB data={formData.rab} updateData={(d) => updateFormData('rab', d)} />}
          {currentStep === 5 && <StepUpload data={formData.dokumen} updateData={(d) => updateFormData('dokumen', d)} />}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 
              ${currentStep === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow'}`}
          >
            ← Sebelumnya
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl font-medium text-sm shadow-md shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              Lanjut ke {steps[currentStep].title} →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium text-sm shadow-md shadow-green-500/30 transition-all duration-200 flex items-center gap-2 ${loading ? 'opacity-70 cursor-wait' : 'hover:-translate-y-0.5'}`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              )}
              {id ? 'Kirim Revisi' : 'Submit Proposal'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProposalForm;
