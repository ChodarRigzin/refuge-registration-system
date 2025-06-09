// src/services/pdfCertificateService.ts
import { Refugee } from '../types'; // 確保路徑正確

const formatDate = (dateString: string, language: 'zh' | 'en' = 'zh') => {
    if (!dateString) return '________________'; // 返回下划线以在PDF中占据空间
    try {
        const date = new Date(dateString + 'T00:00:00');
        if (isNaN(date.getTime())) {
            return dateString; 
        }
        
        if (language === 'zh') {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${Year}年${month}月${day}日`;
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

// 這個函數現在直接觸發列印，而不是返回 Uint8Array
export async function triggerHtmlCertificatePrint(
  personData: Refugee,
  language: 'zh' | 'en',
  translations: any // 傳入你的 translations 物件
): Promise<void> {
  console.log("Data received for HTML certificate generation:", JSON.stringify(personData, null, 2));
  
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0'; // 實際列印時 iframe 大小不重要，設為0或隱藏
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.top = '-9999px'; // 移出可視區域
  iframe.style.left = '-9999px';
  document.body.appendChild(iframe);

  const iframeDoc= iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) {
    document.body.removeChild(iframe); // 清理
    throw new Error('Failed to create iframe document for printing');
  }

    iframeDoc.open();
  iframeDoc.write(htmlContent);
  iframeDoc.close();

  // 等待 iframe 內容 (包括圖片和字體) 完全載入和渲染
  iframe.onload = () => {
    console.log("Iframe content fully loaded.");
    try {
      // 確保 focus 在 iframe 上，某些瀏覽器需要
      iframe.contentWindow?.focus(); 
      iframe.contentWindow?.print();
    } catch (printError) {
      console.error("Error during iframe print:", printError);
      alert("列印時發生錯誤，請重試或檢查瀏覽器設定。");
    } finally {
      // 列印對話框關閉後（或一段時間後）移除 iframe
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
          console.log("Iframe removed.");
        }
      }, 3000); // 延遲 3 秒移除，給列印對話框足夠時間
    }
  };
  // 如果 iframe.onload 不總是觸發 (例如內容是純 HTML 沒有外部資源)，
  // 可以保留一個基於 setTimeout 的備案，但 onload 更可靠
  // setTimeout(() => { ... }, 1000); // 之前的 500ms 可能太短
}