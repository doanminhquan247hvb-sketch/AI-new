import React, { useState, useEffect } from 'react';
import {
  X,
  Palette,
  Type,
  Volume2,
  VolumeX,
  Sparkles,
  Check,
  RotateCcw,
  Sun,
  Moon,
  BookOpen,
  Sliders,
  Play,
  Monitor,
} from 'lucide-react';
import { sound, SoundTheme } from '../utils/sound';

export type ColorMode = 'light' | 'dark' | 'system';
export type AppBgTheme = 'default' | 'cream' | 'chalkboard' | 'midnight' | 'sky' | 'pure_white' | 'oled_black';
export type AppFontFamily = 'plus_jakarta' | 'be_vietnam' | 'quicksand' | 'space_grotesk' | 'merriweather';
export type AppFontSize = 'normal' | 'large' | 'xlarge';

export interface AppearancePreferences {
  colorMode: ColorMode; // 'light' | 'dark' | 'system'
  brightness: number; // 70 to 130 (%)
  contrast: 'normal' | 'high';
  bgTheme: AppBgTheme;
  fontFamily: AppFontFamily;
  fontSize: AppFontSize;
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  soundTheme: SoundTheme;
}

export const DEFAULT_APPEARANCE: AppearancePreferences = {
  colorMode: 'light',
  brightness: 100,
  contrast: 'normal',
  bgTheme: 'default',
  fontFamily: 'plus_jakarta',
  fontSize: 'normal',
  soundEnabled: true,
  soundVolume: 0.6,
  soundTheme: 'standard',
};

const STORAGE_KEY = 'toan_truc_quan_appearance_preferences_v1';

export function getStoredAppearance(): AppearancePreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_APPEARANCE, ...parsed };
    }
  } catch {}
  return DEFAULT_APPEARANCE;
}

export function saveStoredAppearance(pref: AppearancePreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pref));
  } catch {}
}

interface AppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: AppearancePreferences;
  onUpdatePreferences: (pref: AppearancePreferences) => void;
}

