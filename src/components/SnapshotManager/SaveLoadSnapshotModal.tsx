import React, { useState, useEffect } from 'react';
import {
  Save,
  FolderOpen,
  X,
  Check,
  Edit2,
  Trash2,
  Sparkles,
  Layers,
  FileText,
  Clock,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Download,
  Upload,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { SubjectTopicSnapshot, StudyMaterial, ReviewCard, QuizQuestionItem, PracticeQuestion } from '../../types';
import {
  getStoredSnapshots,
  saveCurrentWorkingCopySnapshot,
  restoreSnapshotToAppState,
  renameSnapshot,
  deleteSnapshot,
} from '../../utils/snapshotManager';
import { buildGroundingPackage } from '../../utils/groundedEngine';
import { sound } from '../../utils/sound';

interface SaveLoadSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubject: string;
  currentTopic: string;
  materials: StudyMaterial[];
  reviewCards: ReviewCard[];
  quizQuestions: QuizQuestionItem[];
  practiceQuestions: PracticeQuestion[];
  onSnapshotLoaded?: (snapshot: SubjectTopicSnapshot) => void;
}

export const SaveLoadSnapshotModal: React.FC<SaveLoadSnapshotModalProps> = ({
  isOpen,
  onClose,
  currentSubject,
  currentTopic,
  materials,
  reviewCards,
  quizQuestions,
  practiceQuestions,
  onSnapshotLoaded,
}) => {
  const [snapshots, setSnapshots] = useState<SubjectTopicSnapshot[]>(() => getStoredSnapshots());
  const [snapshotNameInput, setSnapshotNameInput] = useState('');
  const [editingSnapshotId, setEditingSnapshotId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deletingSnapshotId, setDeletingSnapshotId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Active topic working copy materials count
  const currentTopicMaterials = materials.filter(
    (m) => m.topic.toLowerCase().includes(currentTopic.toLowerCase()) || currentTopic.toLowerCase().includes(m.topic.toLowerCase())
  );
  const currentTopicCards = reviewCards.filter(
    (c) => c.topic.toLowerCase().includes(currentTopic.toLowerCase()) || currentTopic.toLowerCase().includes(c.topic.toLowerCase())
  );
  const currentTopicQuizzes = quizQuestions.filter(
    (q) => q.topic.toLowerCase().includes(currentTopic.toLowerCase()) || currentTopic.toLowerCase().includes(q.topic.toLowerCase())
  );

  // Handle Save Current Working Copy
  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();

    // Build complete analysisPreview & studyPack
    const pkg = buildGroundingPackage(
      currentTopic,
      materials,
      reviewCards,
      quizQuestions,
      practiceQuestions
    );

    const newSnapshot = saveCurrentWorkingCopySnapshot({
      name: snapshotNameInput.trim() || `${currentSubject} - ${currentTopic}`,
      subject: currentSubject,
      topic: currentTopic,
      sources: currentTopicMaterials.length > 0 ? currentTopicMaterials : materials.slice(0, 2),
      analysisPreview: pkg.analysisPreview,
      studyPack: {
        flashcards: currentTopicCards.length > 0 ? currentTopicCards : reviewCards.slice(0, 3),
        quizQuestions: currentTopicQuizzes.length > 0 ? currentTopicQuizzes : quizQuestions.slice(0, 3),
        practiceQuestions: practiceQuestions.slice(0, 3),
      },
    });

    const updated = getStoredSnapshots();
    setSnapshots(updated);
    setSnapshotNameInput('');
    setFeedbackMessage(`Đã lưu snapshot "${newSnapshot.name}" thành công!`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Handle Restore Snapshot
  const handleRestore = (snapshot: SubjectTopicSnapshot) => {
    sound.playSuccess();
    restoreSnapshotToAppState(snapshot);
    if (onSnapshotLoaded) {
      onSnapshotLoaded(snapshot);
    }
    setFeedbackMessage(`Đã khôi phục thành công "${snapshot.name}"! UI đã được chuyển sang chủ đề này.`);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  // Handle Rename
  const handleStartRename = (snapshot: SubjectTopicSnapshot) => {
    sound.playClick();
    setEditingSnapshotId(snapshot.id);
    setRenameValue(snapshot.name);
  };

  const handleConfirmRename = (id: string) => {
    if (!renameValue.trim()) return;
    sound.playSuccess();
    const updated = renameSnapshot(id, renameValue);
    setSnapshots(updated);
    setEditingSnapshotId(null);
  };

  // Handle Delete
  const handleConfirmDelete = (id: string) => {
    sound.playPop();
    const updated = deleteSnapshot(id);
    setSnapshots(updated);
    setDeletingSnapshotId(null);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">
                Lưu & Mở Bộ Ôn Tập (Working Copy Snapshots)
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Lưu trọn vẹn: sources, analysisPreview, studyPack. Mở lại để khôi phục bài học.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          {/* 1. SAVE CURRENT WORKING COPY SECTION */}
          <div className="bg-indigo-50/60 rounded-2xl p-4 border border-indigo-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4 text-indigo-700" />
                <h3 className="text-xs font-black uppercase tracking-wider text-indigo-950">
                  Lưu Chủ Đề Hiện Tại: "{currentTopic}"
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-white text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                Working Copy Active
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-normal">
              Snapshot sẽ lưu toàn bộ <strong>{currentTopicMaterials.length} tài liệu (sources)</strong>,{' '}
              <strong>bản tóm tắt & công thức (analysisPreview)</strong>, và{' '}
              <strong>{currentTopicCards.length} flashcards + quiz (studyPack)</strong>.
            </p>

            <form onSubmit={handleSaveCurrent} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={snapshotNameInput}
                onChange={(e) => setSnapshotNameInput(e.target.value)}
                placeholder={`Đặt tên ngắn (VD: ${currentSubject} - ${currentTopic})...`}
                className="flex-1 px-3 py-2 text-xs font-bold bg-white border border-indigo-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu chủ đề này</span>
              </button>
            </form>
          </div>

          {/* 2. SAVED SNAPSHOTS LIST */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-black text-slate-800">
              <span>Các bộ ôn tập đã lưu ({snapshots.length}):</span>
              <span className="text-[11px] text-slate-500 font-normal">
                Bấm "Mở" để nạp snapshot vào ứng dụng
              </span>
            </div>

            {snapshots.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                Chưa có snapshot nào được lưu. Hãy bấm "Lưu chủ đề này" ở trên để lưu lại bài học đầu tiên!
              </div>
            ) : (
              <div className="space-y-2.5">
                {snapshots.map((snap) => {
                  const isCurrentActive =
                    snap.topic.toLowerCase() === currentTopic.toLowerCase() &&
                    snap.subject.toLowerCase() === currentSubject.toLowerCase();

                  return (
                    <div
                      key={snap.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isCurrentActive
                          ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-400/40'
                          : 'bg-white hover:bg-slate-50/80 border-slate-200/90'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        {/* Left: Snapshot Info */}
                        <div className="space-y-1 flex-1 min-w-0">
                          {editingSnapshotId === snap.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                className="px-2 py-1 text-xs font-bold border border-indigo-300 rounded-lg text-slate-900 focus:outline-none"
                              />
                              <button
                                onClick={() => handleConfirmRename(snap.id)}
                                className="p-1 text-emerald-600 hover:text-emerald-700 cursor-pointer"
                                title="Lưu tên"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingSnapshotId(null)}
                                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                                title="Hủy"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-900 truncate">
                                {snap.name}
                              </span>
                              {isCurrentActive && (
                                <span className="text-[10px] font-black uppercase px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  Đang học
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                              {snap.subject} • {snap.topic}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" /> {snap.updatedAt}
                            </span>
                          </div>

                          {/* Snapshot Content Tags */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-bold text-slate-600">
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <FileText className="w-2.5 h-2.5 text-indigo-600" />
                              {snap.sources?.length || 0} tài liệu
                            </span>
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-purple-600" />
                              analysisPreview sẵn sàng
                            </span>
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Layers className="w-2.5 h-2.5 text-amber-600" />
                              {snap.studyPack?.flashcards?.length || 0} thẻ • {snap.studyPack?.quizQuestions?.length || 0} quiz
                            </span>
                          </div>
                        </div>

                        {/* Right: Actions (Mở / Đổi tên / Xóa) */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                          {/* MỞ (RESTORE) BUTTON */}
                          <button
                            onClick={() => handleRestore(snap)}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                            title="Nạp và khôi phục bộ ôn tập này"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                            <span>Mở</span>
                          </button>

                          {/* RENAME BUTTON */}
                          <button
                            onClick={() => handleStartRename(snap)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Đổi tên ngắn"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* DELETE BUTTON */}
                          {deletingSnapshotId === snap.id ? (
                            <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                              <span className="text-[10px] font-bold text-rose-800">Xóa?</span>
                              <button
                                onClick={() => handleConfirmDelete(snap.id)}
                                className="px-1.5 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded cursor-pointer"
                              >
                                Có
                              </button>
                              <button
                                onClick={() => setDeletingSnapshotId(null)}
                                className="px-1.5 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded cursor-pointer"
                              >
                                Không
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeletingSnapshotId(snap.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Xóa môn không dùng"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            Dữ liệu được lưu vĩnh viễn trên trình duyệt của bạn (Local Persistence)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold cursor-pointer transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
