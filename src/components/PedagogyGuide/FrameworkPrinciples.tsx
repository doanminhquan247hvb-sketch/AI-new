import React from 'react';
import { BookOpen, Zap, Compass, HeartHandshake, ArrowRight, CheckCircle2, XCircle, Sparkles, Sliders } from 'lucide-react';
import { sound } from '../../utils/sound';

export const FrameworkPrinciples: React.FC = () => {
  const principles = [
    {
      num: '01',
      title: 'Mô hình CPA (Concrete → Pictorial → Abstract)',
      subtitle: 'Cụ thể hóa trước khi trừu tượng hóa',
      desc: 'Đừng bao giờ bắt đầu bằng công thức khô khan như y = ax + b hay a² + b² = c². Hãy bắt đầu bằng 1 vật thể thực (chiếc bánh pizza, con dốc leo núi, chiếc cân đòn thợ bán hàng). Sau đó là mô hình hình học, và cuối cùng mới đưa ra ký hiệu toán học.',
      badge: 'Phương pháp Singapore Math & Jerome Bruner',
      color: 'border-blue-200 bg-blue-50/40 text-blue-900',
      iconColor: 'text-blue-600',
      example: 'Phân số 3/4 = Cắt bánh 4 lát lấy 3 lát ➔ Đổi sang 75% ➔ Ký hiệu 3/4',
    },
    {
      num: '02',
      title: 'Vòng Lặp Phản Hồi Dưới 50ms (Zero-Latency Feedback)',
      subtitle: 'Tay kéo đến đâu, mắt thấy hình biến đổi tức thì đến đó',
      desc: 'Khái niệm toán học khó hiểu nhất là khi học sinh không thể hình dung biến số biến thiên liên tục ra sao. Thanh trượt tương tác (slider) cho phép não bộ kết nối trực giác: "À, hệ số a âm thì đường thẳng chúc xuống, a dương thì ngóc đầu lên!".',
      badge: 'Nguyên lý Bret Victor (Inventing on Principle)',
      color: 'border-indigo-200 bg-indigo-50/40 text-indigo-900',
      iconColor: 'text-indigo-600',
      example: 'Kéo hệ số góc a trên đồ thị Oxy: Đường thẳng xoay mượt mà, tam giác dốc co giãn ngay tức khắc.',
    },
    {
      num: '03',
      title: 'Giảm Tải Nhận Thức (Cognitive Load Theory)',
      subtitle: '1 Màn hình = 1 Khái niệm cốt lõi, không phân tâm',
      desc: 'Tránh xa các giao diện phức tạp với hàng chục nút bấm rườm rà. Bản khung v.01 chỉ tập trung vào 1 ý niệm chính. Mọi con số, màu sắc và đường nét đều phải phục vụ việc giải thích bản chất.',
      badge: 'UX Sư phạm chuẩn John Sweller',
      color: 'border-emerald-200 bg-emerald-50/40 text-emerald-900',
      iconColor: 'text-emerald-600',
      example: 'Đồng bộ màu sắc: Màu hồng của tham số a khớp với màu đường thẳng và màu tam giác độ dốc.',
    },
    {
      num: '04',
      title: 'Ẩn Dụ Đời Thường & Phản Hồi Động Viên (Socratic)',
      subtitle: 'Xóa bỏ nỗi sợ sai lầm trong môn Toán',
      desc: 'Khi học sinh chọn sai, bản khung không bao giờ hiện chữ báo lỗi đỏ lòm gây nản chí, mà đưa ra một câu hỏi gợi mở trực quan: "Hãy nhìn chiếc bánh xem 4 miếng có phải là một nửa của 8 miếng không nào?". Toán học trở thành hành trình khám phá thay vì thi cử áp lực.',
      badge: 'Tâm lý học học tập tích cực',
      color: 'border-amber-200 bg-amber-50/40 text-amber-900',
      iconColor: 'text-amber-600',
      example: 'Giải phương trình 2x + 4 = 10 bằng cách bốc bớt 4 quả cân ở cả 2 đĩa của chiếc cân đòn.',
    },
  ];

  return (
    <section id="principles-section" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200/80">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            Cẩm Nang Sư Phạm Trực Quan
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2 tracking-tight">
            4 Nguyên Tắc Cốt Lõi Để Dựng Giao Diện Toán "Dễ Hiểu"
          </h2>
          <p className="text-slate-600 text-sm md:text-base mt-1 max-w-2xl">
            Nền tảng khoa học giáo dục giúp học sinh hiểu sâu bản chất, nhớ lâu và xóa bỏ định kiến "toán học là môn học khô khan, toàn công thức".
          </p>
        </div>
      </div>

      {/* Comparison Grid: Old way vs Visual Framework way */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-6 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-base mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          So Sánh: Cách Dạy Truyền Thống vs Bản Khung Trực Quan v.01
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Traditional Box */}
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-2.5">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Cách Tiếp Cận Truyền Thống (Dễ Gây Chán)</span>
            </div>
            <ul className="space-y-2 text-rose-950/80 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>Bắt học sinh chép thuộc lòng định nghĩa và công thức trừu tượng ngay từ đầu (học vẹt).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>Hình vẽ tĩnh trên sách giáo khoa, không thể di chuyển hoặc thay đổi tham số.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>Quy tắc chuyển vế đổi dấu máy móc: "Chuyển vế thì đổi dấu" mà không hiểu tại sao.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>Khi làm sai chỉ có dấu gạch chéo đỏ [X], gây tâm lý sợ hãi và tự ti.</span>
              </li>
            </ul>
          </div>

          {/* Visual Framework Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bản Khung Trực Quan v.01 (Trực Giác Trước Tiên)</span>
            </div>
            <ul className="space-y-2 text-emerald-950/80 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Bắt đầu từ hình ảnh đời thực (bánh pizza, cân đòn, con dốc xe đạp) để tạo cảm giác gần gũi.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Thanh trượt thời gian thực: Kéo số a đến đâu, đồ thị nghiêng và nhảy số đến đó (&lt; 50ms).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Hiểu dấu bằng (=) là hai đĩa cân thăng bằng: Lấy bớt một lượng ở cả 2 vế thì cân vẫn thăng bằng.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Gợi mở kiểu Socrates khi sai: Chỉ ra hình ảnh trực giác để học sinh tự nhận ra lời giải.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {principles.map((item) => (
          <div
            key={item.num}
            className={`p-6 rounded-3xl border ${item.color} shadow-xs space-y-3 relative overflow-hidden transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black opacity-30 font-mono">{item.num}</span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/80 border border-slate-200 shadow-2xs">
                {item.badge}
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-base">{item.title}</h3>
              <p className="text-xs font-semibold opacity-75 mt-0.5">{item.subtitle}</p>
            </div>

            <p className="text-xs leading-relaxed text-slate-700">{item.desc}</p>

            <div className="p-3 bg-white/80 rounded-2xl border border-slate-200/80 text-[11px] text-slate-800">
              <strong className="font-bold text-slate-900 block mb-0.5">Ứng dụng trong giao diện:</strong>
              <span>{item.example}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