export const AppearanceModal: React.FC<AppearanceModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
}) => {
  const [activeTab, setActiveTab] = useState<'bg' | 'font' | 'sound'>('bg');

  if (!isOpen) return null;

  const handleUpdate = (partial: Partial<AppearancePreferences>) => {
    sound.playClick();
    const next = { ...preferences, ...partial };
    onUpdatePreferences(next);
    saveStoredAppearance(next);

    // Sync sound engine
    if (partial.soundEnabled !== undefined) {
      sound.setEnabled(partial.soundEnabled);
    }
    if (partial.soundVolume !== undefined) {
      sound.setVolume(partial.soundVolume);
    }
    if (partial.soundTheme !== undefined) {
      sound.setTheme(partial.soundTheme);
    }
  };

  const handleReset = () => {
    sound.playPop();
    onUpdatePreferences(DEFAULT_APPEARANCE);
    saveStoredAppearance(DEFAULT_APPEARANCE);
    sound.setEnabled(DEFAULT_APPEARANCE.soundEnabled);
    sound.setVolume(DEFAULT_APPEARANCE.soundVolume);
    sound.setTheme(DEFAULT_APPEARANCE.soundTheme);
  };

  const themeOptions: {
    id: AppBgTheme;
    name: string;
    desc: string;
    previewBg: string;
    textColor: string;
    badge: string;
  }[] = [
    {
      id: 'default',
      name: 'Xám Nhạt Thanh Lịch',
      desc: 'Mặc định sáng sủa, thanh thoát, hài hòa mắt nhìn',
      previewBg: 'bg-slate-100',
      textColor: 'text-slate-900',
      badge: 'Mặc định',
    },
    {
      id: 'cream',
      name: 'Giấy Vở Ô Ly (Vàng Kem)',
      desc: 'Ấm áp, dịu mắt như trang giấy tập học trò',
      previewBg: 'bg-[#fbf7ee] border-amber-200',
      textColor: 'text-amber-950',
      badge: 'Dịu mắt',
    },
    {
      id: 'chalkboard',
      name: 'Bảng Phấn Xanh Trường Học',
      desc: 'Tông xanh đen bảng từ trường học truyền thống',
      previewBg: 'bg-[#15231e] border-emerald-900',
      textColor: 'text-emerald-100',
      badge: 'Bảng phấn',
    },
    {
      id: 'midnight',
      name: 'Đêm Dịu Mắt (Midnight Indigo)',
      desc: 'Bảo vệ thị lực khi học bài buổi tối muộn',
      previewBg: 'bg-[#0f172a] border-slate-700',
      textColor: 'text-slate-100',
      badge: 'Ban đêm',
    },
    {
      id: 'sky',
      name: 'Thiên Thanh Mát Mẻ (Sky Soft)',
      desc: 'Xanh da trời mát lành tạo cảm hứng học toán',
      previewBg: 'bg-[#f0f9ff] border-sky-200',
      textColor: 'text-sky-950',
      badge: 'Tươi mới',
    },
    {
      id: 'pure_white',
      name: 'Trắng Sáng Tinh Khiết',
      desc: 'Nền trắng thuần khiết, độ tương phản cao nhất',
      previewBg: 'bg-white border-slate-300',
      textColor: 'text-slate-900',
      badge: 'Tương phản',
    },
  ];

  const fontOptions: {
    id: AppFontFamily;
    name: string;
    desc: string;
    fontFamilyCSS: string;
  }[] = [
    {
      id: 'plus_jakarta',
      name: 'Plus Jakarta Sans',
      desc: 'Hình học hiện đại, rõ ràng, phong cách công nghệ',
      fontFamilyCSS: "'Plus Jakarta Sans', sans-serif",
    },
    {
      id: 'be_vietnam',
      name: 'Be Vietnam Pro',
      desc: 'Thiết kế tối ưu cho tiếng Việt, tròn mềm và dễ đọc',
      fontFamilyCSS: "'Be Vietnam Pro', sans-serif",
    },
    {
      id: 'quicksand',
      name: 'Quicksand',
      desc: 'Phông nét tròn thân thiện, giảm bớt căng thẳng khi học',
      fontFamilyCSS: "'Quicksand', sans-serif",
    },
    {
      id: 'space_grotesk',
      name: 'Space Grotesk',
      desc: 'Phong cách số học & kỹ thuật số độc đáo',
      fontFamilyCSS: "'Space Grotesk', sans-serif",
    },
    {
      id: 'merriweather',
      name: 'Merriweather (Chữ có chân)',
      desc: 'Kiểu chữ sách giáo khoa truyền thống, trang nghiêm',
      fontFamilyCSS: "'Merriweather', serif",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-200/90 shadow-2xl p-5 sm:p-6 space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                Tùy Chỉnh Giao Diện & Âm Thanh
              </h2>
              <p className="text-xs text-slate-500">
                Cá nhân hóa màu nền, phông chữ và âm thanh theo ý thích của em
              </p>
            </div>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => { sound.playClick(); setActiveTab('bg'); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bg'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Màu Nền</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('font'); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'font'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Phông Chữ</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('sound'); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sound'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Âm Thanh</span>
          </button>
        </div>

        {/* TAB 1: MÀU NỀN & THEME */}
        {activeTab === 'bg' && (
          <div className="space-y-3 animate-fadeIn">
            <label className="block text-xs font-bold text-slate-600">
              Chọn màu nền học tập phù hợp với mắt của em:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {themeOptions.map((t) => {
                const isSelected = preferences.bgTheme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleUpdate({ bgTheme: t.id })}
                    className={`p-3.5 rounded-2xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs ${t.previewBg}`}
                    >
                      {isSelected ? (
                        <Check className={`w-4 h-4 ${t.id === 'chalkboard' || t.id === 'midnight' ? 'text-white' : 'text-indigo-600'}`} />
                      ) : (
                        <span className="text-xs font-black opacity-60">Aa</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-xs text-slate-900 truncate">
                          {t.name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0">
                          {t.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-1">
                        {t.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: PHÔNG CHỮ & CỠ CHỮ */}
        {activeTab === 'font' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Font Family list */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600">
                Kiểu phông chữ hiển thị:
              </label>
              <div className="space-y-2">
                {fontOptions.map((f) => {
                  const isSelected = preferences.fontFamily === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => handleUpdate({ fontFamily: f.id })}
                      className={`w-full p-3 rounded-2xl border-2 text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-extrabold text-sm text-slate-900"
                            style={{ fontFamily: f.fontFamilyCSS }}
                          >
                            {f.name}
                          </span>
                          {f.id === 'be_vietnam' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                              Khuyên dùng Tiếng Việt
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {f.desc}
                        </p>
                      </div>

                      <div
                        className="text-base font-black px-3 py-1 rounded-xl bg-slate-100 text-slate-700 shrink-0"
                        style={{ fontFamily: f.fontFamilyCSS }}
                      >
                        ABC 123
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Size adjustment */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-bold text-slate-600">
                Kích thước chữ (Cỡ chữ):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'normal', label: 'Vừa Vặn', scale: '100%' },
                  { id: 'large', label: 'Chữ Lớn', scale: '+15%' },
                  { id: 'xlarge', label: 'Rất Lớn', scale: '+30%' },
                ].map((s) => {
                  const isSelected = preferences.fontSize === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleUpdate({ fontSize: s.id as AppFontSize })}
                      className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-black ring-1 ring-indigo-500'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold'
                      }`}
                    >
                      <span className="text-xs block">{s.label}</span>
                      <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
                        {s.scale}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TIẾNG / ÂM THANH */}
        {activeTab === 'sound' && (
          <div className="space-y-4 animate-fadeIn text-xs">
            {/* Master toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                    preferences.soundEnabled
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {preferences.soundEnabled ? (
                    <Volume2 className="w-5 h-5" />
                  ) : (
                    <VolumeX className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 block text-sm">
                    Âm thanh tương tác
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Hiệu ứng âm thanh khi bấm nút, lật flashcard, trả lời đúng/sai
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleUpdate({ soundEnabled: !preferences.soundEnabled })}
                className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
                  preferences.soundEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                    preferences.soundEnabled ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Volume slider */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-800">
                  Âm lượng ({Math.round(preferences.soundVolume * 100)}%):
                </span>
                <button
                  type="button"
                  onClick={() => sound.playSuccess()}
                  disabled={!preferences.soundEnabled}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200 cursor-pointer disabled:opacity-40"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Nghe thử</span>
                </button>
              </div>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={preferences.soundVolume}
                disabled={!preferences.soundEnabled}
                onChange={(e) => handleUpdate({ soundVolume: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer disabled:opacity-40"
              />
            </div>

            {/* Sound Style Theme */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-600">
                Kiểu âm thanh hiệu ứng:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'standard', name: 'Hiện đại (Chuẩn)', desc: 'Trong trẻo, thanh lịch' },
                  { id: 'playful', name: 'Vui nhộn', desc: 'Cao vui tươi, bắt tai' },
                  { id: 'minimal', name: 'Tối giản', desc: 'Nhẹ nhàng, êm dịu' },
                ].map((thm) => {
                  const isSelected = preferences.soundTheme === thm.id;
                  return (
                    <button
                      key={thm.id}
                      onClick={() => {
                        handleUpdate({ soundTheme: thm.id as SoundTheme });
                        setTimeout(() => sound.playSuccess(), 50);
                      }}
                      className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-black ring-1 ring-indigo-500'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold'
                      }`}
                    >
                      <span className="block">{thm.name}</span>
                      <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
                        {thm.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick sound test triggers */}
            <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-2">
              <span className="font-extrabold text-slate-700 block text-[11px] uppercase tracking-wider">
                Thử nghiệm các hiệu ứng âm thanh:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => sound.playSuccess()}
                  disabled={!preferences.soundEnabled}
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs border border-emerald-200 cursor-pointer disabled:opacity-40"
                >
                  🎉 Thành công (Đúng)
                </button>
                <button
                  type="button"
                  onClick={() => sound.playError()}
                  disabled={!preferences.soundEnabled}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg font-bold text-xs border border-rose-200 cursor-pointer disabled:opacity-40"
                >
                  ❌ Thử lại (Sai)
                </button>
                <button
                  type="button"
                  onClick={() => sound.playFlip()}
                  disabled={!preferences.soundEnabled}
                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-lg font-bold text-xs border border-indigo-200 cursor-pointer disabled:opacity-40"
                >
                  🎴 Lật thẻ Flashcard
                </button>
                <button
                  type="button"
                  onClick={() => sound.playPop()}
                  disabled={!preferences.soundEnabled}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-bold text-xs border border-amber-200 cursor-pointer disabled:opacity-40"
                >
                  ✨ Tiếng Pop
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-bold transition-all cursor-pointer rounded-xl hover:bg-slate-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mặc định ban đầu</span>
          </button>

          <button
            type="button"
            onClick={() => { sound.playClick(); onClose(); }}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md shadow-indigo-600/20"
          >
            Hoàn Tất
          </button>
        </div>
      </div>
    </div>
  );
};
