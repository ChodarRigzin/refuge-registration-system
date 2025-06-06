// src/components/CertificateGenerator.tsx
import React, { useState, useContext, useMemo } from 'react';
import { saveAs } from 'file-saver'; // 用於下載
import { AppContext } from '../contexts/AppContext';
import { Refugee } from '../types';
import { Button } from './common/Button';
import { Select } from './common/Select';
// 不再需要 CertificatePreview 來顯示 HTML 版本的證書
// import { CertificatePreview } from './CertificatePreview'; 
import { AccessDenied } from './AccessDenied';
import { generatePdfCertificate } from '../services/pdfCertificateService'; // 引入我們的服務

interface CertificateGeneratorProps {
  onLoginClick: () => void; 
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ onLoginClick }) => {
  const context = useContext(AppContext);
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false); // 新增狀態來表示正在生成 PDF

  if (!context) return <div className="p-6 text-center">Loading generator...</div>;
  const { refugeeData, isAdmin, translations, language } = context; // 需要 language

  if (!isAdmin) {
     return (
        <div className="bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-xl shadow-xl animate-fadeIn">
         <AccessDenied messageKey="adminOnlyCert" onLoginClick={onLoginClick} />
        </div>
    );
  }

  const selectedPerson = useMemo(() => {
    return refugeeData.find(p => p.id === parseInt(selectedPersonId, 10)) || null;
  }, [refugeeData, selectedPersonId]);

  const handleGenerateAndDownload = async () => {
    if (!selectedPerson) {
      alert(translations.pleaseSelect || '請先選擇一位皈依弟子。');
      return;
    }
    setIsGenerating(true);
    try {
      const pdfBytes = await generatePdfCertificate(selectedPerson, language); // 傳遞選擇的人和語言
      saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), `${selectedPerson.name}_皈依證.pdf`);
    } catch (error) {
      alert(translations.pdfGenerationError || '生成皈依證 PDF 失敗，請查看控制台錯誤。');
      console.error("PDF Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-xl shadow-xl animate-fadeIn">
      <h2 className="text-2xl md:text-3xl font-semibold text-[var(--primary-color)] mb-8 relative pl-10">
        <span className="absolute left-0 top-0.5 text-[var(--gold)] text-3xl md:text-4xl" style={{animation: 'pulseIcon 2s ease-in-out infinite'}}>◈</span>
        {translations.certificateGenTitle || '皈依證生成 (PDF)'}
      </h2>

      <div className="max-w-lg mx-auto mb-8">
        <Select
            label={translations.selectDisciple || '選擇皈依弟子'}
            id="selectPersonCertPdf" // 修改 id 避免衝突
            value={selectedPersonId}
            onChange={(e) => setSelectedPersonId(e.target.value)}
        >
            <option value="">{translations.pleaseSelect || '-- 請選擇 --'}</option>
            {refugeeData && refugeeData.sort((a,b) => b.id - a.id).map(person => (
            <option key={person.id} value={person.id.toString()}>
                {person.id} - {person.name} ({person.phone})
            </option>
            ))}
        </Select>
      </div>

      {selectedPersonId && ( // 只要選擇了人，就顯示按鈕
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Button 
            onClick={handleGenerateAndDownload} 
            variant="primary" 
            size="lg" 
            icon={<i className="fas fa-file-pdf mr-2"></i>}
            disabled={isGenerating} // 生成時禁用按鈕
          >
            {isGenerating ? (translations.generatingPdf || '正在生成 PDF...') : (translations.generateAndDownloadPdf || '生成並下載 PDF')}
          </Button>
        </div>
      )}
      {!selectedPersonId && (
         <div className="mt-8 text-center text-gray-500">
          <p>{translations.selectToGeneratePdf || '請選擇一位皈依弟子以生成 PDF 證書。'}</p>
        </div>
      )}
    </div>
  );
};

// export default CertificateGenerator; // 或 export const CertificateGenerator