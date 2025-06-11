// src/components/CertificateGenerator.tsx
import React, { useState, useContext, useMemo } from 'react';
// import { saveAs } from 'file-saver'; // 我們不再直接使用 saveAs 在這個組件
import { AppContext } from '../contexts/AppContext';
import { Refugee } from '../types';
import { Button } from './common/Button';
import { Select } from './common/Select';
import { AccessDenied } from './AccessDenied';
// ***** 關鍵修改：引入正確的函數名 *****
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

  // ***** 關鍵修改：確保這裡調用的是 triggerHtmlCertificatePrint *****
  const handlePrintCertificate = async () => { // 函數名也最好保持一致
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

  // 如果你還保留了舊的 handleGenerateAndDownload 函數並且它也引用了 generatePdfCertificate，
  // 你需要決定是刪除它，還是也將它更新為調用 triggerHtmlCertificatePrint (如果邏輯適用)，
  // 或者如果它確實是要用舊的 pdf-lib 方式，那你需要確保 pdfCertificateService.ts 中確實有導出 generatePdfCertificate。
  // 但根據我們最新的方向，應該是統一使用 triggerHtmlCertificatePrint。

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
            // 1. 先按照註冊時間排序，最新的在最前面 (這部分已正確)
            .sort((a, b) => {
                const timeA = a.registrationTime ? new Date(a.registrationTime).getTime() : 0;
                const timeB = b.registrationTime ? new Date(b.registrationTime).getTime() : 0;
                return timeB - timeA;
            })
            // 2. 映射到選項，並使用第二個參數 index 來產生編號
            .map((person, index) => ( 
                // key 和 value 仍然使用 Firebase 的唯一 ID，這是功能正確的關鍵
                <option key={person.id} value={person.id}>
                    {/* 這裡進行修改：顯示的文字使用 index + 1 來產生人類可讀的編號 */}
                    {index + 1}. {person.name} ({person.phone})
                </option>
        ))}
    </Select>
  </div>

      {selectedPersonId && selectedPerson && (
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Button 
            onClick={handlePrintCertificate} // ***** 確保這裡調用的是正確的函數 *****
            variant="primary" 
            size="lg" 
            icon={<i className="fas fa-print mr-2"></i>}
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