import React, { useState, useEffect } from 'react';
import { Navbar, AppViewMode } from './components/Navbar';
import { StudyMaterialScreen } from './components/MaterialIntake/StudyMaterialScreen';
import { SummaryKeyPointsScreen } from './components/SummaryKeyPoints/SummaryKeyPointsScreen';
import { PracticeQuestionsHub } from './components/PracticeQuestions/PracticeQuestionsHub';
import { QuizModeScreen } from './components/QuizMode/QuizModeScreen';
import { WireframeContainer, SimulationTab } from './components/InteractiveWireframe/WireframeContainer';
import { FrameworkPrinciples } from './components/PedagogyGuide/FrameworkPrinciples';
import { Session5SummaryScreen } from './components/PedagogyGuide/Session5SummaryScreen';
import { ReviewScreen } from './components/Review/ReviewScreen';
import { AppearanceSettingsScreen } from './components/Appearance/AppearanceSettingsScreen';
import { FlashcardModeScreen } from './components/Flashcard/FlashcardModeScreen';
import { GroundedChatScreen } from './components/GroundedChatbot/GroundedChatScreen';
import { SaveLoadSnapshotModal } from './components/SnapshotManager/SaveLoadSnapshotModal';
import { ApiKeyModal } from './components/Settings/ApiKeyModal';
import { PromptModal } from './components/PromptModal';
import {
  AppearanceModal,
  AppearancePreferences,
  getStoredAppearance,
  saveStoredAppearance,
} from './components/AppearanceModal';
import { Sparkles, Terminal, BookOpen, Layers, Lightbulb, CheckCircle2, HeartHandshake, FolderInput, GraduationCap, HelpCircle, CheckSquare, Palette, Sun, Moon, Bot, FolderOpen } from 'lucide-react';
import { sound } from './utils/sound';
import { INITIAL_STUDY_MATERIALS } from './data/defaultMaterials';
import { INITIAL_REVIEW_CARDS, INITIAL_REVIEW_QUIZZES } from './data/defaultReviewData';
import { INITIAL_PRACTICE_QUESTIONS } from './data/defaultPracticeQuestions';

