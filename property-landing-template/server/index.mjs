import express from 'express';
import cors from 'cors';
import { sendContactMail } from './mailer.mjs';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/contact', async (req, res) => {
  try {
    const body = req.body || {};
    const { name, email, phone, message } = body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: '이메일은 필수 입력입니다.',
      });
    }

    await sendContactMail({ name, email, phone, message });
    return res.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.',
    });
  }
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`[API] Contact server running at http://localhost:${PORT}`);
});
