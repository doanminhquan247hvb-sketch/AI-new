import React, { useState } from 'react';
import { QuizQuestionItem, SavedQuizPackage } from '../../types';
import { getSavedQuizzes, saveQuizPackages } from '../../data/savedQuizzesData';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Award,
  ChevronDown,
  Plus,
  PlayCircle,
  CheckSquare,
  Lightbulb,
  FileCheck2,
  BookOpen,
  Eye,
  Check,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface QuizModeScreenProps {
  onGoToSimulation?: (topicName?: string) => void;
  onGoToReview?: () => void;
  onGoToIntake?: () => void;
}

export type FeedbackTimingMode = 'immediate' | 'end_of_quiz';

export const QuizModeScreen: React.FC<QuizModeScreenProps> = ({
  onGoToSimulation,
  onGoToReview,
  onGoToIntake,
}) => {
  // 1. Load saved quiz packages from LocalStorage
  const [savedPackages, setSavedPackages] = useState<SavedQuizPackage[]>(() => getSavedQuizzes());
  const [selectedPackageId, setSelectedPackageId] = useState<string>(() => {
    const pkgs = getSavedQuizzes();
    return pkgs[0]?.id || 'quiz-pkg-pythagoras';
  });

  const activePackage = savedPackages.find((p) => p.id === selectedPackageId) || savedPackages[0];

  // Option to filter only missed questions for self-study retry
  const [isRetryingMissedOnly, setIsRetryingMissedOnly] = useState<boolean>(false);
  const [missedQuestionIds, setMissedQuestionIds] = useState<string[]>([]);

  // The active pool of questions being solved
  const questions: QuizQuestionItem[] = isRetryingMissedOnly
    ? activePackage.questions.filter((q) => missedQuestionIds.includes(q.id))
    : activePackage?.questions || [];

  // Feedback timing mode: 'immediate' (xem sau mỗi câu) or 'end_of_quiz' (xem sau mỗi lượt)
  const [feedbackTiming, setFeedbackTiming] = useState<FeedbackTimingMode>(() => {
    try {
      const saved = localStorage.getItem('toan_truc_quan_feedback_timing');
      if (saved === 'immediate' || saved === 'end_of_quiz') return saved;
    } catch {}
    return 'immediate';
  });

  const handleSetFeedbackTiming = (mode: FeedbackTimingMode) => {
    sound.playClick();
    setFeedbackTiming(mode);
    try {
      localStorage.setItem('toan_truc_quan_feedback_timing', mode);
    } catch {}
  };

  // Current question index in the active question set
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // CRITICAL REQUIREMENT:
  // "lưu câu trả lời theo từng câu, không dùng state của câu cuối để chấm cho cả bài"
  // Answers stored strictly per question.id
  const [answers, setAnswers] = useState<Record<string, string | number | boolean>>({});

  // Individual checked state per question: { [questionId]: { isChecked, isCorrect } }
  const [checkedState, setCheckedState] = useState<Record<string, { isChecked: boolean; isCorrect: boolean }>>({});

  // Full quiz submission state (viewing final score screen)
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);

  // Modal to add a new question
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [newQuestionType, setNewQuestionType] = useState<'multiple_choice' | 'true_false' | 'fill_blank'>('multiple_choice');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptions, setNewOptions] = useState<string[]>(['', '', '', '']);
  const [newCorrectOption, setNewCorrectOption] = useState<number>(0);
  const [newCorrectBool, setNewCorrectBool] = useState<boolean>(true);
  const [newFillAnswer, setNewFillAnswer] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  const [newTip, setNewTip] = useState('');

  // Switch package
  const handleSelectPackage = (pkgId: string) => {
    sound.playClick();
    setSelectedPackageId(pkgId);
    setCurrentIndex(0);
    setAnswers({});
    setCheckedState({});
    setIsQuizSubmitted(false);
    setIsRetryingMissedOnly(false);
    setMissedQuestionIds([]);
  };

  const currentQuestion = questions[currentIndex] || questions[0];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const currentChecked = currentQuestion ? checkedState[currentQuestion.id] : undefined;

  // Validation function
  const checkIsCorrect = (q: QuizQuestionItem, userAns: any): boolean => {
    if (userAns === undefined || userAns === null || userAns === '') return false;

    if (q.type === 'true_false') {
      return Boolean(userAns) === Boolean(q.correctBool);
    }

    if (q.type === 'fill_blank') {
      const cleanUser = String(userAns).trim().toLowerCase();
      const acceptable = q.acceptableAnswers?.map((a) => a.trim().toLowerCase()) || [];
      return acceptable.some((ans) => ans === cleanUser);
    }

    // multiple_choice
    return Number(userAns) === q.correctIndex;
  };

  // Set answer strictly keyed by questionId
  const handleSetAnswer = (questionId: string, val: string | number | boolean) => {
    sound.playClick();
    setAnswers((prev) => ({
      ...prev,
      [questionId]: val,
    }));

    // If immediate mode is active and user clicks, we can allow checking or update
    if (feedbackTiming === 'immediate') {
      const q = questions.find((item) => item.id === questionId);
      if (q && q.type !== 'fill_blank') {
        const isCorrect = checkIsCorrect(q, val);
        if (isCorrect) {
          sound.playSuccess();
        } else {
          sound.playError();
        }
        setCheckedState((prev) => ({
          ...prev,
          [questionId]: {
            isChecked: true,
            isCorrect,
          },
        }));
      }
    }
  };

  // Check current question manually (for fill_blank or explicit check)
  const handleCheckCurrentQuestion = () => {
    if (!currentQuestion) return;

    if (currentAnswer === undefined || currentAnswer === '') {
      return;
    }

    const isCorrect = checkIsCorrect(currentQuestion, currentAnswer);
    if (isCorrect) {
      sound.playSuccess();
    } else {
      sound.playError();
    }

    setCheckedState((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        isChecked: true,
        isCorrect,
      },
    }));
  };

  // Check entire quiz (grades each question independently using its own answer)
  const handleSubmitWholeQuiz = () => {
    sound.playSuccess();
    const newChecked: Record<string, { isChecked: boolean; isCorrect: boolean }> = {};
    const wrongIds: string[] = [];

    questions.forEach((q) => {
      const userAns = answers[q.id];
      const isCorrect = checkIsCorrect(q, userAns);
      newChecked[q.id] = {
        isChecked: true,
        isCorrect,
      };
      if (!isCorrect) {
        wrongIds.push(q.id);
      }
    });

    setCheckedState(newChecked);
    setMissedQuestionIds(wrongIds);
    setIsQuizSubmitted(true);
  };

  // Reset quiz
  const handleResetQuiz = () => {
    sound.playPop();
    setAnswers({});
    setCheckedState({});
    setIsQuizSubmitted(false);
    setIsRetryingMissedOnly(false);
    setMissedQuestionIds([]);
    setCurrentIndex(0);
  };

  // Start retry mode for missed questions only
  const handleRetryMissedQuestions = () => {
    sound.playPop();
    setIsRetryingMissedOnly(true);
    setIsQuizSubmitted(false);
    setCurrentIndex(0);

    // Reset answers for missed questions only
    const newAnswers = { ...answers };
    const newChecked = { ...checkedState };
    missedQuestionIds.forEach((id) => {
      delete newAnswers[id];
      delete newChecked[id];
    });
    setAnswers(newAnswers);
    setCheckedState(newChecked);
  };

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).filter(
    (id) => questions.some((q) => q.id === id) && answers[id] !== undefined && answers[id] !== ''
  ).length;

  const correctCount = questions.filter((q) => checkedState[q.id]?.isCorrect).length;
  const incorrectCount = totalQuestions - correctCount;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Add question handler
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !newExplanation.trim()) return;

    const newQ: QuizQuestionItem = {
      id: `custom-q-${Date.now()}`,
      topic: activePackage.topic,
      type: newQuestionType,
      question: newQuestionText.trim(),
      explanation: newExplanation.trim(),
      tip: newTip.trim() || undefined,
      subject: activePackage.subject || 'Toán Học',
      ...(newQuestionType === 'multiple_choice'
        ? {
            options: newOptions.map((opt, i) => opt.trim() || `Phương án ${i + 1}`),
            correctIndex: newCorrectOption,
          }
        : newQuestionType === 'true_false'
        ? {
            correctBool: newCorrectBool,
          }
        : {
            acceptableAnswers: [newFillAnswer.trim()],
          }),
    };

    const updatedPkgs = savedPackages.map((pkg) => {
      if (pkg.id === activePackage.id) {
        return {
          ...pkg,
          questions: [...pkg.questions, newQ],
        };
      }
      return pkg;
    });

    setSavedPackages(updatedPkgs);
    saveQuizPackages(updatedPkgs);
    sound.playSuccess();

    setNewQuestionText('');
    setNewOptions(['', '', '', '']);
    setNewExplanation('');
    setNewFillAnswer('');
    setNewTip('');
    setIsAddQuestionModalOpen(false);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* 1. TOP BAR: Package Selector & Feedback Mode Switcher */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Package Selector */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0 relative">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              <span>Đề quiz đã lưu</span>
              <span>•</span>
              <span className="text-indigo-600 font-extrabold">{activePackage.topic}</span>
              {isRetryingMissedOnly && (
                <span className="text-rose-600 font-extrabold bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                  Ôn lại câu sai
                </span>
              )}
            </div>
            <select
              value={selectedPackageId}
              onChange={(e) => handleSelectPackage(e.target.value)}
              className="w-full text-xs sm:text-sm font-extrabold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl py-1.5 pl-2.5 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors truncate"
            >
              {savedPackages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.title} ({pkg.questions.length} câu)
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-[23px] -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Middle/Right: Feedback Timing Mode (PROMPT #04: Xem sau mỗi câu HOẶC sau mỗi lượt) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-center">
          <button
            type="button"
            onClick={() => handleSetFeedbackTiming('immediate')}
            title="Xem kết quả đúng/sai và gợi ý ngay sau mỗi câu hỏi"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              feedbackTiming === 'immediate'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Check className="w-3 h-3" />
            <span>Xem sau mỗi câu</span>
          </button>

          <button
            type="button"
            onClick={() => handleSetFeedbackTiming('end_of_quiz')}
            title="Làm một mạch rồi xem kết quả và gợi ý sau khi nộp bài cả lượt"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              feedbackTiming === 'end_of_quiz'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Xem sau cả lượt</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
          <button
            onClick={() => { sound.playClick(); setIsAddQuestionModalOpen(true); }}
            title="Thêm câu hỏi mới vào bộ này"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200/60 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Thêm câu</span>
          </button>

          <button
            onClick={handleResetQuiz}
            title="Làm lại từ đầu"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Làm lại</span>
          </button>

          {onGoToSimulation && (
            <button
              onClick={() => { sound.playSuccess(); onGoToSimulation(activePackage.topic); }}
              title="Mở mô phỏng trực quan tương ứng"
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Mô phỏng</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. QUESTION STEPPER: Sleek Pills & Progress */}
      <div className="bg-white rounded-2xl px-4 py-2.5 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const hasAns = answers[q.id] !== undefined && answers[q.id] !== '';
            const checked = checkedState[q.id];

            let pillClass = 'bg-slate-100 text-slate-600 hover:bg-slate-200';

            // Show right/wrong colors if immediate mode OR if quiz is submitted
            if ((feedbackTiming === 'immediate' || isQuizSubmitted) && checked?.isChecked) {
              if (checked.isCorrect) {
                pillClass = 'bg-emerald-500 text-white font-bold shadow-xs';
              } else {
                pillClass = 'bg-rose-500 text-white font-bold shadow-xs';
              }
            } else if (hasAns) {
              pillClass = 'bg-indigo-100 text-indigo-700 font-bold border border-indigo-300';
            }

            if (isCurrent) {
              pillClass += ' ring-2 ring-indigo-600 ring-offset-1 scale-105';
            }

            return (
              <button
                key={q.id}
                onClick={() => { sound.playClick(); setCurrentIndex(idx); }}
                className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 transition-all cursor-pointer ${pillClass}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="text-[11px] font-bold text-slate-500 shrink-0">
          <span>Đã làm: </span>
          <strong className="text-slate-800">{answeredCount}/{totalQuestions}</strong>
          {isQuizSubmitted && (
            <span className="ml-2 font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {correctCount}/{totalQuestions} ({scorePercentage}%)
            </span>
          )}
        </div>
      </div>

      {/* 3. MAIN QUESTION CARD (Khi đang giải câu hỏi) */}
      {!isQuizSubmitted && currentQuestion ? (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5 transition-all">
          {/* Question Tag & Status Header */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                Câu {currentIndex + 1} / {totalQuestions}
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                {currentQuestion.type === 'true_false'
                  ? 'Đúng / Sai'
                  : currentQuestion.type === 'fill_blank'
                  ? 'Điền đáp số'
                  : 'Trắc nghiệm'}
              </span>
            </div>

            {/* Answer state badge */}
            <div>
              {/* If in immediate mode, show right/wrong right away */}
              {feedbackTiming === 'immediate' && currentChecked?.isChecked ? (
                currentChecked.isCorrect ? (
                  <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Đúng
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    Chưa đúng
                  </span>
                )
              ) : currentAnswer !== undefined && currentAnswer !== '' ? (
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50/80 px-2.5 py-0.5 rounded-lg">
                  Đã chọn đáp án
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-400">Chưa làm</span>
              )}
            </div>
          </div>

          {/* Question Text */}
          <div className="py-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answers Selection */}
          <div>
            {/* MULTIPLE CHOICE */}
            {(!currentQuestion.type || currentQuestion.type === 'multiple_choice') && (
              <div className="space-y-2">
                {currentQuestion.options?.map((opt, optIdx) => {
                  const isSelected = currentAnswer === optIdx;
                  const isChecked = feedbackTiming === 'immediate' && currentChecked?.isChecked;
                  const isThisCorrect = optIdx === currentQuestion.correctIndex;

                  let rowStyle = 'border-slate-200 bg-slate-50/50 hover:bg-indigo-50/40 hover:border-indigo-200 text-slate-700';

                  if (isChecked) {
                    if (isThisCorrect) {
                      rowStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold';
                    } else if (isSelected && !isThisCorrect) {
                      rowStyle = 'border-rose-400 bg-rose-50/80 text-rose-950';
                    } else {
                      rowStyle = 'border-slate-200 bg-slate-50/30 text-slate-400 opacity-60';
                    }
                  } else if (isSelected) {
                    rowStyle = 'border-indigo-500 bg-indigo-50 text-indigo-950 font-semibold ring-1 ring-indigo-500';
                  }

                  const labels = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSetAnswer(currentQuestion.id, optIdx)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${rowStyle}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                          isChecked && isThisCorrect
                            ? 'bg-emerald-600 text-white'
                            : isChecked && isSelected && !isThisCorrect
                            ? 'bg-rose-600 text-white'
                            : isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white border border-slate-300 text-slate-600'
                        }`}
                      >
                        {labels[optIdx]}
                      </div>
                      <span className="text-xs sm:text-sm font-medium leading-snug flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TRUE / FALSE */}
            {currentQuestion.type === 'true_false' && (
              <div className="grid grid-cols-2 gap-3">
                {[true, false].map((boolVal) => {
                  const isSelected = currentAnswer === boolVal;
                  const isChecked = feedbackTiming === 'immediate' && currentChecked?.isChecked;
                  const isThisCorrect = boolVal === currentQuestion.correctBool;

                  let style = 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700';

                  if (isChecked) {
                    if (isThisCorrect) {
                      style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-500';
                    } else if (isSelected && !isThisCorrect) {
                      style = 'border-rose-400 bg-rose-50 text-rose-950 ring-1 ring-rose-400';
                    } else {
                      style = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                    }
                  } else if (isSelected) {
                    style = 'border-indigo-500 bg-indigo-50 text-indigo-950 font-bold ring-1 ring-indigo-500';
                  }

                  return (
                    <button
                      key={String(boolVal)}
                      type="button"
                      onClick={() => handleSetAnswer(currentQuestion.id, boolVal)}
                      className={`py-3.5 px-4 rounded-xl border flex items-center justify-center gap-2 font-black text-xs sm:text-sm transition-all cursor-pointer ${style}`}
                    >
                      {boolVal ? (
                        <>
                          <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <span>ĐÚNG</span>
                        </>
                      ) : (
                        <>
                          <XCircle className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <span>SAI</span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* FILL IN THE BLANK */}
            {currentQuestion.type === 'fill_blank' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">
                  Nhập đáp số tính toán của em:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                    onChange={(e) => handleSetAnswer(currentQuestion.id, e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleCheckCurrentQuestion(); }}
                    placeholder="VD: 12 hoặc 12cm..."
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                  />
                  {feedbackTiming === 'immediate' && (
                    <button
                      type="button"
                      onClick={handleCheckCurrentQuestion}
                      className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Kiểm tra
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* COMPACT FEEDBACK & GỢI Ý ÔN LẠI (Trong chế độ xem sau mỗi câu) */}
          {feedbackTiming === 'immediate' && currentChecked?.isChecked && (
            <div
              className={`p-3.5 rounded-xl border text-xs animate-fadeIn ${
                currentChecked.isCorrect
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50/80 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold mb-1">
                {currentChecked.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Chính xác! Em làm rất tốt.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>
                      Chưa đúng. Đáp án đúng là:{' '}
                      <strong className="text-emerald-800 underline">
                        {currentQuestion.type === 'true_false'
                          ? currentQuestion.correctBool
                            ? 'ĐÚNG'
                            : 'SAI'
                          : currentQuestion.type === 'fill_blank'
                          ? currentQuestion.acceptableAnswers?.[0]
                          : currentQuestion.options?.[currentQuestion.correctIndex || 0]}
                      </strong>
                    </span>
                  </>
                )}
              </div>

              {/* Lời giải thích ngắn */}
              <p className="text-slate-700 leading-relaxed font-normal mt-1">
                {currentQuestion.explanation}
              </p>

              {/* Gợi ý ngắn để ôn lại (PROMPT #04) */}
              {(currentQuestion.tip || currentQuestion.topic) && (
                <div className="mt-2 flex items-start gap-1.5 text-xs text-amber-900 font-semibold bg-amber-50/90 p-2.5 rounded-xl border border-amber-200/70">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-amber-950">Gợi ý ôn lại: </span>
                    <span>
                      {currentQuestion.tip ||
                        `Xem lại định nghĩa và tính chất cơ bản trong phần "${currentQuestion.topic}".`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BOTTOM CONTROLS */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            {/* Prev / Next buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => { sound.playClick(); setCurrentIndex((i) => Math.max(0, i - 1)); }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-slate-700 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Trước</span>
              </button>

              <button
                type="button"
                disabled={currentIndex === totalQuestions - 1}
                onClick={() => { sound.playClick(); setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1)); }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-slate-700 transition-all cursor-pointer"
              >
                <span>Sau</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Check/Submit buttons */}
            <div className="flex items-center gap-1.5">
              {feedbackTiming === 'immediate' && (
                <button
                  type="button"
                  onClick={handleCheckCurrentQuestion}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs border border-indigo-200/70 transition-all cursor-pointer"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Kiểm tra câu này</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSubmitWholeQuiz}
                className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>{feedbackTiming === 'end_of_quiz' ? 'Nộp bài & Xem kết quả' : 'Chấm cả bài'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* 4. KẾT QUẢ CUỐI MỖI LƯỢT QUIZ (PROMPT #04: Phản ánh đúng số câu đúng / tổng số câu, có gợi ý ôn lại, không game hóa rườm rà) */}
      {isQuizSubmitted && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden animate-fadeIn space-y-4 p-5 sm:p-6">
          {/* Header Score Overview */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Kết Quả Lượt Quiz
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Chủ đề: {activePackage.topic}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {correctCount} / {totalQuestions} câu đúng ({scorePercentage}%)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {scorePercentage === 100
                  ? 'Tuyệt đối! Em đã nắm rất vững kiến thức bài này.'
                  : scorePercentage >= 70
                  ? 'Kết quả khá tốt! Hãy đọc lại các gợi ý bên dưới để hoàn thiện các câu chưa đúng.'
                  : 'Hãy xem kỹ các gợi ý ngắn bên dưới để ôn lại phần kiến thức còn chưa chắc nhé.'}
              </p>
            </div>

            {/* Actions: Làm lại hoặc Ôn lại câu sai */}
            <div className="flex items-center gap-2 flex-wrap">
              {incorrectCount > 0 && !isRetryingMissedOnly && (
                <button
                  type="button"
                  onClick={handleRetryMissedQuestions}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-all cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Làm lại {incorrectCount} câu sai</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleResetQuiz}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại toàn bộ</span>
              </button>

              {onGoToSimulation && (
                <button
                  type="button"
                  onClick={() => onGoToSimulation(activePackage.topic)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Mô phỏng</span>
                </button>
              )}
            </div>
          </div>

          {/* Simple Statistics bar */}
          <div className="grid grid-cols-3 gap-2.5 text-center py-2 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <div className="p-1">
              <span className="text-slate-400 block text-[11px] font-medium">Tổng số câu</span>
              <strong className="text-slate-900 text-sm">{totalQuestions}</strong>
            </div>
            <div className="p-1 border-x border-slate-200/60">
              <span className="text-emerald-600 block text-[11px] font-bold">Số câu đúng</span>
              <strong className="text-emerald-700 text-sm">{correctCount}</strong>
            </div>
            <div className="p-1">
              <span className="text-rose-600 block text-[11px] font-bold">Số câu chưa đúng</span>
              <strong className="text-rose-700 text-sm">{incorrectCount}</strong>
            </div>
          </div>

          {/* Detailed Question Review List with Short Hints for Self-Study */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Chi tiết từng câu & Gợi ý ôn lại:
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Bấm vào câu hỏi để xem lại
              </span>
            </div>

            <div className="space-y-2.5">
              {questions.map((q, idx) => {
                const userAns = answers[q.id];
                const checked = checkedState[q.id];
                const isCorrect = checked?.isCorrect;

                return (
                  <div
                    key={q.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isCorrect
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : 'border-rose-200 bg-rose-50/40'
                    }`}
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-black text-white shrink-0 ${
                            isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {q.question}
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-black shrink-0 px-2 py-0.5 rounded-md ${
                          isCorrect
                            ? 'text-emerald-700 bg-emerald-100/70'
                            : 'text-rose-700 bg-rose-100/70'
                        }`}
                      >
                        {isCorrect ? '✓ Đúng' : '✕ Chưa đúng'}
                      </span>
                    </div>

                    {/* Answer Comparison */}
                    <div className="text-xs text-slate-600 pl-7 space-y-0.5 mt-1">
                      <div>
                        <span>Đáp án của em:{' '}</span>
                        <strong className={isCorrect ? 'text-emerald-800' : 'text-rose-700'}>
                          {userAns === undefined || userAns === ''
                            ? '(Chưa trả lời)'
                            : q.type === 'true_false'
                            ? userAns
                              ? 'ĐÚNG'
                              : 'SAI'
                            : q.type === 'fill_blank'
                            ? String(userAns)
                            : q.options?.[Number(userAns)]}
                        </strong>
                      </div>

                      {!isCorrect && (
                        <div>
                          <span>Đáp án đúng là:{' '}</span>
                          <strong className="text-emerald-700">
                            {q.type === 'true_false'
                              ? q.correctBool
                                ? 'ĐÚNG'
                                : 'SAI'
                              : q.type === 'fill_blank'
                              ? q.acceptableAnswers?.[0]
                              : q.options?.[q.correctIndex || 0]}
                          </strong>
                        </div>
                      )}
                    </div>

                    {/* Short Review Hint (PROMPT #04) */}
                    {(q.tip || q.explanation) && (
                      <div className="mt-2.5 ml-7 p-2 rounded-lg bg-white/90 border border-slate-200/70 text-xs text-slate-700">
                        <div className="flex items-center gap-1 text-[11px] font-extrabold text-amber-800 mb-0.5">
                          <Lightbulb className="w-3 h-3 text-amber-500" />
                          <span>Gợi ý ôn lại:</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {q.tip || q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Thêm câu hỏi mới vào bộ Quiz đã lưu */}
      {isAddQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Thêm Câu Hỏi Vào "{activePackage.title}"
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Lưu trữ vào LocalStorage trình duyệt
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddQuestionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddQuestion} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Dạng câu hỏi:</label>
                <select
                  value={newQuestionType}
                  onChange={(e) => setNewQuestionType(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800"
                >
                  <option value="multiple_choice">Trắc nghiệm 4 lựa chọn</option>
                  <option value="true_false">Đúng / Sai</option>
                  <option value="fill_blank">Điền đáp số / từ ngắn</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">
                  Nội dung câu hỏi <span className="text-rose-500">*</span>:
                </label>
                <textarea
                  required
                  rows={2}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="VD: Tam giác vuông có cạnh huyền 10, cạnh góc vuông 6 thì cạnh còn lại là?"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
                />
              </div>

              {/* Form fields based on type */}
              {newQuestionType === 'multiple_choice' && (
                <div className="space-y-1.5">
                  <label className="block text-slate-700">4 Phương án và chọn đáp án đúng:</label>
                  {newOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={newCorrectOption === i}
                        onChange={() => setNewCorrectOption(i)}
                        className="cursor-pointer"
                      />
                      <span className="font-bold text-slate-600 w-3">{['A', 'B', 'C', 'D'][i]}</span>
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => {
                          const copy = [...newOptions];
                          copy[i] = e.target.value;
                          setNewOptions(copy);
                        }}
                        placeholder={`Phương án ${['A', 'B', 'C', 'D'][i]}`}
                        className="flex-1 p-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-xs"
                      />
                    </div>
                  ))}
                </div>
              )}

              {newQuestionType === 'true_false' && (
                <div>
                  <label className="block text-slate-700 mb-1">Đáp án đúng của câu này:</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="correctBool"
                        checked={newCorrectBool === true}
                        onChange={() => setNewCorrectBool(true)}
                      />
                      <span>ĐÚNG</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="correctBool"
                        checked={newCorrectBool === false}
                        onChange={() => setNewCorrectBool(false)}
                      />
                      <span>SAI</span>
                    </label>
                  </div>
                </div>
              )}

              {newQuestionType === 'fill_blank' && (
                <div>
                  <label className="block text-slate-700 mb-1">
                    Đáp số chấp nhận <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    value={newFillAnswer}
                    onChange={(e) => setNewFillAnswer(e.target.value)}
                    placeholder="VD: 8, hoặc 8cm"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 mb-1">
                  Lời giải chi tiết <span className="text-rose-500">*</span>:
                </label>
                <textarea
                  required
                  rows={2}
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="VD: Áp dụng Pytago: b² = 10² - 6² = 64 ➜ b = 8..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">
                  Gợi ý ngắn để ôn lại (Dành cho tự học):
                </label>
                <input
                  type="text"
                  value={newTip}
                  onChange={(e) => setNewTip(e.target.value)}
                  placeholder="VD: Nhớ công thức b² = c² - a² khi tìm cạnh góc vuông."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddQuestionModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  Lưu Vào Bộ Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
