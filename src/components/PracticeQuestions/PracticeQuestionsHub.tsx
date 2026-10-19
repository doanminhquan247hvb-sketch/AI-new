import React, { useState, useEffect } from 'react';
import { PracticeQuestion, PracticeQuestionType, TargetGrade, StudyMaterial } from '../../types';
import { INITIAL_PRACTICE_QUESTIONS } from '../../data/defaultPracticeQuestions';
import { generateQuestionsForTopic } from '../../utils/practiceQuestionGenerator';
import { sound } from '../../utils/sound';
import {
  HelpCircle,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Plus,
  Trash2,
  Download,
  Filter,
  Search,
  Pencil,
  GraduationCap,
  Layers,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  PlayCircle,
  FileText,
  AlertCircle,
  Lightbulb,
  Check,
  Copy,
  FolderInput,
} from 'lucide-react';

const STORAGE_KEY_PRACTICE = 'toan_truc_quan_practice_questions_v1';
const STORAGE_KEY_MATERIALS = 'toan_truc_quan_materials_v2';

interface PracticeQuestionsHubProps {
  onGoToSimulation?: (topicName?: string) => void;
  onGoToIntake?: () => void;
  onGoToSummary?: () => void;
}

export const PracticeQuestionsHub: React.FC<PracticeQuestionsHubProps> = ({
  onGoToSimulation,
  onGoToIntake,
  onGoToSummary,
}) => {
  // Load questions from LocalStorage or default
  const [questions, setQuestions] = useState<PracticeQuestion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRACTICE);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_PRACTICE_QUESTIONS;
  });

  // Load available topics from study materials
  const [availableTopics, setAvailableTopics] = useState<string[]>([
    'Định lý Pytago',
    'Cân phương trình & Chuyển vế',
    'Phân số & Tỉ số',
    'Hàm số bậc nhất & Đồ thị',
  ]);

  useEffect(() => {
    try {
      const savedMats = localStorage.getItem(STORAGE_KEY_MATERIALS);
      if (savedMats) {
        const mats: StudyMaterial[] = JSON.parse(savedMats);
        const topics = Array.from(new Set(mats.map((m) => m.topic)));
        if (topics.length > 0) {
          setAvailableTopics(topics);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save questions to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRACTICE, JSON.stringify(questions));
    } catch {
      // ignore
    }
  }, [questions]);

  // Selected State
  const [selectedTopic, setSelectedTopic] = useState<string>('Định lý Pytago');
  const [customTopicInput, setCustomTopicInput] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<TargetGrade>('Lớp 7');
  const [activeTab, setActiveTab] = useState<'practice' | 'bank'>('practice');

  // Filter in Question Bank
  const [filterType, setFilterType] = useState<'all' | PracticeQuestionType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Practice State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userSelectedOption, setUserSelectedOption] = useState<number | null>(null);
  const [userBoolAnswer, setUserBoolAnswer] = useState<boolean | null>(null);
  const [userTextAnswer, setUserTextAnswer] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isSelfEvaluatedCorrect, setIsSelfEvaluatedCorrect] = useState<boolean | null>(null);
  const [practiceStats, setPracticeStats] = useState({ correct: 0, totalAnswered: 0 });

  // Add Question Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newQuestionType, setNewQuestionType] = useState<PracticeQuestionType>('multiple_choice');
  const [newPrompt, setNewPrompt] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  const [newCorrectBool, setNewCorrectBool] = useState<boolean>(true);
  const [newOptions, setNewOptions] = useState<string[]>(['', '', '', '']);
  const [newCorrectOptionIndex, setNewCorrectOptionIndex] = useState<number>(0);
  const [newAcceptableAnswer, setNewAcceptableAnswer] = useState<string>('');
  const [newReferenceAnswer, setNewReferenceAnswer] = useState<string>('');

  // Copy status
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Active question list for practice (filtered by selectedTopic or all)
  const currentTopicQuestions = questions.filter(
    (q) => q.topic.toLowerCase().trim() === selectedTopic.toLowerCase().trim()
  );
  const practiceList = currentTopicQuestions.length > 0 ? currentTopicQuestions : questions;
  const currentQuestion = practiceList[currentQuestionIndex] || practiceList[0];

  // Reset practice input on question change
  const resetQuestionInput = () => {
    setUserSelectedOption(null);
    setUserBoolAnswer(null);
    setUserTextAnswer('');
    setIsAnswerSubmitted(false);
    setIsSelfEvaluatedCorrect(null);
  };

  const handleNextQuestion = () => {
    sound.playClick();
    if (currentQuestionIndex < practiceList.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setCurrentQuestionIndex(0);
    }
    resetQuestionInput();
  };

  const handlePrevQuestion = () => {
    sound.playClick();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      setCurrentQuestionIndex(practiceList.length - 1);
    }
    resetQuestionInput();
  };

  // Submit Answer
  const handleSubmitAnswer = () => {
    if (!currentQuestion) return;

    let isCorrect = false;
    if (currentQuestion.type === 'true_false') {
      if (userBoolAnswer === null) return;
      isCorrect = userBoolAnswer === currentQuestion.correctBool;
    } else if (currentQuestion.type === 'multiple_choice') {
      if (userSelectedOption === null) return;
      isCorrect = userSelectedOption === currentQuestion.correctOptionIndex;
    } else if (currentQuestion.type === 'fill_blank') {
      const cleanUser = userTextAnswer.trim().toLowerCase().replace(/\s+/g, '');
      const valid = (currentQuestion.acceptableAnswers || []).some(
        (ans) => ans.trim().toLowerCase().replace(/\s+/g, '') === cleanUser
      );
      isCorrect = valid;
    } else if (currentQuestion.type === 'short_answer') {
      // In short answer, user checks against reference answer and keywords
      const cleanUser = userTextAnswer.trim().toLowerCase();
      const hasKeywords = (currentQuestion.keywords || []).some((kw) =>
        cleanUser.includes(kw.toLowerCase())
      );
      isCorrect = hasKeywords;
      setIsSelfEvaluatedCorrect(hasKeywords);
    }

    if (isCorrect) {
      sound.playSuccess();
      setPracticeStats((prev) => ({ correct: prev.correct + 1, totalAnswered: prev.totalAnswered + 1 }));
    } else {
      sound.playError();
      setPracticeStats((prev) => ({ ...prev, totalAnswered: prev.totalAnswered + 1 }));
    }

    setIsAnswerSubmitted(true);
  };

  // Generate Questions for Topic
  const handleGenerateQuestions = () => {
    sound.playSuccess();
    const topicToUse = customTopicInput.trim() || selectedTopic;
    const newBatch = generateQuestionsForTopic(topicToUse, selectedGrade, 4);

    setQuestions((prev) => [...newBatch, ...prev]);
    setSelectedTopic(topicToUse);
    setCurrentQuestionIndex(0);
    resetQuestionInput();
  };

  // Add Custom Question
  const handleSaveCustomQuestion = () => {
    if (!newPrompt.trim()) return;

    sound.playSuccess();
    const created: PracticeQuestion = {
      id: `custom-pq-${Date.now()}`,
      topic: selectedTopic,
      gradeLevel: selectedGrade,
      type: newQuestionType,
      prompt: newPrompt.trim(),
      explanation: newExplanation.trim() || 'Lời giải chi tiết cho câu hỏi ôn tập.',
      createdAt: new Date().toLocaleDateString('vi-VN'),
      curriculumRef: `SGK Toán ${selectedGrade}`,
    };

    if (newQuestionType === 'true_false') {
      created.correctBool = newCorrectBool;
    } else if (newQuestionType === 'multiple_choice') {
      created.options = newOptions.map((o, idx) => o.trim() || `Phương án ${idx + 1}`);
      created.correctOptionIndex = newCorrectOptionIndex;
    } else if (newQuestionType === 'fill_blank') {
      created.acceptableAnswers = newAcceptableAnswer
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      created.blankPlaceholder = 'Nhập đáp án số hoặc từ ngắn...';
    } else if (newQuestionType === 'short_answer') {
      created.referenceAnswer = newReferenceAnswer.trim();
      created.keywords = newReferenceAnswer
        .split(/\s+/)
        .filter((w) => w.length > 2)
        .slice(0, 4);
    }

    setQuestions((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    // Reset form
    setNewPrompt('');
    setNewExplanation('');
    setNewOptions(['', '', '', '']);
    setNewAcceptableAnswer('');
    setNewReferenceAnswer('');
  };

  // Delete Question
  const handleDeleteQuestion = (id: string) => {
    sound.playClick();
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Export as Markdown
  const handleExportMarkdown = () => {
    sound.playSuccess();
    const header = `# BỘ CÂU HỎI LUYỆN TẬP CƠ BẢN TOÁN HỌC (${selectedGrade})\nChủ đề: ${selectedTopic}\nNgày tạo: ${new Date().toLocaleDateString('vi-VN')}\n\n---\n\n`;
    const body = practiceList
      .map((q, idx) => {
        let details = '';
        if (q.type === 'true_false') {
          details = `**Dạng: Đúng/Sai**\nĐáp án đúng: ${q.correctBool ? 'ĐÚNG' : 'SAI'}`;
        } else if (q.type === 'multiple_choice') {
          details = `**Dạng: Trắc nghiệm 4 lựa chọn**\n${(q.options || [])
            .map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}${i === q.correctOptionIndex ? ' (Đúng)' : ''}`)
            .join('\n')}`;
        } else if (q.type === 'fill_blank') {
          details = `**Dạng: Điền từ/số ngắn**\nĐáp án chấp nhận: ${(q.acceptableAnswers || []).join(', ')}`;
        } else {
          details = `**Dạng: Hỏi - đáp ngắn**\nĐáp án tham khảo: ${q.referenceAnswer || ''}`;
        }
        return `### Câu ${idx + 1}: ${q.prompt}\n${details}\n\n💡 **Lời giải SGK:**\n${q.explanation}\n`;
      })
      .join('\n---\n\n');

    navigator.clipboard.writeText(header + body);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  // Filtered Question Bank
  const filteredBank = questions.filter((q) => {
    if (filterType !== 'all' && q.type !== filterType) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const inPrompt = q.prompt.toLowerCase().includes(query);
      const inTopic = q.topic.toLowerCase().includes(query);
      const inExp = q.explanation.toLowerCase().includes(query);
      if (!inPrompt && !inTopic && !inExp) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 rounded-3xl border border-indigo-400/30 shadow-xl shadow-indigo-950/20 relative overflow-hidden">
        <div className="absolute top-0 right-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-teal-500/30 shrink-0">
              <HelpCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                  Bộ Câu Hỏi Luyện Tập Cơ Bản
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-teal-500/30 text-teal-200 border border-teal-400/30">
                  Ôn Bài Trên Trường • {selectedGrade}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  💾 Lưu LocalStorage
                </span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-100/90 max-w-3xl leading-relaxed">
                Hệ thống câu hỏi mức cơ bản bám sát kiến thức thực tế sách giáo khoa: <strong>Đúng/Sai</strong>, <strong>Lựa chọn</strong>, <strong>Điền từ ngắn</strong> và <strong>Hỏi-đáp ngắn</strong>. Giúp học sinh nắm chắc bản chất, không áp lực game hóa, có lời giải chi tiết từng bước.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-102"
            >
              <Plus className="w-3.5 h-3.5 text-teal-300" />
              <span>Thêm Câu Hỏi</span>
            </button>

            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-102"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Đã Sao Chép!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Xuất Đề Luyện Tập</span>
                </>
              )}
            </button>

            {onGoToSimulation && (
              <button
                onClick={() => onGoToSimulation(selectedTopic)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-amber-500/20 hover:scale-102"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Mô Phỏng Trực Quan</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Topic & Grade Config Bar */}
        <div className="mt-5 pt-4 border-t border-indigo-400/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Topic Select */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-indigo-200 font-bold shrink-0">Chủ đề luyện tập:</span>
            <select
              value={selectedTopic}
              onChange={(e) => {
                setSelectedTopic(e.target.value);
                setCurrentQuestionIndex(0);
                resetQuestionInput();
              }}
              className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer text-xs"
            >
              {availableTopics.map((top) => (
                <option key={top} value={top} className="text-slate-900 bg-white">
                  {top}
                </option>
              ))}
            </select>

            {/* Grade Level Selector */}
            <span className="text-indigo-200 font-bold shrink-0 ml-2">Khối lớp:</span>
            {(['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'] as TargetGrade[]).map((g) => (
              <button
                key={g}
                onClick={() => {
                  setSelectedGrade(g);
                  sound.playClick();
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                  selectedGrade === g
                    ? 'bg-teal-400 text-slate-950 shadow-xs'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Generator trigger button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateQuestions}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-md shadow-teal-500/20 transition-all cursor-pointer hover:scale-102"
              title="Tự động tạo bộ câu hỏi 4 dạng cơ bản bám sát chủ đề đang chọn"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tạo Bộ Câu Hỏi Tự Động</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Navigation Mode: Interactive Practice vs Question Bank */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('practice');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeTab === 'practice'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>✍️ Làm Bài Luyện Tập ({practiceList.length} câu)</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('bank');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeTab === 'bank'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>📋 Ngân Hàng Câu Hỏi ({questions.length} câu đã lưu)</span>
          </button>
        </div>

        {/* Practice Stats Display */}
        {activeTab === 'practice' && practiceStats.totalAnswered > 0 && (
          <div className="text-xs font-bold text-slate-600 hidden sm:flex items-center gap-2">
            <span>Tiến độ ôn:</span>
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Đúng {practiceStats.correct} / {practiceStats.totalAnswered} câu
            </span>
          </div>
        )}
      </div>

      {/* TAB 1: INTERACTIVE PRACTICE MODE (Không game hóa mạnh, ôn bài trên trường) */}
      {activeTab === 'practice' && (
        <div className="space-y-4">
          {currentQuestion ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-6">
              {/* Question Header: Tag, Index, Grade */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-200">
                    {currentQuestion.type === 'true_false'
                      ? '⚖️ Dạng: Đúng / Sai'
                      : currentQuestion.type === 'multiple_choice'
                      ? '🔘 Dạng: Trắc Nghiệm 4 Lựa Chọn'
                      : currentQuestion.type === 'fill_blank'
                      ? '✏️ Dạng: Điền Từ / Số Ngắn'
                      : '💬 Dạng: Hỏi - Đáp Ngắn'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                    {currentQuestion.gradeLevel}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Chủ đề: {currentQuestion.topic}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <span>
                    Câu {currentQuestionIndex + 1} / {practiceList.length}
                  </span>
                </div>
              </div>

              {/* Question Prompt */}
              <div className="space-y-2">
                {currentQuestion.contextNote && (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    ℹ️ {currentQuestion.contextNote}
                  </p>
                )}
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-relaxed">
                  {currentQuestion.prompt}
                </h3>
              </div>

              {/* Question Answer Interface By Type */}
              <div className="space-y-4 pt-2">
                {/* 1. DẠNG ĐÚNG / SAI */}
                {currentQuestion.type === 'true_false' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => !isAnswerSubmitted && setUserBoolAnswer(true)}
                      disabled={isAnswerSubmitted}
                      className={`p-4 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        userBoolAnswer === true
                          ? isAnswerSubmitted
                            ? currentQuestion.correctBool === true
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                              : 'bg-rose-50 border-rose-500 text-rose-900'
                            : 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs'
                          : isAnswerSubmitted && currentQuestion.correctBool === true
                          ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-extrabold'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>ĐÚNG</span>
                    </button>

                    <button
                      onClick={() => !isAnswerSubmitted && setUserBoolAnswer(false)}
                      disabled={isAnswerSubmitted}
                      className={`p-4 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        userBoolAnswer === false
                          ? isAnswerSubmitted
                            ? currentQuestion.correctBool === false
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                              : 'bg-rose-50 border-rose-500 text-rose-900'
                            : 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs'
                          : isAnswerSubmitted && currentQuestion.correctBool === false
                          ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-extrabold'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span>SAI</span>
                    </button>
                  </div>
                )}

                {/* 2. DẠNG LỰA CHỌN (4 Phương án) */}
                {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQuestion.options.map((option, oIdx) => {
                      const isSelected = userSelectedOption === oIdx;
                      const isCorrect = currentQuestion.correctOptionIndex === oIdx;

                      let style = 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300';
                      if (isAnswerSubmitted) {
                        if (isCorrect) {
                          style = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black shadow-xs';
                        } else if (isSelected && !isCorrect) {
                          style = 'bg-rose-50 border-rose-500 text-rose-950 font-bold';
                        } else {
                          style = 'opacity-60 border-slate-200';
                        }
                      } else if (isSelected) {
                        style = 'bg-indigo-50 border-indigo-600 text-indigo-950 font-black shadow-2xs';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isAnswerSubmitted}
                          onClick={() => setUserSelectedOption(oIdx)}
                          className={`p-3.5 rounded-2xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer text-xs sm:text-sm font-medium ${style}`}
                        >
                          <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-700 shrink-0 text-xs">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="flex-1 leading-snug">{option}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 3. DẠNG ĐIỀN TỪ / SỐ NGẮN */}
                {currentQuestion.type === 'fill_blank' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700">
                      Gõ câu trả lời của em vào ô bên dưới:
                    </label>
                    <input
                      type="text"
                      disabled={isAnswerSubmitted}
                      value={userTextAnswer}
                      onChange={(e) => setUserTextAnswer(e.target.value)}
                      placeholder={currentQuestion.blankPlaceholder || 'Gõ câu trả lời ngắn...'}
                      className="w-full sm:max-w-md px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                    {isAnswerSubmitted && (
                      <div className="text-xs font-bold text-slate-600">
                        Đáp án được chấp nhận:{' '}
                        <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {(currentQuestion.acceptableAnswers || []).join(' hoặc ')}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. DẠNG HỎI - ĐÁP NGẮN */}
                {currentQuestion.type === 'short_answer' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700">
                      Tự diễn đạt câu trả lời ngắn theo cách hiểu của em (1-2 câu):
                    </label>
                    <textarea
                      rows={3}
                      disabled={isAnswerSubmitted}
                      value={userTextAnswer}
                      onChange={(e) => setUserTextAnswer(e.target.value)}
                      placeholder="Gõ lời giải thích hoặc câu trả lời ngắn của em..."
                      className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-y"
                    />

                    {isAnswerSubmitted && currentQuestion.referenceAnswer && (
                      <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-2 text-xs">
                        <span className="font-black text-indigo-900 block">
                          📖 Đáp án tham khảo chuẩn SGK:
                        </span>
                        <p className="text-slate-800 font-medium leading-relaxed">
                          {currentQuestion.referenceAnswer}
                        </p>
                        {currentQuestion.keywords && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[11px] font-bold text-slate-500">
                              Từ khóa cốt lõi cần có:
                            </span>
                            {currentQuestion.keywords.map((kw, kwIdx) => (
                              <span
                                key={kwIdx}
                                className="px-2 py-0.5 bg-white rounded-md text-[10px] font-extrabold text-indigo-700 border border-indigo-200"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons: Submit / Next / Prev */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevQuestion}
                    className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Câu trước</span>
                  </button>

                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <span>Câu tiếp theo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white rounded-xl text-xs sm:text-sm font-black shadow-md shadow-indigo-500/25 transition-all cursor-pointer hover:scale-102"
                    >
                      Kiểm Tra Đáp Án
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-black shadow-md shadow-emerald-500/20 transition-all cursor-pointer hover:scale-102"
                    >
                      <span>Làm Câu Tiếp Theo</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Pedagogical Explanation Box (Hiện ra khi đã kiểm tra đáp án) */}
              {isAnswerSubmitted && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-white border border-emerald-200 shadow-2xs space-y-2.5 animate-fadeIn">
                  <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Lời giải chi tiết từng bước ôn bài trên trường:</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-line">
                    {currentQuestion.explanation}
                  </p>

                  {currentQuestion.curriculumRef && (
                    <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Nguồn tài liệu: {currentQuestion.curriculumRef}</span>
                      <span className="text-emerald-700 font-bold">Chuẩn chương trình {selectedGrade}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-300">
              <p className="text-sm text-slate-600 font-medium">Chưa có câu hỏi nào cho chủ đề này.</p>
              <button
                onClick={handleGenerateQuestions}
                className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Tạo Câu Hỏi Ngay
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: QUESTION BANK MANAGEMENT (Lưu trong LocalStorage) */}
      {activeTab === 'bank' && (
        <div className="space-y-4">
          {/* Bank Filters */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm theo nội dung câu hỏi, định lý, công thức..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-medium"
                />
              </div>

              {/* Type Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                    filterType === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tất cả ({questions.length})
                </button>
                <button
                  onClick={() => setFilterType('true_false')}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                    filterType === 'true_false'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Đúng/Sai
                </button>
                <button
                  onClick={() => setFilterType('multiple_choice')}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                    filterType === 'multiple_choice'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Lựa chọn
                </button>
                <button
                  onClick={() => setFilterType('fill_blank')}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                    filterType === 'fill_blank'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Điền từ ngắn
                </button>
                <button
                  onClick={() => setFilterType('short_answer')}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                    filterType === 'short_answer'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Hỏi-đáp ngắn
                </button>
              </div>
            </div>
          </div>

          {/* List of Questions in Bank */}
          <div className="space-y-3">
            {filteredBank.map((q, qIndex) => (
              <div
                key={q.id}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3 hover:border-indigo-300 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                      {q.type === 'true_false'
                        ? 'Đúng/Sai'
                        : q.type === 'multiple_choice'
                        ? 'Lựa chọn'
                        : q.type === 'fill_blank'
                        ? 'Điền từ ngắn'
                        : 'Hỏi-đáp ngắn'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                      {q.gradeLevel}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{q.topic}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    title="Xóa câu hỏi khỏi kho"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                  {q.prompt}
                </p>

                {/* Question Details preview */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 space-y-1">
                  {q.type === 'true_false' && (
                    <span className="font-bold">
                      Đáp án đúng: {q.correctBool ? 'ĐÚNG' : 'SAI'}
                    </span>
                  )}
                  {q.type === 'multiple_choice' && (
                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      {(q.options || []).map((opt, i) => (
                        <div
                          key={i}
                          className={i === q.correctOptionIndex ? 'text-emerald-700 font-bold' : ''}
                        >
                          {String.fromCharCode(65 + i)}. {opt} {i === q.correctOptionIndex && '✓'}
                        </div>
                      ))}
                    </div>
                  )}
                  {q.type === 'fill_blank' && (
                    <span className="font-bold text-emerald-800">
                      Đáp án chấp nhận: {(q.acceptableAnswers || []).join(', ')}
                    </span>
                  )}
                  {q.type === 'short_answer' && (
                    <div>
                      <span className="font-bold">Đáp án mẫu: </span>
                      <span>{q.referenceAnswer}</span>
                    </div>
                  )}
                  <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    💡 <strong>Lời giải:</strong> {q.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MODAL: THÊM CÂU HỎI THỦ CÔNG */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-black text-slate-900">
                  Thêm Câu Hỏi Luyện Tập Mới
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Type Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chọn dạng câu hỏi:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'multiple_choice', label: 'Lựa chọn' },
                    { id: 'true_false', label: 'Đúng / Sai' },
                    { id: 'fill_blank', label: 'Điền từ ngắn' },
                    { id: 'short_answer', label: 'Hỏi-đáp ngắn' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewQuestionType(t.id as PracticeQuestionType)}
                      className={`p-2 rounded-xl font-bold border transition-all cursor-pointer ${
                        newQuestionType === t.id
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nội dung câu hỏi:
                </label>
                <textarea
                  rows={2}
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  placeholder="Ví dụ: Cho tam giác ABC vuông tại A có AB = 3cm, AC = 4cm. Tính BC."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Specific inputs by type */}
              {newQuestionType === 'true_false' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Đáp án đúng là:
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input
                        type="radio"
                        checked={newCorrectBool === true}
                        onChange={() => setNewCorrectBool(true)}
                      />
                      <span>ĐÚNG</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input
                        type="radio"
                        checked={newCorrectBool === false}
                        onChange={() => setNewCorrectBool(false)}
                      />
                      <span>SAI</span>
                    </label>
                  </div>
                </div>
              )}

              {newQuestionType === 'multiple_choice' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    4 Phương án (tích chọn phương án đúng):
                  </label>
                  {newOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={newCorrectOptionIndex === i}
                        onChange={() => setNewCorrectOptionIndex(i)}
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...newOptions];
                          updated[i] = e.target.value;
                          setNewOptions(updated);
                        }}
                        placeholder={`Phương án ${String.fromCharCode(65 + i)}`}
                        className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  ))}
                </div>
              )}

              {newQuestionType === 'fill_blank' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Đáp án chấp nhận (các phương án cách nhau bởi dấu phẩy):
                  </label>
                  <input
                    type="text"
                    value={newAcceptableAnswer}
                    onChange={(e) => setNewAcceptableAnswer(e.target.value)}
                    placeholder="Ví dụ: 5, 5cm, 5 cm"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              )}

              {newQuestionType === 'short_answer' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Đáp án tham khảo chuẩn:
                  </label>
                  <textarea
                    rows={2}
                    value={newReferenceAnswer}
                    onChange={(e) => setNewReferenceAnswer(e.target.value)}
                    placeholder="Gõ đáp án mẫu chuẩn cho câu hỏi..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              )}

              {/* Explanation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lời giải chi tiết từng bước:
                </label>
                <textarea
                  rows={3}
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="Trình bày các bước giải chi tiết giúp học sinh ôn bài trên trường..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveCustomQuestion}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
              >
                Lưu Câu Hỏi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
