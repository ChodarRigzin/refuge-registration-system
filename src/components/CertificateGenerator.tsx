// src/components/CertificateGenerator.tsx

import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Refugee } from '../types';
import { Button } from './common/Button';
import { Select } from './common/Select';
import { AccessDenied } from './AccessDenied';
import { triggerHtmlCertificatePrint } from '../services/pdfCertificateService'; 

interface CertificateGeneratorProps {
  onLoginClick: () => void; 
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ onLoginClick }) => {
  const context = useContext(AppContext);
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  const [isPrinting, setIsPrinting] = useState(false);

  if (!context) return <div className="p-6 text-center">Loading generator...</div>;
  const { refugeeData, isAdmin, translations, language } = context;

  if (!isAdmin) {
     return (
        <div className="bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-xl shadow-xl animate-fadeIn">
         <AccessDenied messageKey="adminOnlyCert" onLoginClick={onLoginClick} />
        </div>
    );
  }

  const selectedPerson = useMemo(() => {
    if (!refugeeData || !Array.isArray(refugeeData)) return null;
    return refugeeData.find(p => p.id.toString() === selectedPersonId) || null;
  }, [refugeeData, selectedPersonId]);

  const handlePrintCertificate = async () => {
    if (!selectedPerson) {
      alert(translations?.pleaseSelect || '請先選擇一位皈依弟子。');
      return;
    }
    if (!translations || typeof language === 'undefined') {
      alert('系統資源未完全載入，無法生成證書。請稍後再試。');
      console.error("Translations object or language is not available in context.");
      return;
    }

    setIsPrinting(true);
    try {
      await triggerHtmlCertificatePrint(selectedPerson, language, translations);
    } catch (error) {
      alert(translations?.printError || '準備列印皈依證時發生錯誤，請查看控制台。');
      console.error("Certificate printing failed:", error);
    } finally {
      setTimeout(() => {
        setIsPrinting(false);
      }, 1500); 
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-xl shadow-xl animate-fadeIn">
     <h2 className="text-2xl font-bold text-[#8B6F47] mb-8 flex items-center gap-3">
       <span className="text-2xl text-[#D4A574]">◈</span>
       {translations?.certificateGenTitleHtmlPrint || '皈依證預覽與列印'}
     </h2>

      <div className="max-w-lg mx-auto mb-8">
        <Select
            label={translations?.selectDisciple || '選擇皈依弟子'}
            id="selectPersonToPrintCert"
            value={selectedPersonId}
            onChange={(e) => setSelectedPersonId(e.target.value)}
        >
            <option value="">{translations?.pleaseSelect || '-- 請選擇 --'}</option>
            {refugeeData && Array.isArray(refugeeData) && refugeeData
                // ***** 關鍵修改 #1：我們現在要按照後端給的永久編號來排序 *****
                .sort((a, b) => {
                    // 將 undefined 或 null 的編號視為 0，確保排序穩定
                    const seqA = a.sequenceNumber || 0;
                    const seqB = b.sequenceNumber || 0;
                    return seqB - seqA; // 從大到小排序 (最新的在最上面)
                })
                // ***** 關鍵修改 #2：顯示永久編號，而不是臨時計數 *****
                .map((person) => ( 
                    <option key={person.id} value={person.id}>
                        {/* 使用 person.sequenceNumber 來顯示永久編號 */}
                        {person.sequenceNumber || '無編號'}. {person.name} ({person.phone || '無電話'})
                    </option>
            ))}
        </Select>
      </div>

      {selectedPersonId && selectedPerson && (
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Button 
            onClick={handlePrintCertificate}
            variant="primary" 
            size="lg" 
            disabled={isPrinting} 
          >
            {isPrinting 
              ? (translations?.preparingPrint || '正在準備列印...') 
              : (translations?.printFullCertificate || '列印完整皈依證')}
          </Button>
        </div>
      )}
      {!selectedPersonId && (
         <div className="mt-8 text-center text-gray-500">
          <p>{translations?.selectToPrintCertificate || '請選擇一位皈依弟子以準備列印皈依證。'}</p>
        </div>
      )}
    </div>
  );
};

export default CertificateGenerator;