// src/components/CertificateDisplay.tsx
import React from 'react';
import './CertificateDisplay.css'; // 確保這個 CSS 檔案存在且被正確引入

// 假設印章圖片放在 public 資料夾下，命名為 seal.png
const PDF_SEAL_IMAGE_URL = '/seal.png'; 
// 如果印章圖片放在 src/assets/ 下，則需要 import:
// import pdfSealImageFromFile from '../assets/seal.png'; // 調整相對路徑
// const PDF_SEAL_IMAGE_URL = pdfSealImageFromFile;

interface CertificatePdfProps {
  // 來自 PDF 範本頂部
  buddhaNameTibetan: string;
  buddhaNameEnglish: string;
  founderNameChinese: string;
  
  // 來自 PDF 範本中間 - 傳戒師資訊
  refugeLamaTibetanLine1: string; // སྐྱབས་སྡོམ་གནང་མཁན། །
  refugeLamaTibetanLine2: string; // ཀཿཐོག་རིག་འཛིན་ཆེན་པོ་པདྨ་དབང་ཆེན། །
  refugeLamaEnglish: string;      // Refuge Lama: H.E.Kathog Rigzin Chenpo
  refugeLamaChinese: string;      // 傳皈依戒師：噶陀仁珍千寶
  
  // 來自 PDF 範本下方 - 皈依者詳細資訊
  recipientName: string;          // 皈依者(recipient) 的值
  refugeDate: string;             // 皈依日期(date) 的值
  refugePlace: string;            // 皈依地點(place) 的值
  dharmaNamePhonetic: string;     // 法名音譯(Dharma Name) 的值 (可能是藏文原文或中文音譯)
  dharmaNameTranslation: string;  // 法名譯意(translation) 的值
}

const CertificateDisplay: React.FC<CertificatePdfProps> = (props) => {
  return (
    <div className="certificate-pdf-container print-container"> {/* 使用新的 class 名以區分 */}
      
      {/* 第一部分：頂部創教者資訊 */}
      <div className="pdf-section pdf-header-section">
        <p className="tibetan-text pdf-buddha-name-tibetan">{props.buddhaNameTibetan}</p>
        <p className="pdf-buddha-name-english">{props.buddhaNameEnglish}</p>
        <p className="pdf-founder-name-chinese">{props.founderNameChinese}</p>
      </div>

      {/* 第二部分：中間傳戒師資訊和印章 */}
      <div className="pdf-section pdf-lama-seal-section">
        <div className="pdf-lama-info">
          <p className="tibetan-text pdf-lama-tibetan-line1">{props.refugeLamaTibetanLine1}</p>
          <p className="tibetan-text pdf-lama-tibetan-line2">{props.refugeLamaTibetanLine2}</p>
          <p className="pdf-lama-english">{props.refugeLamaEnglish}</p>
          <p className="pdf-lama-chinese">{props.refugeLamaChinese}</p>
        </div>
        <img src={PDF_SEAL_IMAGE_URL} alt="Official Seal" className="pdf-seal-image" />
      </div>

      {/* 第三部分：下方皈依者詳細資訊 */}
      <div className="pdf-section pdf-recipient-details-section">
        <div className="detail-item">
          <span className="tibetan-text pdf-label">སྐྱབས་སྡོམ་ཞུ་མཁན།</span>
          <span className="pdf-label-suffix">皈依者(recipient):</span>
          <span className="pdf-value">{props.recipientName}</span>
        </div>
        <div className="detail-item">
          <span className="tibetan-text pdf-label">གནང་བའི་དུས་ཚོད།</span>
          <span className="pdf-label-suffix">皈依日期(date):</span>
          <span className="pdf-value">{props.refugeDate}</span>
        </div>
        <div className="detail-item">
          <span className="tibetan-text pdf-label">ཞུ་བའི་ས་གནས།</span>
          <span className="pdf-label-suffix">皈依地點(place):</span>
          <span className="pdf-value">{props.refugePlace}</span>
        </div>
        <div className="detail-item">
          <span className="tibetan-text pdf-label">ཆོས་མིང་སྒྲ་བསྒྱུར།</span>
          <span className="pdf-label-suffix">法名音譯(Dharma Name):</span>
          {/* 法名音譯的值可能本身就是藏文，所以也加上 font-tibetan (如果需要) */}
          <span className={`pdf-value ${props.dharmaNamePhonetic.match(/[\u0F00-\u0FFF]/) ? 'font-tibetan' : ''}`}>{props.dharmaNamePhonetic}</span>
        </div>
        <div className="detail-item">
          <span className="tibetan-text pdf-label">ཆོས་མིང་དོན་བསྒྱུར།</span>
          <span className="pdf-label-suffix">法名譯意(translation):</span>
          <span className="pdf-value">{props.dharmaNameTranslation}</span>
        </div>
      </div>

      {/* 第四部分：頁碼 */}
      <div className="pdf-page-number no-print">2</div>
    </div>
  );
};

export default CertificateDisplay;