import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, PieChart, Square, Info, RefreshCw, Layers, ArrowRight, Gauge, Check } from 'lucide-react';
import { sound } from '../../utils/sound';

export const FractionVisualizer: React.FC = () => {
  const [denominator, setDenominator] = useState<number>(4);
  const [numerator, setNumerator] = useState<number>(3);
  const [displayMode, setDisplayMode] = useState<'pizza' | 'bar' | 'numberline'>('pizza');
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  // GCD helper for fraction reduction
  const getGCD = (a: number, b: number): number => {
    return b === 0 ? a : getGCD(b, a % b);
  };

  const gcd = getGCD(numerator, denominator);
  const simplifiedNum = numerator / gcd;
  const simplifiedDen = denominator / gcd;
  const isSimplified = gcd === 1 || numerator === 0;

  const handleDenominatorChange = (newDen: number) => {
    sound.playPop(350 + newDen * 20);
    setDenominator(newDen);
    if (numerator > newDen) {
      setNumerator(newDen);
    }
  };

  const handleNumeratorChange = (newNum: number) => {
    sound.playPop(400 + newNum * 35);
    setNumerator(newNum);
  };

  const applyPreset = (num: number, den: number) => {
    sound.playClick();
    setDenominator(den);
    setNumerator(num);
  };

  const percentage = Math.round((numerator / denominator) * 100);
  const decimal = (numerator / denominator).toFixed(2);

  // SVG pizza slice calculation
  const radius = 95;
  const center = 120;

  const createSlicePath = (index: number, total: number, isPulledOut: boolean) => {
    const anglePerSlice = (2 * Math.PI) / total;
    const startAngle = index * anglePerSlice - Math.PI / 2;
    const endAngle = (index + 1) * anglePerSlice - Math.PI / 2;
    const midAngle = (startAngle + endAngle) / 2;

    // Shift center outward slightly if pulled out
    const pullDistance = isPulledOut ? 8 : 0;
    const cx = center + pullDistance * Math.cos(midAngle);
    const cy = center + pullDistance * Math.sin(midAngle);

    if (total === 1) {
      return `M ${cx - radius} ${cy} A ${radius} ${radius} 0 1 0 ${cx + radius} ${cy} A ${radius} ${radius} 0 1 0 ${cx - radius} ${cy} Z`;
    }

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const largeArcFlag = anglePerSlice > Math.PI ? 1 : 0;

    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  // Helper coordinates for pizza slice decorative topping
  const getSliceToppingPos = (index: number, total: number) => {
    const anglePerSlice = (2 * Math.PI) / total;
    const midAngle = index * anglePerSlice + anglePerSlice / 2 - Math.PI / 2;
    const dist = radius * 0.62;
    return {
      x: center + dist * Math.cos(midAngle),
      y: center + dist * Math.sin(midAngle),
    };
  };

  return (
    <div id="fraction-visualizer-card" className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-7 shadow-xs relative overflow-hidden">
      {/* Background soft glow accent */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100/80 text-amber-900 border border-amber-200/60 flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-amber-600" />
              Module 1 • Bản Chất Phân Số & Tỷ Lệ
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Trực quan hóa cấp độ tiểu học & THCS</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-1.5 tracking-tight">
            Hiểu Phân Số Bằng Cách "Cắt Lát & Đếm Phần"
          </h3>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/70 text-xs font-bold">
          <button
            id="fraction-mode-pizza-btn"
            onClick={() => { sound.playClick(); setDisplayMode('pizza'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              displayMode === 'pizza'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieChart className="w-3.5 h-3.5 text-amber-500" />
            <span>Bánh Tròn</span>
          </button>
          <button
            id="fraction-mode-bar-btn"
            onClick={() => { sound.playClick(); setDisplayMode('bar'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              displayMode === 'bar'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Square className="w-3.5 h-3.5 text-indigo-500" />
            <span>Thanh Socola</span>
          </button>
          <button
            id="fraction-mode-numberline-btn"
            onClick={() => { sound.playClick(); setDisplayMode('numberline'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              displayMode === 'numberline'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gauge className="w-3.5 h-3.5 text-emerald-500" />
            <span>Trục Số 0 → 1</span>
          </button>
        </div>
      </div>

      {/* Quick Presets Bar */}
      <div className="flex flex-wrap items-center gap-2 mt-4 pt-1">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Mẫu nhanh:
        </span>
        {[
          { num: 1, den: 4, label: '1/4 (Một phần tư)' },
          { num: 1, den: 2, label: '1/2 (Một nửa)' },
          { num: 2, den: 3, label: '2/3' },
          { num: 3, den: 4, label: '3/4 (Ba phần tư)' },
          { num: 4, den: 8, label: '4/8 (= 1/2)' },
          { num: 5, den: 6, label: '5/6' },
          { num: 6, den: 6, label: '6/6 (Toàn phần)' },
        ].map((p, idx) => (
          <button
            key={idx}
            onClick={() => applyPreset(p.num, p.den)}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              numerator === p.num && denominator === p.den
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Interactive Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left: Graphic View */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100/70 rounded-2xl border border-slate-200/80 relative min-h-[340px]">
          {displayMode === 'pizza' && (
            <div className="relative flex flex-col items-center">
              <svg width="240" height="240" viewBox="0 0 240 240" className="drop-shadow-md select-none">
                {/* Pizza Crust Outer Shadow */}
                <circle cx={center} cy={center} r={radius + 8} fill="#d97706" fillOpacity="0.2" />
                <circle cx={center} cy={center} r={radius + 4} fill="#fef3c7" stroke="#b45309" strokeWidth="2.5" />

                {/* Slices */}
                {Array.from({ length: denominator }).map((_, i) => {
                  const isSelected = i < numerator;
                  const isHovered = hoveredSlice === i;
                  const topping = getSliceToppingPos(i, denominator);

                  return (
                    <g
                      key={`pizza-slice-${denominator}-${i}`}
                      onMouseEnter={() => setHoveredSlice(i)}
                      onMouseLeave={() => setHoveredSlice(null)}
                      onClick={() => handleNumeratorChange(i + 1)}
                      className="cursor-pointer"
                    >
                      <motion.path
                        d={createSlicePath(i, denominator, isHovered || (isSelected && numerator === 1))}
                        initial={{ scale: 0.96, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2, delay: i * 0.015 }}
                        fill={isSelected ? '#f59e0b' : '#ffffff'}
                        stroke="#d97706"
                        strokeWidth="2"
                        className="transition-colors duration-150 hover:brightness-105"
                      />

                      {/* Pepperoni / Olive Toppings if slice is selected */}
                      {isSelected && denominator <= 10 && (
                        <circle
                          cx={topping.x}
                          cy={topping.y}
                          r={denominator > 6 ? 4 : 6}
                          fill="#dc2626"
                          stroke="#991b1b"
                          strokeWidth="1"
                          className="pointer-events-none"
                        />
                      )}
                    </g>
                  );
                })}

                {/* Center cheese seal */}
                <circle cx={center} cy={center} r="7" fill="#78350f" stroke="#ffffff" strokeWidth="1.5" />
              </svg>

              <div className="text-center mt-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Chạm hoặc nhấp vào lát bất kỳ để lấy nhanh {numerator}/{denominator}
                </span>
              </div>
            </div>
          )}

          {displayMode === 'bar' && (
            <div className="w-full max-w-md flex flex-col items-center">
              <div className="w-full bg-amber-950/10 rounded-2xl p-3 border-2 border-amber-900/20 shadow-inner">
                <div
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${denominator}, 1fr)` }}
                >
                  {Array.from({ length: denominator }).map((_, i) => {
                    const isSelected = i < numerator;
                    return (
                      <motion.button
                        key={`bar-${denominator}-${i}`}
                        onClick={() => handleNumeratorChange(i + 1)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className={`h-28 rounded-xl border-2 flex flex-col items-center justify-center font-black text-sm transition-all cursor-pointer shadow-xs ${
                          isSelected
                            ? 'bg-gradient-to-b from-indigo-500 to-indigo-600 border-indigo-700 text-white shadow-indigo-200'
                            : 'bg-white border-slate-300 text-slate-400 hover:border-indigo-300 hover:text-slate-600'
                        }`}
                      >
                        <span className="text-base">{i + 1}</span>
                        <span className="text-[10px] font-medium opacity-80">1/{denominator}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-4 text-center">
                Mỗi thanh hình chữ nhật được chia làm <strong className="text-slate-800">{denominator} phần bằng nhau</strong>. Bạn đã lấy <strong className="text-indigo-600 font-bold">{numerator} phần</strong>.
              </p>
            </div>
          )}

          {displayMode === 'numberline' && (
            <div className="w-full max-w-md flex flex-col items-center py-6">
              {/* Number Line Canvas */}
              <div className="w-full px-4 relative">
                {/* Horizontal axis bar */}
                <div className="w-full h-3 bg-slate-200 rounded-full relative">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Ticks */}
                <div className="relative w-full h-8 mt-2">
                  {Array.from({ length: denominator + 1 }).map((_, i) => {
                    const pos = (i / denominator) * 100;
                    return (
                      <div
                        key={`tick-${i}`}
                        className="absolute -translate-x-1/2 flex flex-col items-center"
                        style={{ left: `${pos}%` }}
                      >
                        <div className={`w-0.5 h-3 ${i === numerator ? 'bg-emerald-600 h-4' : 'bg-slate-400'}`} />
                        <span className={`text-[10px] mt-1 font-mono font-bold ${i === numerator ? 'text-emerald-700 text-xs' : 'text-slate-500'}`}>
                          {i === 0 ? '0' : i === denominator ? '1' : `${i}/${denominator}`}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Position Marker Pin */}
                <div
                  className="absolute -top-7 -translate-x-1/2 flex flex-col items-center transition-all duration-200 pointer-events-none"
                  style={{ left: `${percentage}%` }}
                >
                  <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-md shadow-xs whitespace-nowrap">
                    {numerator}/{denominator} ({decimal})
                  </span>
                  <div className="w-2 h-2 bg-emerald-600 rotate-45 -mt-1"></div>
                </div>
              </div>

              <div className="mt-8 p-3 bg-white rounded-xl border border-slate-200 text-xs text-center text-slate-600 w-full">
                Phân số là một số nằm trên trục số giữa <strong className="text-slate-900">0</strong> và <strong className="text-slate-900">1</strong> (với tử số nhỏ hơn mẫu số).
              </div>
            </div>
          )}
        </div>

        {/* Right: Sliders & Live Math Representation */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          {/* Sliders Box */}
          <div className="space-y-4 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/70">
            {/* Denominator Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="den-slider-v2" className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                  Mẫu số (Chia làm mấy phần bằng nhau?):
                </label>
                <span className="font-mono font-black text-base text-slate-900 bg-white px-3 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                  {denominator}
                </span>
              </div>
              <input
                id="den-slider-v2"
                type="range"
                min="1"
                max="12"
                value={denominator}
                onChange={(e) => handleDenominatorChange(Number(e.target.value))}
                className="w-full accent-slate-800 h-2.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                <span>1 phần (Nguyên chiếc)</span>
                <span>6 phần</span>
                <span>12 phần</span>
              </div>
            </div>

            {/* Numerator Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="num-slider-v2" className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  Tử số (Số phần ta đã lấy / đã ăn):
                </label>
                <span className="font-mono font-black text-base text-amber-800 bg-amber-50 px-3 py-0.5 rounded-lg border border-amber-300 shadow-2xs">
                  {numerator}
                </span>
              </div>
              <input
                id="num-slider-v2"
                type="range"
                min="0"
                max={denominator}
                value={numerator}
                onChange={(e) => handleNumeratorChange(Number(e.target.value))}
                className="w-full accent-amber-600 h-2.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                <span>0 (Chưa lấy gì)</span>
                <span>{Math.round(denominator / 2)} phần (Khoảng nửa)</span>
                <span>{denominator} (Lấy hết)</span>
              </div>
            </div>
          </div>

          {/* Connected Math Representation Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center shadow-2xs">
              <span className="text-[11px] text-slate-500 font-bold block uppercase tracking-wider">Phân Số Gốc</span>
              <div className="text-2xl font-black text-slate-900 flex items-center justify-center gap-1 mt-1 font-mono">
                <span className="text-amber-600">{numerator}</span>
                <span className="text-slate-300 font-light">/</span>
                <span className="text-slate-800">{denominator}</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center shadow-2xs">
              <span className="text-[11px] text-slate-500 font-bold block uppercase tracking-wider">Phần Trăm</span>
              <div className="text-2xl font-black text-indigo-600 mt-1 font-mono">
                {percentage}%
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center shadow-2xs">
              <span className="text-[11px] text-slate-500 font-bold block uppercase tracking-wider">Số Thập Phân</span>
              <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">
                {decimal}
              </div>
            </div>
          </div>

          {/* Simplification & Equivalent Fraction Banner */}
          {!isSimplified && (
            <div className="p-3 bg-indigo-50/80 border border-indigo-200/80 rounded-2xl flex items-center justify-between text-xs text-indigo-950">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-indigo-200/70 font-bold text-indigo-800 text-[11px]">
                  Rút gọn tối giản:
                </span>
                <span className="font-mono font-bold text-sm">
                  {numerator}/{denominator} = <span className="text-indigo-600 font-black">{simplifiedNum}/{simplifiedDen}</span>
                </span>
              </div>
              <span className="text-[11px] text-indigo-600 font-medium">
                (Chia cả tử & mẫu cho {gcd})
              </span>
            </div>
          )}

          {/* Intuitive Human Sentence */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 leading-relaxed">
              <strong className="font-bold text-amber-900">Diễn giải dễ hiểu:</strong>{' '}
              {numerator === 0 ? (
                <span>Chưa lấy miếng nào cả (0%). Chiếc bánh vẫn còn nguyên vẹn 100%!</span>
              ) : numerator === denominator ? (
                <span>Đã lấy trọn vẹn cả chiếc bánh (100% hay đúng bằng 1 đơn vị hoàn chỉnh).</span>
              ) : numerator / denominator === 0.5 ? (
                <span>Chính xác là một nửa chiếc bánh (50% hay 0.5). Dù chia làm {denominator} phần lấy {numerator} phần thì vẫn là 1 nửa!</span>
              ) : numerator / denominator < 0.5 ? (
                <span>Đã lấy <strong className="font-semibold text-amber-900">{numerator} phần</strong> trên tổng số {denominator} phần (ít hơn một nửa bánh).</span>
              ) : (
                <span>Đã lấy <strong className="font-semibold text-amber-900">{numerator} phần</strong> trên tổng số {denominator} phần (nhiều hơn một nửa bánh).</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
