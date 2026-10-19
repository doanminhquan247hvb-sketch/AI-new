import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Sparkles, HelpCircle, ArrowRight, RotateCcw, Trophy, Flame } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Question {
  id: number;
  category: string;
  question: string;
  hint: string;
  options: { label: string; text: string }[];
  correct: string;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Phân Số',
    question: 'Nếu cắt một chiếc bánh pizza làm 8 lát bằng nhau và bạn ăn hết 4 lát, phân số này tương đương với điều gì?',
    hint: 'Hãy tưởng tượng chiếc bánh bị cắt đôi xem sao nhé!',
    options: [
      { label: 'A', text: 'Ăn hết 25% chiếc bánh' },
      { label: 'B', text: 'Ăn đúng một nửa chiếc bánh (1/2 hay 50%)' },
      { label: 'C', text: 'Ăn nhiều hơn một nửa chiếc bánh' },
      { label: 'D', text: 'Ăn hết 4/4 chiếc bánh' },
    ],
    correct: 'B',
    explanation: 'Chính xác! 4/8 sau khi rút gọn (chia cả tử và mẫu cho 4) bằng đúng 1/2 (tức 50% chiếc bánh).',
  },
  {
    id: 2,
    category: 'Cân Thăng Bằng',
    question: 'Trên cân đòn thăng bằng, đĩa trái có "2 hộp x và 4 quả cân 1kg", đĩa phải có "10 quả cân 1kg". Khi bỏ bớt 4 quả cân ở cả hai đĩa, đĩa phải còn lại mấy kg?',
    hint: 'Bỏ cùng một lượng ở cả 2 vế thì cân vẫn luôn thăng bằng.',
    options: [
      { label: 'A', text: 'Còn 10 kg' },
      { label: 'B', text: 'Còn 8 kg' },
      { label: 'C', text: 'Còn 6 kg (10 - 4 = 6)' },
      { label: 'D', text: 'Còn 4 kg' },
    ],
    correct: 'C',
    explanation: 'Tuyệt vời! 10 - 4 = 6 kg. Khi đó 2x = 6 kg, do đó mỗi hộp x nặng đúng 3 kg!',
  },
  {
    id: 3,
    category: 'Đồ Thị Hàm Số',
    question: 'Đường thẳng y = 2x + 3 sẽ cắt trục thẳng đứng (trục tung Oy) tại điểm có tọa độ nào?',
    hint: 'Tại trục tung Oy, giá trị x luôn bằng 0.',
    options: [
      { label: 'A', text: 'Điểm (0, 3)' },
      { label: 'B', text: 'Điểm (3, 0)' },
      { label: 'C', text: 'Điểm (0, 2)' },
      { label: 'D', text: 'Điểm (2, 3)' },
    ],
    correct: 'A',
    explanation: 'Rất chính xác! Khi cho x = 0, ta có y = 2(0) + 3 = 3. Do đó tung độ gốc luôn là (0, b) = (0, 3).',
  },
  {
    id: 4,
    category: 'Định Lý Pytago',
    question: 'Một tam giác vuông có 2 cạnh góc vuông dài 3cm và 4cm. Hỏi cạnh huyền dài bao nhiêu cm?',
    hint: 'Tổng diện tích hai hình vuông: 3² + 4² = 9 + 16 = 25.',
    options: [
      { label: 'A', text: '5 cm (vì 5² = 25)' },
      { label: 'B', text: '7 cm' },
      { label: 'C', text: '6 cm' },
      { label: 'D', text: '12 cm' },
    ],
    correct: 'A',
    explanation: 'Xuất sắc! Đây chính là bộ ba số Pytago kinh điển: 3² + 4² = 9 + 16 = 25 = 5².',
  },
  {
    id: 5,
    category: 'Đồ Thị',
    question: 'Hàm số y = -2x + 4 có đồ thị đi lên dốc hay đi xuống dốc từ trái sang phải?',
    hint: 'Nhìn vào dấu của hệ số góc a.',
    options: [
      { label: 'A', text: 'Đi lên dốc (đồng biến)' },
      { label: 'B', text: 'Đi xuống dốc (nghịch biến vì hệ số góc a = -2 âm)' },
      { label: 'C', text: 'Nằm ngang hoàn toàn' },
      { label: 'D', text: 'Thẳng đứng vuông góc với trục hoành' },
    ],
    correct: 'B',
    explanation: 'Đúng rồi! Vì hệ số góc a = -2 < 0, mỗi khi x tăng 1 đơn vị thì y giảm 2 đơn vị, tạo thành con dốc trượt xuống.',
  },
];

export const QuickQuiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const q = QUESTIONS[currentIdx];

  const handleSelect = (label: string) => {
    if (isAnswered) return;
    setSelectedOption(label);
    setIsAnswered(true);

    if (label === q.correct) {
      sound.playSuccess();
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
    } else {
      sound.playPop(200);
      setStreak(0);
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setIsCompleted(false);
  };

  return (
    <div id="quick-quiz-section" className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-7 shadow-xs relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
            4
          </span>
          <div>
            <h4 className="font-extrabold text-slate-900 text-base">
              Thử Thách 10 Giây (Khối 4: Củng Cố Ngay Lập Tức)
            </h4>
            <p className="text-xs text-slate-500">
              Kiểm tra khả năng trực giác toán học qua câu hỏi tình huống thực tế
            </p>
          </div>
        </div>

        {/* Streak & Score Counter */}
        <div className="flex items-center gap-2">
          {streak > 1 && (
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-300/80 px-2.5 py-1 rounded-xl text-xs font-bold text-amber-800 animate-bounce">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Chuỗi {streak} câu đúng!</span>
            </div>
          )}
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-3 py-1 rounded-xl">
            Điểm: {score}/{QUESTIONS.length}
          </span>
        </div>
      </div>

      {!isCompleted ? (
        <div className="mt-5 space-y-4">
          {/* Question Meta */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200/50">
              {q.category}
            </span>
            <span className="text-slate-400 font-medium">
              Câu hỏi {currentIdx + 1} / {QUESTIONS.length}
            </span>
          </div>

          {/* Question Text */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-sm font-bold text-slate-900 leading-relaxed">
            {q.question}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {q.options.map((opt) => {
              const isSelected = selectedOption === opt.label;
              const isCorrect = opt.label === q.correct;

              let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/40';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-xs';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 line-through';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={opt.label}
                  disabled={isAnswered}
                  onClick={() => handleSelect(opt.label)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0">
                    {opt.label}
                  </span>
                  <span className="flex-1">{opt.text}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Feedback */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                  selectedOption === q.correct
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/80 border-amber-200 text-amber-950'
                }`}
              >
                <div>
                  <strong className="font-bold block mb-0.5">
                    {selectedOption === q.correct ? '🎉 Tuyệt vời!' : '💡 Gợi ý tư duy:'}
                  </strong>
                  <span>{q.explanation}</span>
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shrink-0 cursor-pointer shadow-xs"
                >
                  <span>{currentIdx < QUESTIONS.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* Completed Screen */
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-amber-200 shadow-sm">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h5 className="text-xl font-black text-slate-900">
              Hoàn Thành Thử Thách 10 Giây!
            </h5>
            <p className="text-xs text-slate-600 mt-1">
              Bạn đạt được <strong className="text-indigo-600 font-bold">{score}/{QUESTIONS.length}</strong> điểm. Cảm nhận trực giác toán học của bạn rất tốt!
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Thử lại một lần nữa</span>
          </button>
        </div>
      )}
    </div>
  );
};
