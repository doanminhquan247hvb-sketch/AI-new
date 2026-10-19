import React, { useState } from 'react';
import { MATH_CHEAT_SHEET } from '../../data/defaultReviewData';
import {
  PieChart,
  Scale,
  TrendingUp,
  Triangle,
  PlayCircle,
  Copy,
  Check,
  Search,
  AlertTriangle,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface CheatSheetReviewProps {
  onGoToSimulation?: (simulationTab?: string) => void;
}

export const CheatSheetReview: React.FC<CheatSheetReviewProps> = ({ onGoToSimulation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedTopic, setCopiedTopic] = useState<string | null>(null);

  const filteredSheets = MATH_CHEAT_SHEET.filter(
    (sheet) =>
      sheet.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheet.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheet.coreFormula.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyFormula = (topic: string, formula: string) => {
    sound.playClick();
    navigator.clipboard.writeText(formula);
    setCopiedTopic(topic);
    setTimeout(() => setCopiedTopic(null), 1800);
  };

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'PieChart':
        return <PieChart className="w-5 h-5 text-amber-500" />;
      case 'Scale':
        return <Scale className="w-5 h-5 text-violet-500" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-indigo-500" />;
      case 'Triangle':
      default:
        return <Triangle className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Search & Header bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h3 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Sổ Tay Công Thức & Bản Chất Trực Quan</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng hợp quy tắc vàng, trực giác tư duy và bẫy sai lầm cần tránh khi làm bài thi
          </p>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo chủ đề, công thức..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSheets.map((sheet, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200/70 shadow-2xs">
                    {getTopicIcon(sheet.icon)}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900">{sheet.topic}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{sheet.summary}</p>
                  </div>
                </div>
              </div>

              {/* Core Formula Box with Copy */}
              <div className="bg-slate-900 text-white p-3.5 rounded-2xl my-3 relative group">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-indigo-300 mb-1">
                  <span>CÔNG THỨC VÀNG</span>
                  <button
                    onClick={() => handleCopyFormula(sheet.topic, sheet.coreFormula)}
                    className="flex items-center gap-1 text-[10px] text-slate-300 hover:text-white bg-slate-800 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                  >
                    {copiedTopic === sheet.topic ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>
                <code className="text-xs sm:text-sm font-mono font-bold text-emerald-300 block overflow-x-auto whitespace-pre-wrap">
                  {sheet.coreFormula}
                </code>
              </div>

              {/* Pedagogical Intuition */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-2xl text-xs text-amber-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>Trực giác bản chất (CPA):</span>
                </div>
                <p className="leading-relaxed text-amber-900">{sheet.intuition}</p>
              </div>

              {/* Trap Avoidance */}
              <div className="mt-2.5 p-3 bg-rose-50/70 border border-rose-200/60 rounded-2xl text-xs text-rose-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-rose-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Bẫy đề thi cần tránh:</span>
                </div>
                <p className="leading-relaxed text-rose-900">{sheet.trapAvoidance}</p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">Học trực quan 4 khối</span>
              {onGoToSimulation && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onGoToSimulation(sheet.simulationTab);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 rounded-xl text-xs font-black transition-all cursor-pointer shadow-2xs"
                >
                  <PlayCircle className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Mô Phỏng Trực Quan</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
