// api/send-certificate.ts (最終版: 單一附件 + 明確 SMTP 設定)
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
      pdfBase64, // 確認接收的是單一 pdfBase64 字串
    } = req.body;

    if (!recipientEmail || !recipientName || !pdfBase64) {
      return res.status(400).json({ message: '缺少必要欄位' });
    }

    const mailUser = process.env.MAIL_USER;
    const mailPass = process.env.MAIL_APP_PASSWORD;

    if (!mailUser || !mailPass) {
      console.error('Email credentials not configured.');
      return res.status(500).json({ message: 'Email service not configured.' });
    }

    // ***** 主要修改點：使用最穩定、明確的 SMTP 設定 *****
    let transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com", // Outlook 的 SMTP 伺服器地址
      port: 587, // Outlook 的標準加密端口
      secure: false, // port 587 使用 STARTTLS 加密，所以這裡要設為 false
      auth: {
        user: mailUser, // 您的 service_rigzin@outlook.com
        pass: mailPass, // 您的 16 位應用程式密碼
      },
      tls: {
        ciphers:'SSLv3' // 增加這項以提高相容性
      }
    });

    // 增加一個驗證步驟，可以提供更明確的錯誤訊息
    await transporter.verify();
    console.log("SMTP Server is ready to take messages");

    const mailOptions = {
      from: `"噶陀仁珍千寶佛學會" <${mailUser}>`,
      to: recipientEmail,
      subject: subject || `${recipientName} 的皈依證`,
      html: `<div style="font-family: Arial, sans-serif;">${(bodyText || '').replace(/\n/g, '<br>')}</div>`,
      attachments: [{ // 確認是單一附件
        filename: `皈依證_${recipientName}.pdf`,
        content: Buffer.from(pdfBase64, 'base64'),
        contentType: 'application/pdf',
      }],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });

  } catch (error: any) {
    console.error('API Error:', error);
    // 回傳更詳細的錯誤訊息
    res.status(500).json({ 
      message: 'Failed to send email due to a server error.',
      error: error.message 
    });
  }
}