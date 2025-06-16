import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'hinatamomo356@gmail.com',
    pass: 'xfhl cmdt gkmj kulh'
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
      from: '"Enoma" <hinatamomo356@gmail.com>',
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
        <title>密码重置</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .button:hover { background: #5a67d8; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 密码重置请求</h1>
          </div>
          <div class="content">
            <p>您好，</p>
            <p>我们收到了您的密码重置请求。请点击下面的按钮来重置您的密码：</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">重置密码</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ 重要提醒：</strong>
              <ul>
                <li>此链接将在1小时后过期</li>
                <li>如果您没有请求密码重置，请忽略此邮件</li>
                <li>为了您的账户安全，请不要将此链接分享给他人</li>
              </ul>
            </div>
            
            <p>如果按钮无法点击，请复制以下链接到浏览器地址栏：</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">${resetUrl}</p>
            
            <p>如有任何疑问，请随时联系我们的客服团队。</p>
            
            <p>谢谢！<br>Enoma 团队</p>
          </div>
          <div class="footer">
            <p>此邮件是系统自动发送，请勿回复。</p>
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
        <title>密码修改通知</title>
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
            <h1>🔐 密码修改通知</h1>
          </div>
          <div class="content">
            <p>您好，</p>
            <p>您的账户密码已成功修改。</p>
            
            <div class="alert">
              <strong>⚠️ 重要提醒：</strong>
              <ul>
                <li>修改时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</li>
                <li>如果这不是您本人的操作，请立即联系我们的客服团队</li>
                <li>为了账户安全，请定期更换密码</li>
              </ul>
            </div>
            
            <p>如有任何疑问，请随时联系我们的客服团队。</p>
            
            <p>谢谢！<br>Enoma 团队</p>
          </div>
          <div class="footer">
            <p>此邮件是系统自动发送，请勿回复。</p>
          </div>
        </div>
      </body>
    </html>
  `;
}