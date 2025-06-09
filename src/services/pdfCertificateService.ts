// 請在您的檔案頂部引入這兩個函式庫
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// 您原有的 triggerHtmlCertificatePrint 函式將被修改為一個分派器
export async function triggerHtmlCertificatePrint(
  personData: any,
  language: 'zh' | 'en',
  translations: any
): Promise<void> {
  console.log("Data for certificate:", personData);

  // 1. 偵測是否為行動裝置
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const htmlContent = generateCertificateHTML(personData); // 將 HTML 生成獨立出來

  if (isMobile) {
    // 2. 行動裝置：開啟新視窗並提供下載按鈕
    openCertificateInNewWindow(htmlContent);
  } else {
    // 桌面裝置：使用原有的 iframe 列印方式
    printCertificateViaIframe(htmlContent);
  }
}

/**
 * 輔助函式：生成證書的完整 HTML 內容
 * @param personData - 皈依者資料
 * @returns {string} - 證書的 HTML 字串
 */
function generateCertificateHTML(personData: any): string {
    const personDataString = JSON.stringify(personData);
    // 這裡貼上您之前版本中完整的 HTML 模板字串
    return `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>皈依證 - Refuge Vow Certificate</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&family=Noto+Serif+TC:wght@400;700&family=Noto+Sans+Tibetan:wght@400;700&display=swap" rel="stylesheet">
   <style>
    @page {
      size: A5 landscape;
      margin: 0; /* 改為0以實現滿版效果 */
    }
    @page:first {
      margin: 0; /* 確保第一頁也是0邊距 */
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Noto Serif TC', serif;
      background-color: #e0e0e0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .tibetan { font-family: 'Noto Sans Tibetan', sans-serif; }
    .english { font-family: 'Noto Serif TC', serif; font-style: italic; }
    
    .a5-full-bleed-sheet {
      width: 210mm;  /* A5 橫向的完整寬度 */
      height: 148mm; /* A5 橫向的完整高度 */
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      page-break-after: always;
      margin: 0;
      overflow: hidden;
      background-color: #8C1515; /* 紅色背景 */
    }
    
    .a5-sheet {
      width: 210mm;
      height: 148mm;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      page-break-after: always;
      margin: 0;
      overflow: hidden;
    }
    .a5-sheet:last-child { page-break-after: auto; }
   
     /* --- 修改點: 針對封面/封底的滿版樣式 --- */
    
   
    .page {
      width: 105mm;
      height: 148mm;
      padding: 8mm;
      display: flex;
      flex-direction: column;
      border: 1px dashed #aaa;
      overflow: hidden;
      position: relative;
      background-color: white;
    }
    @media print {
        .page {
            border: none;
        }
    }
    .page-content { flex: 1; }
    .page-number {
      position: absolute;
      bottom: 8mm;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 8pt;
      color: #888;
    }
    .cover-background {
      background-color: #8C1515;
      color: #D4AF37;
    }
    .cover-background h1,
    .cover-background .english,
    .cover-background .motto,
    .cover-background .footer-text,
    .cover-background .footer-text span,
    .cover-background .footer-text h2 {
        color: #D4AF37;
    }
    .cover-background .logo {
         filter: brightness(0) saturate(100%) invert(80%) sepia(29%) saturate(548%) hue-rotate(357deg) brightness(91%) contrast(91%);
    }
    .cover-page { text-align: center; }
    .cover-page .page-content { display: flex; flex-direction: column; align-items: center; justify-content: space-between; }
    .cover-page h1 { font-size: 16pt; margin: 2mm 0; }
    .cover-page .motto { margin-top: 5mm; font-size: 11pt; line-height: 1.7; }
    .cover-page .logo { width: 25mm; height: 25mm; margin: 5mm 0; }
    .cover-page .footer-text { position: absolute; bottom: 21mm; left: 0; right: 0; text-align: center; font-size: 9pt; line-height: 1.5; }
    .image-page { text-align: center; justify-content: center; }
    .image-page img { max-width: 100%; max-height: 100mm; object-fit: contain; }
    .image-page h2 { font-size: 11pt; margin-top: 4mm; }
    .prayer-page { text-align: center; line-height: 2; }
    .prayer-page h2 { font-size: 14pt; margin-bottom: 5mm; }
    .prayer-page .prayer-text { font-size: 12pt; }
    .prayer-page .mantra { font-size: 12pt; margin-top: 8mm; }
    .details-page { line-height: 1.3; font-size: 10pt; }
    .details-page .detail-section { margin-bottom: 5mm; }
    .details-page .detail-section p { margin: 1.5mm 0; }
    .details-page .seal { position: absolute; width: 40mm; height: 40mm; right: 10mm; top: 35mm; opacity: 0.8; z-index: 0; }
    .detail-item { display: flex; margin: 3mm 0; align-items: flex-end; position: relative; z-index: 1; }
    .detail-label { flex-shrink: 0; padding-right: 2mm; }
    .detail-value { flex-grow: 1; border-bottom: 0.5px solid #555; min-height: 18px; padding-left: 1mm; font-family: 'Noto Sans TC', sans-serif; }
    .teachings-page { font-size: 9.5pt; line-height: 1.5; }
    .teachings-page h2 { text-align:center; font-size: 14pt; margin-bottom: 4mm; }
    .teachings-page h3 { font-size: 11pt; margin-top: 3mm; margin-bottom: 1.5mm; }
    .teachings-page p, .teachings-page c4 { display: block; margin-bottom: 2mm; text-align: justify;}
    .teachings-page c4 { text-align:center;font-size: 11pt; margin-top: 1mm; margin-bottom: 1mm; }
  </style>
</head>
<body>

  <!-- 修改點: 將封面和封底合併到第一張 A5 紙上 -->
  <div class="a5-sheet full-bleed-sheet">
    <!-- 封面 (左半邊) -->
    <div class="page cover-page cover-background">
      <div class="page-content">
        <div>
          <h1 class="tibetan">སྐྱབས་སྡོམ་ཐོབ་ཡིག</h1>
          <h1>皈依證</h1>
          <h1 class="english">Refuge Vow Certificate</h1>
          <div class="motto">諸惡莫作 眾善奉行<br>自淨其意 是諸佛法</div>
          <img src="/logo.png" alt="Logo" class="logo">
        </div>
        <div class="footer-text">
          <span class="tibetan">ཀཿཐོག་རིག་འཛིན་ཆེན་པོའི་གཞུང་ལས་ཁང་ནས།</span><br>
          <span>噶陀仁珍千寶總會</span>
        </div>
      </div>
    </div>
    <!-- 封底 (右半邊)，從文件末尾移至此處 -->
    <div class="page cover-page cover-background">
        <div class="page-content">
            <div></div> <!-- 用於垂直對齊的空 div -->
            <div class="footer-text" style="font-size: 11pt;">
                <h2 class="tibetan" style="font-size: 12pt; margin-bottom: 5mm;">ཀཿཐོག་རིག་འཛིན་སྒྲུབ་སྡེའམ་ཐེག་མཆོག་དགའ་ཚལ་གཞུང་ལས་ཁང་།</h2>
                <span style="display: block; margin-bottom: 8mm;">噶陀仁珍千寶佛學會·妙乘法苑 發行</span>
                <h1 class="english" style="font-size: 10pt;">The Office of Kathog Rigzin Chenpo Practice Community or the Sublime Vehicle Joyful Grove</h1>
            </div>
        </div>
    </div>
  </div>


  <!-- 後續內容頁面維持不變 -->
  <div class="a5-sheet">
    <div class="page image-page">
      <img src="/img00001.jpg" alt="釋迦牟尼佛">
      <h2 class="tibetan">སྟོན་པ་ཟླ་མེད་རྒྱལ་བ་ཤཱཀྱའི་གཙོ །།</h2>
      <h2>無比導師釋迦牟尼尊</h2>
    </div>
    <div class="page image-page">
      <img src="/img00002.jpg" alt="蓮花生大士">
      <h2 class="tibetan">གསང་ཆེན་སྔགས་ཀྱི་སྟོན་པ་པདྨ་འབྱུང་།།</h2>
      <h2>密乘導師蓮花生大士</h2>
    </div>
  </div>

  <!-- A5 Sheet 3: Prayer Page (1) + Details Page (2) -->
  <div class="a5-sheet">
    <div class="page prayer-page">
      <div class="page-content">
        <h2>日誦皈依文</h2>
        <div class="prayer-text">
          <p>無上最勝佛法僧</p>
          <p>直至菩提我皈依</p>
          <p>六度萬行諸功德</p>
          <p>為利眾生願成佛</p>
        </div>
        <div class="mantra">
          <p class="tibetan">ཨོཾ་ཨཱཿཧཱུྃ་བཛྲ་གུ་རུ་པདྨ་སིདྡྷི་ཧཱུྃ།</p>
          <p>嗡阿吽 邊雜咕嚕貝瑪悉地吽</p>
        </div>
      </div>
      <div class="page-number">1</div>
    </div>
    <div class="page details-page">
      <div class="page-content">
        <img src="/seal.png" alt="印章" class="seal">
        <div class="detail-section">
          <p class="tibetan">སྟོན་པ། མཉམ་མེད་ཐུབ་པའི་དབང་པོ་ཤཱཀྱའི་རྒྱལ།</p>
          <p><strong>創教者：</strong>無等導師釋迦能仁王</p>
          <p class="english">The teacher: Peerless Lord of Sages, King of the Shakyas.</p>
        </div>
        <div class="detail-section">
          <p class="tibetan">སྐྱབས་སྡོམ་གནང་མཁན།།ཀཿཐོག་རིག་འཛིན་ཆེན་པོ་པདྨ་དབང་ཆེན།།</p>
          <p><strong>傳皈依戒師：</strong>噶陀仁珍千寶‧貝瑪旺晴</p>
          <p class="english">Bestower of the Refuge Vows: H.E. Kathog Rigzin Chenpo, Pema Wangchen</p>
        </div>
        <div class="detail-section" style="margin-top: 15mm;">
          <div class="detail-item"><span class="detail-label">皈依者 Refuge Preceptor：</span><span class="detail-value" id="recipient-name"></span></div>
          <div class="detail-item"><span class="detail-label">皈依日期 Date of Refuge：</span><span class="detail-value" id="refuge-date"></span></div>
          <div class="detail-item"><span class="detail-label">皈依地點 Place of Refuge：</span><span class="detail-value" id="refuge-place"></span></div>
          <!-- CORRECTED Dharma Name Section with IDs -->
          <div class="detail-item"><span class="detail-label">法名原文 Original Dharma Name：</span><span class="detail-value" id="dharma-name-original"></span></div>
          <div class="detail-item"><span class="detail-label">法名音譯 Phonetic Dharma Name：</span><span class="detail-value" id="dharma-name-phonetic"></span></div>
          <div class="detail-item"><span class="detail-label">法名譯意 Meaning of Dharma Name：</span><span class="detail-value" id="dharma-name-meaning"></span></div>
        </div>
      </div>
      <div class="page-number">2</div>
    </div>
  </div>

  
  <!-- 後續頁面... (請依照上面的結構繼續添加) -->
  
  <!-- A5 Sheet 4: 傳承法脈 + 所依經續師尊空行 -->
  <div class="a5-sheet">
    <div class="page teachings-page">
        <p class="tibetan">ཆོས་བརྒྱུད། བོད་བརྒྱུད་ནང་བསྟན། རྙིང་མ་དང་ཇོ་ནང་གཙོ་བོར་གྱུར་པའི་རིས་མེད།</p>
        <h3>傳承法脈：</h3>
        <p>藏傳佛教寧瑪與覺囊為主的無宗派。</p>
        <p class="tibetan">མདོ་གཞུང་། ཐེག་གསུམ་མདོ་སྡེ་སྤྱི་དང་སངས་རྒྱས་ཕལ་པོ་ཆེ། དགོངས་པ་ངེས་འགྲེལ། ལངྐར་གཤེགས་པ། གསེར་འོད་དམ་པ་སོགས་འཁོར་ལོ་ཐ་མའི་མདོ་སྡེ་ཉི་ཤུ།</p>        
        <h3>所依經：</h3>
        <p>三乘經典。主要為華嚴經、解深密經、楞伽經、金光明經等三轉法輪二十部了義經。</p>
        <p class="tibetan">སྔགས་གཞུང་། སྒྲ་ཐལ་འགྱུར་རྩ་བའི་རྒྱུད། གསང་བ་སྙིང་པོ། བཀའ་བརྒྱད། བདེ་མཆོག ཀྱེ་རྡོར། དུས་འཁོར། འཕྲིན་ལས་འདུས་པ་སོགས་རྒྱུད་སྡེ་བཞིས་བསྡུས་པ་ཐམས་ཅད།</p>
        <h3>主依密續：</h3>
        <p>四續所攝一切密續,主要為聲應成根本續、大幻網續、八大善逝、勝樂、喜金剛、時輪、度母事業總集等續。</p>
        <div class="page-number">3</div>
    </div>
    <div class="page teachings-page">
        <p class="tibetan">བླ་མ། པདྨ་འབྱུང་གནས། ནག་པོ་སྤྱོད་པ། ནམ་མཁའི་སྙིང་པོ་སོགས།</p>    
        <h3>所依上師：</h3>
        <p>蓮花生大士、大黑行者、虛空藏等師尊。</p> 
        <p class="tibetan">ཡི་དམ། རྡོ་རྗེ་སེམས་དཔའ། སྤྱན་རས་གཟིགས། དུས་འཁོར་སོགས་གོང་གསལ་རྒྱུད་སྡེ་དང་འབྲེལ་བ།</p>        
        <h3主修本尊：</h3>
        <p>金剛薩埵、觀世音菩薩、時輪金剛等,與以上續部相關諸本尊。</p>
        <p class="tibetan">མཁའ་འགྲོ། དམ་ཚིག་སྒྲོལ་མ། སྒྲོལ་མ་དོན་གྲུབ། གསང་པ་ཡེ་ཤེས། ནཱ་རོ་ནཱ་རོ་མཁའ་སྤྱོད་སོགས།</p>  
        <h3>所依空行母：</h3>
        <p>諸事成就度母、三昧耶度母、密慧佛母、那洛空行母等。</p>
        <p class="tibetan">ནོར་ལྷ། རྣམ་སྲས། མགོན་དཀར་ཡིད་བཞིན་ནོར་བུ་སོགས།</p>  
        <h3>所修財神：</h3>
        <p>財寶天王、白瑪哈嘎拉等。</p>    
        <p class="tibetan">སྲུང་མ། མྱུར་མཛད་མགོན་པོ། དཔལ་ལྡན་ལྷ་མོ། མ་གཟའ་དམ་གསུམ་སོགས།</p>  
        <h3>護法：</h3>
        <p>瑪哈嘎拉、吉祥天女、一髻佛母、羅睺羅、具善金剛等。</p>   
        <div class="page-number">4</div>
    </div>
  </div>
  
 
<!-- A5 Sheet 5: 日月年修法行 + 戒律 -->
  <div class="a5-sheet">
    <div class="page teachings-page">
         
        <p class="tibetan">ཉིན་རེའི་ཆོས་སྤྱོད། ཕྱག་འཚལ། མཆོད་འབུལ། སྐྱབས་འགྲོ། སྟོན་པའི་མཚན། བཛྲ་གུ་རུ། མ་ཎི། ཏཱ་རེ། རྡོར་སེམས་བཤགས་པ་སོགས་བྱའོ། །</p>  
        <h3>日修法行：</h3>
        <p>頂禮、供養、皈依，誦釋迦牟尼佛、蓮師、觀音、度母、金剛薩埵咒語及懺悔等。</p> 
        <p class="tibetan">ཟླ་མཆོད་ནི། ཚེས་བརྒྱད་གནམ་གང་སོགས་ལ་སྨྱུང་གནས་སྲུང་བ་དང་སྦྱིན་པ་གཏོང་། ཚེས་བཅུ་དང་ཉེར་ལྔ་ལ་ཚོགས་མཆོད། ཚེས་དགུ། བཅུ་དགུ། ཉེར་དགུ་སོགས་ལ་སྲུང་མ་མཆོད་པར་བརྩོན་ནོ། །</p>  
        <h3>月修功課：</h3>
        <p>農曆初八及三十受齋戒、行布施，初十、二十五日作薈供，農曆初九、十九、二十九供護法。</p>   
        <p class="tibetan">ལོ་མཆོད་ནི། སྟོན་པའི་དུས་ཆེན་བཞི། གུ་རུའི་ཚེས་བཅུ། ཀཿཐོག་རིག་འཛིན་ཚེ་དབང་ནོར་བུའི་འདས་མཆོད། རང་གི་བླ་མའི་འཁྲུངས་སྐར་སོགས་ལ་མཆོད་འབུལ། སྡོམ་པ་སྲུང་བ་དང་། མདོ་འདོན། རིག་སྔགས་བཟླ་བ། མཆོད་སྦྱིན་སོགས་བྱ།</p>  
        <h3>年修功課：</h3>
        <p>釋迦牟尼佛出生、成道、轉法輪、入涅槃等四大節日，仁珍才旺諾布圓寂日，上師生日等，行供養、齋戒、念經、持咒、布施等法行。</p> 
        <div class="page-number">5</div>
    </div>
    <div class="page teachings-page">
        <p class="tibetan">སྡོམ་པ། སྐྱབས་སྡོམ་མི་བརྗེད་པ་དང་། ཐུབ་པའི་བསྟན་པ་ཀུན་ལ་དག་སྣང་སྦྱོང་བ། བསྟན་འཛིན་སུ་ལའང་མི་སྨོད་པ། སེམས་ཅན་ཐམས་ཅད་ཕ་མ་ལྟ་བུ་དང་། མཆེད་གྲོགས་མ་ལུས་སངས་རྒྱས་ཀྱི་སྤྲུལ་བར་བསམ་དགོས། །རང་གི་ནུས་པ་དང་བསྟུན་པའི་ལུས་ངག་ལོང་སྤྱོད་བཏང་སྟེ་བསྟན་པ་སྤེལ་བ་དང་། དེ་ལྟར་མ་གྱུར་ཀྱང་ཉིན་རེར་བསྟན་དང་འགྲོ་བའི་དོན་ཆེན་འགྲུབ་པའི་སྨོན་ལམ་ཚར་གསུམ་མ་བརྗེད་པར་བྱ་དགོས། །དེ་ལྟར་བྱས་པས་སངས་རྒྱས་ཀྱི་ཕྲིན་ལས་སྤེལ། བསྟན་པ་ལ་བྱ་བ་བྱས། རང་གཞན་འབྲེལ་ཐོགས་མ་ལུས་པ་མི་རིང་བར་བདེ་ནས་བདེ་བ་སངས་རྒྱས་ཀྱི་སར་གྲོལ་བར་འགྱུར་རོ། །</p>  
        <h3>戒律：</h3>
        <p>不忘記皈依戒，對佛法發清淨心，不毀謗任何傳法師，如對父母般看待一切眾生，觀所有師兄弟為佛陀之化身，以自己的能力身口意、受用護持佛法，若無法如此行持，至少一天發三次宏揚佛法及利益眾生之願，能如此而行即為協助宏揚佛陀之事業、為法行，未來際自他結過法緣之眾生於樂處至樂境解脫、證得佛位。</p>    
        
        <div class="page-number">6</div>       
     </div>
  </div>


  <!-- A5 Sheet 6: 藏文戒律 + 藏文戒律 -->
  <div class="a5-sheet">
    <div class="page teachings-page">
        <p class="tibetan">
        སྟོན་པ་ཟླ་མེད་ཤཱཀྱ་ཐུབ་པའི་བསྟན་པ་རིན་པོ་ཆེའི་འཇུག་སྒོ་ཐུན་མོང་གི་བསླབ་བྱ་བཤད་པ་ལ་གསུམ། སྐྱབས་འགྲོའི། བསྙེན་གནས་ཀྱི། དགེ་བསྙེན་གྱི་བསླབ་བྱའོ། །དང་པོ་ལ། ཐུན་མིན་དཀོན་མཆོག་གསུམ་སོ་སོ་ལ་སྐྱབས་སུ་སོང་བའི་བསླབ་བྱ་དང་། གསུམ་ཀའི་ཐུན་མོང་གི་བསླབ་བྱའོ། །དང་པོ་ནི། བསླབ་བྱ་སྐྱབས་འགྲོ་ཐུན་མོང་མིན་གསུམ་ནི། །སྐྱབས་གཞན་མི་འཚོལ་སེམས་ཅན་འཚེ་བ་སྤོང་། མུ་སྟེགས་མི་འགྲོགས་སོ་སོར་གུས་བསྐྱེད་དོ། །ཞེས་པ་སྟེ། འདི་ལ་དགག་སྒྲུབ་གཉིས་ལས། དགག་པའི་བསླབ་བྱར། སངས་རྒྱས་ཆོས་དང་དགེ་འདུན་གསུམ་ལ་སྐྱབས་སུ་སོང་ནས་སོ་སོའི་བསླབ་བྱ་ནི་རིམ་པ་ཇི་ལྟ་བར། སྐྱབས་གཞན་འཇིག་རྟེན་པའི་ལྷ་ལ་རེ་ལྟོས་བཀལ་ནས་སྐྱབས་འགྲོ་མི་བྱ། སེམས་ཅན་ལ་གནོད་འཚེ་སྤོང་། གྲོགས་མུ་སྟེགས་ཅན་དང་མི་འགྲོགས་པ་སྟེ། དེ་དག་དང་འགལ་ན་དཀོན་མཆོག་གསུམ་པོ་དེ་དང་དེའི་སྐྱབས་འགྲོ་གཏོང་བའི་ཕྱིར། མྱང་འདས་ལས། གང་ཞིག་སངས་རྒྱས་སྐྱབས་འགྲོ་བ། །དེ་ནི་ཡང་དག་དགེ་བསྙེན་ཏེ། །ནམ་དུའང་ལྷ་ནི་གཞན་དག་ལ། །སྐྱབས་སུ་འགྲོ་བ་མ་ཡིན་ནོ།  །དམ་པའི་ཆོས་ལ་སྐྱབས་འགྲོ་བ། །འཚེ་ཞིང་གནོད་པའི་སེམས་དང་བྲལ། །དགེ་འདུན་ལ་ཡང་སྐྱབས་འགྲོ་བ། །མུ་སྟེགས་ཅན་དང་འགྲོགས་མི་བྱ། །ཞེས་སོ། །སྒྲུབ་པའི་བསླབ་བྱར། སངས་རྒྱས་ཀྱི་སྐུའི་རྟེན་སཙྪའི་ཆག་དུམ་ཙམ་དང་། ཆོས་ཀྱི་རྟེན་ཡིག་འབྲུ་གཅིག་ཙམ་དང་། དགེ་འདུན་གྱི་གཟུགས་ལྷན་པ་སེར་པོ་བཏབ་པ་ཡན་ཆད་ལ་དཀོན་མཆོག་དེ་དང་དེའི་འདུ་ཤེས་བཞག་ནས་གུས་པར་བྱ་བའོ། །གཉིས་པ་ནི། སྲོག་དང་བྱ་དགར་དཀོན་མཆོག་གསུམ་མི་སྤང་། དགོས་གལ་ཆེ་ཡང་ཐབས་གཞན་མི་འཚོལ་ཞིང་། དུས་མཆོད་མི་བཅག་རང་གཞན་སྐྱབས་འགྲོར་འགོད། །གར་འགྲོའི་ཕྱོགས་ཀྱི་སངས་རྒྱས་ལ་ཕྱག་འཚལ། །ལྔ་རྣམས་ཐུན་མོང་བསླབ་བྱར་ཇོ་བོ་བཞེད། །ཅེས་པ་སྟེ། སྲོག་དང་རྒྱལ་སྲིད་ལ་སོགས་པའི་ཆེད་དུའང་དཀོན་མཆོག་མི་སྤང་བ་དང་། དགོས་གལ་ཇི་ལྟར་ཆེ་ཡང་དཀོན་མཆོག་ལ་བློ་གཏོད་པ་ལས་འཇིག་རྟེན་པའི་ཐབས་གཞན་མི་འཚོལ་བ་དང་། རྟག་ཏུ་ཡོན་ཏན་དྲན་པས་དུས་ཀྱི་མཆོད་པ་མི་བཅག་པ་དང་། ཕན་ཡོན་ཤེས་པས་རང་སྐྱབས་སུ་འགྲོ་ཞིང་གཞན་དག་ཀྱང་འགྲོར་གཞུག་པ་དང་། གར་འགྲོའི་ཕྱོགས་ཀྱི་སངས་རྒྱས་དང་དེའི་སྐུ་གཟུགས་ལ་ཕྱག་འཚལ་བ་དང་ལྔའོ། །གཉིས་པ་ལ། དུས་ཁྲིམས་བསྙེན་གནས་དངོས་ཀྱི་བསླབ་བྱ་དང་། དེ་གཏན་ཁྲིམས་སུ་བྱས་ན་གོ་མིའི་དགེ་བསྙེན་དུ་འགྲོ་ཚུལ་ལོ། །དང་པོ་ནི། རྩ་བཞི་སྤོང་བ་ཚུལ་ཁྲིམས་ཡན་ལག་བཞི། །ཆང་སྤོང་བག་ཡོད་ཡན་ལག་མལ་ཆེ་མཐོ། །གར་ཕྲེང་ལ་སོགས་ཕྱི་དྲོའི་ཁ་ཟས་གསུམ། །བརྟུལ་བཞུགས་ཡན་ལག་བསྙེན་གནས་སྡོམ་པ་ཡིན། །ཡན་ལག་འདི་བརྒྱད་གཏན་དུ་མ་ཡིན་པས། །ཡོན་ཏན་རྟེན་མིན་དེ་ཕྱིར་སོ་ཐར་ནི། །མཚན་ཉིད་ལྡན་པ་རིགས་བདུན་ཁོ་ན་ཡིན། །ཞེས་པ་སྟེ། མཛོད་ལས། ཚུལ་ཁྲིམས་ཡན་ལག་བག་ཡོད་པའི། །ཡན་ལག་བརྟུལ་ཞུགས་ཡན་ལག་སྟེ།།བཞི་གཅིག་དེ་བཞིན་གསུམ་རིམ་བཞིན། །</p>
        
        <div class="page-number">7</div>
    </div>
    <div class="page teachings-page">
        <p class="tibetan">
        ཞེས་པ་ལྟར་མི་ཚངས་སྤྱོད་སོགས་རྩ་བའི་ལྟུང་བ་བཞི་སྤོང་བ་ཚུལ་ཁྲིམས་ཀྱི། ཆང་སྤོང་བ་བག་ཡོད་ཀྱི། མལ་ཆེ་མཐོ་དང་། གར་སོགས་ཕྲེང་སོགས་དང་། དུས་མ་ཡིན་པའི་ཁ་ཟས་ཏེ་གསུམ་སྤོང་བ་བརྟུལ་ཞུགས་ཀྱི་ཡན་ལག་སྟེ། ཡན་ལག་འདི་བརྒྱད་པོ་ཉིན་ཞག་གི་མཐའ་ཚུན་ཆད་དུ་ཁས་བླངས་པའི་དུས་ཁྲིམས་ཡིན་གྱི་གཏན་ཁྲིམས་མ་ཡིན་པས་སྡོམ་པ་གོང་མ་རྣམས་ཀྱི་ཡོན་ཏན་གྱི་རྟེན་དུ་མི་རིགས་པའི་ཕྱིར་མ་ཡིན་ལ། དེས་ན་གོང་མའི་ཡོན་ཏན་གྱི་རྟེན་དུ་གྱུར་པའི་མཚན་ཉིད་ཅན་ནི་རིགས་བདུན་ཉིད་དུ་ངེས་ཏེ། ལམ་སྒྲོན་ལས། སོ་སོ་ཐར་པ་རིགས་བདུན་གྱི། །རྟག་ཏུ་སྡོམ་གཞན་ལྡན་པ་ལ། །བྱང་ཆུབ་སེམས་དཔའི་སྡོམ་པ་ཡི། །སྐལ་པ་ཡོད་ཀྱི་གཞན་དུ་མིན། །ཞེས་གསུངས་པ་ལྟར་རོ། །གཉིས་པ་ནི། འདི་བརྒྱད་ཇི་སྲིད་འཚོ་ཡི་བར་བསྲུངས་ན། །གོ་མིའི་དགེ་བསྙེན་ཡིན་ཀྱང་ཡོད་སྨྲའི་མིན། །གནས་བརྟན་སྡེ་པའི་ལུགས་སུ་དབྱིག་གཉེན་བཞེད། །ཅེས་པ་སྟེ། གསོ་སྦྱོང་ཡན་ལག་བརྒྱད་ཇི་སྲིད་འཚོའི་བར་དུ་ཁས་ལེན་པ་གོ་མིའི་དགེ་བསྙེན་ཏེ། འདི་གཞི་ཐམས་ཅད་ཡོད་པར་སྨྲ་བའི་འདུལ་བ་ལས་མ་བཤད་ནའང་། འཕགས་པ་གནས་བརྟན་པའི་སྡེ་པའི་ལུགས་སུ་དབྱིག་གཉེན་བཞེད་དེ། གོ་མིའི་དགེ་བསྙེན་ཞེས་བྱ་བ་འདི་ནི་འཕགས་པ་གནས་བརྟན་པའི་མན་ངག་བརྒྱུད་པ་ལས་ཐོས་ཀྱི་བདེ་བར་གཤེགས་པས་གསུངས་པ་ནི་མ་མཐོང་ངོང་། ཞེས་གསུངས་པའི་ཕྱིར། འོན་ཀྱང་ཐེག་ཆེན་གྱི་སྡེ་སྣོད་ལས་གསུངས་ཏེ། རྒྱལ་བུ་སྙིང་རྗེ་ཆེར་སེམས་ཀྱིས་བསྙེན་གནས་ཡན་ལག་བརྒྱད་ཇི་སྲིད་འཚོའི་བར་དུ་བླངས་པར་དཀོན་བརྩེགས་ལས་བཤད་པའི་ཕྱིར་རོ། །གསུམ་པ་དགེ་བསྙེན་གྱི་བསླབ་བྱ་ལ་གསུམ་སྟེ། དགེ་བསྙེན་གྱི་སྤང་བྱ་ལྔ་ངོས་བཟུང་། དེ་བསྲུང་ཚུལ་གྱི་གྲངས་ལས་དགེ་བསྙེན་གྱི་དབྱེ་བ་བཤད། ཕྱོགས་མཐུན་གྱི་བསླབ་བྱ་བསྟན་པའོ། །དང་པོ་ནི། གསོད་རྐུ་རྫུན་སྨྲ་འདོད་པས་ལོག་པར་གཡེམ། །མྱོས་འགྱུར་སྤོང་རྣམས་དགེ་བསྙེན་སྡོམ་པ་སྟེ། །ཞེས་པས་དགེ་བསྙེན་གྱི་སྤང་བྱ་ལ་རྩ་བ་དང་། ཡན་ལག་གཉིས་ལས། རྩ་བ་ནི་བཞི་སྟེ། སྲོག་གཅོད་པ་དང་། མ་བྱིན་པར་ལེན་པ་དང་། འདོད་པས་ལོག་པར་གཡེམ་པ་དང་།  རྫུན་དུ་སྨྲ་བའོ། །འདི་དག་ལ་ཡུལ་གྱི་ཡན་ལག་ཏུ་མི་ཡིན་པ་དགོས་ཏེ། དེ་མ་ཚང་ན་རྩ་བར་གཏོགས་པའི་ཉེས་པ་ཙམ་དུ་ཟད་ཀྱི། རྩ་བ་དངོས་མ་ཡིན་པས་སྡོམ་པ་ཉམས་པར་མི་འགྱུར་ཞིང་། འདིར་བསླབ་གཞིར་མི་ཚངས་སྤྱོད་མི་འཇོག་པར་འདོད་ལོག་འཇོག་པ་ནི། ཁྱིམ་པས་བསྲུང་སླ་བ་ལ་སོགས་ཀྱི་ཕྱིར་ཏེ། མཛོད་ལས། ལོག་གཡེམ་ཤིན་ཏུ་དམད་ཕྱིར་དང་། སླ་ཕྱིར་མི་བྱེད་ཐོབ་ཕྱིར་རོ། །ཞེས་སོ། །ཡན་ལག་ནི། མྱོས་འགྱུར་སྤོང་བ་སྟེ། དེ་མ་སྤངས་ན་བསླབ་པ་གཞན་རྣམས་བསྲུང་མི་ནུས་པའི་ཕྱིར། དེ་ལས། བཅས་པའི་ཁ་ན་མ་ཐོ་བ། ། མྱོས་འགྱུར་ལས་གཞན་སྲུང་ཕྱིར་རོ། །ཞེས་སོ། །</p>
        
        <div class="page-number">8</div>
    </div>
  </div>

  <!-- A5 Sheet 7: 藏文戒律 + 藏文戒律 -->
  <div class="a5-sheet">
    <div class="page teachings-page">
        <p class="tibetan">གཉིས་པ་ལ། དེ་ལས་ཕྱེ་བ་ཉན་ཐོས་སྡེ་པའི་ལུགས་དང་། དེ་ལས་གཞན་པ་སྡེ་པ་གཞན་གྱི་ལུགས་སོ། །དང་པོ་ནི། གང་འདོད་ཁས་ལེན་གྲངས་ལྟར་སྣ་གཅིག་སྤྱོད། །སྣ་འགའ་ཕལ་ཆེར་སྤྱོད་དང་ཡོངས་རྫོགས་སྤྱོད། །གཅིག་གཉིས་གསུམ་དང་ལྔ་སྤོང་ཞེས་པ་སྟེ། །སྐྱབས་འགྲོ་བླང་ནས་དེའི་བསླབ་བྱ་ཙམ་བསྲུང་བ་སྐྱབས་གསུམ་འཛིན་པའི་དགེ་བསྙེན་ཞེས་སྔར་བཤད་པ་དེ་ལ། ཉི་འོག་པ་དང་མདོ་སྡེ་པ་དག དེ་དགེ་བསྙེན་གྱི་སྡོམ་པ་མ་ཡིན་ཡང་དགེ་བསྙེན་མཚན་ཉིད་པ་ཡིན་ཟེར། བྱེ་བྲག་ཏུ་སྨྲ་བ། དགེ་བསྙེན་གྱི་སྡོམ་པ་མེད་ན། དེ་དགེ་བསྙེན་མཚན་ཉིད་པ་མ་ཡིན་པར་འདོད། བཤད་མ་ཐག་པའི་དགེ་བསྙེན་གྱི་སྤང་བྱ་ལྔ་ལས། སྲོག་གཅོད་ཙམ་སྤོང་བ་སྣ་གཅིག་སྤྱོད་པ་དང་། དེའི་སྟེང་མ་བྱིན་ལེན་ཙམ་སྤོང་བ་སྣ་འགའ་སྤྱོད་པ་དང་། དེ་གཉིས་ཀྱི་སྟེང་རྫུན་དང་གསུམ་སྤོང་བ་ཕལ་ཆེར་སྤྱོད་པ་དང་། དེ་གསུམ་གྱི་སྟེང་དུ་འདོད་ལོག་དང་ཆང་སྟེ་ལྔ་ཆར་སྤོང་བ་ཡོངས་རྫོགས་དགེ་བསྙེན་ནོ། །དེ་བཞི་ལ་བྱེ་བྲག་ཏུ་སྨྲ་བ་ལྟར་ན། སྡོམ་པ་ལེན་པའི་ཚེ་དགེ་བསྙེན་ཙམ་དུ་ཁས་བླངས་ནས་ཕྱིས་བསྲུང་དུས་སྣ་གཅིག་སོགས་གང་འདོད་བསྲུང་བ་ལ་དེ་དག་སྤྱོད་ཅེས་འདོད་དེ། མཛོད་ལས། སྣ་གཅིག་སྤྱོད་སོགས་ཇི་ལྟ་བུ། །དེ་བསྲུང་བ་ལ་བསྲུང་ཞེས་གྲགས། །ཞེས་སོ། །མདོ་སྡེ་པ་ལྟར་ན། ལེན་པའི་ཚེ་བདག་སྣ་གཅིག་སྤྱོད་པའི་དགེ་བསྙེན་དུ་བཟུང་དུ་གསོལ་ཞེས་པ་ལྟ་བུ་གང་འདོད་ཁས་བླངས་ནས་དེ་བསྲུང་བ་སྟེ། དེ་ལས་གཞན་དུ་ཡོངས་རྫོགས་བླངས་ནས་ཕྱིས་དེ་མ་བསྲུངས་ན་ཚུལ་འཆལ་དུ་འགྱུར་བའི་ཕྱིར། ཞེས་འདོད་དོ། །གཉིས་པ་ནི། དེ་ཡི་སྟེང་། མི་ཚངས་སྤྱོད་སྤོང་ཚངས་སྤྱོད་དགེ་བསྙེན་ནོ། །འདི་དང་གོ་མི་གཉིས་ནི་ཁྱིམ་པ་དང་། རབ་བྱུང་གཉིས་ཀ་མིན་ཞེས་མཁས་རྣམས་བཞེད།། ཅེས་པ་སྟེ། ཡོངས་རྫོགས་དགེ་བསྙེན་གྱི་སྤང་བྱའི་སྟེང་མི་ཚངས་སྤྱོད་སྤོང་བ་ནི་ཚངས་སྤྱོད་ཀྱི་དགེ་བསྙེན་ཏེ། རྒྱན་གྱིས་བརྒྱན་པར་བྱས་ཀྱང་ཆོས་སྤྱོད་ལ། །ཞེས་སོགས་ཀྱིས་བསྟན་པར་མདོ་སྡེ་པ་འདོད་ཅིང་། འདི་དང་གོ་མིའི་དགེ་བསྙེན་གཉིས་ཆོ་འཕྲུལ་བསྟན་པའི་མདོ་ལས་ཀྱང་གསུངས་ཏེ། ཇི་སྐད་དུ། རབ་བྱུང་ཡོན་ཏན་དུ་མ་ལྡན་པ་ཞེས། །དེ་བཞིན་གཤེགས་པ་རྣམས་ཀྱིས་བསྔགས་མོད་ཀྱི། །སེམས་ཅན་ཀུན་ལ་སྙིང་རྗེར་གྱུར་པས་ན། །འགྲོ་ལ་ཕན་ཕྱིར་བདག་གིས་རྒྱལ་སྲིད་སྒྲུབ། །ཇི་སྲིད་འཚོའི་བར་ཚངས་པར་སྤྱོད་བྱེད་ཅིང་།  གསོ་སྦྱོང་ཡན་ལག་བརྒྱད་པའང་བླང་བར་བགྱི། ། ཞེས་གསུངས་པའི་ཕྱིར། འདི་གཉིས་ཁྱིམ་པ་དང་རབ་བྱུང་གཉིས་ཀ་མ་ཡིན་ཏེ། ཁྱིམ་ཐབ་སྤང་བས་འདོད་པ་འཁྲིག་བཅས་ཀྱི་ཁྱིམ་པ་མ་ཡིན་པ་གང་ཞིག རབ་བྱུང་གི་རྟགས་མ་བླངས་པས་དེ་ཡང་མ་ཡིན་པའི་ཕྱིར་རོ། །</p>      
        <div class="page-number">9</div>
    </div>
    <div class="page teachings-page">
        <p class="tibetan">གསུམ་པ་དགེ་བསྙེན་གྱི་ཕྱོགས་མཐུན་གྱི་བསླབ་བྱ་ལ། དངོས་དང་། སྔགས་པ་ཁྱིམ་པས་ཀྱང་འདུལ་བའི་བསླབ་བྱ་ལ་གཅེས་སྤྲས་བྱ་དགོས་པར་གདམས་པའོ། །དང་པོ་ནི། མི་དགེ་ལྷག་དྲུག་ཕྱོགས་མཐུན་སྤང་བྱ་དང་། ཞེས་པ་སྟེ། སྤྱིར་མི་དགེ་བ་བཅུ་ལས་མི་གསོད་པ་སོགས་ལུས་ཀྱི་ལས་གསུམ་དང་། ངག་གི་རྫུན་སྨྲ་བ་རྣམས་ནི་རྩ་བ་ཡིན་པའི་ཕྱིར། དེ་བཞི་བྱུང་ན་སྡོམ་པ་གཏོང་བས་སླར་བླང་བར་བྱ་ཞིང་། མི་མ་ཡིན་གསོད་པ་སོགས་བཞི་དང་ཆང་འཐུང་བའི་ཉེས་པ་སྟེ་ལྔ་བྱུང་ན་སྡོམ་ལྡན་གྱི་དྲུང་དུ་བཤགས། དེ་ལས་གཞན་པ་ཕྲ་མ་སོགས་ངག་གི་ལས་གསུམ་དང་ཡིད་ཀྱི་གསུམ་སྟེ་མི་དགེ་བ་ལྷག་མ་དྲུག་ནི་ཕྱོགས་མཐུན་གྱི་སྤང་བྱ་སྟེ། དེ་དག་ཀྱང་འགྱོད་སྡོམ་གྱི་སེམས་ཀྱིས་ཕྱིར་འཆོས་པར་བྱ་བ་ཡིན་ནོ། །གཉིས་པ་ནི། དགེ་བསྙེན་སྡོམ་ལྡན་རིག་པ་འཛིན་པས་ཀྱང་། རབ་བྱུང་རྟགས་དང་ཆོ་ག་མ་གཏོགས་པ། །ལྷག་རྣམས་ཉམས་སུ་ལེན་པར་དཔུང་བཟང་བཤད། །ཅེས་པ་སྟེ། དགེ་བསྙེན་གྱི་སྡོམ་ལྡན་སྔགས་ལ་ཞུགས་པ་ཡིན་ན། དེ་ལྟ་བུའི་དགེ་བསྙེན་རིག་པ་འཛིན་པ་དེས་ཀྱང་། ངུར་སྨྲིག་བགོ་བ་དང་ལྷུང་བཟེད་འཆང་བ་སོགས་རབ་བྱུང་གི་རྟགས་ཀྱི་བསྐོར་དང་། ལས་ཀྱི་ཆོ་ག་དང་བཅས་རྐྱང་འགའ་ཞིག་མ་གཏོགས་ལྷག་མ་རྣམས་འདུལ་བ་ནས་ཇི་ལྟར་འབྱུང་བ་བཞིན་དུ་ཉམས་སུ་ལེན་དགོས་པར་གསུངས་ན་སྔགས་པ་རབ་བྱུང་གིས་ལྟ་སྨོས་ཀྱང་ཅི་དགོས་ཏེ། དཔུང་བཟང་ལས། རྒྱལ་བ་ངས་གསུངས་སོ་སོ་ཐར་པ་ཡི། །ཚུལ་ཁྲིམས་རྣམ་དག་འདུལ་བ་མ་ལུས་ལས། །སྔགས་པ་ཁྱིམ་པས་རྟགས་དང་ཆོ་ག་སྤང་། །ལྷག་མ་རྣམས་ནི་ཉམས་སུ་བླང་བར་བྱ། །ཞེས་གསུངས་པའི་ཕྱིར་རོ།།   །།ཞེས་དཔག་བསམ་སྙེ་མ་ལས་ཁོལ་དུ་བྱུང་བའོ། །</p>    
        <div class="page-number">10</div>
    </div>
  </div>

 <!-- A5 Sheet 8: 中文戒律 + 中文戒律 -->
  <div class="a5-sheet">
    <div class="page teachings-page">
      <h3>無比釋迦牟尼佛寶教共同學處 分說三品：</h3> 
      <p>初、皈依學處。二、近住律儀 。三、近事律儀。</p> 
      <h3>初品 分二：</h3>
      <p>一、別說三寶各別皈依學處。二、三寶共通學處。</p>          
      <h3>一、別說皈依不共學處：</h3>
      <p>此有三，如頌云：「不求餘護、不害有情、不交外道而於三寶各別恭敬也。」此有止、修二門。</p>  
      <p>遮止學處者：既皈依佛法僧三寶，其各別學處依次為：不依世間諸天求護、斷傷害有情心、不與外道住。若違此三，則失三寶皈依故。《涅槃經》云：「若人皈依佛，是名真居士，終不更皈依，其餘諸天神。皈依於正法，離殺害之心。亦皈依僧伽，不共外道住。」如是說。</p>             
      <p>修行學處者：於佛身依處乃至泥塑（如擦擦）殘片、於法依處乃至一字、於僧伽形相乃至黃布片補丁以上，皆應作三寶想而恭敬之。</p>
      <div class="page-number">11</div>
    </div>
    <div class="page teachings-page">
      <h3>二、共通學處者：</h3>
      <p>「縱遇命難利養不捨三寶，雖有要事不求他法，恆念功德不斷時供，了知勝利自皈令他皈，所往方所禮敬彼佛。此五為共通學處，大德阿底峽如是說。」</p>          
      <p>如此謂縱為性命王位等亦不捨三寶；無論要事如何重大，唯依三寶不求世間他法；恆念功德不斷時供；知其利益自當皈依並令他人皈依；所往方所禮敬彼方佛及佛像，凡五也。</p>
      <h3>第二品 近住律儀分二：</h3>
      <p>一、近住時戒正行學處。二、若轉為恆戒則成八戒居士（གོ་མི་དགེ་བསྙེན།）之理。</p>   
      <h3>一、近住時戒者：</h3>
      <p>「斷四根本為戒分四支，離酒為不放逸支，高廣床座、歌舞花鬘、非時食三為苦行支，此八支齋戒也。」</p> 
      <p>此八支非恆常戒，不堪為上品功德所依，故具德相之別解脫唯七眾耳。</p>  
      <p>《俱舍論》云：「戒分不放逸，苦行支次第，四一三如是。」</p> 
    <div class="page-number">12</div>
    </div>
  </div>

 <!-- A5 Sheet 9: 中文戒律 + 中文戒律 -->
  <div class="a5-sheet">
    <div class="page teachings-page">
      <p>如此謂斷離邪淫等四根本罪為戒分，離酒為不放逸分，離高廣床座、歌舞花鬘、非時食三為苦行分。此八支限一日夜受持，為時戒非恆戒，不堪為上品戒功德所依，故非別解脫戒。是故堪為上品功德所依之具德相者，決定唯七眾。《道炬論》云：「別解脫律儀，恆具七眾戒，餘則無菩薩，戒律儀緣分。」如是說。</p> 
      <h3>二、八戒居士者：</h3>       
      <p>「若此八支盡形壽受持，名八戒居士，雖非一切有部所說，然為聖者上座部傳承，世親論師如是許。」</p>  
      <p>此謂八戒居士之名，從聖者上座部口訣傳承中聞，未見善逝佛陀親說。然大乘經存有此說，如《寶積經》載：大悲王子盡形壽受八關齋戒故。</p>  
      <h3>第三品 近事律儀分三：</h3>
      <p>一、居士五種所斷。二、從守護差別明居士種類。三、示相順學處。</p> 
      <h3>一、居士五種所斷：</h3>
      <p>「殺盜邪淫妄，及斷諸醉品，是為居士戒。」</p>        

      <div class="page-number">13</div>
    </div>
    <div class="page teachings-page">
        <p>此故居士所斷有根本與分支二者，根本有四：殺生、不與取、邪淫、妄語，此須對境為人，若非如此，僅違犯根本戒相攝之罪，非根本罪主體，故不失毀。</p>        
        <p>於此學處之基不立非梵行而立邪淫者，以在家易守故。《俱舍》云：「邪淫極可呵，易斷易不作。」如是說。</p>        
        <p>支分者：斷諸醉品。若不斷此，不能護餘學處故。彼論云：「遮罪除醉外，為護餘律儀。」如是說。</p>        
        <h3>二、居士種類：</h3>
        <p>此又分：聲聞部派之規，及餘部他規也。</p>        
        <p>其一：「隨欲受持，依數而有一分行、少分行、多分行、圓滿行，斷一二三五之別。」</p>        
        <p>「皈依後僅守皈依學處者，名三皈居士也，此如向者所說。日下部（ཉི་འོག་པ་）、經部許為雖非居士戒，然為具德相之居士也。說一切有部許無居士戒則非具德居士也。</p>
        <p>如上所述，僅斷殺生為一分；其上復斷不予取為少分行；此二之上，更斷妄語共三為多分行；此三之上，全邪淫、飲酒五分具斷者，為圓滿居士也。</p>
        <div class="page-number">14</div>
    </div>
  </div>
        
 <!-- A5 Sheet 10: 中文戒律 + 中文戒律 -->
  <div class="a5-sheet">
    <div class="page teachings-page">
    <p>此四種中，有部主張：受戒時僅許為居士，爾後隨欲守一分等，皆名「持」。《俱舍》云：「何言一分等？謂約能持說。」</p>
    <p>經部如此主張：受時即許「願受一分居士。」如是等隨所許而守，否則具全受已而不持守，成毀犯故。</p> 
    <p>餘部之說：「圓滿居士上更斷梵行者，名梵行居士也。」此與八戒居士具非在家、出家，此乃智者所許。</p> 
    <p>圓滿居士所斷者之上，復更斷除非梵行者，云梵行居士也，雖以瓔珞莊嚴其身，然行法行，如是等義，乃經部宗所欲宣說。</p>
    <p>此與八戒居士二者，於《示現神變經》中亦有所述，如云：「出家德無量，諸佛所讚嘆，然利有情故，我修王位業，盡形守梵行，亦受八齋戒。」此故二者具非出家在家，離家室欲樂故非在家，未受出家相故亦非出家也。</p>
    <h3>三、相順學處分二：</h3>
    <p>一、實際學處。二、教誡在家咒師亦須殷行律藏學處。</p>
    <div class="page-number">15</div>
    </div>
    <div class="page teachings-page">
    <h3>一、實際學處：</h3>
    <p>「餘六不善為相順所斷。」</p>
    <p>如此謂總的十不善中，不殺等身三業及語業之妄語為根本故，若違犯此四則失戒律，須重受。若殺非人等四及飲酒五罪，於具戒者前懺。餘兩舌等語三業、意三業共六不善業為相順所斷，仍須以追悔防護之心改過也。</p> 
    <h3>二、教誡在家咒師：：</h3>
    <p>「居士密咒持明者，惟除僧相及羯磨，餘者實修《蘇婆》說。」</p> 
    <p>如此謂若具居士戒者入於密咒實修，除著袈裟、持缽盂等出家相及少數羯磨儀軌，餘者亦須遵循律藏所說而實行，在家咒師若此，出家咒師更不待言。《蘇婆經》云：「勝者我說別解脫，無餘清淨戒律儀，在家咒士除僧相，羯磨餘悉當修學。」如此說故也。</p>
    <p>此乃錄自《如意寶樹穗》。</p>
    <div class="page-number">16</div>
    </div>
  </div>
     
  <!-- A5 Sheet 11: 戒律攝要 + 戒律攝要 -->
  <div class="a5-sheet">
    <div class="page teachings-page">
    <h3>皈依學處攝要分三：</h3>
    <p>所捨學處、所取學處、通分學處。</p>
    <h3>一、所捨學處</h3>
    <p>(一)皈依佛後，不能皈依世間鬼神。</p>
    <p>(二)皈依法後，不能傷害有情。</p>
    <p>(三)皈依僧後，不能與外道者同居。外道者，包括恨自己金剛上師及毀謗三寶者。</p>
    <h3>二、所取學處</h3>
    <p>(一)皈依佛後，要恭敬佛陀聖像。</p>
    <p>(二)皈依法後，要恭敬經典等法寶。</p>
    <p>(三)皈依僧後，要恭敬僧眾。</p>
    <p>不僅恭敬真實三寶，連破碎的佛像、經書的任一字、僧衣的任一布片等，也要當做真實三寶，虔以頂禮，放置清淨處。</p>
    <div class="page-number">17</div>
    </div>
    <div class="page teachings-page">
    <h3>三、通分學處</h3>
    <p>(一)因皈依佛，故視善知識如佛，恆常尊敬。</p>
    <p>(二)因皈依法，故視善知識之言語如法語，不可違背。</p>
    <p>(三)因皈依僧，故視善知識之眷屬及佛門皈依者如道友，身口意三門清淨恆恭敬。</p>
    <p>另依阿底峽尊者所提「五共通學處」：</p>
    <p>(一)縱遇命難，亦不捨皈依戒。</p>
    <p>(二)縱獲各種財惑、利誘，亦不捨皈依戒。</p>
    <p>(三)於遇任何災難困境，亦不捨皈依戒，並只求三寶加持。是困境如病，三寶事業如藥，善知識如醫生，審慎明觀。</p>
    <p>(四)任何去處，恆頂禮往處之三寶。</p>
    <p>(五)每日恆念三寶及皈依偈。並常勸他人皈依三寶。</p>
    <div class="page-number">18</div>
    </div>
  </div>

  <!-- A5 Sheet 12: 戒律攝要 + 歷代上師簡介 -->
  <div class="a5-sheet">
    <div class="page teachings-page">
    <h3>於四行為間(行、食、坐、臥)皆以善巧方便法，時刻不忘三寶，即：</h3>
    <p>1、行時觀想三寶、上師坐於右肩，自己繞三寶、上師而行。</p>
    <p>2、食時觀想三寶、上師於喉間供養，或食用前先供養三寶、上師。</p>
    <p>3、坐時觀想三寶、上師於頂輪。</p>
    <p>4、眠臥時觀想三寶、上師於心輪，心止於此而入眠。</p>    
    <div class="page-number">19</div>
    </div>
    <div class="page teachings-page">
    <h3>皈依仁波切簡介</h3>
    <p>噶陀大持明（仁珍千寶），為噶陀及覺囊之至高無上師，並且有很多著作。上師殊勝化身之體性乃極樂世界的怙主阿彌陀佛，由諸佛意大智慧的本質中變化種種不同身相，示現為釋迦牟尼佛身邊的羅漢優婆離尊者、南瞻部洲六嚴二勝中精通戒律學的功德光、印度八大持明中受持意揚大嘿嚕嘎的吽千嘎啦等，如是代代清淨如蓮花鬘般，而至此世噶陀大持明（仁珍千寶）。</p>    
    <p>以下略述於覺囊世系為主之轉世：</p>  
    <h3>第一世</h3>
    <p>薩桑瑪底班禪。1294-1376，法名-羅珠堅參，出生於阿里地區，四歲即精通彌勒五論，西藏非常有名的學者，多伯巴大師十四大弟子之一，宗喀巴大師的上師之一，著作至今仍存的有五大冊。</p>  
    <h3>第二世</h3>
    <p>杰尊更噶秋珠。1420-，學習藏傳佛教各教派，宏揚了義他空及大圓滿法，十二年閉關實修時輪金剛六支加行，氣心自在獲得煉丹成就，依幻身至香巴拉淨土受法，活至一百三十歲左右，幻身融入時輪金剛身。其著名弟子有更噶卓秋等。</p>  
   <div class="page-number">20</div>
    </div>
  </div>

  <!-- A5 Sheet 13: 歷代上師簡介 -->
  <div class="a5-sheet">
    <div class="page teachings-page">
      <h3>第三世</h3>
      <p>定吉王子，法名為耶西嘉措。1585-，出生於定吉王族，至尊多羅納塔大師認證為薩桑班禪的化身，為其舉行座床典禮，同時承許為自己的另一化現，至藏傳佛教薩迦、寧瑪、格魯等各派學習經論，非常出名。圓滿時輪金剛三年三個月閉關修持，獲得十相大自在成就。著作有時輪金剛不共灌頂、勝樂金剛及六種教傳之講記、大中觀的解釋等。</p>          
      <h3>第四世</h3>
      <p>（自此為噶陀派世系起始，許為第一世）</p> 
      <p>噶陀大持明（仁珍千寶），仁珍貝瑪諾布，1599-1679，法名更桑智美，於噶陀兩位伏藏師敦都及龍薩坐下學習噶陀諸種教法，大德貝瑪羅珠學習諸多顯宗經典，於山上閉關七年修習菩提心，一生中大部份時間行閉關修持。</p>
      <h3>第五世</h3>
      <p>仁珍才旺諾布（噶陀派世系許為第二世），1698 - 1755，是位著名於世、時號稱為喜馬拉雅山區十三國之偉大國師，弟子眾多，特別是為尊貴遍知第七世達賴喇嘛、怙主大寶法王噶瑪巴、二位尼泊爾王、二位拉達克王和德格王等的上師。</p>  
      <div class="page-number">21</div>
    </div>
    <div class="page teachings-page">
      <p>無私的重修尼泊爾三座大佛塔及重振百餘噶陀寺，並展開仁珍千寶傳承。</p> 
      <p>總計寫過八本書，包含大手印、大圓滿等齊全修行儀軌及法要。特別推廣香巴噶舉及覺囊派法門，提倡藏傳佛教無宗派思想導師之一。</p> 
      <h3>第六世</h3>
      <p>仁珍慈仁札西，1769-1708 （應為1769-1780或卒年有誤），五歲為巴窩仁波切及十三世大寶法王等共同認證，不久後即圓寂。</p> 
      <h3>第七世</h3>
      <p>仁珍雷吉多傑，1792 - 1872，是頗具知名、偉大的安樂主（即諸侯王爺）得到西藏政府和中國同治皇帝的表彰，並賜予真實利益的「安樂主」章。為佛法廣揚多處的上師，並取出寂靜、忿怒蓮師伏藏法，重建尼泊爾、西藏佛寺無數，傳授噶陀仁珍千寶傳承法門於多處。</p> 
      <h3>第八世</h3>
      <p>仁珍久美熱殿，1885 - 1959，為第一世敦珠法王心子之一，德行兼備，法性自力通達、智慧高廣、心意之大力具足、弟子無數、眾所皆知的伏藏大師，傳授噶陀仁珍千寶傳承法門於多處。</p>
      <div class="page-number">22</div>
    </div>
  </div>

  <!-- A5 Sheet 14: 上師此世簡介 -->
  <div class="a5-sheet">
    <div class="page teachings-page">
      <h3>第九世</h3>
      <p>仁珍貝瑪旺晴蒙藏後裔，幼時即為康倉大伏藏師、多客珠仁波切、白玉寺嘎瑪恰美仁波切、夏札瑞薩仁波切、果巴祖古仁波切等，認證為噶陀仁珍千寶才旺諾布的轉世，於藏傳佛法領域，除自之噶陀仁珍千寶傳承外，持有噶陀、白玉、隆欽、敦珠、噶舉、覺囊等傳承，其聞思修過程及其講著略述：</p> 
      <p>七至十六歲於如父之上師圖滇諾布指導下，學習藏文及藏密各種儀軌、手印、唱頌、講解、醫藥、地理風水、天文曆算等，獲得噶陀仁珍千寶部份法門、多羅納塔大師的「勝樂金剛耳傳」、達普巴的度母密法等遍學菩薩道。</p> 
      <p>冬、夏期間於上師帶領下：</p> 
      <p>於果巴祖古座下修學那洛六法、噶舉巴瑪哈嘎拉事業部及佈陣法等。於堪欽益西嘉措座下，學習三律論、入菩薩行、慈氏五論、四加行、藏密氣功等。</p> 
      <p>於康倉仁波切處，獲得其取藏之十二部教法、噶陀兩位主要伏藏大師法集的灌頂及講解、阿邦及阿加伏藏大師部份的法藏、密續藥師佛各種灌頂、口傳及講解等。在康倉大師所取馬頭明王伏藏法內也記載尊者為此法門的持有者之一，將宏揚十方利益無數眾生。</p> 
      <div class="page-number">23</div>
    </div>
    <div class="page teachings-page">
      <p>於白玉噶瑪恰美仁波切座下，獲得多・滇必寧瑪的《生起次第講記》、白玉天法全集內大部份的灌頂、口傳及講解。夏札瑞薩仁波切座下獲得噶陀仁珍千寶傳承的蓮師十三本尊、羅睺羅護法事業部、金剛薩埵五次第、大圓滿三虛空的口傳及講解等。</p>        
      <p>於噶陀席欽翁珠仁波切座下，獲得噶陀兩位取藏師敦都多傑和隆薩寧波三根本伏藏法的灌頂和教授、噶陀仁珍千寶傳承(匯整三伏藏敦都多傑、隆薩寧波、貝瑪德清林巴合一)的氣脈明點法門。</p> 
      <p>十二歲寫下《諸佛意集秘密寶藏》法集。十七到十八歲，於格魯巴朗加及阿客慈誠座下學習西藏歷史、古文學、菩提道次第論、阿底峽尊者之度母法門教學及口訣。</p> 
      <p>十八至二十四歲，於尼泊爾楊列修噶陀大成就者夏札桑吉多傑仁波切座下，接受噶陀仁珍千寶的部份教法、噶陀遠傳及近傳部份教法、完整的隆欽共與不共大圓滿法及敦珠新巖傳完整教法。</p>           
      <p>期間於加德滿都金剛亥母勝地、廓爾卡的波客日湖畔、菩提泉及幽陌雪山等地，作了三年以上的長期閉關。未閉關時間，於上師夏札仁波切允許下，於瑜伽士穆得瑪德座下，獲得噶陀仁珍千寶傳承的灌頂、口傳及口訣等完整教法。</p>              
      <div class="page-number">24</div>
    </div>
  </div>

  <!-- A5 Sheet 15: 上師此世簡介 + 現任-->
  <div class="a5-sheet">
    <div class="page teachings-page">
      <p>於寧瑪巴大法座貝諾法王座下，接受完整《大寶伏藏集》的灌頂、三句椎擊要義等遠傳及近傳諸多法門。</p> 
      <p>於隆欽教主多智千法王座下，得到隆欽傳承圓滿的灌頂及口傳、孜瑪入護法的事業部法門、寧·尼瑪哦些的猛咒寶藏口傳及口訣。</p>           
      <p>於聽列諾布仁波切座下，接受敦珠新巖傳法要，獲囑未來廣揚此法。</p> 
      <p>於堪欽貝瑪才旺法王座下，獲得大圓滿三自解脫、三句椎擊要義等口傳及講解。</p> 
      <p>於覺囊派五明通達阿客德勒喇吉座下接受覺囊派特殊的一百零八種（包含藏系八大修部宗派）導引文講解傳承等。</p>
      <p>於薩迦崔欽法王座下獲得喜金剛、那洛卡雀母、道果教學、灌頂等；於達欽教主座下，獲得喜金剛基與道之灌頂、三紅尊共與不共、那洛空行不共教法、瑪哈嘎拉外內密諸灌頂及教授、財寶天王七種不共灌頂及口傳等;白雅仁波切座下獲得欽哲教傳、口訣藏、薩迦十三金法等灌頂、口傳及講解等。</p>
      <p>於丘桑仁波切座下獲文殊閻魔敵、羅睺羅事業部、普巴三利刃、大圓滿自生自現前行及正行的灌頂、講解等。</p>
      <div class="page-number">25</div>
    </div>
    <div class="page teachings-page">
      <p>曾獲東印度西藏《明鏡報》曾提報為最優青年詩人、為尼泊爾《喜馬拉雅之聲雜誌》編輯部評為最優年青作者，現任一些報章雜誌藏文文選評審之一。</p>
      <p>至今著作含：《西藏僧侶日記》、《藏語概論》、《藏傳葬禮研究》、《西藏姓名研究》、《道歌集》、《金剛舞論集》、《木拉寺誌》、《雪瓊四大名人傳》、《格言集》、《戲劇註解》、《翁珠仁波切詩傳》、《木拉覺嫫傳》、《續部天文曆算概論》、《妙音梵文入門》、《仁珍千寶前行導引文》、《修心八頌解釋》、《佛子行三十七頌解釋》、《十四根本墮解釋》、《生起次第導引文》、《圓滿次第導引文》、《文殊大圓滿解釋》、《勝慧上師講記》、《大圓滿三虛空解釋》、《八大嘿嚕嘎廣解》等。</p>
      <h3>現任</h3>
      <p>木拉寺大金剛上師</p> 
      <p>木拉藏醫院名譽院長</p> 
      <p>噶陀仁珍千寶傳承教主</p> 
            <div class="page-number">26</div>
    </div>
  </div>

  <!-- A5 Sheet 16: 駐錫道場 + 駐錫道場 -->
  <div class="a5-sheet">
    <div class="page teachings-page">
       <h3>住錫道場</h3>
       <p>☸️台灣</p> 
       <p>1995年起｜噶陀仁珍千寶佛學會 最高導師</p> 
       <p>2000年起｜妙乘法苑  住持 </p> 
       <p>2008年起｜華嚴精舍  住持 </p> 
       <p>2012年起｜蓮嚴佛學研究會  住持 </p> 
       <p>2011-13年｜國際佛教研究會第二屆 主席  </p> 
       <p>☸️法國</p> 
       <p>2001年起｜阿音佛學會  導師 </p> 
       <p>☸️美國</p> 
       <p>2016年起｜（西雅圖）蓮花勝王佛學會  住持</p> 
       <p>☸️新加坡</p> 
       <p>2006年起｜大圓印妙法中心  導師 </p>         
       <p>2023年起｜萬佛林密嚴殿 導師 </p> 
       <p>☸️馬來西亞</p> 
       <p>2000年起｜（泗灣島）邊佳蘭佛教會導師</p> 
       <p>2018年起｜(柔佛巴魯)蓮花勝王禪修苑  住持</p>       
       <div class="page-number">27</div>
    </div>
    <div class="page teachings-page">
       <p>☸️紐西蘭</p> 
       <p>2023年5月｜貝瑪阿諦佛學院  院長</p> 
       <p>☸️泰國清邁</p> 
       <p>2023年8月起｜覺樂顯密禪苑  名譽院長</p>   
       <img src="/img00003.jpg" alt="防誤跨法輪"> 
       <div class="page-number">28</div>
       </div>
  </div>
      
  <!-- A5 Sheet 17: 四無量心 + 台灣聯絡處 -->
  <div class="a5-sheet">
    <div class="page teachings-page">
      <h2>四無量心</h2>
      <c4>願眾生具足樂及樂因</c4> 
      <c4>願眾生永離苦及苦因</c4> 
      <c4>願眾生永不離無苦樂</c4> 
      <c4>願眾生離愛憎住等捨</c4>
      <c4></c4>    
      <h2>四弘誓願</h2>
      <c4>眾生無邊誓願度</c4> 
      <c4>煩惱無盡誓願斷</c4> 
      <c4>法門無量誓願學</c4> 
      <c4>佛法無上誓願成</c4> 
      </div>
    <div class="page teachings-page">
      <h3>台灣聯絡處(Taiwan)</h3>
      <p>*北區</p> 
      <p>總會(Headquater)｜新北市汐止區東勢街201巷307號</p> 
      <p>No. 307, Ln. 201, Dongshih St., Sijhih Dist, New Taipei City 22141, Taiwan (R.O.C)</p> 
      <p>電話(Tel.)：02-26913004｜Fax：02-26913063</p> 
      <p>Mobile：0955-991498</p> 
      <p>基隆蓮研佛學研究會｜基隆市愛一路75-77之3號4樓</p>   
      <p>電話(Tel.)：02-2428321938</p>   
      <p>*中區</p> 
      <p>妙乘法苑閉關中心｜台中市神岡區圳堵里神清路322號</p> 
      <p>No.322, Shencing Rd., Shengang Dist., Taichung City 42954, Taiwan (R.O.C)</p> 
      <p>電話 (Tel.)： 04-25630771 / Mobile：0955-991498</p> 
      <p>華嚴精舍｜台中市大里區來興街19號</p> 
      <p>電話(Tel.)： 04-24813802</p> 
      <p>*南區</p> 
      <p>高雄市鼓山區華欣路7號3樓</p> 
      <p>電話(Tel.)：07-5553249</p> 
      </div>
  </div>

    <!-- A5 Sheet 18: 國外聯絡處 + 網站資訊 -->
  <div class="a5-sheet">
    <div class="page teachings-page">
      <h3>國外聯絡處</h3>
      <p>*新加坡大圓印妙法中心(Singapore)：</p> 
      <p>地址：Block 134,Geylang East Ave.1, #01-223, 380134</p> 
      <p>電話(Tel.)：+65 67 44 33 76</p> 
      <p>*新加坡萬佛林密嚴殿｜Man Fatt Lam Temple</p> 
      <p>地址：211 Bedok Rd, Singapore</p>   
      <p>*馬來西亞蓮花勝王禪修苑</p> 
      <p>地址：No. 1, Jalan Jaya Putra 5/68, 81100 Johor Bahru, Malaysia </p>   
      <p>電話(Tel.)：+60 12 790 3522</p> 
      <p>*法國 Choktsang Lungtok</p>   
      <p>地址：4 rue de l'Artois 92160 Antony </p> 
      <p>電話(Tel.)：+33 1 75 32 37 96</p> 
      <p>*美國蓮花佛學會(西雅圖)｜Padma Raja Society</p> 
      <p>地址：1843 NW Lutes Rd.,  Poulsbo WA 98370 USA  </p> 
      <p>電話 (Tel.)： 360-930-0709/5128391525
      <p>*貝瑪阿諦佛學院｜PadmaAti Buddhism Institute</p> 
      <p>122 Wheturangi Rd., GreenlandAuckland 1051, New Zealand</p> 
     </div>
    <div class="page teachings-page">
       <h3>網站資訊</h3>
       <p>噶陀仁珍千寶總網</p>
       <p>http://www.rigzin-chenpo.org/</p> 
       <p>噶陀仁珍千寶佛學會臉書</p>
       <p>https://www.facebook.com/rigzinchenpoassociation/?locale=zh_TW</p> 
       <p>妙乘法苑臉書</p>
       <p>https://www.facebook.com/groups/586354635295716/?locale=zh_TW</p> 
       <p>勝覺網</p> 
       <p>https://victoriousbodhi.com/</p> 
       <p>https://victorious-bodhi.org/</p> 
    </div>
  </div>

    <!-- A5 Sheet 19: 圖片頁 x 2 -->
  <div class="a5-sheet">
    <div class="page image-page">
      <img src="/img00004.jpg" alt="仁珍才旺諾布">
      <h2 class="tibetan">ཀཿཐོག་གསང་བདག་རིག་འཛིན་ཆེན་པོའི་སྡེ།།</h2>
      <h2>密主噶陀仁珍千寶尊</h2>
    </div>
    <div class="page image-page">
      <img src="/img00005.jpg" alt="仁珍千寶">
      <h2 class="tibetan">རིས་མེད་ཐུབ་བསྟན་གཙུག་འཛིན་པདྨ་དབང་།།</h2>
      <h2>頂戴無分佛教貝瑪旺</h2>
    </div>
  </div>



 <script>
      function populateData() {
          const personData = ${JSON.stringify(personData)};
          let formattedDate = '';
          if (personData.refugeDate) {
              try {
                  const date = new Date(personData.refugeDate + 'T00:00:00');
                  if (!isNaN(date.getTime())) {
                      formattedDate = \`\${date.getFullYear()}年\${date.getMonth() + 1}月\${date.getDate()}日\`;
                  } else { formattedDate = personData.refugeDate; }
              } catch(e) { formattedDate = personData.refugeDate; }
          }
          // 這段程式碼會尋找 id 為 'details-page' 的元素，如果找不到就不會執行，所以是安全的
          const detailsPage = document.querySelector('.details-page');
          if (detailsPage) {
            detailsPage.querySelector('#recipient-name').textContent = personData.name || '';
            detailsPage.querySelector('#refuge-date').textContent = formattedDate || '';
            detailsPage.querySelector('#refuge-place').textContent = personData.refugePlace || '';
            detailsPage.querySelector('#dharma-name-original').textContent = personData.dharmaName || '';
            detailsPage.querySelector('#dharma-name-phonetic').textContent = personData.dharmaNamePhonetic || personData.buddhistName || '';
            detailsPage.querySelector('#dharma-name-meaning').textContent = personData.dharmaNameMeaning || '';
          }
      }
      if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', populateData);
      } else { populateData(); }
  <\/script>
</body>
</html>
`;
 }


