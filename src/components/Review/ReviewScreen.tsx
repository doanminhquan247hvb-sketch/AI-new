import React, { useState, useEffect } from 'react';
import { ReviewCard, MasteryLevel, StudyMaterial } from '../../types';
import { INITIAL_REVIEW_CARDS, INITIAL_REVIEW_QUIZZES } from '../../data/defaultReviewData';
import { INITIAL_STUDY_MATERIALS } from '../../data/defaultMaterials';
import { FlashcardReview } from './FlashcardReview';
import { SpeedQuizReview } from './SpeedQuizReview';
import { QuizModeScreen } from '../QuizMode/QuizModeScreen';
import { CheatSheetReview } from './CheatSheetReview';
import { AddReviewCardModal } from './AddReviewCardModal';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Zap,
  CheckCircle2,
  Clock,
  HelpCircle,
  RotateCcw,
  Plus,
  PlayCircle,
  Layers,
  FileText,
  Flame,
  ArrowRight,
  Database,
  BarChart3,
  BookmarkCheck,
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface ReviewScreenProps {
  onGoToSimulation?: (simulationTabOrTopic?: string) => void;
  onGoToIntake?: () => void;
  onGoToSummary?: () => void;
}

const STORAGE_KEY_CARDS = 'toan_truc_quan_review_cards_v1';
const STORAGE_KEY_MATERIALS = 'toan_truc_quan_materials_v2';

