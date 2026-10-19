import React, { useState, useEffect } from 'react';
import { ReviewQuizItem } from '../../types';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  Zap,
  Flame,
  Award,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  PlayCircle,
  Timer,
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface SpeedQuizReviewProps {
  quizzes: ReviewQuizItem[];
  onGoToSimulation?: (topicName?: string) => void;
}

export const SpeedQuizReview: React.FC<SpeedQuizReviewProps> = ({ quizzes, onGoToSimulation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [missedQuestions, setMissedQuestions] = useState<ReviewQuizItem[]>([]);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15);

  const currentQuiz = quizzes[currentIndex];

  // Timer countdown
  useEffect(() => {
    if (!isTimerActive || selectedOption !== null || isCompleted) return;

    if (timeLeft <= 0) {
      // Time's up - mark as incorrect (no option selected)
      sound.playError();
      setSelectedOption(-1);
      setStreak(0);
      setMissedQuestions((prev) => [...prev, currentQuiz]);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTimerActive, selectedOption, isCompleted, currentQuiz]);

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return; // Prevent multiple answers

    setSelectedOption(idx);
    const isCorrect = idx === currentQuiz.correctIndex;

    if (isCorrect) {
      sound.playSuccess();
      setScore((s) => s + 10);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
    } else {
      sound.playError();
      setStreak(0);
      setMissedQuestions((prev) => [...prev, currentQuiz]);
    }
  };

  const handleNextQuestion = () => {
    sound.playClick();
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setTimeLeft(15);
    } else {
      setIsCompleted(true);
      sound.playSuccess();
    }
  };

  const handleRestart = (onlyMissed = false) => {
    sound.playClick();
    if (onlyMissed && missedQuestions.length > 0) {
      setCurrentIndex(0);
      setSelectedOption(null);
      setTimeLeft(15);
      setIsCompleted(false);
      // Let user retry missed
    } else {
      setCurrentIndex(0);
      setSelectedOption(null);
      setScore(0);
      setStreak(0);
      setMissedQuestions([]);
      setTimeLeft(15);
      setIsCompleted(false);
    }
  };

  if (isCompleted) {
    const accuracy = Math.round((score / (quizzes.length * 10)) * 100);
    return (
      <div className="bg-white rounded-3xl p-8 max-w-xl mx-auto border border-slate-200/90 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/25">
          <Award className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80">
            Tổng Kết Trắc Nghiệm Ôn Tập
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            {accuracy >= 80 ? 'Xuất Sắc! Nắm Rất Vững Bài' : accuracy >= 50 ? 'Khá Lắm! Tiếp Tục Phát Huy' : 'Cần Ôn Luyện Thêm Một Chút'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Em đã hoàn thành thử thách câu hỏi trắc giác bản chất toán học
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-indigo-50/80 p-3.5 rounded-2xl border border-indigo-200/60">
            <span className="text-[11px] font-bold text-indigo-700 block">Điểm số</span>
            <span className="text-xl font-black text-indigo-950">{score} đ</span>
          </div>
          <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200/60">
            <span className="text-[11px] font-bold text-emerald-700 block">Độ chính xác</span>
            <span className="text-xl font-black text-emerald-950">{accuracy}%</span>
          </div>
          <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/60">
            <span className="text-[11px] font-bold text-amber-700 block">Chuỗi đúng cao nhất</span>
            <span className="text-xl font-black text-amber-950">{maxStreak} 🔥</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => handleRestart(false)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-600/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Làm Lại Toàn Bộ</span>
          </button>

          {onGoToSimulation && (
            <button
              onClick={() => onGoToSimulation()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-amber-500/20"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Xem Bàn Mô Phỏng</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Header bar: Question index, timer, streaks */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            Câu {currentIndex + 1} / {quizzes.length}
          </span>
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            Chủ đề: <span className="text-slate-800 font-extrabold">{currentQuiz.topic}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer toggle & display */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-700">
            <Timer className={`w-3.5 h-3.5 ${timeLeft <= 5 ? 'text-rose-600 animate-pulse' : 'text-slate-500'}`} />
            <span className={timeLeft <= 5 ? 'text-rose-600 font-black' : ''}>{timeLeft}s</span>
          </div>

          {/* Streak indicator */}
          <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-xl text-xs font-black text-amber-800">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{streak} Streak</span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1 px-3 py-1 bg-indigo-50 border border-indigo-200/80 rounded-xl text-xs font-black text-indigo-800">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{score} đ</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 mb-1 block">
            Thử Thách Khắc Sâu Kiến Thức:
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
            {currentQuiz.question}
          </h3>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-2.5">
          {currentQuiz.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQuiz.correctIndex;
            const hasAnswered = selectedOption !== null;

            let buttonStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200/90 text-slate-800';

            if (hasAnswered) {
              if (isCorrect) {
                buttonStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-300/50';
              } else if (isSelected && !isCorrect) {
                buttonStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-bold';
              } else {
                buttonStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={hasAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`p-4 rounded-2xl border text-left text-sm sm:text-base transition-all flex items-center justify-between gap-3 cursor-pointer ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      hasAnswered && isCorrect
                        ? 'bg-emerald-600 text-white'
                        : hasAnswered && isSelected && !isCorrect
                        ? 'bg-rose-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-200 shadow-2xs'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>

                {hasAnswered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {hasAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Feedback block once answered */}
        {selectedOption !== null && (
          <div className="space-y-3 pt-2 animate-fadeIn">
            <div
              className={`p-4 rounded-2xl border ${
                selectedOption === currentQuiz.correctIndex
                  ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50/90 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider mb-1">
                {selectedOption === currentQuiz.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-800">Chính xác tuyệt đối! (+10 điểm)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span className="text-rose-800">
                      {selectedOption === -1 ? 'Hết giờ!' : 'Chưa đúng rồi!'} Đáp án đúng là{' '}
                      {String.fromCharCode(65 + currentQuiz.correctIndex)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm font-medium leading-relaxed mt-1">
                {currentQuiz.explanation}
              </p>

              {currentQuiz.tip && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-200/50 flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Mẹo: {currentQuiz.tip}</span>
                </div>
              )}
            </div>

            {/* Next button */}
            <div className="flex items-center justify-between gap-3 pt-2">
              {onGoToSimulation && (
                <button
                  onClick={() => onGoToSimulation(currentQuiz.topic)}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Mở mô phỏng chủ đề này</span>
                </button>
              )}

              <button
                onClick={handleNextQuestion}
                className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-indigo-600/20"
              >
                <span>{currentIndex < quizzes.length - 1 ? 'Câu Tiếp Theo' : 'Xem Kết Quả'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
