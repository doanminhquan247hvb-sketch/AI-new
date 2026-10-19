import React, { useState, useEffect, useCallback } from 'react';
import { ReviewCard, MasteryLevel } from '../../types';
import {
  FlashcardDeck,
  getStoredFlashcardDecks,
  saveStoredFlashcardDecks,
} from '../../data/flashcardDecksData';
import {
  RotateCw,
  ArrowLeft,
  ArrowRight,
  Shuffle,
  Lightbulb,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  Eye,
  Plus,
  PlayCircle,
  Award,
  Layers,
  BookOpen,
  Filter,
  Check,
  RotateCcw,
  Volume2,
  ListFilter,
  Grid,
  Maximize2,
  Play,
  Pause,
  PlusCircle,
  ChevronDown,
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface FlashcardModeScreenProps {
  onGoToSimulation?: (topicName?: string) => void;
  onGoToQuiz?: () => void;
  onGoToIntake?: () => void;
}

export const FlashcardModeScreen: React.FC<FlashcardModeScreenProps> = ({
  onGoToSimulation,
  onGoToQuiz,
  onGoToIntake,
}) => {
  // 1. Multi-subject decks state
  const [decks, setDecks] = useState<FlashcardDeck[]>(() => getStoredFlashcardDecks());
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedDeckId, setSelectedDeckId] = useState<string>('all');

  // 2. Filter decks based on subject
  const availableSubjects = ['all', ...Array.from(new Set(decks.map((d) => d.subject)))];

  const filteredDecks = decks.filter((d) => {
    if (selectedSubject === 'all') return true;
    return d.subject === selectedSubject;
  });

  // Collect all cards based on selectedDeckId or selectedSubject
  const currentPoolCards: ReviewCard[] = React.useMemo(() => {
    if (selectedDeckId !== 'all') {
      const found = decks.find((d) => d.id === selectedDeckId);
      return found ? found.cards : [];
    }
    if (selectedSubject !== 'all') {
      return decks
        .filter((d) => d.subject === selectedSubject)
        .flatMap((d) => d.cards);
    }
    return decks.flatMap((d) => d.cards);
  }, [decks, selectedDeckId, selectedSubject]);

  // 3. Card status filters ('all' | 'need_review' | 'learning' | 'mastered')
  const [statusFilter, setStatusFilter] = useState<'all' | 'need_review' | 'learning' | 'mastered'>('all');

  const activeCards = currentPoolCards.filter((c) => {
    if (statusFilter === 'all') return true;
    return c.mastery === statusFilter;
  });

  // 4. Current card navigation & flip state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [viewLayout, setViewLayout] = useState<'flip_single' | 'grid_all'>('flip_single');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  // 5. Add custom card modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('Toán Học');
  const [newTopic, setNewTopic] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newHint, setNewHint] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newFormula, setNewFormula] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newKeyRule, setNewKeyRule] = useState('');

  // Keep currentIndex in bounds when cards change
  useEffect(() => {
    if (currentIndex >= activeCards.length) {
      setCurrentIndex(Math.max(0, activeCards.length - 1));
    }
  }, [activeCards.length, currentIndex]);

  const activeCard: ReviewCard | undefined = activeCards[currentIndex] || activeCards[0];

  // Flip card
  const handleFlip = useCallback(() => {
    sound.playFlip();
    setIsFlipped((prev) => !prev);
  }, []);

  // Next card
  const handleNext = useCallback(() => {
    sound.playClick();
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev < activeCards.length - 1 ? prev + 1 : 0));
  }, [activeCards.length]);

  // Prev card
  const handlePrev = useCallback(() => {
    sound.playClick();
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, activeCards.length - 1)));
  }, [activeCards.length]);

  // Shuffle cards
  const handleShuffle = () => {
    sound.playPop();
    setIsFlipped(false);
    setShowHint(false);
    if (activeCards.length > 1) {
      const randomIndex = Math.floor(Math.random() * activeCards.length);
      setCurrentIndex(randomIndex);
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or modal is open
      if (
        isAddModalOpen ||
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowRight' || e.key === 'KeyD') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'KeyA') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrev, isAddModalOpen]);

  // Auto-play slideshow timer
  useEffect(() => {
    let timer: any;
    if (isAutoPlaying && activeCards.length > 0) {
      timer = setInterval(() => {
        setIsFlipped((flipped) => {
          if (!flipped) {
            sound.playFlip();
            return true;
          } else {
            handleNext();
            return false;
          }
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying, activeCards.length, handleNext]);

  // Rate card mastery level
  const handleRateCard = (cardId: string, mastery: MasteryLevel) => {
    if (mastery === 'mastered') {
      sound.playSuccess();
    } else {
      sound.playPop();
    }

    const updatedDecks = decks.map((deck) => ({
      ...deck,
      cards: deck.cards.map((c) =>
        c.id === cardId
          ? {
              ...c,
              mastery,
              reviewCount: (c.reviewCount || 0) + 1,
              lastReviewedAt: 'Vừa xong',
            }
          : c
      ),
    }));

    setDecks(updatedDecks);
    saveStoredFlashcardDecks(updatedDecks);

    // Auto advance after rating
    setTimeout(() => {
      handleNext();
    }, 250);
  };

  // Add new custom card
  const handleAddCustomCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const newCard: ReviewCard = {
      id: `custom-fc-${Date.now()}`,
      subject: newSubject,
      topic: newTopic.trim() || 'Chủ đề tổng hợp',
      title: newTitle.trim() || newQuestion.slice(0, 30) + '...',
      question: newQuestion.trim(),
      hint: newHint.trim() || undefined,
      answer: newAnswer.trim(),
      formula: newFormula.trim() || undefined,
      example: newExample.trim() || undefined,
      keyRule: newKeyRule.trim() || undefined,
      mastery: 'learning',
      reviewCount: 0,
    };

    // Find target deck or create a new one
    let deckExists = decks.find((d) => d.subject === newSubject);
    let updatedDecks: FlashcardDeck[];

    if (deckExists) {
      updatedDecks = decks.map((d) =>
        d.id === deckExists?.id
          ? { ...d, cards: [newCard, ...d.cards] }
          : d
      );
    } else {
      const newDeck: FlashcardDeck = {
        id: `deck-custom-${Date.now()}`,
        subject: newSubject,
        topic: newTopic.trim() || 'Tổng hợp',
        title: `Bộ Thẻ ${newSubject}`,
        description: `Tự tạo cho môn ${newSubject}`,
        badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        cards: [newCard],
      };
      updatedDecks = [newDeck, ...decks];
    }

    setDecks(updatedDecks);
    saveStoredFlashcardDecks(updatedDecks);
    sound.playSuccess();

    // Reset modal form
    setNewQuestion('');
    setNewAnswer('');
    setNewTitle('');
    setNewTopic('');
    setNewHint('');
    setNewFormula('');
    setNewExample('');
    setNewKeyRule('');
    setIsAddModalOpen(false);
  };

  // Stats calculation
  const totalCardsCount = currentPoolCards.length;
  const masteredCount = currentPoolCards.filter((c) => c.mastery === 'mastered').length;
  const learningCount = currentPoolCards.filter((c) => c.mastery === 'learning').length;
  const needReviewCount = currentPoolCards.filter((c) => c.mastery === 'need_review').length;
  const masteredPercentage = totalCardsCount > 0 ? Math.round((masteredCount / totalCardsCount) * 100) : 0;

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* 1. TOP CONTROL BAR: Multi-Subject Selector & Actions */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Subject & Deck Selector */}
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>

          {/* Subject Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
            {availableSubjects.map((sub) => {
              const isSelected = selectedSubject === sub;
              return (
                <button
                  key={sub}
                  onClick={() => {
                    sound.playClick();
                    setSelectedSubject(sub);
                    setSelectedDeckId('all');
                    setCurrentIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {sub === 'all' ? 'Tất cả môn' : sub}
                </button>
              );
            })}
          </div>

          {/* Specific Deck Selector (if more than 1 in subject) */}
          {filteredDecks.length > 1 && (
            <div className="relative inline-block">
              <select
                value={selectedDeckId}
                onChange={(e) => {
                  sound.playClick();
                  setSelectedDeckId(e.target.value);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className="text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl py-1.5 pl-2.5 pr-7 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="all">Tất cả bộ thẻ ({currentPoolCards.length} thẻ)</option>
                {filteredDecks.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.cards.length})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Right: Mode Buttons & Add Card */}
        <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
          {/* Switch View: Single Flip vs Grid */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl">
            <button
              onClick={() => { sound.playClick(); setViewLayout('flip_single'); }}
              title="Chế độ lật thẻ đơn (Focus Mode)"
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewLayout === 'flip_single' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { sound.playClick(); setViewLayout('grid_all'); }}
              title="Xem dạng lưới danh sách tất cả thẻ"
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewLayout === 'grid_all' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add New Card Button */}
          <button
            onClick={() => { sound.playClick(); setIsAddModalOpen(true); }}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Thẻ</span>
          </button>
        </div>
      </div>

      {/* 2. PROGRESS & STATUS FILTER BAR */}
      <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Progress summary */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-extrabold text-slate-800">
            Tiến độ thuộc bài:{' '}
            <span className="text-emerald-600 font-black">{masteredCount}/{totalCardsCount}</span>{' '}
            <span className="text-slate-400 font-normal">({masteredPercentage}%)</span>
          </div>

          {/* Mini progress bar */}
          <div className="w-28 sm:w-36 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/70">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
              style={{ width: `${masteredPercentage}%` }}
            />
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'Tất cả', count: totalCardsCount },
            { id: 'need_review', label: 'Cần ôn lại', count: needReviewCount, color: 'text-rose-700 bg-rose-50 border-rose-200' },
            { id: 'learning', label: 'Đang học', count: learningCount, color: 'text-amber-700 bg-amber-50 border-amber-200' },
            { id: 'mastered', label: 'Đã thuộc', count: masteredCount, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
          ].map((st) => {
            const isSelected = statusFilter === st.id;
            return (
              <button
                key={st.id}
                onClick={() => {
                  sound.playClick();
                  setStatusFilter(st.id as any);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500 font-black'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <span>{st.label}</span>
                <span className="text-[10px] opacity-70">({st.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN FLASHCARD COMPONENT (LẬT THẺ ĐƠN) */}
      {viewLayout === 'flip_single' && (
        <>
          {activeCards.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/90 shadow-xs max-w-md mx-auto my-6 space-y-3">
              <Sparkles className="w-10 h-10 text-indigo-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Không có thẻ nào trong bộ lọc này</h3>
              <p className="text-xs text-slate-500">
                Hãy chọn môn học khác hoặc chuyển bộ lọc sang "Tất cả".
              </p>
              <button
                onClick={() => { setStatusFilter('all'); setSelectedSubject('all'); }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Xem tất cả thẻ
              </button>
            </div>
          ) : activeCard ? (
            <div className="space-y-4">
              {/* Stepper Dots & Controls */}
              <div className="flex items-center justify-between px-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                    Thẻ {currentIndex + 1} / {activeCards.length}
                  </span>
                  <span className="text-slate-400 text-[11px] hidden sm:inline">
                    Phím tắt: [Space] Lật thẻ • [← / →] Chuyển thẻ
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    title={isAutoPlaying ? 'Dừng tự động lật' : 'Tự động lật và chuyển thẻ'}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isAutoPlaying
                        ? 'bg-amber-500 text-slate-950 font-black animate-pulse'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isAutoPlaying ? 'Đang tự phát' : 'Tự phát'}</span>
                  </button>

                  <button
                    onClick={handleShuffle}
                    title="Xáo trộn ngẫu nhiên"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 3D Interactive Flip Card Container */}
              <div
                onClick={handleFlip}
                className="relative w-full min-h-[340px] sm:min-h-[380px] perspective-1000 cursor-pointer select-none group"
              >
                <div
                  className={`w-full h-full rounded-3xl transition-transform duration-500 transform-style-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* ====== MẶT TRƯỚC (FRONT: CÂU HỎI / KHÁI NIỆM) ====== */}
                  <div
                    className={`absolute inset-0 backface-hidden bg-white rounded-3xl p-6 sm:p-8 border-2 flex flex-col justify-between shadow-lg transition-all ${
                      isFlipped ? 'pointer-events-none' : 'pointer-events-auto'
                    } ${
                      activeCard.mastery === 'mastered'
                        ? 'border-emerald-200 group-hover:border-emerald-300'
                        : activeCard.mastery === 'learning'
                        ? 'border-amber-200 group-hover:border-amber-300'
                        : 'border-slate-200 group-hover:border-indigo-300'
                    }`}
                  >
                    {/* Header: Subject & Topic badge + Front indicator */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                          {activeCard.subject || 'Toán Học'}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {activeCard.topic}
                        </span>
                      </div>

                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        Mặt trước: Câu hỏi / Khái niệm
                      </span>
                    </div>

                    {/* Center: Question / Concept */}
                    <div className="my-auto py-4 text-center space-y-3">
                      <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                        {activeCard.title}
                      </span>
                      <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-relaxed max-w-2xl mx-auto">
                        {activeCard.question}
                      </h2>

                      {/* Optional Hint Button */}
                      {activeCard.hint && (
                        <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                          {!showHint ? (
                            <button
                              type="button"
                              onClick={() => setShowHint(true)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition-all cursor-pointer"
                            >
                              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                              <span>Xem gợi ý ôn lại</span>
                            </button>
                          ) : (
                            <div className="inline-block max-w-lg bg-amber-50/90 border border-amber-200/80 text-amber-950 text-xs font-medium p-3 rounded-2xl animate-fadeIn text-left">
                              <span className="font-black text-amber-900 block mb-0.5">💡 Gợi ý:</span>
                              {activeCard.hint}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer: Flip Indicator */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
                      <span className="font-medium">Nhấp vào thẻ để lật</span>
                      <span className="inline-flex items-center gap-1.5 font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200/60 transition-colors">
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Xem đáp án (Mặt sau)</span>
                      </span>
                    </div>
                  </div>

                  {/* ====== MẶT SAU (BACK: ĐÁP ÁN & CÔNG THỨC) ====== */}
                  <div
                    className={`absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-500/30 flex flex-col justify-between shadow-xl transition-all ${
                      !isFlipped ? 'pointer-events-none' : 'pointer-events-auto'
                    }`}
                  >
                    {/* Header: Subject & Back indicator */}
                    <div className="flex items-center justify-between gap-2 border-b border-indigo-800/60 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                          {activeCard.subject || 'Toán Học'}
                        </span>
                        <span className="text-xs font-bold text-indigo-200/80">
                          {activeCard.topic}
                        </span>
                      </div>

                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-400/30">
                        Mặt sau: Đáp án & Lời giải
                      </span>
                    </div>

                    {/* Center Content: Answer, Formula, Example */}
                    <div className="my-auto py-3 space-y-3 overflow-y-auto max-h-[220px] scrollbar-none pr-1">
                      {/* Highlighted Formula if present */}
                      {activeCard.formula && (
                        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-indigo-400/30 text-center font-black text-amber-300 text-base sm:text-lg">
                          {activeCard.formula}
                        </div>
                      )}

                      {/* Main Answer text */}
                      <div className="text-xs sm:text-sm text-indigo-50 leading-relaxed font-medium">
                        {activeCard.answer}
                      </div>

                      {/* Example if present */}
                      {activeCard.example && (
                        <div className="p-2.5 bg-black/20 rounded-xl border border-indigo-500/20 text-xs text-indigo-200">
                          <span className="font-black text-amber-300 block mb-0.5">📌 Ví dụ áp dụng:</span>
                          {activeCard.example}
                        </div>
                      )}

                      {/* Key Rule if present */}
                      {activeCard.keyRule && (
                        <div className="p-2.5 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-xs text-emerald-200">
                          <span className="font-black text-emerald-300 block mb-0.5">⚡ Quy tắc then chốt:</span>
                          {activeCard.keyRule}
                        </div>
                      )}
                    </div>

                    {/* Rating & Actions on Back */}
                    <div
                      className="pt-3 border-t border-indigo-800/60 flex flex-col sm:flex-row items-center justify-between gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-[11px] font-bold text-indigo-300">
                        Đánh giá mức độ nhớ:
                      </span>

                      {/* 3 Rating Buttons */}
                      <div className="flex items-center gap-1.5 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => handleRateCard(activeCard.id, 'need_review')}
                          className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                            activeCard.mastery === 'need_review'
                              ? 'bg-rose-600 text-white ring-2 ring-rose-400'
                              : 'bg-rose-950/60 hover:bg-rose-900 text-rose-200 border border-rose-800'
                          }`}
                        >
                          ✕ Cần ôn lại
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRateCard(activeCard.id, 'learning')}
                          className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                            activeCard.mastery === 'learning'
                              ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                              : 'bg-amber-950/60 hover:bg-amber-900 text-amber-200 border border-amber-800'
                          }`}
                        >
                          ⏳ Tạm nhớ
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRateCard(activeCard.id, 'mastered')}
                          className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                            activeCard.mastery === 'mastered'
                              ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                              : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-200 border border-emerald-800'
                          }`}
                        >
                          ✓ Đã thuộc làu
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Navigation Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Thẻ Trước</span>
                </button>

                <button
                  type="button"
                  onClick={handleFlip}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs border border-indigo-200 transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <RotateCw className="w-4 h-4 text-indigo-600" />
                  <span>{isFlipped ? 'Lật lại mặt trước' : 'Lật xem mặt sau'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all cursor-pointer shadow-sm active:scale-98"
                >
                  <span>Thẻ Sau</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}

      {/* 4. GRID VIEW LAYOUT (XEM DANH SÁCH TẤT CẢ CÁC THẺ) */}
      {viewLayout === 'grid_all' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Danh sách {activeCards.length} thẻ:</span>
            <span>Bấm vào thẻ để chuyển sang chế độ lật</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {activeCards.map((card, idx) => (
              <div
                key={card.id}
                onClick={() => {
                  sound.playClick();
                  setCurrentIndex(idx);
                  setViewLayout('flip_single');
                  setIsFlipped(false);
                }}
                className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                      {card.subject || 'Toán'}
                    </span>
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">
                      {card.title}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      card.mastery === 'mastered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : card.mastery === 'learning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {card.mastery === 'mastered'
                      ? '✓ Đã thuộc'
                      : card.mastery === 'learning'
                      ? '⏳ Đang học'
                      : '✕ Cần ôn'}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-900 line-clamp-2">
                  <span className="text-slate-400 mr-1">Hỏi:</span>
                  {card.question}
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2">
                  <span className="text-indigo-600 font-bold mr-1">Đáp:</span>
                  {card.formula ? `${card.formula} — ` : ''}
                  {card.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MODAL: THÊM THẺ FLASHCARD MỚI (CHO MỌI MÔN HỌC) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Tạo Thẻ Flashcard Mới
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Phù hợp cho Toán, Lý, Hóa, Tiếng Anh, Sử, Địa...
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomCard} className="space-y-3 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 mb-1">Môn học:</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="Toán Học">Toán Học</option>
                    <option value="Vật Lý">Vật Lý</option>
                    <option value="Hóa Học">Hóa Học</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Lịch Sử">Lịch Sử</option>
                    <option value="Địa Lý">Địa Lý</option>
                    <option value="Sinh Học">Sinh Học</option>
                    <option value="Tin Học">Tin Học</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Chủ đề bài học:</label>
                  <input
                    type="text"
                    required
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="VD: Định luật Ôm, Thì hiện tại..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">
                  Mặt trước: Câu hỏi / Khái niệm cần nhớ <span className="text-rose-500">*</span>:
                </label>
                <textarea
                  required
                  rows={2}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="VD: Trong mạch nối tiếp, cường độ dòng điện liên hệ thế nào?"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">
                  Mặt sau: Đáp án / Định nghĩa đầy đủ <span className="text-rose-500">*</span>:
                </label>
                <textarea
                  required
                  rows={2}
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="VD: Cường độ dòng điện là như nhau tại mọi điểm: I = I1 = I2..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 mb-1">Công thức cốt lõi (nếu có):</label>
                  <input
                    type="text"
                    value={newFormula}
                    onChange={(e) => setNewFormula(e.target.value)}
                    placeholder="VD: I = U / R"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Gợi ý ngắn (Hint):</label>
                  <input
                    type="text"
                    value={newHint}
                    onChange={(e) => setNewHint(e.target.value)}
                    placeholder="Gợi ý khi lỡ quên..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  Lưu Thẻ Flashcard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
