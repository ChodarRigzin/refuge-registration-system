// src/components/CertificatePreview.tsx
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext'; // 假設你用 Context 管理皈依者資料
import { Refugee } from '../types'; // 你的皈依者資料類型
import './CertificateDisplay.css'; // 或者你為這個 PDF 樣式創建的特定 CSS 檔案

// 假設印章圖片在 public 資料夾
const PDF_SEAL_IMAGE_URL = '/seal.png';

interface CertificatePreviewProps {
  person: Refugee | null; // person prop 仍然是必要的
}

// 從 PDF 範本獲取固定的頂部和傳戒師資訊
// 這些資訊將用於填充證書上的固定文字部分
const fixedPdfCertificateData = {
  buddhaNameTibetan: "སྟོན་པ། མཉམ་མེད་ཐུབ་པའི་དབང་པོ་ཤཱཀྱའི་རྒྱལ།",
  buddhaNameEnglish: "The Buddha Shakyamuni",
  founderNameChinese: "創教者：無等導師釋迦牟尼佛",
  refugeLamaTibetanLine1: "སྐྱབས་སྡོམ་གནང་མཁན། །",
  refugeLamaTibetanLine2: "ཀཿ ཐོག་རིག་འཛིན་ཆེན་པོ་པདྨ་དབང་ཆེན། །",
  refugeLamaEnglish: "Refuge Lama: H.E.Kathog Rigzin Chenpo",
  refugeLamaChinese: "傳皈依戒師：噶陀仁珍千寶",
};

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({ person }) => {
  const context = useContext(AppContext);

  // 如果沒有 person 資料，不渲染任何東西或者顯示提示
  if (!context || !person) {
    // 可以根據需要在 CertificateGenerator 中處理 "請選擇" 的情況
    return null; 
  }
  const { translations, language } = context; // 假設 translations 包含標籤的翻譯

  // 日期格式化函數 (可以保留或根據需要調整)
  const formatDate = (dateString: string) => {
    if (!dateString) return '________________';
    try {
        const date = new Date(dateString + 'T00:00:00');
        return new Intl.DateTimeFormat(language === 'zh' ? 'zh-TW-u-ca-roc' : 'en-US', {
            year: language === 'zh' ? 'numeric' : 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    } catch (e) {
        return dateString;
    }
  };

  return (
    // 這個 div 的 id 用於 CertificateGenerator 中的列印功能
    // class 名稱用於應用 A6 樣式和列印樣式
    <div id="certificateContentToPrint" className="certificate-pdf-container print-container"> 
      
      {/* 第一部分：頂部創教者資訊 */}
      <div className="pdf-section pdf-header-section">
        <p className="tibetan-text pdf-buddha-name-tibetan">{fixedPdfCertificateData.buddhaNameTibetan}</p>
        <p className="pdf-buddha-name-english">{fixedPdfCertificateData.buddhaNameEnglish}</p>
        <p className="pdf-founder-name-chinese">{fixedPdfCertificateData.founderNameChinese}</p>
      </div>

      {/* 第二部分：中間傳戒師資訊和印章 */}
      <div className="pdf-section pdf-lama-seal-section">
        <div className="pdf-lama-info">
          <p className="tibetan-text pdf-lama-tibetan-line1">{fixedPdfCertificateData.refugeLamaTibetanLine1}</p>
          <p className="tibetan-text pdf-lama-tibetan-line2">{fixedPdfCertificateData.refugeLamaTibetanLine2}</p>
          <p className="pdf-lama-english">{fixedPdfCertificateData.refugeLamaEnglish}</p>
          <p className="pdf-lama-chinese">{fixedPdfCertificateData.refugeLamaChinese}</p>
        </div>
        <img src={PDF_SEAL_IMAGE_URL} alt="Official Seal" className="pdf-seal-image" />
      </div>

      {/* 第三部分：下方皈依者詳細資訊 */}
      <div className="pdf-section pdf-recipient-details-section">
        <div className="detail-item">
          <span className="tibetan-text pdf-label">སྐྱབས་སྡོམ་ཞུ་མཁན།</span>
          <span className="pdf-label-suffix">{translations?.recipientLabel || "皈依者(Recipient):"}</span>
          <span className="pdf-value">{person.name}</span>
        </div>
        <div className="detail-item">
          <span className="tibetan-text pdf-label">གནང་བའི་དུས་ཚོད།</span>
          <span className="pdf-label-suffix">{translations?.dateLabel || "皈依日期(Date):"}</span>
          <span className="pdf-value">{formatDate(person.refugeDate)}</span>
        </div>
        <div className="detail-item">
          <span className="tibetan-text pdf-label">ཞུ་བའི་ས་གནས།</span>
          <span className="pdf-label-suffix">{translations?.placeLabel || "皈依地點(Place):"}</span>
          <span className="pdf-value">{person.refugePlace}</span>
        </div>

     {/* 新增：法名 (藏文原文) */}
        <div className="detail-item">
          <span className="tibetan-text pdf-label">ཆོས་མིང།</span>
          <span className="pdf-label-suffix">{translations?.dharmaNameOriginalLabel || "法名(Dharma Name):"}</span>
          {/* 假設 person.dharmaName 儲存的是藏文原文法名 */}
          <span className="pdf-value font-tibetan">{person.dharmaName || '________________'}</span>
        </div>

        {/* 修改：法名音譯 (中文) */}
        <div className="detail-item">
          <span className="tibetan-text pdf-label">ཆོས་མིང་སྒྲ་བསྒྱུར།</span>
          <span className="pdf-label-suffix">{translations?.dharmaNamePhoneticLabel || "法名音譯(Phonetic Dharma Name):"}</span>
          {/* 假設 person.dharmaNamePhonetic 儲存的是中文音譯 */}
          <span className="pdf-value">{person.dharmaNamePhonetic || '________________'}</span>
        </div>
        <div className="detail-item">
          <span className="tibetan-text pdf-label">ཆོས་མིང་དོན་བསྒྱུར།</span>
          <span className="pdf-label-suffix">{translations?.dharmaNameMeaningLabel || "法名譯意(Translation):"}</span>
          <span className="pdf-value">{person.dharmaNameMeaning || '________________'}</span>
        </div>
      </div>

      {/* 第四部分：頁碼 */}
     <div className="pdf-page-number-container no-print">
  <span className="pdf-page-number-text">2</span>
</div>
    </div>
  );
};

export default CertificatePreview; // 或者 export const CertificatePreview;