/**
 * 行動版處理：在新視窗中開啟證書並添加操作按鈕
 * @param {string} htmlContent - 證書的 HTML 內容
 */
function openCertificateInNewWindow(htmlContent: string) {
    const newWindow = window.open("", "_blank");
    if (!newWindow) {
        alert("無法開啟新視窗，請檢查您的瀏覽器是否封鎖了彈出視窗。");
        return;
    }

    newWindow.document.write(htmlContent);

    // --- 在新視窗中動態添加按鈕和處理邏輯 ---

    // 1. 添加 UI 元素 (按鈕和讀取畫面)
    const mobileUI = `
        <style>
            #mobile-controls {
                position: fixed; top: 0; left: 0; width: 100%;
                background: rgba(0,0,0,0.8);
                padding: 10px;
                display: flex; justify-content: space-around; align-items: center;
                z-index: 10000;
                color: white;
            }
            #mobile-controls button {
                padding: 8px 12px; font-size: 14px; border-radius: 5px; border: 1px solid #fff;
                background: #4CAF50; color: white;
            }
            #loader-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.7);
                display: none; justify-content: center; align-items: center;
                z-index: 10001; color: white; font-size: 20px;
            }
        </style>
        <div id="mobile-controls">
            <button id="btnPrint">列印</button>
            <button id="btnSavePdf">下載 PDF</button>
            <button id="btnSaveImg">下載圖片</button>
        </div>
        <div id="loader-overlay"><div>處理中，請稍候...</div></div>
    `;
    newWindow.document.body.insertAdjacentHTML('beforeend', mobileUI);

    // 2. 獲取新視窗中的元素
    const printBtn = newWindow.document.getElementById('btnPrint');
    const savePdfBtn = newWindow.document.getElementById('btnSavePdf');
    const saveImgBtn = newWindow.document.getElementById('btnSaveImg');
    const certificateContainer = newWindow.document.getElementById('certificate-container');
    const loader = newWindow.document.getElementById('loader-overlay');

    const showLoader = () => { if(loader) loader.style.display = 'flex'; };
    const hideLoader = () => { if(loader) loader.style.display = 'none'; };

    // 3. 綁定按鈕事件
    if (printBtn) {
        printBtn.onclick = () => {
            const controls = newWindow.document.getElementById('mobile-controls');
            if (controls) controls.style.display = 'none'; // 列印時隱藏按鈕
            newWindow.print();
            if (controls) controls.style.display = 'flex'; // 列印後顯示按鈕
        };
    }

    if (saveImgBtn) {
        saveImgBtn.onclick = async () => {
            if (!certificateContainer) return;
            showLoader();
            try {
                // 使用 html2canvas 將整個證書容器轉為圖片
                const canvas = await html2canvas(certificateContainer, {
                    scale: 2, // 提高解析度
                    useCORS: true,
                    backgroundColor: '#e0e0e0' // 確保背景色一致
                });
                const link = newWindow.document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = '皈依證.png';
                link.click();
            } catch (error) {
                console.error('下載圖片失敗:', error);
                alert('下載圖片失敗，詳情請見主控台。');
            } finally {
                hideLoader();
            }
        };
    }

    if (savePdfBtn) {
        savePdfBtn.onclick = async () => {
            if (!certificateContainer) return;
            showLoader();
            try {
                // 建立一個 A5 橫向的 PDF 文件
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'mm',
                    format: 'a5'
                });

                const sheets = newWindow.document.querySelectorAll('.a5-sheet');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();

                for (let i = 0; i < sheets.length; i++) {
                    const sheet = sheets[i] as HTMLElement;
                    const canvas = await html2canvas(sheet, { scale: 2, useCORS: true });
                    const imgData = canvas.toDataURL('image/png');
                    
                    if (i > 0) {
                        pdf.addPage(); // 第一頁之後的頁面需要新增頁面
                    }
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                }
                pdf.save('皈依證.pdf');
            } catch (error) {
                console.error('下載PDF失敗:', error);
                alert('下載PDF失敗，詳情請見主控台。');
            } finally {
                hideLoader();
            }
        };
    }
    
    newWindow.document.close();
}


/**
 * 桌面版處理：使用隱藏的 iframe 進行列印
 * @param {string} htmlContent - 證書的 HTML 內容
 */
function printCertificateViaIframe(htmlContent: string) {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
        throw new Error('無法建立 iframe 文件以進行列印');
    }

    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    iframe.onload = () => {
        try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
        } catch (printError) {
            console.error("iframe 列印時發生錯誤:", printError);
            alert("列印時發生錯誤，請重試或檢查您的瀏覽器設定。");
        } finally {
            setTimeout(() => {
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
            }, 3000);
        }
    };
}