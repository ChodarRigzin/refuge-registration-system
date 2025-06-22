// api/send-certificate.ts (Gmail 最終版)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '僅允許 POST 請求' });
  }

  try {
    const { 
      recipientEmail, 
      recipientName, 
      subject,
      bodyText,
      pdfBase64,
    } = req.body;

    if (!recipientEmail || !recipientName || !pdfBase64) {
      return res.status(400).json({ message: '缺少必要欄位' });
    }

    const mailUser = process.env.MAIL_USER;
    const mailPass = process.env.MAIL_APP_PASSWORD;

    if (!mailUser || !mailPass) {
      return res.status(500).json({ message: 'Email service not configured.' });
    }

    // ***** 主要修改點：換回 service: 'gmail' *****
    let transporter = nodemailer.createTransport({
      service: 'gmail', // 直接使用 Gmail 服務
      auth: {
        user: mailUser, // 您新的 @gmail.com 信箱
        pass: mailPass, // 您從新 Gmail 帳戶取得的 16 位應用程式密碼
      },
    });

    const mailOptions = {
      from: `"噶陀仁珍千寶佛學會" <${mailUser}>`,
      to: recipientEmail,
      subject: subject || `${recipientName} 的皈依證`,
      html: `<div style="font-family: Arial, sans-serif;">${(bodyText || '').replace(/\n/g, '<br>')}</div>`,
      attachments: [{
        filename: `皈依證_${recipientName}.pdf`,
        content: Buffer.from(pdfBase64, 'base64'),
        contentType: 'application/pdf',
      }],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });

  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Failed to send email.', error: error.message });
  }
}