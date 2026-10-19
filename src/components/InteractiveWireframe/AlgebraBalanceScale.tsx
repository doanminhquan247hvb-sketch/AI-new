import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Scale, Sparkles, RefreshCw, CheckCircle2, ArrowRight, MinusCircle, Divide, PlusCircle, HelpCircle } from 'lucide-react';
import { sound } from '../../utils/sound';

interface EquationPreset {
  id: string;
  label: string;
  a: number;
  b: number;
  c: number;
  solution: number;
}

const PRESETS: EquationPreset[] = [
  { id: 'eq1', label: '2x + 4 = 10 (Cơ bản)', a: 2, b: 4, c: 10, solution: 3 },
  { id: 'eq2', label: '3x + 3 = 15 (Chia 3)', a: 3, b: 3, c: 15, solution: 4 },
  { id: 'eq3', label: 'x + 6 = 11 (Cộng trừ)', a: 1, b: 6, c: 11, solution: 5 },
  { id: 'eq4', label: '4x + 2 = 18 (Nâng cao)', a: 4, b: 2, c: 18, solution: 4 },
];

export const AlgebraBalanceScale: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('eq1');
  const [aCount, setACount] = useState<number>(2);
  const [bWeight, setBWeight] = useState<number>(4);
  const [cWeight, setCWeight] = useState<number>(10);
  const [guessedX, setGuessedX] = useState<number>(3);
  const [step, setStep] = useState<number>(1);
  const [historyLog, setHistoryLog] = useState<string[]>([
    'Phương trình ban đầu: 2x + 4 = 10'
  ]);

  const activePreset = PRESETS.find(p => p.id === selectedPresetId) || PRESETS[0];

  // Left total weight with guessed X
  const leftTotal = aCount * guessedX + bWeight;
  const rightTotal = cWeight;
  const difference = leftTotal - rightTotal;

  // Rotation angle of balance bar
  const tiltAngle = Math.max(-14, Math.min(14, difference * 2.5));

  const selectPreset = (p: EquationPreset) => {
    sound.playClick();
    setSelectedPresetId(p.id);
    setACount(p.a);
    setBWeight(p.b);
    setCWeight(p.c);
    setGuessedX(p.solution);
    setStep(1);
    setHistoryLog([`Phương trình ban đầu: ${p.a > 1 ? `${p.a}x` : 'x'} + ${p.b} = ${p.c}`]);
  };

  const handleStepSubtract = () => {
    if (bWeight > 0) {
      sound.playSuccess();
      const sub = bWeight;
      setBWeight(0);
      setCWeight(prev => Math.max(0, prev - sub));
      setStep(2);
      setHistoryLog(prev => [
        ...prev,
        `Trừ ${sub} ở cả hai đĩa cân ➔ ${aCount > 1 ? `${aCount}x` : 'x'} = ${cWeight - sub}`
      ]);
    }
  };

  const handleStepDivide = () => {
    if (aCount > 1) {
      sound.playSuccess();
      const div = aCount;
      setCWeight(prev => prev / div);
      setACount(1);
      setStep(3);
      setHistoryLog(prev => [
        ...prev,
        `Chia ${div} ở cả hai đĩa cân ➔ x = ${(cWeight / div).toFixed(0)}`
      ]);
    }
  };

  const resetEquation = () => {
    sound.playClick();
    selectPreset(activePreset);
  };

  return (
    <div id="algebra-balance-card" className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-7 shadow-xs relative overflow-hidden">
      {/* Background soft glow accent */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-100/80 text-violet-900 border border-violet-200/60 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-violet-600" />
              Module 2 • Phương Trình & Bản Chất Dấu Bằng (=)
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Cân đòn thăng bằng tư duy</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-1.5 tracking-tight">
            Giải Phương Trình Bằng Cân Thăng Bằng (Không Cần Học Vẹt)
          </h3>
        </div>

        {/* Current Equation Display */}
        <div className="flex items-center gap-2.5 bg-slate-900 text-white px-4 py-2 rounded-2xl shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Trạng thái:</span>
          <span className="font-mono text-base font-black text-amber-300">
            {aCount > 1 ? `${aCount}x` : 'x'} {bWeight > 0 ? `+ ${bWeight}` : ''} = {cWeight}
          </span>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2 mt-4 pt-1">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-violet-500" />
          Bài toán mẫu:
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => selectPreset(p)}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              selectedPresetId === p.id
                ? 'bg-violet-600 text-white border-violet-700 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left: SVG Balance Scale View */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-2xl relative overflow-hidden min-h-[360px] shadow-inner">
          {/* Status Indicator on top */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors ${
                difference === 0
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              {difference === 0 ? 'Cân đang thăng bằng tuyệt đối (=)' : 'Cân đang bị lệch (Chưa bằng nhau)'}
            </span>
          </div>

          {/* Balance Scale SVG */}
          <div className="relative w-full max-w-md h-64 flex items-center justify-center pt-8">
            <svg width="360" height="220" viewBox="0 0 360 220" className="overflow-visible select-none">
              {/* Central Pillar Base */}
              <polygon points="170,200 190,200 183,70 177,70" fill="#475569" />
              <rect x="135" y="200" width="90" height="14" rx="4" fill="#334155" />
              
              {/* Central Pivot Dial (Center Meter) */}
              <circle cx="180" cy="70" r="16" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
              
              {/* Dial Meter Tick Marks */}
              <line x1="180" y1="58" x2="180" y2="62" stroke="#10b981" strokeWidth="2" />
              <line x1="172" y1="60" x2="174" y2="64" stroke="#94a3b8" strokeWidth="1" />
              <line x1="188" y1="60" x2="186" y2="64" stroke="#94a3b8" strokeWidth="1" />

              {/* Central Needle pointing up (opposes tilt) */}
              <line
                x1="180"
                y1="70"
                x2="180"
                y2="57"
                stroke={difference === 0 ? '#10b981' : '#f59e0b'}
                strokeWidth="2.5"
                transform={`rotate(${-tiltAngle * 1.5} 180 70)`}
                style={{ transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              />

              {/* Tilting Beam Group */}
              <g transform={`rotate(${tiltAngle} 180 70)`} style={{ transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                {/* Horizontal Beam */}
                <rect x="25" y="66" width="310" height="8" rx="4" fill="#94a3b8" />
                <circle cx="45" cy="70" r="5" fill="#f59e0b" />
                <circle cx="315" cy="70" r="5" fill="#f59e0b" />

                {/* Left Pan Chains & Plate (X = 45) */}
                <line x1="45" y1="70" x2="15" y2="140" stroke="#64748b" strokeWidth="1.5" />
                <line x1="45" y1="70" x2="75" y2="140" stroke="#64748b" strokeWidth="1.5" />
                <ellipse cx="45" cy="140" rx="38" ry="7" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />

                {/* Left Pan Contents: Mystery X boxes + weight coins */}
                <g transform="translate(10, 98)">
                  {/* Mystery X boxes */}
                  {Array.from({ length: aCount }).map((_, i) => (
                    <g key={`box-x-${i}`} transform={`translate(${i * 24 + (aCount === 1 ? 16 : 0)}, 10)`}>
                      <rect width="22" height="26" rx="4" fill="#6366f1" stroke="#4338ca" strokeWidth="1.5" />
                      <text x="11" y="17" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">x</text>
                    </g>
                  ))}

                  {/* Single unit weights on left */}
                  {Array.from({ length: Math.min(bWeight, 8) }).map((_, i) => (
                    <circle
                      key={`unit-left-${i}`}
                      cx={8 + (i % 4) * 14}
                      cy={-2 - Math.floor(i / 4) * 12}
                      r="6"
                      fill="#f59e0b"
                      stroke="#b45309"
                      strokeWidth="1"
                    />
                  ))}
                  {bWeight > 8 && (
                    <text x="24" y="-12" fill="#fcd34d" fontSize="10" fontWeight="bold">+{bWeight - 8}</text>
                  )}
                </g>

                {/* Right Pan Chains & Plate (X = 315) */}
                <line x1="315" y1="70" x2="285" y2="140" stroke="#64748b" strokeWidth="1.5" />
                <line x1="315" y1="70" x2="345" y2="140" stroke="#64748b" strokeWidth="1.5" />
                <ellipse cx="315" cy="140" rx="38" ry="7" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />

                {/* Right Pan Contents: Unit weights */}
                <g transform="translate(285, 110)">
                  {Array.from({ length: Math.min(cWeight, 12) }).map((_, i) => (
                    <circle
                      key={`unit-right-${i}`}
                      cx={8 + (i % 4) * 14}
                      cy={18 - Math.floor(i / 4) * 14}
                      r="6"
                      fill="#f59e0b"
                      stroke="#b45309"
                      strokeWidth="1"
                    />
                  ))}
                  {cWeight > 12 && (
                    <text x="32" y="-10" fill="#fcd34d" fontSize="10" fontWeight="bold">+{cWeight - 12}</text>
                  )}
                </g>
              </g>
            </svg>
          </div>

          {/* Weight Breakdown Cards below canvas */}
          <div className="flex items-center justify-between w-full max-w-sm mt-3 text-xs text-slate-300">
            <div className="text-center bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-medium">Vế trái (Đĩa trái)</span>
              <span className="font-mono font-bold text-indigo-300">{leftTotal} đơn vị</span>
            </div>
            <div className="text-center font-black text-slate-400 text-lg px-2">
              {difference === 0 ? '=' : difference > 0 ? '>' : '<'}
            </div>
            <div className="text-center bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-medium">Vế phải (Đĩa phải)</span>
              <span className="font-mono font-bold text-amber-300">{rightTotal} đơn vị</span>
            </div>
          </div>
        </div>

        {/* Right: Interactive Step-by-Step Ledger & Solution */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Step Action Buttons */}
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>Thao Tác Từng Bước (Luôn Cân Bằng)</span>
              <span className="text-[11px] font-normal text-slate-500">Bước {step}/3</span>
            </span>

            {/* Step 1 button */}
            <div className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
              bWeight > 0 ? 'bg-white border-amber-300 shadow-2xs' : 'bg-slate-100 border-slate-200 opacity-70'
            }`}>
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">Bước 1: Bỏ số lẻ ở cả hai đĩa</span>
                <span className="text-[11px] text-slate-500">
                  {bWeight > 0 ? `Bỏ bớt ${bWeight} quả cân ở mỗi bên` : 'Đã bỏ hết số lẻ tự do'}
                </span>
              </div>
              <button
                disabled={bWeight === 0}
                onClick={handleStepSubtract}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  bWeight > 0
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                - {bWeight > 0 ? bWeight : 0} cả 2 vế
              </button>
            </div>

            {/* Step 2 button */}
            <div className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
              bWeight === 0 && aCount > 1 ? 'bg-white border-indigo-300 shadow-2xs' : 'bg-slate-100 border-slate-200 opacity-70'
            }`}>
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">Bước 2: Chia đều cho số hộp x</span>
                <span className="text-[11px] text-slate-500">
                  {aCount > 1 ? `Chia cả 2 đĩa làm ${aCount} phần để tìm 1 hộp x` : 'Đã tìm được giá trị 1 hộp x!'}
                </span>
              </div>
              <button
                disabled={bWeight > 0 || aCount === 1}
                onClick={handleStepDivide}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  bWeight === 0 && aCount > 1
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                : {aCount} cả 2 vế
              </button>
            </div>

            <button
              onClick={resetEquation}
              className="w-full py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 border border-dashed border-slate-300 rounded-xl hover:bg-white cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Đặt lại phương trình ban đầu</span>
            </button>
          </div>

          {/* Real-time Guess Slider */}
          <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200/80">
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="guess-x-slider-v2" className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Kéo thử trọng lượng hộp bí ẩn x:
              </label>
              <span className="font-mono font-black text-base text-indigo-700 bg-white px-3 py-0.5 rounded-lg border border-indigo-200 shadow-2xs">
                x = {guessedX}
              </span>
            </div>
            <input
              id="guess-x-slider-v2"
              type="range"
              min="0"
              max="8"
              step="1"
              value={guessedX}
              onChange={(e) => {
                sound.playPop(300 + Number(e.target.value) * 50);
                setGuessedX(Number(e.target.value));
              }}
              className="w-full accent-indigo-600 h-2.5 bg-indigo-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-indigo-600 mt-1 font-medium">
              <span>x = 0</span>
              <span className="font-bold">x = {activePreset.solution} (Nghiệm đúng)</span>
              <span>x = 8</span>
            </div>
          </div>

          {/* Mathematical Transformation History */}
          <div className="p-3.5 bg-slate-100/90 rounded-2xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-800 block mb-1.5">Nhật ký biến đổi tương đương:</span>
            <div className="space-y-1 font-mono text-[11px] text-slate-600">
              {historyLog.map((log, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-indigo-600 font-bold">⇔</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
