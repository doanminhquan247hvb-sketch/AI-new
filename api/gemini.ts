import { GoogleGenAI } from '@google/genai';

/**
 * Serverless Proxy Function cho Vercel / Netlify / Node.js
 * Đường dẫn: /api/gemini
 *
 * Nhiệm vụ:
 * 1. Nhận yêu cầu từ Frontend (người dùng không cần nhập API key)
 * 2. Lấy GEMINI_API_KEY từ Biến môi trường (Environment Variable) trên Server
 * 3. Gọi Google Gemini API một cách bảo mật tuyệt đối
 * 4. Trả kết quả về cho Frontend
 */
export default async function handler(req: any, res: any) {
  // Chỉ chấp nhận phương thức POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Vui lòng dùng phương thức POST.' });
  }

  const { message, topic, sources, analysisPreview, studyPack } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Nội dung câu hỏi (message) không hợp lệ.' });
  }

  // 1. Lấy API key từ biến môi trường của Server (KHÔNG lộ ra trình duyệt)
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'Chưa cấu hình biến môi trường GEMINI_API_KEY trên Server.',
      fallback: true,
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Strict Grounding Rule: Chỉ trả lời trong phạm vi tài liệu bài học
    const systemInstruction = `
Bạn là Trợ lý Ôn Bài Grounded cho học sinh phổ thông.
Chủ đề bài học: "${topic || 'Toán học'}".

QUY TẮC BẮT BUỘC TUYỆT ĐỐI (GROUNDING RULES):
1. Bạn CHỈ ĐƯỢC PHÉP trả lời dựa trên các tài liệu sau:
   - sources: ${JSON.stringify(sources || [])}
   - analysisPreview: ${JSON.stringify(analysisPreview || {})}
   - studyPack: ${JSON.stringify(studyPack || {})}

2. NẾU CÂU HỎI KHÔNG CÓ TRONG TÀI LIỆU HOẶC KHÔNG THỂ SUY RA ĐƯỢC TỪ TÀI LIỆU TRÊN:
   BẠN BẮT BUỘC PHẢI TRẢ LỜI CHÍNH XÁC NGUYÊN VĂN:
   "Nội dung này nằm ngoài phạm vi tài liệu đã cung cấp."

3. TUYỆT ĐỐI KHÔNG tán gẫu ngoài lề hoặc trả lời các kiến thức không có trong bài học.
4. Ngôn ngữ thân thiện, dễ hiểu, chuẩn mực sư phạm cho học sinh K12.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction,
        temperature: 0.1,
      },
    });

    const reply = response.text || 'Nội dung này nằm ngoài phạm vi tài liệu đã cung cấp.';

    return res.status(200).json({
      reply,
      grounded: !reply.includes('Nội dung này nằm ngoài phạm vi tài liệu đã cung cấp.'),
    });
  } catch (error: any) {
    console.error('Lỗi khi gọi Google Gemini API từ Serverless Proxy:', error);
    return res.status(500).json({
      error: 'Lỗi xử lý từ Gemini API trên server proxy.',
      message: error?.message || 'Unknown error',
    });
  }
}
