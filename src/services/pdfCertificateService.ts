// src/services/pdfCertificateService.ts
import { Refugee } from '../types';

const formatDate = (dateString: string, language: 'zh' | 'en' = 'zh') => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString + 'T00:00:00');
        if (isNaN(date.getTime())) {
            return dateString;
        }
        
        if (language === 'zh') {
            const year = date.getFullYear();
            const rocYear = year - 1911;
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `民國${rocYear}年${month}月${day}日`;
        } else {
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(date);
        }
    } catch (e) {
        console.error('Date formatting error:', e);
        return dateString;
    }
};

export async function generatePdfCertificate(
  personData: Refugee,
  language: 'zh' | 'en'
): Promise<void> {
  console.log("Data received for PDF generation:", JSON.stringify(personData, null, 2));
  
  // 創建隱藏的 iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.top = '-9999px';
  iframe.style.left = '-9999px';
  iframe.style.width = '105mm';
  iframe.style.height = '148mm';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) {
    throw new Error('Failed to create iframe document');
  }

  // 建立 HTML 內容
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page {
          size: A6;
          margin: 0;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'Noto Serif TC', serif;
        }
        
        .page {
          width: 105mm;
          height: 148mm;
          padding: 8mm 10mm;
          box-sizing: border-box;
          position: relative;
          page-break-after: always;
          display: flex;
          flex-direction: column;
        }
        
        /* 第一頁樣式 */
        .page1 {
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        
        .page1 h1 {
          font-size: 14pt;
          margin-bottom: 5mm;
          font-weight: normal;
        }
        
        .page1 .chinese-text {
          font-size: 12pt;
          line-height: 2;
          margin-bottom: 5mm;
        }
        
        .page1 .english-text {
          font-size: 11pt;
          line-height: 1.8;
          margin-bottom: 5mm;
        }
        
        .page1 .tibetan-footer {
          font-size: 12pt;
          margin-bottom: 5mm;
        }
        
        .page1 .chinese-footer {
          font-size: 11pt;
        }
        
        .page1 .page-number {
          position: absolute;
          bottom: 5mm;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 9pt;
        }
        
        /* 第二頁樣式 */
        .page2 .header {
          text-align: center;
          margin-bottom: 2mm;
        }
        
        .page2 .header p {
          font-size: 11pt;
          margin: 1mm 0;
          font-weight: normal;
        }
        
        .page2 .header .tibetan {
          font-size: 13pt;
        }
        
        .page2 .header .english {
          font-size: 10pt;
        }
        
        .page2 .lama-section {
          text-align: center;
          margin-bottom: 2mm;
          position: relative;
          min-height: 40mm;
        }
        
        .page2 .lama-section p {
          margin: 0.5mm 0;
          font-size: 10pt;
        }
        
        .page2 .seal {
          position: absolute;
          width: 35mm;
          height: 35mm;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.9;
        }
        
        .page2 .details {
          margin-top: 1mm;
        }
        
        .page2 .detail-item {
          display: flex;
          margin-bottom: 2.5mm;
          font-size: 10pt;
          align-items: baseline;
        }
        
        .page2 .detail-label {
          width: 45mm;
          flex-shrink: 0;
          font-size: 10pt;
        }
        
        .page2 .detail-value {
          flex-grow: 1;
          border-bottom: 0.5px solid black;
          padding-bottom: 0.5mm;
          margin-left: 2mm;
          min-height: 1em;
          font-size: 10pt;
        }
        
        .page2 .page-number {
          position: absolute;
          bottom: 5mm;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 8pt;
          color: #666;
        }
        
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <!-- 第一頁 -->
      <div class="page page1">
        <div>
          <h1>日 誦 皈 依 文</h1>
          
          <div class="chinese-text">
            無上最勝佛法僧<br>
            直至菩提我皈依<br>
            六度萬行諸功德<br>
            為利眾生願成佛
          </div>
          
          <div class="english-text">
            Namo Guru Bhe<br>
            Namo Buddhaya<br>
            Namo Dharmaya<br>
            Namo Sanghaya
          </div>
          
          <div class="tibetan-footer">
            ཨོཾ་ཨཱཿཧཱུྃ་བཛྲ་གུ་རུ་པདྨ་སིདྡྷི་ཧཱུྃ།
          </div>
          
          <div class="chinese-footer">
            嗡阿吽 邊雜 咕嚕 貝瑪 悉地 吽
          </div>
        </div>
        
        <div class="page-number">1</div>
      </div>
      
      <!-- 第二頁 -->
      <div class="page page2">
        <div class="header">
          <p class="tibetan">སྟོན་པ། མཉམ་མེད་ཐུབ་པའི་དབང་པོ་ཤཱཀྱ་རྒྱལ།</p>
          <p class="english">The Buddha Shakyamuni</p>
          <p>創教者：無等導師釋迦牟尼佛</p>
        </div>
        
        <div class="lama-section">
          <p>སྐྱབས་རྗེ། གནང་མཁན།</p>
          <p>ཀཿཐོག་རིག་འཛིན་ཆེན་པོ་རྒྱལ་བ་ཆེན་པོ།</p>
          <p>Refuge Lama: H.E.Kathog Rigzin Chenpo</p>
          <p>傳戒依戒師：噶陀仁珍千寶</p>
          <img src="/seal.png" class="seal" alt="印章" onerror="this.style.display='none'">
        </div>
        
        <div class="details">
          <div class="detail-item">
            <div class="detail-label">皈依者(Recipient):</div>
            <div class="detail-value">${personData.name || ''}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">皈依日期(Date):</div>
            <div class="detail-value">${formatDate(personData.refugeDate, language)}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">皈依地點(Place):</div>
            <div class="detail-value">${personData.refugePlace || ''}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">法名(Dharma Name):</div>
            <div class="detail-value">${personData.dharmaName || ''}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">法名音譯(Phonetic Transcription):</div>
            <div class="detail-value">${personData.dharmaNamePhonetic || ''}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">法名譯意(Translation):</div>
            <div class="detail-value">${personData.dharmaNameMeaning || ''}</div>
          </div>
        </div>
        
        <div class="page-number">2</div>
      </div>
    </body>
    </html>
  `;

  iframeDoc.open();
  iframeDoc.write(htmlContent);
  iframeDoc.close();

  // 等待內容載入完成
  setTimeout(() => {
    // 觸發列印
    iframe.contentWindow?.print();
    
    // 列印完成後移除 iframe
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 500);
}

// 輔助函數：下載 PDF（使用列印功能）
export function downloadPdf(personData: Refugee, filename: string = 'refuge_certificate.pdf') {
    generatePdfCertificate(personData, 'zh');
}