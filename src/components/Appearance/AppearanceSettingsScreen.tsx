import React from 'react';
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  Type,
  Volume2,
  VolumeX,
  Sparkles,
  Check,
  RotateCcw,
  Sliders,
  Play,
  Eye,
  CheckCircle2,
  HelpCircle,
  Calculator,
  Compass,
} from 'lucide-react';
import {
  AppearancePreferences,
  AppBgTheme,
  AppFontFamily,
  AppFontSize,
  ColorMode,
  DEFAULT_APPEARANCE,
  saveStoredAppearance,
} from '../AppearanceModal';
import { sound, SoundTheme } from '../../utils/sound';

interface AppearanceSettingsScreenProps {
  preferences: AppearancePreferences;
  onUpdatePreferences: (pref: AppearancePreferences) => void;
  onGoToSimulation?: (topicName?: string) => void;
  onGoToQuiz?: () => void;
}

export const AppearanceSettingsScreen: React.FC<AppearanceSettingsScreenProps> = ({
  preferences,
  onUpdatePreferences,
  onGoToSimulation,
  onGoToQuiz,
}) => {
  const handleUpdate = (partial: Partial<AppearancePreferences>) => {
    sound.playClick();
    const next = { ...preferences, ...partial };
    onUpdatePreferences(next);
    saveStoredAppearance(next);

    // Sync sound engine if changed
    if (partial.soundEnabled !== undefined) sound.setEnabled(partial.soundEnabled);
    if (partial.soundVolume !== undefined) sound.setVolume(partial.soundVolume);
    if (partial.soundTheme !== undefined) sound.setTheme(partial.soundTheme);
  };

  const handleResetToDefault = () => {
    sound.playPop();
    onUpdatePreferences(DEFAULT_APPEARANCE);
    saveStoredAppearance(DEFAULT_APPEARANCE);
    sound.setEnabled(DEFAULT_APPEARANCE.soundEnabled);
    sound.setVolume(DEFAULT_APPEARANCE.soundVolume);
    sound.setTheme(DEFAULT_APPEARANCE.soundTheme);
  };

  // Switch Color Mode (Light / Dark / System)
  const handleSetColorMode = (mode: ColorMode) => {
    sound.playClick();
    let targetBg = preferences.bgTheme;
    if (mode === 'dark' && (targetBg === 'default' || targetBg === 'cream' || targetBg === 'sky' || targetBg === 'pure_white')) {
      targetBg = 'midnight';
    } else if (mode === 'light' && (targetBg === 'midnight' || targetBg === 'chalkboard' || targetBg === 'oled_black')) {
      targetBg = 'default';
    }

    handleUpdate({
      colorMode: mode,
      bgTheme: targetBg,
    });
  };

  // Themes list
  const lightThemes: {
    id: AppBgTheme;
    name: string;
    desc: string;
    previewBg: string;
    border: string;
    textColor: string;
  }[] = [
    {
      id: 'default',
      name: 'Xám Nhạt Thanh Lịch',
      desc: 'Mặc định sáng sủa, thanh thoát, hài hòa mắt nhìn',
      previewBg: 'bg-slate-100',
      border: 'border-slate-300',
      textColor: 'text-slate-900',
    },
    {
      id: 'cream',
      name: 'Giấy Vở Ô Ly (Vàng Kem)',
      desc: 'Ấm áp, dịu mắt như trang giấy tập học sinh',
      previewBg: 'bg-[#fbf7ee]',
      border: 'border-amber-200',
      textColor: 'text-amber-950',
    },
    {
      id: 'sky',
      name: 'Thiên Thanh Dịu Mát',
      desc: 'Xanh da trời mát lành tạo cảm hứng học toán',
      previewBg: 'bg-[#f0f9ff]',
      border: 'border-sky-200',
      textColor: 'text-sky-950',
    },
    {
      id: 'pure_white',
      name: 'Trắng Sáng Tinh Khiết',
      desc: 'Nền trắng thuần khiết, độ tương phản cao',
      previewBg: 'bg-white',
      border: 'border-slate-300',
      textColor: 'text-slate-900',
    },
  ];

  const darkThemes: {
    id: AppBgTheme;
    name: string;
    desc: string;
    previewBg: string;
    border: string;
    textColor: string;
  }[] = [
    {
      id: 'midnight',
      name: 'Đêm Dịu Mắt (Midnight Indigo)',
      desc: 'Bảo vệ thị lực tối đa khi học bài lúc tối muộn',
      previewBg: 'bg-[#0f172a]',
      border: 'border-indigo-900',
      textColor: 'text-slate-100',
    },
    {
      id: 'chalkboard',
      name: 'Bảng Phấn Xanh Trường Học',
      desc: 'Tông xanh đen bảng từ trường học truyền thống',
      previewBg: 'bg-[#15231e]',
      border: 'border-emerald-900',
      textColor: 'text-emerald-100',
    },
    {
      id: 'oled_black',
      name: 'Đen Tuyền Tuyệt Đối (OLED)',
      desc: 'Đen sâu 100%, tiết kiệm pin và chống lóa',
      previewBg: 'bg-black',
      border: 'border-slate-800',
      textColor: 'text-slate-100',
    },
  ];

  const fontOptions: {
    id: AppFontFamily;
    name: string;
    desc: string;
    badge?: string;
    fontFamilyCSS: string;
  }[] = [
    {
      id: 'be_vietnam',
      name: 'Be Vietnam Pro',
      desc: 'Thiết kế tối ưu cho tiếng Việt, nét chữ tròn mềm và dễ đọc',
      badge: 'Khuyên dùng Tiếng Việt',
      fontFamilyCSS: "'Be Vietnam Pro', sans-serif",
    },
    {
      id: 'quicksand',
      name: 'Quicksand',
      desc: 'Phông nét tròn thân thiện, trẻ trung, giảm áp lực khi học toán',
      badge: 'Thân thiện',
      fontFamilyCSS: "'Quicksand', sans-serif",
    },
    {
      id: 'plus_jakarta',
      name: 'Plus Jakarta Sans',
      desc: 'Hình học hiện đại, rõ ràng, phong cách công nghệ (Mặc định)',
      fontFamilyCSS: "'Plus Jakarta Sans', sans-serif",
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Header Bar */}
      <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Cài Đặt Giao Diện & Chế Độ Sáng Tối
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Lưu Tự Động
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tùy biến màu nền, phông chữ, chế độ sáng/tối và âm thanh để học tập thoải mái nhất
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetToDefault}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-slate-900 text-xs font-bold bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer self-start sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Khôi phục mặc định</span>
        </button>
      </div>

      {/* 2. CHỈNH SÁNG TỐI (LIGHT / DARK MODE) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Sun className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              1. Chế Độ Sáng Tối (Color Mode)
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Đang chọn:{' '}
            <strong className="text-indigo-600">
              {preferences.colorMode === 'dark'
                ? 'Chế độ Tối 🌙'
                : preferences.colorMode === 'system'
                ? 'Theo hệ thống 💻'
                : 'Chế độ Sáng ☀️'}
            </strong>
          </span>
        </div>

        {/* 3 Mode Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Light Mode */}
          <button
            type="button"
            onClick={() => handleSetColorMode('light')}
            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              preferences.colorMode === 'light'
                ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              {preferences.colorMode === 'light' && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">
                  <Check className="w-3 h-3 stroke-3" />
                </span>
              )}
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-900 block">
                Chế Độ Sáng (Light)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Sáng sủa, chữ đen trên nền sáng, tối ưu khi học bài ban ngày
              </p>
            </div>
          </button>

          {/* Dark Mode */}
          <button
            type="button"
            onClick={() => handleSetColorMode('dark')}
            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              preferences.colorMode === 'dark'
                ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-indigo-300 flex items-center justify-center">
                <Moon className="w-5 h-5" />
              </div>
              {preferences.colorMode === 'dark' && (
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                  <Check className="w-3 h-3 stroke-3" />
                </span>
              )}
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-900 block">
                Chế Độ Tối (Dark)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Nền đen trầm, giảm ánh sáng chói, êm mắt khi học bài ban đêm
              </p>
            </div>
          </button>

          {/* System Mode */}
          <button
            type="button"
            onClick={() => handleSetColorMode('system')}
            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              preferences.colorMode === 'system'
                ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <Monitor className="w-5 h-5" />
              </div>
              {preferences.colorMode === 'system' && (
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">
                  <Check className="w-3 h-3 stroke-3" />
                </span>
              )}
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-900 block">
                Theo Hệ Thống (Auto)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Tự động chuyển sáng/tối theo cài đặt của máy tính hoặc điện thoại
              </p>
            </div>
          </button>
        </div>

        {/* Brightness Adjustment Slider */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-bold text-slate-800">
                Độ Sáng Màn Hình Học Tập ({preferences.brightness || 100}%):
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleUpdate({ brightness: Math.max(70, (preferences.brightness || 100) - 10) })}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] rounded-lg border border-slate-200 cursor-pointer"
              >
                Tối hơn (-10%)
              </button>
              <button
                type="button"
                onClick={() => handleUpdate({ brightness: 100 })}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] rounded-lg border border-slate-200 cursor-pointer"
              >
                Chuẩn 100%
              </button>
              <button
                type="button"
                onClick={() => handleUpdate({ brightness: Math.min(130, (preferences.brightness || 100) + 10) })}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] rounded-lg border border-slate-200 cursor-pointer"
              >
                Sáng hơn (+10%)
              </button>
            </div>
          </div>

          <input
            type="range"
            min="70"
            max="130"
            step="5"
            value={preferences.brightness || 100}
            onChange={(e) => handleUpdate({ brightness: parseInt(e.target.value) })}
            className="w-full accent-indigo-600 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] font-semibold text-slate-400">
            <span>70% (Dịu tối ban đêm)</span>
            <span>100% (Tiêu chuẩn đề xuất)</span>
            <span>130% (Sáng rõ nơi nhiều nắng)</span>
          </div>
        </div>
      </div>

      {/* 3. BẢNG CHỌN MÀU NỀN HỌC TẬP (BACKGROUND THEMES) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Palette className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              2. Bảng Màu Nền Học Toán
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Chọn tông màu dễ chịu nhất cho mắt
          </span>
        </div>

        {/* Light themes */}
        <div className="space-y-2">
          <span className="text-xs font-extrabold text-slate-600 block">
            ☀️ Tông Sáng (Phù hợp ban ngày):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {lightThemes.map((t) => {
              const isSelected = preferences.bgTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleUpdate({ bgTheme: t.id, colorMode: 'light' })}
                  className={`p-3 rounded-2xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs ${t.previewBg} ${t.border}`}
                  >
                    {isSelected ? (
                      <Check className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <span className="text-xs font-black opacity-60">Aa</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="font-extrabold text-xs text-slate-900 block truncate">
                      {t.name}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-1">
                      {t.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dark themes */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-extrabold text-slate-600 block">
            🌙 Tông Tối (Phù hợp ban đêm, chống mỏi mắt):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {darkThemes.map((t) => {
              const isSelected = preferences.bgTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleUpdate({ bgTheme: t.id, colorMode: 'dark' })}
                  className={`p-3 rounded-2xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs ${t.previewBg} ${t.border}`}
                  >
                    {isSelected ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-xs font-black text-white/70">Aa</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="font-extrabold text-xs text-slate-900 block truncate">
                      {t.name}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-1">
                      {t.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. PHÔNG CHỮ & CỠ CHỮ */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Type className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              3. Phông Chữ & Cỡ Chữ
            </h3>
          </div>
        </div>

        {/* Font List */}
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
                    {f.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                        {f.badge}
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
                  a² + b² = c²
                </div>
              </button>
            );
          })}
        </div>

        {/* Font Size */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <label className="block text-xs font-bold text-slate-600">
            Kích thước chữ (Cỡ chữ hiển thị):
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

      {/* 5. TIẾNG & ÂM THANH */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Volume2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              4. Âm Thanh & Hiệu Ứng
            </h3>
          </div>
        </div>

        {/* Master Toggle */}
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
                Hiệu ứng khi bấm nút, lật thẻ công thức, kiểm tra câu trả lời
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

        {/* Volume slider & theme */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-800 text-xs">
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

        {/* Sound Theme */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-600">
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
                  <span className="block text-xs">{thm.name}</span>
                  <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
                    {thm.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. LIVE PREVIEW CARD */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Xem Trước Trực Quan Giao Diện Học Tập
          </h3>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
              Ví dụ: Định Lý Pytago
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Đã hiểu bài
            </span>
          </div>

          <h4 className="text-sm font-bold text-slate-900">
            Trong tam giác vuông, bình phương độ dài cạnh huyền bằng tổng bình phương độ dài hai cạnh góc vuông:
          </h4>

          <div className="p-3 bg-white rounded-xl border border-slate-200 text-center font-black text-indigo-900 text-base">
            BC² = AB² + AC² &nbsp;⟺&nbsp; c² = a² + b²
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => sound.playSuccess()}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Bấm thử hiệu ứng
            </button>

            {onGoToQuiz && (
              <button
                onClick={onGoToQuiz}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Vào làm Quiz ngay →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
