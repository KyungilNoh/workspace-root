import { NextResponse } from 'next/server';
import { sendContactMail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: '이메일은 필수 입력입니다.' },
        { status: 400 }
      );
    }

    await sendContactMail({ name, email, phone, message });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
