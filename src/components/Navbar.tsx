import React, { useState } from 'react';
import {
  Calculator,
  Sparkles,
  Terminal,
  Volume2,
  VolumeX,
  FolderInput,
  PlayCircle,
  BookOpen,
  GraduationCap,
  HelpCircle,
  CheckSquare,
  Palette,
  Sun,
  Moon,
  Layers,
  Bot,
  FolderOpen,
  Key,
  ChevronDown,
} from 'lucide-react';
import { sound } from '../utils/sound';

export type AppViewMode =
  | 'intake'
  | 'summary'
  | 'practice'
  | 'quiz'
  | 'flashcards'
  | 'grounded_chat'
  | 'workspace'
  | 'principles'
  | 'review'
  | 'appearance'
  | 'session5';

interface NavbarProps {
  onOpenPromptModal: () => void;
  onOpenAppearanceModal: () => void;
  onOpenSnapshotModal: () => void;
  onOpenApiKeyModal: () => void;
  activeView: AppViewMode;
  setActiveView: (view: AppViewMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  colorMode: 'light' | 'dark' | 'system';
  onToggleColorMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPromptModal,
  onOpenAppearanceModal,
  onOpenSnapshotModal,
  onOpenApiKeyModal,
  activeView,
  setActiveView,
  soundEnabled,
  onToggleSound,
  colorMode,
  onToggleColorMode,
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const isMoreActive =
    activeView === 'session5' || activeView === 'review' || activeView === 'principles';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 h-15 flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div
          className="flex items-center gap-2.5 shrink-0 cursor-pointer select-none group"
          onClick={() => {
            sound.playClick();
            setActiveView('intake');
          }}
          title="Về màn hình Nhập Học Liệu"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform">
            <Calculator className="w-5 h-5" />
          </div>
          <div className="hidden md:block">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-900 text-sm tracking-tight whitespace-nowrap">
                Toán Trực Quan
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                v.01
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Học toán dễ hiểu • Text-First</p>
          </div>
        </div>

        {/* Center: Clean & Structured Study Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 overflow-x-auto scrollbar-none max-w-full">
          {/* 1. Học Liệu */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveView('intake');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeView === 'intake'
                ? 'bg-white text-indigo-700 shadow-2xs font-black ring-1 ring-slate-900/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FolderInput
              className={`w-3.5 h-3.5 ${activeView === 'intake' ? 'text-indigo-600' : 'text-slate-400'}`}
            />
            <span>Học Liệu</span>
          </button>

          {/* 2. Tóm Tắt */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveView('summary');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeView === 'summary'
                ? 'bg-white text-purple-700 shadow-2xs font-black ring-1 ring-slate-900/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sparkles
              className={`w-3.5 h-3.5 ${activeView === 'summary' ? 'text-purple-600' : 'text-slate-400'}`}
            />
            <span>Tóm Tắt</span>
          </button>

          {/* 3. Luyện Tập */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveView('practice');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeView === 'practice'
                ? 'bg-white text-teal-700 shadow-2xs font-black ring-1 ring-slate-900/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <HelpCircle
              className={`w-3.5 h-3.5 ${activeView === 'practice' ? 'text-teal-600' : 'text-slate-400'}`}
            />
            <span>Luyện Tập</span>
          </button>

          {/* 4. Quiz */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveView('quiz');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeView === 'quiz'
                ? 'bg-white text-rose-700 shadow-2xs font-black ring-1 ring-slate-900/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <CheckSquare
              className={`w-3.5 h-3.5 ${activeView === 'quiz' ? 'text-rose-600' : 'text-slate-400'}`}
            />
            <span>Quiz</span>
          </button>

          {/* 5. Flashcard */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveView('flashcards');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeView === 'flashcards'
                ? 'bg-white text-amber-700 shadow-2xs font-black ring-1 ring-slate-900/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers
              className={`w-3.5 h-3.5 ${activeView === 'flashcards' ? 'text-amber-600' : 'text-slate-400'}`}
            />
            <span>Flashcard</span>
          </button>

          {/* 6. Chatbot Grounded */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveView('grounded_chat');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeView === 'grounded_chat'
                ? 'bg-white text-indigo-700 shadow-2xs font-black ring-1 ring-indigo-500/30'
                : 'text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/70'
            }`}
          >
            <Bot
              className={`w-3.5 h-3.5 ${activeView === 'grounded_chat' ? 'text-indigo-600' : 'text-slate-400'}`}
            />
            <span>Chatbot</span>
          </button>

          {/* 7. Mô Phỏng */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveView('workspace');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeView === 'workspace'
                ? 'bg-white text-indigo-700 shadow-2xs font-black ring-1 ring-slate-900/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <PlayCircle
              className={`w-3.5 h-3.5 ${activeView === 'workspace' ? 'text-indigo-600' : 'text-slate-400'}`}
            />
            <span>Mô Phỏng</span>
          </button>

          {/* 8. More Dropdown: Review, Tổng Kết B5, Nguyên Tắc */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick();
                setIsMoreMenuOpen(!isMoreMenuOpen);
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                isMoreActive
                  ? 'bg-indigo-600 text-white font-black shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>
                {activeView === 'session5'
                  ? '🎯 Tổng Kết B5'
                  : activeView === 'review'
                  ? '🎓 Review'
                  : activeView === 'principles'
                  ? '📘 Nguyên Tắc'
                  : 'Mở rộng'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {isMoreMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsMoreMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-40 animate-fadeIn">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveView('session5');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-bold flex items-center gap-2 hover:bg-slate-50 cursor-pointer ${
                      activeView === 'session5' ? 'text-purple-700 bg-purple-50/50' : 'text-slate-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>🎯 Tổng Kết Buổi 5</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveView('review');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-bold flex items-center gap-2 hover:bg-slate-50 cursor-pointer ${
                      activeView === 'review' ? 'text-indigo-700 bg-indigo-50/50' : 'text-slate-700'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <span>🎓 Review Ôn Tập</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveView('principles');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-bold flex items-center gap-2 hover:bg-slate-50 cursor-pointer ${
                      activeView === 'principles' ? 'text-emerald-700 bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>📘 4 Nguyên Tắc CPA</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </nav>

        {/* Right Toolbar: Essential Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Light/Dark Mode */}
          <button
            onClick={onToggleColorMode}
            title={colorMode === 'dark' ? 'Chuyển sang Chế độ Sáng' : 'Chuyển sang Chế độ Tối'}
            className="p-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
          >
            {colorMode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Bộ Ôn Tập (Snapshots Hub) */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSnapshotModal();
            }}
            title="Lưu & Mở Bộ Ôn Tập (Snapshots)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100/90 text-indigo-800 border border-indigo-200/80 transition-all cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden lg:inline">Bộ Ôn Tập</span>
          </button>

          {/* API Key Modal */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenApiKeyModal();
            }}
            title="Cài đặt Gemini API Key & Proxy"
            className="p-2 rounded-xl text-slate-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 transition-colors cursor-pointer"
          >
            <Key className="w-4 h-4 text-amber-600" />
          </button>

          {/* Giao Diện */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveView('appearance');
            }}
            title="Cài đặt giao diện & phông chữ"
            className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'appearance'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs ring-2 ring-amber-300'
                : 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80'
            }`}
          >
            <Palette className="w-4 h-4 text-amber-700" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              soundEnabled
                ? 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
                : 'text-slate-400 bg-slate-100 hover:text-slate-600'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Prompt Modal */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenPromptModal();
            }}
            title="Xem danh sách Prompt bài học"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-300" />
          </button>
        </div>
      </div>
    </header>
  );
};
