import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import crypto from 'crypto';
import { z } from 'zod';
import { sendEmail, generatePasswordResetEmail } from '../../../../lib/email';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json(
        { message: 'パスワードリセットリンクをメールで送信しました。' },
        { status: 200 }
      );
    }

    // Generate cryptographically secure reset token
    const resetToken = crypto.randomBytes(64).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send email with reset link
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    try {
      await sendEmail({
        to: email,
        subject: '密码重置请求 - Enoma',
        html: generatePasswordResetEmail(resetUrl)
      });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Password reset link:', resetUrl);
        console.log('Reset token for testing:', resetToken);
      }
    }

    return NextResponse.json(
      { message: 'パスワードリセットリンクをメールで送信しました。' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: '有効なメールアドレスを入力してください' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'パスワードリセットの要求に失敗しました' },
      { status: 500 }
    );
  }
}