export const ReviewScreen: React.FC<ReviewScreenProps> = ({ onGoToSimulation, onGoToIntake, onGoToSummary }) => {
  // Load review cards from localStorage or fallback
  const [cards, setCards] = useState<ReviewCard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CARDS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_REVIEW_CARDS;
  });

  // Load study materials from localStorage to show sync status
  const [materials, setMaterials] = useState<StudyMaterial[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MATERIALS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_STUDY_MATERIALS;
  });

  // Active Review sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'flashcards' | 'quiz' | 'cheatsheet' | 'stats'>('flashcards');

  // Modal for adding review card
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync cards to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(cards));
    } catch {}
  }, [cards]);

  // Statistics calculation
  const totalCards = cards.length;
  const masteredCount = cards.filter((c) => c.mastery === 'mastered').length;
  const learningCount = cards.filter((c) => c.mastery === 'learning').length;
  const needReviewCount = cards.filter((c) => c.mastery === 'need_review').length;
  const masteryPercentage = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;

  // Update card mastery
  const handleUpdateCardMastery = (cardId: string, mastery: MasteryLevel) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? {
              ...c,
              mastery,
              reviewCount: c.reviewCount + 1,
              lastReviewedAt: 'Vừa xong',
            }
          : c
      )
    );
  };

  // Add new custom card
  const handleAddCard = (newCardData: Omit<ReviewCard, 'id' | 'reviewCount'>) => {
    const newCard: ReviewCard = {
      ...newCardData,
      id: `rev-card-${Date.now()}`,
      reviewCount: 0,
    };
    setCards((prev) => [newCard, ...prev]);
  };

  // Reset to default cards
  const handleResetCards = () => {
    sound.playPop();
    setCards(INITIAL_REVIEW_CARDS);
  };

  // Auto-generate a review card from a StudyMaterial
  const handleGenerateCardFromMaterial = (mat: StudyMaterial) => {
    sound.playSuccess();
    const existing = cards.find((c) => c.sourceMaterialId === mat.id);
    if (existing) {
      setActiveSubTab('flashcards');
      return;
    }

    const generatedCard: ReviewCard = {
      id: `rev-card-from-${mat.id}`,
      sourceMaterialId: mat.id,
      topic: mat.topic,
      title: mat.title.replace(/^(Ghi chép|Đề bài tập|Ảnh chụp bài tập|Bài giảng video):\s*/, ''),
      question: `Trọng tâm và bản chất kiến thức cần nhớ trong bài: "${mat.title}" là gì?`,
      hint: mat.previewNote || 'Ôn lại phần giải thích trực quan trong bài học.',
      answer: mat.summary || mat.content.slice(0, 300) + (mat.content.length > 300 ? '...' : ''),
      formula: mat.topic.includes('Pytago')
        ? 'a² + b² = c²'
        : mat.topic.includes('Phương trình')
        ? 'ax + b = c'
        : mat.topic.includes('Đồ thị')
        ? 'y = ax + b'
        : 'a / b',
      keyRule: mat.keyPoints && mat.keyPoints.length > 0 ? mat.keyPoints[0] : undefined,
      visualMetaphor: '💡 Khắc sâu bằng sơ đồ trực quan và bàn mô phỏng thực hành.',
      summary: mat.summary,
      keyPoints: mat.keyPoints,
      mastery: 'learning',
      lastReviewedAt: 'Vừa tạo',
      reviewCount: 0,
    };

    setCards((prev) => [generatedCard, ...prev]);
    setActiveSubTab('flashcards');
  };

  // Map topic to simulation tab name
  const handleGoToSimulationByTopic = (topicName?: string) => {
    if (!onGoToSimulation) return;
    if (!topicName) {
      onGoToSimulation('fractions');
      return;
    }
    const t = topicName.toLowerCase();
    if (t.includes('phân số') || t.includes('tỷ')) {
      onGoToSimulation('fractions');
    } else if (t.includes('phương trình') || t.includes('cân')) {
      onGoToSimulation('algebra');
    } else if (t.includes('đồ thị') || t.includes('hàm số')) {
      onGoToSimulation('linear');
    } else if (t.includes('pytago') || t.includes('tam giác')) {
      onGoToSimulation('pythagoras');
    } else {
      onGoToSimulation('fractions');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Mastery Progress Dashboard */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Màn Ôn Tập & Review Kiến Thức
              </span>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Phương pháp Spaced Retrieval
              </span>
              {onGoToSummary && (
                <button
                  onClick={() => { sound.playClick(); onGoToSummary(); }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Kho Tóm Tắt & Điểm Mấu Chốt</span>
                </button>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Ôn Lại Bài Giảng & Khắc Sâu Bản Chất Trực Quan
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Học sinh không chỉ học thuộc công thức vẹt, mà lật thẻ ôn tập để truy hồi nhận thức (Active Recall),
              thử thách phản xạ trắc nghiệm 10s và đối chiếu ngay trên Bàn Mô Phỏng.
            </p>
          </div>

          {/* Quick Mastery Gauge & Counter */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-indigo-500/30 flex items-center gap-4 shrink-0 shadow-md">
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 block leading-tight">
                {masteryPercentage}%
              </span>
              <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider block">
                Độ Thành Thạo
              </span>
            </div>
            <div className="h-10 w-px bg-slate-700"></div>
            <div className="space-y-1 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{masteredCount} thẻ đã thuộc</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300">
                <Clock className="w-3.5 h-3.5" />
                <span>{learningCount} thẻ đang ôn</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-300">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{needReviewCount} thẻ cần xem lại</span>
              </div>
            </div>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
          <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${(masteredCount / totalCards) * 100}%` }}
              className="bg-emerald-500 transition-all duration-500"
              title="Đã thuộc"
            />
            <div
              style={{ width: `${(learningCount / totalCards) * 100}%` }}
              className="bg-amber-400 transition-all duration-500"
              title="Đang ôn"
            />
            <div
              style={{ width: `${(needReviewCount / totalCards) * 100}%` }}
              className="bg-rose-400 transition-all duration-500"
              title="Cần ôn lại"
            />
          </div>
          <span className="text-slate-400 font-extrabold text-[11px] shrink-0">
            {totalCards} Thẻ Trong Kho
          </span>
        </div>
      </div>

      {/* Main Review Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 bg-slate-200/60 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
          <button
            onClick={() => { sound.playClick(); setActiveSubTab('flashcards'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeSubTab === 'flashcards'
                ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-900/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>🎴 Lật Thẻ Ghi Nhớ (Flashcards)</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveSubTab('quiz'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeSubTab === 'quiz'
                ? 'bg-white text-rose-700 shadow-xs ring-1 ring-slate-900/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Zap className="w-4 h-4 text-rose-600" />
            <span>🎯 Chế Độ Quiz (Quiz Mode)</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveSubTab('cheatsheet'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeSubTab === 'cheatsheet'
                ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-slate-900/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>📑 Sổ Tay Công Thức Vàng</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveSubTab('stats'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeSubTab === 'stats'
                ? 'bg-white text-violet-800 shadow-xs ring-1 ring-slate-900/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <BookmarkCheck className="w-4 h-4 text-violet-600" />
            <span>📊 Học Liệu Đồng Bộ ({materials.length})</span>
          </button>
        </div>

        {/* Right side helper actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Thẻ Ôn Tập</span>
          </button>

          <button
            onClick={handleResetCards}
            title="Khôi phục các thẻ ôn tập mẫu ban đầu"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Render Active Sub-View */}
      {activeSubTab === 'flashcards' && (
        <FlashcardReview
          cards={cards}
          onUpdateCardMastery={handleUpdateCardMastery}
          onGoToSimulation={handleGoToSimulationByTopic}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />
      )}

      {activeSubTab === 'quiz' && (
        <QuizModeScreen
          onGoToSimulation={handleGoToSimulationByTopic}
          onGoToIntake={onGoToIntake}
        />
      )}

      {activeSubTab === 'cheatsheet' && (
        <CheatSheetReview onGoToSimulation={onGoToSimulation} />
      )}

      {activeSubTab === 'stats' && (
        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-600" />
                  <span>Học Liệu Đã Nạp Từ LocalStorage & Tình Trạng Ôn Tập</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Mỗi bài học em đã nhập ở màn "Nhập Học Liệu" đều có thể chuyển thành thẻ ôn tập chủ động.
                </p>
              </div>

              {onGoToIntake && (
                <button
                  onClick={() => { sound.playClick(); onGoToIntake(); }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <span>Mở Màn Nhập Học Liệu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* List of Stored Materials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {materials.map((mat) => {
                const linkedCard = cards.find((c) => c.sourceMaterialId === mat.id);
                return (
                  <div
                    key={mat.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-300 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-100/80 text-indigo-800">
                          {mat.topic}
                        </span>
                        {linkedCard ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Đã có thẻ ôn
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                            Chưa tạo thẻ
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-2">
                        {mat.title}
                      </h4>
                      {mat.summary ? (
                        <p className="text-[11px] text-slate-700 bg-white/80 p-2 rounded-xl border border-indigo-100/80 mt-1 line-clamp-2 font-medium">
                          <span className="font-bold text-indigo-700">✨ Tóm tắt: </span>
                          {mat.summary}
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {mat.previewNote || mat.content}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-400">
                        {mat.createdAt}
                      </span>
                      <button
                        onClick={() => handleGenerateCardFromMaterial(mat)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          linkedCard
                            ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{linkedCard ? 'Xem Thẻ Ôn Tập' : 'Tạo Thẻ Tự Động'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Custom Card */}
      <AddReviewCardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCard={handleAddCard}
      />
    </div>
  );
};
