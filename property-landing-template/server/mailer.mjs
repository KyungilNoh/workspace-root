import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const {
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN,
  GMAIL_USER,
  TO_EMAIL,
} = process.env;

const oauth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

export async function sendContactMail({ name, email, phone, message }) {
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN || !GMAIL_USER) {
    throw new Error('Gmail 환경변수가 설정되지 않았습니다.');
  }

  oauth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });
  const { token } = await oauth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: GMAIL_USER,
      clientId: GMAIL_CLIENT_ID,
      clientSecret: GMAIL_CLIENT_SECRET,
      refreshToken: GMAIL_REFRESH_TOKEN,
      accessToken: token || undefined,
    },
  });

  const to = TO_EMAIL || GMAIL_USER;
  const subject = `[문의 도착] ${name || '이름 미입력'} 님의 문의`;
  const text = `새로운 문의가 도착했습니다.\n\n이름: ${name || '-'}\n이메일: ${email}\n연락처: ${phone || '-'}\n\n메시지:\n${message || '-'}`;
  const html = `<h2>새로운 문의가 도착했습니다.</h2><p><strong>이름:</strong> ${name || '-'}</p><p><strong>이메일:</strong> ${email}</p><p><strong>연락처:</strong> ${phone || '-'}</p><p><strong>메시지:</strong></p><pre>${message || '-'}</pre>`;

  await transporter.sendMail({
    from: `'Landing Contact' <${GMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}
