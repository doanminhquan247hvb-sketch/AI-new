import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Grounded chat endpoint (supports both /api/grounded-chat and /api/gemini serverless proxy)
  const chatHandler = async (req: express.Request, res: express.Response) => {
    try {
      const { message, topic, sources, analysisPreview, studyPack } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      const clientKey = req.headers['x-gemini-api-key'] as string;
      const apiKey = clientKey?.trim() || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({
          fallback: true,
          reply: null,
          note: 'No GEMINI_API_KEY, client engine will answer'
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `
Bạn là Trợ lý Ôn Bài Grounded (Chuyên biệt hỗ trợ ôn tập cho chủ đề hiện tại).
Chủ đề bài học: "${topic || 'Toán học'}".

QUY TẮC BẮT BUỘC TUYỆT ĐỐI (GROUNDING CONSTRAINTS):
1. Bạn CHỈ ĐƯỢC PHÉP trả lời trong phạm vi các tài liệu sau:
   - sources: ${JSON.stringify(sources || [])}
   - analysisPreview: ${JSON.stringify(analysisPreview || {})}
   - studyPack: ${JSON.stringify(studyPack || {})}

2. NẾU CÂU HỎI KHÔNG CÓ TRONG TÀI LIỆU HOẶC KHÔNG THỂ SUY RA ĐƯỢC TỪ TÀI LIỆU TRÊN:
   BẠN BẮT BUỘC PHẢI TRẢ LỜI CHÍNH XÁC NGUYÊN VĂN:
   "Nội dung này nằm ngoài phạm vi tài liệu đã cung cấp."
   (Sau câu này, bạn có thể nói thêm một lời nhắc nhở ngắn gọn, thân thiện hướng dẫn học sinh đặt câu hỏi về các định nghĩa, công thức hoặc bài tập có trong bài học).

3. TUYỆT ĐỐI KHÔNG BIẾN THÀNH CHATBOT CHUNG CHUNG:
   - Không trả lời bất kỳ câu hỏi nào ngoài phạm vi bài học (ví dụ: tin tức, lập trình phần mềm, thời tiết, triết học, giải trí, kiến thức chưa có trong tài liệu).

4. Ngôn ngữ thân thiện, chuẩn mực sư phạm, dễ hiểu cho học sinh, giải thích rõ ràng từng bước.
5. Khi trả lời được từ tài liệu, hãy ghi rõ trích dẫn căn cứ ở cuối câu trả lời (ví dụ: [Căn cứ: sources], [Căn cứ: analysisPreview], hoặc [Căn cứ: studyPack]).
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: message }]
          }
        ],
        config: {
          systemInstruction,
          temperature: 0.1,
        }
      });

      const reply = response.text || 'Nội dung này nằm ngoài phạm vi tài liệu đã cung cấp.';
      return res.json({
        reply,
        grounded: !reply.includes('Nội dung này nằm ngoài phạm vi tài liệu đã cung cấp.'),
        fallback: false
      });
    } catch (err: any) {
      console.error('Gemini grounded chat error:', err);
      return res.status(200).json({
        fallback: true,
        reply: null,
        error: err.message
      });
    }
  };

  app.post('/api/grounded-chat', chatHandler);
  app.post('/api/gemini', chatHandler);

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: !!process.env.GEMINI_API_KEY
    });
  });

  // Vite integration
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
