import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [currentStep, setCurrentStep] = useState(1);
  
  // State global untuk menampung seluruh data form
  const [formData, setFormData] = useState({
    identitas: { skema: 'Penelitian', judul: '', abstrak: '', kataKunci: '', rumpunIlmu: '' },
    anggota: [],
    mitra: [],
    rab: [],
    dokumen: null
  });

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("=== DATA PROPOSAL DUMMY (SIAP DIKIRIM KE BACKEND) ===");
    console.log(JSON.stringify(formData, null, 2));
    alert("Proposal berhasil disubmit secara simulasi! Silakan cek Console Browser untuk melihat format datanya.");
    navigate('/dashboard');
  };

  // Fungsi untuk update state dari child component
  const updateFormData = (section, data) => {
    setFormData(prev => ({ ...prev, [section]: data }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header & Back Button */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pengajuan Proposal Baru</h1>
            <p className="mt-2 text-sm text-gray-500">Lengkapi data proposal penelitian atau pengabdian Anda langkah demi langkah.</p>
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
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium text-sm shadow-md shadow-green-500/30 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Submit Proposal
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProposalForm;
