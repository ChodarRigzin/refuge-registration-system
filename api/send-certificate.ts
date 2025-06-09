// api/send-certificate.ts (Vercel Serverless Function)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer'; // npm install nodemailer

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { 
    recipientEmail, 
    recipientName, 
    pdfBase64, 
    subject: customSubject, // 從前端接收自訂主旨
    greeting: customGreeting, // 從前端接收自訂問候語
    bodyText: customBodyText  // 從前端接收自訂郵件內容
  } = req.body;

  if (!recipientEmail || !recipientName || !pdfBase64) {
    return res.status(400).json({ message: 'Missing required fields: recipientEmail, recipientName, or pdfBase64' });
  }

  // 從環境變數獲取郵件服務憑證 (在 Vercel 專案設定中配置)
  const mailUser = process.env.MAIL_USER; // 例如：your-email@gmail.com
  const mailPass = process.env.MAIL_APP_PASSWORD; // 例如：Gmail 應用程式密碼

  if (!mailUser || !mailPass) {
    console.error('Email credentials not configured in environment variables.');
    return res.status(500).json({ message: 'Email service not configured on server.' });
  }

  // 創建 Nodemailer transporter (根據你的郵件服務商調整)
  let transporter = nodemailer.createTransport({
    service: 'gmail', // 或者其他服務，例如 'hotmail', 'outlook', 或者直接用 SMTP
    auth: {
      user: mailUser,
      pass: mailPass,
    },
  });

  // 郵件內容
  const subject = customSubject || `${recipientName} 的皈依證`;
  const greeting = customGreeting || `親愛的 ${recipientName}，`;
  const bodyMainText = customBodyText || "附件是您的皈依證，請查收。祝福您！";
  const htmlBody = `
    <p>${greeting}</p>
    <p>${bodyMainText}</p>
    <p><br>敬頌 法安</p>
    <p>噶陀仁珍千寶佛學會 敬上</p> {/* 你的組織名稱 */}
  `;

  const mailOptions = {
    from: `"噶陀仁珍千寶佛學會" <${mailUser}>`, // 發件人名稱和郵箱
    to: recipientEmail,
    subject: subject,
    html: htmlBody,
    attachments: [
      {
        filename: `${recipientName}_皈依證.pdf`,
        content: Buffer.from(pdfBase64, 'base64'), // 將 base64 轉回 Buffer
        contentType: 'application/pdf',
      },
    ],
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    // 避免將詳細錯誤暴露給前端，但記錄在伺服器日誌中
    res.status(500).json({ message: 'Failed to send email due to a server error.' });
  }
}