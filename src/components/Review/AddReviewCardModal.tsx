import React, { useState } from 'react';
import { ReviewCard, MasteryLevel } from '../../types';
import { X, Sparkles, Plus, BookOpen } from 'lucide-react';
import { sound } from '../../utils/sound';

interface AddReviewCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (card: Omit<ReviewCard, 'id' | 'reviewCount'>) => void;
  defaultTopic?: string;
}

export const AddReviewCardModal: React.FC<AddReviewCardModalProps> = ({
  isOpen,
  onClose,
  onAddCard,
  defaultTopic = 'Phân số & Tỷ số',
}) => {
  const [subject, setSubject] = useState('Toán Học');
  const [topic, setTopic] = useState(defaultTopic);
  const [cardCategory, setCardCategory] = useState<'concept' | 'definition' | 'example' | 'distinction' | 'rule_note'>('concept');
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [hint, setHint] = useState('');
  const [answer, setAnswer] = useState('');
  const [example, setExample] = useState('');
  const [distinction, setDistinction] = useState('');
  const [ruleNote, setRuleNote] = useState('');
  const [formula, setFormula] = useState('');
  const [visualMetaphor, setVisualMetaphor] = useState('');
  const [mastery, setMastery] = useState<MasteryLevel>('learning');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !question.trim() || !answer.trim()) return;

    sound.playSuccess();
    onAddCard({
      subject,
      topic,
      cardCategory,
      title: title.trim(),
      question: question.trim(),
      hint: hint.trim() || undefined,
      answer: answer.trim(),
      example: example.trim() || undefined,
      distinction: distinction.trim() || undefined,
      ruleNote: ruleNote.trim() || undefined,
      formula: formula.trim() || undefined,
      visualMetaphor: visualMetaphor.trim() || undefined,
      mastery,
      lastReviewedAt: 'Mới thêm',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200/90 shadow-2xl p-6 sm:p-7 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Thêm Thẻ Ôn Tập Mới</h3>
              <p className="text-xs text-slate-500">Tạo thẻ ghi nhớ để kích hoạt tư duy chủ động (Active Recall)</p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1">Môn học (đa môn):</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800"
              >
                <option value="Toán Học">📐 Toán Học</option>
                <option value="Vật Lý">⚡ Vật Lý</option>
                <option value="Hóa Học">🧪 Hóa Học</option>
                <option value="Sinh Học">🌿 Sinh Học</option>
                <option value="Tiếng Anh">🇬🇧 Tiếng Anh</option>
                <option value="Lịch Sử">📜 Lịch Sử & Địa Lý</option>
                <option value="Tin Học">💻 Tin Học & Lập Trình</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Dạng thẻ ưu tiên:</label>
              <select
                value={cardCategory}
                onChange={(e) => setCardCategory(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800"
              >
                <option value="concept">💡 Khái niệm trọng tâm</option>
                <option value="definition">📖 Định nghĩa chuẩn</option>
                <option value="example">🔍 Ví dụ minh họa thực tế</option>
                <option value="distinction">⚖️ Phân biệt tránh nhầm lẫn</option>
                <option value="rule_note">⚠️ Quy tắc / Lưu ý quan trọng</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Chủ đề bài học:</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="VD: Định lý Pytago, Quang phổ, Thì hiện tại hoàn thành..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">
              Tiêu đề ngắn của thẻ <span className="text-rose-500">*</span>:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Bí quyết nhớ công thức Pytago"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">
              Mặt trước: Khái niệm / Câu hỏi kích hoạt tư duy <span className="text-rose-500">*</span>:
            </label>
            <textarea
              required
              rows={2}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="VD: Trong tam giác vuông, bình phương cạnh huyền bằng gì?"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Gợi ý suy luận (tùy chọn):</label>
            <input
              type="text"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="VD: Nhớ tới hình ảnh ghép 3 hình vuông..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">
              Mặt sau: Định nghĩa cốt lõi & Giải thích ngắn gọn <span className="text-rose-500">*</span>:
            </label>
            <textarea
              required
              rows={3}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="VD: Bằng tổng bình phương hai cạnh góc vuông (BC² = AB² + AC²)..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1">Ví dụ minh họa (Ví dụ cụ thể):</label>
              <input
                type="text"
                value={example}
                onChange={(e) => setExample(e.target.value)}
                placeholder="VD: Tam giác có 2 cạnh 3cm, 4cm thì cạnh huyền = 5cm"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1">Phân biệt (Tránh nhầm lẫn):</label>
              <input
                type="text"
                value={distinction}
                onChange={(e) => setDistinction(e.target.value)}
                placeholder="VD: Phân biệt cạnh huyền (đối diện góc vuông) với cạnh góc vuông"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1">Quy tắc / Lưu ý quan trọng:</label>
              <input
                type="text"
                value={ruleNote}
                onChange={(e) => setRuleNote(e.target.value)}
                placeholder="VD: Bắt buộc tam giác phải có 1 góc bằng 90 độ"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1">Công thức cốt lõi (nếu có):</label>
              <input
                type="text"
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                placeholder="VD: a² + b² = c²"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => { sound.playClick(); onClose(); }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all cursor-pointer shadow-md shadow-indigo-600/20"
            >
              Lưu Thẻ Ôn Tập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
