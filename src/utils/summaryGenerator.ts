import { StudyMaterial } from '../types';

export interface GeneratedSummaryResult {
  summary: string;
  keyPoints: string[];
  summarizedAt: string;
}

/**
 * Intelligent Pedagogical Summarizer for Grade 7+ Mathematics
 * Extracts core conceptual intuition, formulas, step-by-step methods, and trap avoidance.
 */
export function generateMaterialSummary(material: StudyMaterial): GeneratedSummaryResult {
  const now = new Date();
  const timeStr = `Hôm nay, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const topicLower = (material.topic || '').toLowerCase();
  const titleLower = (material.title || '').toLowerCase();
  const contentLower = (material.content || '').toLowerCase();

  // 1. Topic: Định lý Pytago & Tam giác vuông
  if (topicLower.includes('pytago') || titleLower.includes('pytago') || contentLower.includes('pytago')) {
    return {
      summary:
        'Định lý Pytago là mối quan hệ diện tích kinh điển trong tam giác vuông: diện tích hình vuông dựng trên cạnh huyền luôn bằng tổng diện tích hai hình vuông dựng trên hai cạnh góc vuông (a² + b² = c²). Định lý giúp tính nhanh độ dài cạnh thứ ba khi đã biết hai cạnh còn lại.',
      keyPoints: [
        '📌 Bản chất trực quan: Ghép diện tích 2 hình vuông nhỏ dựng trên 2 cạnh góc vuông sẽ vừa khít diện tích hình vuông lớn nhất dựng trên cạnh huyền.',
        '📐 Công thức vàng: c = √(a² + b²) (tính cạnh huyền) hoặc a = √(c² - b²) (tính cạnh góc vuông).',
        '🧱 Bộ ba số Pytago nguyên kinh điển: (3, 4, 5) và (5, 12, 13) cùng các bội số nhân đôi (6, 8, 10).',
        '⚠️ Bẫy sai lầm: Định lý chỉ áp dụng duy nhất cho tam giác vuông; cạnh huyền c luôn luôn là cạnh dài nhất nằm đối diện góc vuông 90°.',
      ],
      summarizedAt: timeStr,
    };
  }

  // 2. Topic: Phương trình & Cân thăng bằng
  if (
    topicLower.includes('phương trình') ||
    topicLower.includes('cân') ||
    titleLower.includes('phương trình') ||
    titleLower.includes('cân') ||
    contentLower.includes('cân thăng bằng')
  ) {
    return {
      summary:
        'Phương trình bậc nhất một ẩn (ax + b = c) hoạt động giống hệt một chiếc cân đòn đang thăng bằng. Muốn tìm số lượng trong chiếc hộp bí mật x, học sinh thực hiện các thao tác bớt/thêm số lượng bằng nhau ở cả hai đĩa cân rồi chia đều theo số hộp x.',
      keyPoints: [
        '📌 Bản chất chiếc cân: Dấu bằng (=) đại diện cho đòn cân thăng bằng; mọi thao tác làm với vế trái bắt buộc phải làm y hệt với vế phải.',
        '⚖️ Quy tắc chuyển vế đổi dấu: Chuyển một hạng tử sang vế kia tương đương với việc bớt cùng đại lượng đó ở cả 2 vế cân (2x + 4 = 10 ➜ 2x = 10 - 4 = 6).',
        '🔢 Hai bước chuẩn mực: Bước 1 dọn dẹp số tự do b; Bước 2 chia cả hai vế cho hệ số a để giải phóng 1 ẩn x (x = 6 / 2 = 3).',
        '⚠️ Bẫy sai lầm: Khi chia cả 2 vế cho hệ số âm (ví dụ -3x = 12), nhớ đổi dấu: x = 12 / (-3) = -4.',
      ],
      summarizedAt: timeStr,
    };
  }

  // 3. Topic: Phân số & Tỷ số
  if (
    topicLower.includes('phân số') ||
    topicLower.includes('tỷ số') ||
    titleLower.includes('phân số') ||
    contentLower.includes('phân số')
  ) {
    return {
      summary:
        'Phân số a/b (với b ≠ 0) biểu thị mối quan hệ số lượng giữa phần được lấy (tử số a) và tổng số phần bằng nhau được chia đều từ một chỉnh thể đơn vị (mẫu số b). Hình ảnh chiếc bánh pizza hoặc thanh socola giúp trực quan hóa rõ nét giá trị phân số.',
      keyPoints: [
        '📌 Bản chất tử và mẫu: Mẫu số b cho biết chia làm bao nhiêu phần bằng nhau; Tử số a cho biết ta lấy hoặc quan tâm bao nhiêu phần.',
        '🍕 Tính chất cơ bản: Nhân hoặc chia cả tử và mẫu với cùng số khác 0 thì giá trị phân số hoàn toàn không đổi (1/2 = 2/4 = 4/8).',
        '➕ Quy tắc cộng trừ: Bắt buộc quy đồng đưa về cùng mẫu số trước khi cộng hoặc trừ các tử số với nhau.',
        '⚠️ Bẫy sai lầm: Mẫu số luôn luôn phải khác 0; tuyệt đối không cộng tử với tử, mẫu với mẫu (1/2 + 1/3 ≠ 2/5).',
      ],
      summarizedAt: timeStr,
    };
  }

  // 4. Topic: Đồ thị hàm số y = ax + b
  if (
    topicLower.includes('đồ thị') ||
    topicLower.includes('hàm số') ||
    titleLower.includes('đồ thị') ||
    contentLower.includes('ax + b')
  ) {
    return {
      summary:
        'Đồ thị hàm số bậc nhất y = ax + b (a ≠ 0) là một đường thẳng liên tục trên mặt phẳng toạ độ Oxy. Trong đó hệ số góc a quyết định chiều dốc và độ nghiêng, còn tung độ gốc b xác định vị trí đường thẳng cắt trục thẳng đứng Oy.',
      keyPoints: [
        '📈 Ý nghĩa hệ số góc a: a > 0 thì đường thẳng dốc lên từ trái qua phải (đồng biến); a < 0 thì dốc xuống (nghịch biến); |a| càng lớn đường thẳng càng dựng đứng.',
        '🎯 Điểm cắt trục tung Oy: Luôn là điểm (0, b), biểu diễn trạng thái ban đầu khi x = 0.',
        '📐 Giao điểm trục hoành Ox: Điểm (-b/a, 0) tìm được khi cho y = 0.',
        '⚠️ Bẫy sai lầm: Nhầm lẫn giữa trục hoành Ox (nằm ngang) và trục tung Oy (thẳng đứng); hai đường thẳng song song khi có a = a\' và b ≠ b\'.',
      ],
      summarizedAt: timeStr,
    };
  }

  // 5. Topic: Hình học không gian
  if (topicLower.includes('không gian') || topicLower.includes('hình hộp') || topicLower.includes('lập phương')) {
    return {
      summary:
        'Hình học không gian nghiên cứu các khối 3 chiều (chiều dài, chiều rộng, chiều cao) với các yếu tố đỉnh, cạnh và mặt phẳng. Tư duy trực quan thông qua hình trải phẳng (net) giúp dễ dàng tính diện tích xung quanh và thể tích khối hình.',
      keyPoints: [
        '📦 Yếu tố cơ bản: Một khối đa diện gồm các đỉnh, cạnh và mặt; các mặt đối diện nhau trong hình hộp chữ nhật luôn bằng nhau.',
        '📐 Thể tích khối: Thể tích bằng diện tích mặt đáy nhân với chiều cao (V = S_đáy × h).',
        '✂️ Diện tích xung quanh: Bằng chu vi mặt đáy nhân với chiều cao; tổng diện tích toàn phần bao gồm diện tích xung quanh cộng 2 đáy.',
        '⚠️ Bẫy sai lầm: Chú ý đổi đồng nhất đơn vị đo (cm, dm, m) trước khi tính toán diện tích hoặc thể tích.',
      ],
      summarizedAt: timeStr,
    };
  }

  // 6. Generic Math Concept Extractor
  // Extract clean meaningful sentences from user-provided text
  const cleanContent = material.content.replace(/data:image\/[^;]+;base64,[^\s]+/g, '[Ảnh minh họa]').trim();
  const rawSentences = cleanContent
    .split(/[.\n!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12 && !s.startsWith('http') && !s.startsWith('<svg'));

  const coreSentences = rawSentences.slice(0, 2).join('. ');
  const fallbackSummary = coreSentences
    ? `Bài học "${material.title}" trong chủ đề ${material.topic}: ${coreSentences}. Nội dung tập trung vào việc hiểu rõ bản chất quy luật và phương pháp tư duy toán học.`
    : `Tóm tắt bài học "${material.title}" thuộc chuyên đề ${material.topic}. Học sinh cần nắm vững định nghĩa cốt lõi, mối quan hệ trực quan giữa các đại lượng và quy trình từng bước khi giải toán.`;

  return {
    summary: fallbackSummary,
    keyPoints: [
      `📌 Khái niệm cốt lõi: Nắm vững bản chất môn Toán trong chủ đề "${material.topic}", kết nối bài học với hình ảnh tư duy trực quan.`,
      rawSentences[0]
        ? `📐 Quy tắc then chốt: ${rawSentences[0]}.`
        : '📐 Quy tắc then chốt: Xác định chính xác các đại lượng cho trước và ẩn số cần tìm trước khi lập luận.',
      rawSentences[1]
        ? `💡 Phương pháp tư duy: ${rawSentences[1]}.`
        : '💡 Phương pháp tư duy: Vận dụng mô hình trực quan để phân tích từng bước, tránh ghi nhớ công thức một cách máy móc.',
      '⚠️ Lưu ý quan trọng: Luôn kiểm tra lại điều kiện xác định, đơn vị đo và tính hợp lý của kết quả sau khi giải xong.',
    ],
    summarizedAt: timeStr,
  };
}