export default function App() {
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);
  const [isAppearanceModalOpen, setIsAppearanceModalOpen] = useState<boolean>(false);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<AppViewMode>('intake');
  const [targetSimulationTab, setTargetSimulationTab] = useState<SimulationTab>('fractions');

  const [activeTopic, setActiveTopic] = useState<string>(() => {
    return localStorage.getItem('toan_truc_quan_active_topic_v1') || 'Định Lý Pytago';
  });
  const [activeSubject, setActiveSubject] = useState<string>(() => {
    return localStorage.getItem('toan_truc_quan_active_subject_v1') || 'Toán Học';
  });
  const [snapshotToast, setSnapshotToast] = useState<string | null>(null);

  // Listen for snapshot restoration event to update state and trigger UI changes across entire app
  useEffect(() => {
    const handleSnapshotRestored = (e: any) => {
      const snap = e.detail;
      if (snap) {
        setActiveTopic(snap.topic);
        setActiveSubject(snap.subject);
        setSnapshotToast(`Đã nạp thành công bộ ôn tập: "${snap.name}"! Giao diện đã cập nhật toàn bộ bài học.`);
        setTimeout(() => setSnapshotToast(null), 4500);
      }
    };
    window.addEventListener('app_snapshot_restored', handleSnapshotRestored);
    return () => window.removeEventListener('app_snapshot_restored', handleSnapshotRestored);
  }, []);

  // Appearance preferences state (Theme, Font, Sound, Brightness, Color Mode)
  const [preferences, setPreferences] = useState<AppearancePreferences>(() => getStoredAppearance());

  // Keep sound manager synced
  useEffect(() => {
    sound.setEnabled(preferences.soundEnabled);
    sound.setVolume(preferences.soundVolume);
    sound.setTheme(preferences.soundTheme);
  }, [preferences]);

  const handleToggleSound = () => {
    const nextEnabled = !preferences.soundEnabled;
    const updated: AppearancePreferences = { ...preferences, soundEnabled: nextEnabled };
    setPreferences(updated);
    saveStoredAppearance(updated);
    sound.setEnabled(nextEnabled);
    if (nextEnabled) sound.playSuccess();
  };

  const handleToggleColorMode = () => {
    const nextMode = preferences.colorMode === 'dark' ? 'light' : 'dark';
    let targetBg = preferences.bgTheme;
    if (nextMode === 'dark') {
      if (targetBg === 'default' || targetBg === 'cream' || targetBg === 'sky' || targetBg === 'pure_white') {
        targetBg = 'midnight';
      }
    } else {
      if (targetBg === 'midnight' || targetBg === 'chalkboard' || targetBg === 'oled_black') {
        targetBg = 'default';
      }
    }
    const updated: AppearancePreferences = {
      ...preferences,
      colorMode: nextMode,
      bgTheme: targetBg,
    };
    setPreferences(updated);
    saveStoredAppearance(updated);
    sound.playClick();
  };

  const handleNavigateToSimulation = (tabOrTopic?: string) => {
    sound.playSuccess();
    if (tabOrTopic) {
      const lower = tabOrTopic.toLowerCase();
      if (lower.includes('fractions') || lower.includes('phân số') || lower.includes('tỷ')) {
        setTargetSimulationTab('fractions');
      } else if (lower.includes('algebra') || lower.includes('phương trình') || lower.includes('cân')) {
        setTargetSimulationTab('algebra');
      } else if (lower.includes('linear') || lower.includes('đồ thị') || lower.includes('hàm số')) {
        setTargetSimulationTab('linear');
      } else if (lower.includes('pythagoras') || lower.includes('pytago') || lower.includes('tam giác')) {
        setTargetSimulationTab('pythagoras');
      }
    }
    setActiveView('workspace');
  };

  // Determine dynamic classes based on user preferences
  const bgThemeClass =
    preferences.bgTheme === 'cream'
      ? 'bg-[#fbf7ee] text-amber-950 bg-[radial-gradient(#edd9b8_1px,transparent_1px)] [background-size:24px_24px]'
      : preferences.bgTheme === 'chalkboard'
      ? 'bg-[#121c19] text-emerald-50 bg-[radial-gradient(#1c3127_1px,transparent_1px)] [background-size:24px_24px]'
      : preferences.bgTheme === 'midnight'
      ? 'bg-[#0b1120] text-slate-100 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]'
      : preferences.bgTheme === 'oled_black'
      ? 'bg-black text-slate-100'
      : preferences.bgTheme === 'sky'
      ? 'bg-[#f0f9ff] text-sky-950 bg-[radial-gradient(#bae6fd_1px,transparent_1px)] [background-size:24px_24px]'
      : preferences.bgTheme === 'pure_white'
      ? 'bg-white text-slate-900'
      : 'bg-slate-50/90 text-slate-900 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]';

  const fontFamilyClass =
    preferences.fontFamily === 'be_vietnam'
      ? "font-['Be_Vietnam_Pro',sans-serif]"
      : preferences.fontFamily === 'quicksand'
      ? "font-['Quicksand',sans-serif]"
      : preferences.fontFamily === 'space_grotesk'
      ? "font-['Space_Grotesk',sans-serif]"
      : preferences.fontFamily === 'merriweather'
      ? "font-['Merriweather',serif]"
      : "font-['Plus_Jakarta_Sans',sans-serif]";

  const fontSizeClass =
    preferences.fontSize === 'large'
      ? 'text-[17px]'
      : preferences.fontSize === 'xlarge'
      ? 'text-[19px]'
      : 'text-[15px]';

  const brightnessStyle = {
    filter: `brightness(${preferences.brightness || 100}%)`,
  };

  return (
    <div
      style={brightnessStyle}
      className={`min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-300 ${bgThemeClass} ${fontFamilyClass} ${fontSizeClass}`}
    >
      {/* Top Navbar */}
      <Navbar
        onOpenPromptModal={() => setIsPromptModalOpen(true)}
        onOpenAppearanceModal={() => setIsAppearanceModalOpen(true)}
        onOpenSnapshotModal={() => setIsSnapshotModalOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        soundEnabled={preferences.soundEnabled}
        onToggleSound={handleToggleSound}
        colorMode={preferences.colorMode}
        onToggleColorMode={handleToggleColorMode}
      />

      {/* Snapshot Restored Toast Notification */}
      {snapshotToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-black border border-emerald-400 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span>{snapshotToast}</span>
        </div>
      )}

      {/* Main Screen Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 space-y-4 sm:space-y-5">
        {/* Compact & Clean Context Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl px-4 py-3 sm:py-3.5 shadow-md shadow-indigo-950/10 border border-indigo-500/20 flex flex-wrap items-center justify-between gap-3 relative overflow-hidden">
          <div className="flex items-center gap-2.5 z-10 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0 shadow-2xs">
              {activeView === 'intake' ? (
                <FolderInput className="w-4 h-4 text-indigo-300" />
              ) : activeView === 'summary' ? (
                <Sparkles className="w-4 h-4 text-purple-300" />
              ) : activeView === 'practice' ? (
                <HelpCircle className="w-4 h-4 text-teal-300" />
              ) : activeView === 'quiz' ? (
                <CheckSquare className="w-4 h-4 text-rose-300" />
              ) : activeView === 'flashcards' ? (
                <Layers className="w-4 h-4 text-amber-300" />
              ) : activeView === 'grounded_chat' ? (
                <Bot className="w-4 h-4 text-indigo-300" />
              ) : activeView === 'review' ? (
                <GraduationCap className="w-4 h-4 text-indigo-300" />
              ) : activeView === 'appearance' ? (
                <Palette className="w-4 h-4 text-amber-300" />
              ) : activeView === 'session5' ? (
                <Sparkles className="w-4 h-4 text-purple-300" />
              ) : (
                <Sparkles className="w-4 h-4 text-indigo-300" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xs sm:text-sm font-black text-white tracking-tight truncate">
                  {activeView === 'intake'
                    ? 'Nhập Học Liệu Môn Toán'
                    : activeView === 'summary'
                    ? 'Kho Tóm Tắt & Điểm Mấu Chốt'
                    : activeView === 'practice'
                    ? 'Bộ Câu Hỏi Luyện Tập Cơ Bản'
                    : activeView === 'quiz'
                    ? 'Chế Độ Quiz Mode'
                    : activeView === 'flashcards'
                    ? 'Chế Độ Flashcard 3D'
                    : activeView === 'grounded_chat'
                    ? 'Trợ Lý Ôn Bài Grounded'
                    : activeView === 'workspace'
                    ? 'Bàn Mô Phỏng Toán Trực Quan'
                    : activeView === 'review'
                    ? 'Màn Review & Ôn Tập'
                    : activeView === 'appearance'
                    ? 'Cài Đặt Giao Diện & Sáng Tối'
                    : activeView === 'session5'
                    ? 'Tổng Kết Thành Quả Buổi 5'
                    : '4 Nguyên Tắc Sư Phạm Dễ Hiểu'}
                </h1>
                <span className="text-[10px] font-extrabold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {activeView === 'intake'
                    ? '✨ Text-First'
                    : activeView === 'summary'
                    ? '🔑 Chuẩn Sư Phạm'
                    : activeView === 'practice'
                    ? '📚 4 Dạng Cơ Bản'
                    : activeView === 'quiz'
                    ? '🎯 Từng Câu Riêng Biệt'
                    : activeView === 'flashcards'
                    ? '🎴 Lật Thẻ 3D'
                    : activeView === 'grounded_chat'
                    ? '🔒 Grounded 100%'
                    : activeView === 'review'
                    ? '🎯 Active Recall'
                    : activeView === 'appearance'
                    ? '🎨 Tuỳ Chỉnh'
                    : activeView === 'session5'
                    ? '🎯 Báo Cáo Buổi 5'
                    : 'Chuẩn CPA'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 z-10 shrink-0">
            <button
              onClick={() => { sound.playClick(); setIsSnapshotModalOpen(true); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-2xs"
              title="Lưu hoặc mở bộ ôn tập (Snapshots)"
            >
              <FolderOpen className="w-3.5 h-3.5 text-indigo-300" />
              <span className="hidden sm:inline">Bộ Ôn Tập</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setIsPromptModalOpen(true); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-200" />
              <span>Prompt</span>
            </button>
          </div>
        </div>

        {/* Dynamic View */}
        {activeView === 'intake' && (
          <StudyMaterialScreen
            onGoToSimulation={() => handleNavigateToSimulation()}
            onGoToReview={() => setActiveView('review')}
            onGoToSummary={() => setActiveView('summary')}
          />
        )}
        {activeView === 'summary' && (
          <SummaryKeyPointsScreen
            onGoToSimulation={handleNavigateToSimulation}
            onGoToReview={() => setActiveView('review')}
            onGoToIntake={() => setActiveView('intake')}
          />
        )}
        {activeView === 'practice' && (
          <PracticeQuestionsHub
            onGoToSimulation={handleNavigateToSimulation}
            onGoToIntake={() => setActiveView('intake')}
            onGoToSummary={() => setActiveView('summary')}
          />
        )}
        {activeView === 'quiz' && (
          <QuizModeScreen
            onGoToSimulation={handleNavigateToSimulation}
            onGoToReview={() => setActiveView('review')}
            onGoToIntake={() => setActiveView('intake')}
          />
        )}
        {activeView === 'flashcards' && (
          <FlashcardModeScreen
            onGoToSimulation={handleNavigateToSimulation}
            onGoToQuiz={() => setActiveView('quiz')}
            onGoToIntake={() => setActiveView('intake')}
          />
        )}
        {activeView === 'grounded_chat' && (
          <GroundedChatScreen
            onGoToSimulation={handleNavigateToSimulation}
            onGoToQuiz={() => setActiveView('quiz')}
            onGoToIntake={() => setActiveView('intake')}
          />
        )}
        {activeView === 'workspace' && (
          <WireframeContainer initialTab={targetSimulationTab} />
        )}
        {activeView === 'principles' && <FrameworkPrinciples />}
        {activeView === 'review' && (
          <ReviewScreen
            onGoToSimulation={handleNavigateToSimulation}
            onGoToIntake={() => setActiveView('intake')}
            onGoToSummary={() => setActiveView('summary')}
          />
        )}
        {activeView === 'session5' && (
          <Session5SummaryScreen
            onGoToIntake={() => setActiveView('intake')}
            onGoToChat={() => setActiveView('grounded_chat')}
            onGoToSnapshot={() => setIsSnapshotModalOpen(true)}
            onGoToApiKey={() => setIsApiKeyModalOpen(true)}
          />
        )}
        {activeView === 'appearance' && (
          <AppearanceSettingsScreen
            preferences={preferences}
            onUpdatePreferences={setPreferences}
            onGoToSimulation={handleNavigateToSimulation}
            onGoToQuiz={() => setActiveView('quiz')}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="mt-14 border-t border-slate-200/80 bg-white/80 backdrop-blur-sm py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Bản Khung Giao Diện Học Liệu Đầu Vào & Toán Trực Quan v.01</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-600 font-semibold text-[11px]">
            <span>📝 Ghi chép Text-First</span>
            <span>•</span>
            <span>📸 Ảnh chụp trang SGK</span>
            <span>•</span>
            <span>🔗 Link bài giảng online</span>
            <span>•</span>
            <span>📐 Mô phỏng toán học</span>
            <span>•</span>
            <span>🎴 Màn Review & Flashcards</span>
          </div>
        </div>
      </footer>

      {/* Prompt Modal (accessible anytime via button) */}
      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
      />

      {/* Appearance Modal (Chỉnh màu nền, phông chữ, tiếng) */}
      <AppearanceModal
        isOpen={isAppearanceModalOpen}
        onClose={() => setIsAppearanceModalOpen(false)}
        preferences={preferences}
        onUpdatePreferences={setPreferences}
      />

      {/* Save & Load Snapshots Modal */}
      <SaveLoadSnapshotModal
        isOpen={isSnapshotModalOpen}
        onClose={() => setIsSnapshotModalOpen(false)}
        currentSubject={activeSubject}
        currentTopic={activeTopic}
        materials={(() => {
          try {
            const raw = localStorage.getItem('toan_truc_quan_materials_v2');
            if (raw) return JSON.parse(raw);
          } catch {}
          return INITIAL_STUDY_MATERIALS;
        })()}
        reviewCards={(() => {
          try {
            const raw = localStorage.getItem('toan_truc_quan_review_cards_v1');
            if (raw) return JSON.parse(raw);
          } catch {}
          return INITIAL_REVIEW_CARDS;
        })()}
        quizQuestions={INITIAL_REVIEW_QUIZZES}
        practiceQuestions={INITIAL_PRACTICE_QUESTIONS}
      />

      {/* API Key Settings Modal (Local-Only Round 5) */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      {/* Floating Quick Appearance Button (Always visible on all screens!) */}
      {activeView !== 'appearance' && (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            onClick={() => { sound.playClick(); setActiveView('appearance'); }}
            title="Bấm để mở mục Chỉnh Giao Diện & Sáng Tối"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/30 border-2 border-amber-300 transition-all hover:scale-105 active:scale-95 cursor-pointer animate-fadeIn"
          >
            <Palette className="w-4 h-4 text-slate-950" />
            <span>🎨 Chỉnh Giao Diện & Sáng Tối</span>
          </button>
        </div>
      )}
    </div>
  );
}
