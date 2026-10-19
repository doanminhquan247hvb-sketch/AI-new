import React, { useState } from 'react';
import { Copy, Check, Wand2, SlidersHorizontal, Settings2, Code, FileCode2 } from 'lucide-react';

export const PromptBuilder: React.FC = () => {
  const [grade, setGrade] = useState<'primary' | 'secondary' | 'highschool'>('secondary');
  const [topic, setTopic] = useState<string>('Hàm số bậc nhất và Đồ thị tọa độ Oxy');
  const [pedagogy, setPedagogy] = useState<string>('cpa');
  const [includeSlider, setIncludeSlider] = useState<boolean>(true);
  const [includeQuiz, setIncludeQuiz] = useState<boolean>(true);
  const [includeRealWorldMetaphor, setIncludeRealWorldMetaphor] = useState<boolean>(true);
  const [techStack, setTechStack] = useState<string>('React (TypeScript) + Tailwind CSS + Lucide Icons');
  const [copied, setCopied] = useState<boolean>(false);

  // Computed Grade Label
  const gradeLabel =
    grade === 'primary'
      ? 'Tiểu học (Lớp 1 - 5)'
      : grade === 'secondary'
      ? 'THCS (Lớp 6 - 9)'
      : 'THPT (Lớp 10 - 12)';

  // Generate the prompt dynamically based on user selections
  const generatedPrompt = `Bạn là một Chuyên gia Công nghệ Giáo dục (EdTech) và Kỹ sư Front-end giàu kinh nghiệm.

HÃY THIẾT KẾ VÀ DỰNG "BẢN KHUNG MÔN TOÁN V.01" DỄ HIỂU NHẤT CHO CHỦ ĐỀ:
"${topic}" dành cho đối tượng học sinh: ${gradeLabel}.

1. MỤC TIÊU CỐT LÕI (TRỰC QUAN & DỄ HIỂU):
- Triệt tiêu cảm giác sợ hãi môn Toán bằng cách biến công thức khô khan thành chuyển động hình học cụ thể.
${includeRealWorldMetaphor ? '- Bắt buộc gắn liền với 1 ẩn dụ đời thực gần gũi (Ví dụ: dốc cầu, con lắc, bánh pizza, thanh kẹo, bậc thang).' : ''}
${
  pedagogy === 'cpa'
    ? '- Áp dụng phương pháp CPA (Concrete → Pictorial → Abstract): Đi từ thực tế trực quan trước, sau đó mới đến ký hiệu toán học.'
    : pedagogy === 'socratic'
    ? '- Áp dụng phương pháp gợi mở Socrates: Đặt câu hỏi kích thích quan sát, không ném ngay lời giải sẵn.'
    : '- Kết hợp yếu tố Gamification: Chia nhỏ thành các thử thách nhỏ, mở khóa từng huy hiệu kiến thức.'
}

2. CẤU TRÚC BẢN KHUNG V.01 (GỒM 4 KHỐI THIẾT YẾU):
- KHỐI 1: KHỞI ĐỘNG TRỰC GIÁC (Intuitive Hook)
  + 1 câu hỏi đời sống gây tò mò.
  + Đồ họa khởi động không dùng ký hiệu toán học phức tạp.
- KHỐI 2: PHÒNG THÍ NGHIỆM TƯƠNG TÁC (Interactive Lab)
${includeSlider ? '  + Thanh trượt (Sliders) điều chỉnh tham số với độ trễ dưới 50ms.' : ''}
  + Khung hiển thị đồ họa SVG chuyển động mượt mà tương ứng với giá trị tham số.
  + Thẻ "Ý nghĩa đời thường": Diễn giải bằng câu văn bình dân, rõ ràng.
- KHỐI 3: CẦU NỐI CÔNG THỨC (Formula Bridge)
  + Kết nối các tham số vừa thay đổi vào phương trình toán học chuẩn.
  + Tô màu đồng bộ giữa tham số trên thanh trượt và ký hiệu trong công thức.
${includeQuiz ? `- KHỐI 4: THỬ THÁCH NHỎ 10 GIÂY (Micro-Check)
  + 1 câu hỏi trắc nghiệm tương tác kiểm tra ngay mức độ thấu hiểu bản chất.
  + Phản hồi giải thích chi tiết vì sao đúng/sai theo hướng tích cực, động viên.` : ''}

3. QUY CHUẨN CÔNG NGHỆ:
- Ngôn ngữ & Thư viện: ${techStack}.
- Giao diện thân thiện, gọn gàng, không dùng bảng điều khiển rối mắt, tối ưu responsive trên cả mobile và desktop.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="prompt-builder-section" className="scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Wand2 className="w-3.5 h-3.5 text-emerald-600" />
            Công Cụ Tạo Prompt Tùy Chỉnh (Custom Builder)
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Tự Thiết Kế Prompt "Bản Khung Toán v.01" Của Bạn
          </h2>
          <p className="text-slate-600 text-sm md:text-base mt-1 max-w-2xl">
            Tùy biến cấp học, chủ đề, phương pháp sư phạm và tính năng tương tác để nhận ngay Prompt tối ưu nhất cho bài toán của bạn.
          </p>
        </div>
      </div>

      {/* Main Builder Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Options */}
        <div className="lg:col-span-5 bg-white p-5 md:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Settings2 className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-bold text-slate-800">Tùy Chọn Thông Số</span>
          </div>

          {/* Grade Level */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              1. Đối tượng / Cấp học
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'primary', label: 'Tiểu học' },
                { id: 'secondary', label: 'THCS' },
                { id: 'highschool', label: 'THPT' }
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setGrade(lvl.id as any)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                    grade === lvl.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Select or Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              2. Chủ đề Toán cần làm dễ hiểu
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2.5 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            >
              <option value="Phân số, Tỷ lệ phần trăm và Chia đều trực quan">Phân số, Tỷ lệ % và Chia đều trực quan (Tiểu học)</option>
              <option value="Hàm số bậc nhất y = ax + b và Đồ thị tọa độ Oxy">Hàm số bậc nhất y = ax + b và Đồ thị Oxy</option>
              <option value="Định lý Pytago và Tam giác vuông thực tế">Định lý Pytago và Tam giác vuông thực tế</option>
              <option value="Phương trình bậc hai ax² + bx + c = 0 và Đỉnh Parabol">Phương trình bậc hai ax² + bx + c = 0 và Parabol</option>
              <option value="Xác suất thống kê qua vòng quay may mắn & tung xúc xắc">Xác suất thống kê qua vòng quay & tung xúc xắc</option>
              <option value="Đường tròn lượng giác và hàm Sin, Cos">Đường tròn lượng giác và hàm Sin, Cos</option>
            </select>
          </div>

          {/* Pedagogy Method */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              3. Phương pháp sư phạm dễ hiểu
            </label>
            <div className="space-y-2">
              {[
                { id: 'cpa', title: 'Mô hình CPA (Concrete → Pictorial → Abstract)', desc: 'Đi từ vật thể thực tế → Đồ thị → Công thức' },
                { id: 'socratic', title: 'Phương pháp gợi mở Socrates', desc: 'Đặt câu hỏi nhỏ từng bước để người học tự khám phá' },
                { id: 'gamified', title: 'Trò chơi hóa (Gamification)', desc: 'Học qua mini-game, tích điểm và phản hồi vui tươi' }
              ].map((p) => (
                <label
                  key={p.id}
                  onClick={() => setPedagogy(p.id)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    pedagogy === p.id
                      ? 'bg-indigo-50/70 border-indigo-400 text-indigo-950'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="pedagogy"
                    checked={pedagogy === p.id}
                    onChange={() => setPedagogy(p.id)}
                    className="mt-0.5 accent-indigo-600 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold block">{p.title}</span>
                    <span className="text-[11px] text-slate-500">{p.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Feature Toggles */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              4. Thành phần bắt buộc trong Bản Khung
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSlider}
                  onChange={(e) => setIncludeSlider(e.target.checked)}
                  className="rounded accent-indigo-600 w-4 h-4 cursor-pointer"
                />
                <span>Thanh trượt Sliders thay đổi tham số tức thời (&lt;50ms)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeRealWorldMetaphor}
                  onChange={(e) => setIncludeRealWorldMetaphor(e.target.checked)}
                  className="rounded accent-indigo-600 w-4 h-4 cursor-pointer"
                />
                <span>Ẩn dụ đời sống thường nhật (không dùng từ hàn lâm)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeQuiz}
                  onChange={(e) => setIncludeQuiz(e.target.checked)}
                  className="rounded accent-indigo-600 w-4 h-4 cursor-pointer"
                />
                <span>Thử thách nhỏ 10 giây (Micro-quiz phản hồi tích cực)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Output: Real-time Generated Prompt */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 shadow-md overflow-hidden">
          {/* Output Header */}
          <div className="p-4 bg-slate-800/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <FileCode2 className="w-4 h-4 text-emerald-400" />
              <span>Kết Quả Prompt v.01 (Sẵn Sàng Dùng)</span>
            </div>

            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Đã sao chép vào clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép Prompt này</span>
                </>
              )}
            </button>
          </div>

          {/* Prompt Code Display */}
          <div className="p-5 flex-1 overflow-y-auto text-xs font-mono text-emerald-300/90 whitespace-pre-wrap leading-relaxed select-all bg-slate-950/70">
            {generatedPrompt}
          </div>

          {/* Footer Guide */}
          <div className="p-3.5 bg-slate-800/60 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Định dạng: Chuẩn Markdown tối ưu cho mọi LLM</span>
            <span className="text-slate-300 font-semibold">Tương thích: AI Studio, ChatGPT, Claude, Cursor</span>
          </div>
        </div>
      </div>
    </section>
  );
};
