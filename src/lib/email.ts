import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
  try {
    const info = await transporter.sendMail({
      from: `"Enoma" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    
    console.log('Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

export function generatePasswordResetEmail(resetUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>パスワードリセット</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: #ffffff !important; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .button:hover { background: #5a67d8; color: #ffffff !important; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 パスワードリセット要求</h1>
          </div>
          <div class="content">
            <p>こんにちは、</p>
            <p>パスワードリセットのリクエストを受け取りました。以下のボタンをクリックしてパスワードをリセットしてください：</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">パスワードをリセット</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ 重要なお知らせ：</strong>
              <ul>
                <li>このリンクは1時間後に期限切れになります</li>
                <li>パスワードリセットを要求していない場合は、このメールを無視してください</li>
                <li>アカウントのセキュリティのため、このリンクを他人と共有しないでください</li>
              </ul>
            </div>
            
            <p>ボタンがクリックできない場合は、以下のリンクをブラウザのアドレスバーにコピーしてください：</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">${resetUrl}</p>
            
            <p>ご質問がございましたら、いつでもカスタマーサポートチームにお問い合わせください。</p>
            
            <p>ありがとうございます！<br>Enoma チーム</p>
          </div>
          <div class="footer">
            <p>このメールは自動送信されています。返信はしないでください。</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function generatePasswordChangeNotificationEmail(): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>パスワード変更通知</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .alert { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 パスワード変更通知</h1>
          </div>
          <div class="content">
            <p>こんにちは、</p>
            <p>お客様のアカウントのパスワードが正常に変更されました。</p>
            
            <div class="alert">
              <strong>⚠️ 重要なお知らせ：</strong>
              <ul>
                <li>変更時刻：${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</li>
                <li>この操作に心当たりがない場合は、すぐにカスタマーサポートチームにご連絡ください</li>
                <li>アカウントのセキュリティのため、定期的にパスワードを変更してください</li>
              </ul>
            </div>
            
            <p>ご質問がございましたら、いつでもカスタマーサポートチームにお問い合わせください。</p>
            
            <p>ありがとうございます！<br>Enoma チーム</p>
          </div>
          <div class="footer">
            <p>このメールは自動送信されています。返信はしないでください。</p>
          </div>
        </div>
      </body>
    </html>
  `;
}