import React, { useState, useEffect } from 'react';
import { FractionVisualizer } from './FractionVisualizer';
import { LinearGraphVisualizer } from './LinearGraphVisualizer';
import { PythagorasVisualizer } from './PythagorasVisualizer';
import { AlgebraBalanceScale } from './AlgebraBalanceScale';
import { QuickQuiz } from './QuickQuiz';
import { PieChart, TrendingUp, Triangle, Scale, Eye, Sliders, FileText, CheckCircle, Sparkles, Wand2 } from 'lucide-react';
import { sound } from '../../utils/sound';

export type SimulationTab = 'fractions' | 'algebra' | 'linear' | 'pythagoras';

interface WireframeContainerProps {
  initialTab?: SimulationTab;
}

export const WireframeContainer: React.FC<WireframeContainerProps> = ({ initialTab = 'fractions' }) => {
  const [activeTab, setActiveTab] = useState<SimulationTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tab: SimulationTab) => {
    sound.playClick();
    setActiveTab(tab);
  };

  return (
    <section id="wireframe-live-demo-section" className="space-y-6">
      {/* 4-Block Concept Flow Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-sm p-4 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">
            Quy Trình Sư Phạm Bản Khung v.01
          </span>
          <span className="text-[11px] font-medium text-slate-500 hidden md:inline">
            (Học sinh tự khám phá trước khi học công thức)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100/90 rounded-xl text-slate-700">
            <Eye className="w-3.5 h-3.5 text-indigo-500" /> 1. Khởi động trực giác
          </span>
          <span className="text-slate-300">→</span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200/80 rounded-xl text-indigo-700 font-bold">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" /> 2. Kéo trượt thời gian thực
          </span>
          <span className="text-slate-300">→</span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100/90 rounded-xl text-slate-700">
            <FileText className="w-3.5 h-3.5 text-emerald-600" /> 3. Kết nối công thức
          </span>
          <span className="text-slate-300">→</span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100/90 rounded-xl text-slate-700">
            <CheckCircle className="w-3.5 h-3.5 text-amber-500" /> 4. Thử thách 10 giây
          </span>
        </div>
      </div>

      {/* Topic Switcher Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 bg-slate-200/60 p-2 rounded-2xl border border-slate-200/80 shadow-inner">
        <button
          id="tab-btn-fractions"
          onClick={() => handleTabChange('fractions')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'fractions'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 ring-2 ring-amber-300/40 translate-y-[-1px]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
          }`}
        >
          <PieChart className={`w-4 h-4 shrink-0 ${activeTab === 'fractions' ? 'text-slate-950' : 'text-amber-500'}`} />
          <span>Phân Số & Tỷ Lệ</span>
        </button>

        <button
          id="tab-btn-algebra"
          onClick={() => handleTabChange('algebra')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'algebra'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20 ring-2 ring-violet-300/40 translate-y-[-1px]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
          }`}
        >
          <Scale className={`w-4 h-4 shrink-0 ${activeTab === 'algebra' ? 'text-white' : 'text-violet-600'}`} />
          <span>Cân Thăng Bằng (x)</span>
        </button>

        <button
          id="tab-btn-linear"
          onClick={() => handleTabChange('linear')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'linear'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/20 ring-2 ring-indigo-300/40 translate-y-[-1px]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
          }`}
        >
          <TrendingUp className={`w-4 h-4 shrink-0 ${activeTab === 'linear' ? 'text-white' : 'text-indigo-500'}`} />
          <span>Đồ Thị y = ax + b</span>
        </button>

        <button
          id="tab-btn-pythagoras"
          onClick={() => handleTabChange('pythagoras')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'pythagoras'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-300/40 translate-y-[-1px]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
          }`}
        >
          <Triangle className={`w-4 h-4 shrink-0 ${activeTab === 'pythagoras' ? 'text-white' : 'text-emerald-500'}`} />
          <span>Định Lý Pytago</span>
        </button>
      </div>

      {/* Active Studio View */}
      <div className="transition-all duration-300">
        {activeTab === 'fractions' && <FractionVisualizer />}
        {activeTab === 'algebra' && <AlgebraBalanceScale />}
        {activeTab === 'linear' && <LinearGraphVisualizer />}
        {activeTab === 'pythagoras' && <PythagorasVisualizer />}
      </div>

      {/* Embedded Micro-quiz */}
      <QuickQuiz />
    </section>
  );
};
