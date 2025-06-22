// api/send-certificate.ts (最終版: 使用明確的 SMTP 設定)
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
      attachments,
    } = req.body;

    if (!recipientEmail || !recipientName || !attachments || !Array.isArray(attachments) || attachments.length === 0) {
      return res.status(400).json({ message: '缺少必要欄位，或附件格式不正確' });
    }

    const mailUser = process.env.MAIL_USER;
    const mailPass = process.env.MAIL_APP_PASSWORD;

    if (!mailUser || !mailPass) {
      console.error('Email credentials not configured.');
      return res.status(500).json({ message: 'Email service not configured.' });
    }

    // ***** 主要修改點：從 service 捷徑改為明確的 SMTP 設定 *****
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

    const mailAttachments = attachments.map(att => ({
      filename: att.filename,
      content: Buffer.from(att.content, 'base64'),
      contentType: 'application/pdf',
    }));

    const mailOptions = {
      from: `"噶陀仁珍千寶佛學會" <${mailUser}>`,
      to: recipientEmail,
      subject: subject || `${recipientName} 的皈依證`,
      html: `<div style="font-family: Arial, sans-serif;">${(bodyText || '').replace(/\n/g, '<br>')}</div>`,
      attachments: mailAttachments,
    };

    // 增加一個驗證步驟，可以提供更明確的錯誤訊息
    await transporter.verify();
    console.log("Server is ready to take our messages");

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });

  } catch (error: any) {
    console.error('API Error:', error);
    // 現在我們可以回傳更詳細的錯誤訊息
    res.status(500).json({ 
      message: 'Failed to send email due to a server error.',
      error: error.message // 將實際的錯誤訊息也傳給前端
    });
  }
}