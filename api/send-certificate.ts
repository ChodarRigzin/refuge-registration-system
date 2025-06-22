// api/send-certificate.ts (更新為使用 Outlook)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { 
    recipientEmail, 
    recipientName, 
    pdfBase64, 
    subject: customSubject,
    bodyText: customBodyText
  } = req.body;

  if (!recipientEmail || !recipientName || !pdfBase64) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const mailUser = process.env.MAIL_USER;
  const mailPass = process.env.MAIL_APP_PASSWORD;

  if (!mailUser || !mailPass) {
    console.error('Email credentials not configured in environment variables.');
    return res.status(500).json({ message: 'Email service not configured on server.' });
  }

  // ***** 主要修改點：將 service 從 'gmail' 改為 'hotmail' *****
  let transporter = nodemailer.createTransport({
    service: 'hotmail', // 使用 Hotmail/Outlook 服務
    auth: {
      user: mailUser, // 您新的 @outlook.com 信箱
      pass: mailPass, // 您在 Outlook 產生的應用程式密碼
    },
  });

  // 郵件內容 (這裡的邏輯不變)
  const subject = customSubject || `${recipientName} 的皈依證`;
  // 將純文字中的換行符號 \n 轉換為 HTML 的 <br>
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      ${customBodyText.replace(/\n/g, '<br>')}
    </div>
  `;

  const mailOptions = {
    from: `"噶陀仁珍千寶佛學會" <${mailUser}>`,
    to: recipientEmail,
    subject: subject,
    html: htmlBody,
    attachments: [
      {
        filename: `${recipientName}_皈依證.pdf`,
        content: Buffer.from(pdfBase64, 'base64'),
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
    res.status(500).json({ message: 'Failed to send email due to a server error.' });
  }
}