import React, { useState } from 'react';
import { ReviewCard, MasteryLevel } from '../../types';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
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
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface FlashcardReviewProps {
  cards: ReviewCard[];
  onUpdateCardMastery: (cardId: string, mastery: MasteryLevel) => void;
  onGoToSimulation?: (topicName?: string) => void;
  onOpenAddModal: () => void;
}

export const FlashcardReview: React.FC<FlashcardReviewProps> = ({
  cards,
  onUpdateCardMastery,
  onGoToSimulation,
  onOpenAddModal,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'need_review' | 'learning' | 'mastered'>('all');

  const filteredCards = cards.filter((c) => {
    if (selectedFilter === 'all') return true;
    return c.mastery === selectedFilter;
  });

  const activeCard: ReviewCard | undefined = filteredCards[currentIndex] || filteredCards[0];

  const handleFlip = () => {
    sound.playFlip();
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    sound.playClick();
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    sound.playClick();
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(filteredCards.length - 1);
    }
  };

  const handleShuffle = () => {
    sound.playPop();
    setIsFlipped(false);
    setShowHint(false);
    if (filteredCards.length > 1) {
      const randomIndex = Math.floor(Math.random() * filteredCards.length);
      setCurrentIndex(randomIndex);
    }
  };

  const handleRate = (mastery: MasteryLevel) => {
    if (!activeCard) return;
    if (mastery === 'mastered') {
      sound.playSuccess();
    } else {
      sound.playPop();
    }
    onUpdateCardMastery(activeCard.id, mastery);

    // Auto advance to next card after rating
    setTimeout(() => {
      handleNext();
    }, 280);
  };

  if (filteredCards.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/90 shadow-xs max-w-xl mx-auto my-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-base font-black text-slate-800">Không có thẻ nào trong bộ lọc này</h3>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          Em đã học hết các thẻ cần ôn hoặc chưa có thẻ nào phù hợp với bộ lọc hiện tại.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setSelectedFilter('all')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all cursor-pointer shadow-sm"
          >
            Xem Tất Cả Thẻ ({cards.length})
          </button>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
          >
            + Thêm Thẻ Ôn Tập
          </button>
        </div>
      </div>
    );
  }

  const masteryBadge = (mastery: MasteryLevel) => {
    switch (mastery) {
      case 'mastered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Đã thuộc làu
          </span>
        );
      case 'learning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" /> Đang ôn luyện
          </span>
        );
      case 'need_review':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <HelpCircle className="w-3 h-3 text-rose-600" /> Cần ôn lại
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Top Filter and Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-extrabold text-slate-500 mr-1 text-[11px] uppercase tracking-wider">Lọc thẻ:</span>
          <button
            onClick={() => { sound.playClick(); setSelectedFilter('all'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({cards.length})
          </button>
          <button
            onClick={() => { sound.playClick(); setSelectedFilter('need_review'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedFilter === 'need_review'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60'
            }`}
          >
            🔴 Cần ôn ({cards.filter((c) => c.mastery === 'need_review').length})
          </button>
          <button
            onClick={() => { sound.playClick(); setSelectedFilter('learning'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedFilter === 'learning'
                ? 'bg-amber-500 text-slate-950 shadow-2xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            🟡 Đang học ({cards.filter((c) => c.mastery === 'learning').length})
          </button>
          <button
            onClick={() => { sound.playClick(); setSelectedFilter('mastered'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedFilter === 'mastered'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            🟢 Đã thuộc ({cards.filter((c) => c.mastery === 'mastered').length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            title="Đảo thẻ ngẫu nhiên"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trộn ngẫu nhiên</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/70 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Thẻ</span>
          </button>
        </div>
      </div>

      {/* Progress pill bar */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
        <span>
          Thẻ <span className="text-indigo-600 font-black text-sm">{currentIndex + 1}</span> / {filteredCards.length}
        </span>
        <div className="flex-1 mx-4 bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / filteredCards.length) * 100}%` }}
          />
        </div>
        <span className="text-slate-400 font-semibold text-[11px]">
          Ôn tập: {activeCard?.reviewCount || 0} lần
        </span>
      </div>

      {/* Flashcard container */}
      <div
        onClick={handleFlip}
        className={`group relative min-h-[360px] sm:min-h-[380px] bg-white rounded-3xl p-6 sm:p-8 border-2 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl flex flex-col justify-between ${
          isFlipped
            ? 'border-indigo-400/80 bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30'
            : 'border-slate-200/90 hover:border-indigo-300/80'
        }`}
      >
        {/* Top Card Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              {activeCard.subject && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200/80">
                  {activeCard.subject}
                </span>
              )}
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                {activeCard.topic}
              </span>
              {activeCard.cardCategory && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
                  {activeCard.cardCategory === 'concept' ? '💡 Khái niệm' :
                   activeCard.cardCategory === 'definition' ? '📖 Định nghĩa' :
                   activeCard.cardCategory === 'example' ? '🔍 Ví dụ' :
                   activeCard.cardCategory === 'distinction' ? '⚖️ Phân biệt' : '⚠️ Lưu ý'}
                </span>
              )}
              {masteryBadge(activeCard.mastery)}
            </div>
            <h3 className="text-base font-black text-slate-900 tracking-tight mt-1">
              {activeCard.title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-xs text-indigo-600 font-bold bg-indigo-50/80 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200/50 transition-colors">
            <RotateCw className={`w-3.5 h-3.5 transition-transform duration-300 ${isFlipped ? 'rotate-180' : ''}`} />
            <span>{isFlipped ? 'Xem Mặt Câu Hỏi' : 'Lật Xem Đáp Án'}</span>
          </div>
        </div>

        {/* Card Body: Front vs Back */}
        <div className="py-6 flex-1 flex flex-col justify-center">
          {!isFlipped ? (
            /* FRONT: Question */
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>Câu hỏi kích hoạt tư duy trực giác:</span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-slate-800 leading-relaxed">
                {activeCard.question}
              </p>

              {/* Optional Hint Button */}
              {activeCard.hint && (
                <div className="pt-2">
                  {!showHint ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playPop();
                        setShowHint(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition-colors cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>Xem gợi ý suy luận</span>
                    </button>
                  ) : (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2 animate-fadeIn"
                    >
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold block">Gợi ý:</span>
                        <p className="text-amber-800 mt-0.5">{activeCard.hint}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="text-center pt-4">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
                  <Eye className="w-4 h-4" /> Bấm vào thẻ để lật xem đáp án & bản chất trực quan
                </span>
              </div>
            </div>
          ) : (
            /* BACK: Answer, Formula, Intuition */
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Bản chất trực quan & Lời giải:</span>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed whitespace-pre-line">
                  {activeCard.answer}
                </p>
              </div>

              {/* Summary (Tóm tắt ngắn) */}
              {activeCard.summary && (
                <div className="p-3 bg-indigo-50/80 border border-indigo-100 rounded-2xl text-xs text-slate-800">
                  <span className="font-black text-indigo-800 uppercase tracking-wider block text-[10px] mb-1">
                    📖 Tóm tắt bài học (Summary):
                  </span>
                  <p className="leading-relaxed font-medium">{activeCard.summary}</p>
                </div>
              )}

              {/* Key Points (Điểm mấu chốt) */}
              {activeCard.keyPoints && activeCard.keyPoints.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="font-black text-indigo-800 uppercase tracking-wider block text-[10px]">
                    🔑 Điểm mấu chốt then chốt:
                  </span>
                  <div className="grid grid-cols-1 gap-1">
                    {activeCard.keyPoints.map((pt, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-2 bg-slate-50/90 border border-slate-200/70 rounded-xl text-xs font-semibold text-slate-800 flex items-start gap-1.5"
                      >
                        <span className="shrink-0">{pt.slice(0, 2)}</span>
                        <span className="flex-1 leading-snug">{pt.slice(2).trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Example if provided */}
              {activeCard.example && (
                <div className="p-3 bg-teal-50/80 border border-teal-200/80 rounded-2xl text-xs text-teal-950 font-medium">
                  <span className="font-extrabold block text-teal-800 mb-0.5">🔍 Ví dụ minh họa cụ thể:</span>
                  <p className="text-teal-900 leading-relaxed">{activeCard.example}</p>
                </div>
              )}

              {/* Distinction if provided */}
              {activeCard.distinction && (
                <div className="p-3 bg-purple-50/80 border border-purple-200/80 rounded-2xl text-xs text-purple-950 font-medium">
                  <span className="font-extrabold block text-purple-800 mb-0.5">⚖️ Phân biệt tránh nhầm lẫn:</span>
                  <p className="text-purple-900 leading-relaxed">{activeCard.distinction}</p>
                </div>
              )}

              {/* Rule Note if provided */}
              {activeCard.ruleNote && (
                <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs text-amber-950 font-medium">
                  <span className="font-extrabold block text-amber-800 mb-0.5">⚠️ Quy tắc / Lưu ý quan trọng:</span>
                  <p className="text-amber-900 leading-relaxed">{activeCard.ruleNote}</p>
                </div>
              )}

              {/* Core Formula if any */}
              {activeCard.formula && (
                <div className="flex items-center gap-3 p-3 bg-indigo-50/90 border border-indigo-200/80 rounded-2xl">
                  <span className="text-xs font-black uppercase text-indigo-700 tracking-wider shrink-0">
                    Công thức vàng:
                  </span>
                  <code className="text-xs sm:text-sm font-mono font-black text-indigo-950 bg-white px-2.5 py-1 rounded-xl border border-indigo-200 shadow-2xs">
                    {activeCard.formula}
                  </code>
                </div>
              )}

              {/* Visual Metaphor / Real world analogy */}
              {activeCard.visualMetaphor && (
                <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl text-xs text-amber-950 font-medium">
                  <span className="font-extrabold block text-amber-800 mb-0.5">💡 Hình tượng trực quan dễ nhớ:</span>
                  <p>{activeCard.visualMetaphor}</p>
                </div>
              )}

              {/* Key pedagogical rule */}
              {activeCard.keyRule && (
                <p className="text-[11px] font-bold text-slate-500 bg-slate-100/90 px-3 py-1.5 rounded-xl border border-slate-200/60">
                  📌 {activeCard.keyRule}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Card Footer: Rating Buttons when Flipped */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          {isFlipped ? (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-extrabold text-slate-600">Đánh giá mức độ hiểu của em:</span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleRate('need_review')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <span>🔴 Chưa vững</span>
                </button>
                <button
                  onClick={() => handleRate('learning')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <span>🟡 Đang ôn</span>
                </button>
                <button
                  onClick={() => handleRate('mastered')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>🟢 Đã thuộc làu</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between text-xs text-slate-400">
              <span>Bấm nút mũi tên hoặc lật thẻ để ôn tập tiếp</span>
              {onGoToSimulation && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    onGoToSimulation(activeCard.topic);
                  }}
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold transition-colors cursor-pointer"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Mô phỏng bài này</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Prev / Next Bottom Navigator */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Thẻ Trước</span>
        </button>

        <button
          onClick={handleFlip}
          className="px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-2xs"
        >
          {isFlipped ? '↺ Xem Lại Câu Hỏi' : '⇄ Lật Mặt Sau'}
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md shadow-indigo-600/20"
        >
          <span>Thẻ Tiếp Theo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
