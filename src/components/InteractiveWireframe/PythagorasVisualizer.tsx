import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Triangle, Sparkles, CheckCircle, Info, Grid, Ruler } from 'lucide-react';
import { sound } from '../../utils/sound';

interface TripletPreset {
  a: number;
  b: number;
  c: number;
  label: string;
}

const TRIPLETS: TripletPreset[] = [
  { a: 3, b: 4, c: 5, label: 'Bộ 3-4-5 (Kinh điển Ai Cập)' },
  { a: 6, b: 8, c: 10, label: 'Bộ 6-8-10 (Nhân đôi)' },
  { a: 5, b: 12, c: 13, label: 'Bộ 5-12-13 (Nâng cao)' },
];

export const PythagorasVisualizer: React.FC = () => {
  const [a, setA] = useState<number>(3);
  const [b, setB] = useState<number>(4);
  const [showGridTiles, setShowGridTiles] = useState<boolean>(true);

  const aSquared = a * a;
  const bSquared = b * b;
  const cSquared = aSquared + bSquared;
  const c = Math.sqrt(cSquared);

  // Calculate angles in degrees
  const angleA = Math.round((Math.asin(a / c) * 180) / Math.PI);
  const angleB = 90 - angleA;

  // Scale factor for SVG rendering
  const scale = 18;
  const originX = 140;
  const originY = 220;

  const handleAChange = (val: number) => {
    sound.playPop(350 + val * 30);
    setA(val);
  };

  const handleBChange = (val: number) => {
    sound.playPop(350 + val * 30);
    setB(val);
  };

  const selectTriplet = (t: TripletPreset) => {
    sound.playSuccess();
    setA(t.a);
    setB(t.b);
  };

  return (
    <div id="pythagoras-visualizer-card" className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-7 shadow-xs relative overflow-hidden">
      {/* Background soft glow accent */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/80 text-emerald-900 border border-emerald-200/60 flex items-center gap-1.5">
              <Triangle className="w-3.5 h-3.5 text-emerald-600" />
              Module 4 • Định Lý Pytago & Hình Học Không Gian
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Bản chất diện tích 3 hình vuông</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-1.5 tracking-tight">
            Hiểu Định Lý Pytago Bằng "Cộng Diện Tích Ô Vuông"
          </h3>
        </div>

        {/* Pythagorean Formula Display */}
        <div className="bg-emerald-50 border border-emerald-200/80 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-2xs">
          <span className="text-xs text-emerald-700 font-bold">Định lý:</span>
          <span className="font-mono text-base font-black text-emerald-950">
            <span className="text-sky-600 font-black">{a}²</span> + <span className="text-indigo-600 font-black">{b}²</span> = <span className="text-emerald-600 font-black">{c.toFixed(2).replace(/\.00$/, '')}²</span>
          </span>
        </div>
      </div>

      {/* Triplet Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            Bộ 3 số nguyên đẹp:
          </span>
          {TRIPLETS.map((t, idx) => (
            <button
              key={idx}
              onClick={() => selectTriplet(t)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                a === t.a && b === t.b
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowGridTiles(!showGridTiles)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            showGridTiles ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>{showGridTiles ? 'Đang hiện lưới 1x1' : 'Hiện lưới 1x1'}</span>
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left: SVG Geometric Visualization */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-2xl relative overflow-hidden min-h-[380px] shadow-inner">
          <svg width="360" height="340" viewBox="0 0 360 340" className="overflow-visible select-none drop-shadow-md">
            {/* Square on side A (sky blue) - sits to the left of vertical side */}
            <g>
              <rect
                x={originX - a * scale}
                y={originY - a * scale}
                width={a * scale}
                height={a * scale}
                fill="#0284c7"
                fillOpacity="0.45"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              {showGridTiles && a <= 8 && (
                Array.from({ length: a }).map((_, row) =>
                  Array.from({ length: a }).map((_, col) => (
                    <rect
                      key={`grid-a-${row}-${col}`}
                      x={originX - a * scale + col * scale}
                      y={originY - a * scale + row * scale}
                      width={scale}
                      height={scale}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="0.5"
                      strokeOpacity="0.4"
                    />
                  ))
                )
              )}
              <text
                x={originX - (a * scale) / 2}
                y={originY - (a * scale) / 2 + 5}
                fill="#e0f2fe"
                fontSize="13"
                fontWeight="black"
                textAnchor="middle"
              >
                a² = {aSquared}
              </text>
            </g>

            {/* Square on side B (indigo) - sits below horizontal side */}
            <g>
              <rect
                x={originX}
                y={originY}
                width={b * scale}
                height={b * scale}
                fill="#4f46e5"
                fillOpacity="0.45"
                stroke="#818cf8"
                strokeWidth="2"
              />
              {showGridTiles && b <= 8 && (
                Array.from({ length: b }).map((_, row) =>
                  Array.from({ length: b }).map((_, col) => (
                    <rect
                      key={`grid-b-${row}-${col}`}
                      x={originX + col * scale}
                      y={originY + row * scale}
                      width={scale}
                      height={scale}
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="0.5"
                      strokeOpacity="0.4"
                    />
                  ))
                )
              )}
              <text
                x={originX + (b * scale) / 2}
                y={originY + (b * scale) / 2 + 5}
                fill="#ede9fe"
                fontSize="13"
                fontWeight="black"
                textAnchor="middle"
              >
                b² = {bSquared}
              </text>
            </g>

            {/* Hypotenuse Square C (emerald) - tilted */}
            {(() => {
              const pX = originX;
              const pY = originY - a * scale;
              const qX = originX + b * scale;
              const qY = originY;

              // Vector PQ: (qX - pX, qY - pY) = (b*scale, a*scale)
              // Perpendicular vector pointing outward: (-a*scale, b*scale)
              const nx = -a * scale;
              const ny = -b * scale;

              const rX = qX - (qY - pY);
              const rY = qY + (qX - pX);
              const sX = pX - (qY - pY);
              const sY = pY + (qX - pX);

              return (
                <g>
                  <polygon
                    points={`${pX},${pY} ${qX},${qY} ${rX},${rY} ${sX},${sY}`}
                    fill="#059669"
                    fillOpacity="0.45"
                    stroke="#34d399"
                    strokeWidth="2"
                  />
                  <text
                    x={(pX + qX + rX + sX) / 4}
                    y={(pY + qY + rY + sY) / 4 + 5}
                    fill="#d1fae5"
                    fontSize="13"
                    fontWeight="black"
                    textAnchor="middle"
                  >
                    c² = {cSquared}
                  </text>
                </g>
              );
            })()}

            {/* The Right Triangle itself */}
            <polygon
              points={`${originX},${originY} ${originX},${originY - a * scale} ${originX + b * scale},${originY}`}
              fill="#ffffff"
              fillOpacity="0.15"
              stroke="#ffffff"
              strokeWidth="2.5"
            />

            {/* Right Angle 90deg Square Marker */}
            <rect
              x={originX}
              y={originY - 14}
              width="14"
              height="14"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
            />
            <circle cx={originX + 7} cy={originY - 7} r="2" fill="#fbbf24" />

            {/* Side Length Labels */}
            <text x={originX - 12} y={originY - (a * scale) / 2 + 4} fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="end">
              a = {a}
            </text>
            <text x={originX + (b * scale) / 2} y={originY + 18} fill="#818cf8" fontSize="12" fontWeight="bold" textAnchor="middle">
              b = {b}
            </text>
            <text
              x={originX + (b * scale) / 2 + 10}
              y={originY - (a * scale) / 2 - 10}
              fill="#34d399"
              fontSize="12"
              fontWeight="bold"
            >
              c = {c.toFixed(2).replace(/\.00$/, '')}
            </text>
          </svg>

          {/* Angles & Stats Bar */}
          <div className="flex items-center justify-between w-full max-w-sm mt-3 px-2 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Góc vuông: <strong className="text-amber-300 font-mono">90°</strong>
            </span>
            <span className="text-slate-500">•</span>
            <span>Góc nhọn 1: <strong className="text-sky-300 font-mono">{angleA}°</strong></span>
            <span className="text-slate-500">•</span>
            <span>Góc nhọn 2: <strong className="text-indigo-300 font-mono">{angleB}°</strong></span>
          </div>
        </div>

        {/* Right: Controls & Intuitive Meaning */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/70">
            {/* Slider a */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="side-a-slider-v2" className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                  Cạnh góc vuông (a):
                </label>
                <span className="font-mono font-black text-base text-sky-700 bg-sky-50 px-3 py-0.5 rounded-lg border border-sky-200 shadow-2xs">
                  a = {a}
                </span>
              </div>
              <input
                id="side-a-slider-v2"
                type="range"
                min="2"
                max="7"
                value={a}
                onChange={(e) => handleAChange(Number(e.target.value))}
                className="w-full accent-sky-600 h-2.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider b */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="side-b-slider-v2" className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  Cạnh góc vuông (b):
                </label>
                <span className="font-mono font-black text-base text-indigo-700 bg-indigo-50 px-3 py-0.5 rounded-lg border border-indigo-200 shadow-2xs">
                  b = {b}
                </span>
              </div>
              <input
                id="side-b-slider-v2"
                type="range"
                min="2"
                max="7"
                value={b}
                onChange={(e) => handleBChange(Number(e.target.value))}
                className="w-full accent-indigo-600 h-2.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Area Sum Equation Cards */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-2">
              Chứng minh bằng tổng diện tích ô vuông:
            </span>
            <div className="flex items-center justify-between text-center font-mono font-black">
              <div className="bg-white px-3 py-2 rounded-xl border border-sky-200 text-sky-700 shadow-2xs">
                <div className="text-[10px] text-slate-400 font-sans font-normal">Hình vuông a²</div>
                <div className="text-lg">{aSquared} ô</div>
              </div>
              <span className="text-emerald-700 text-xl font-bold">+</span>
              <div className="bg-white px-3 py-2 rounded-xl border border-indigo-200 text-indigo-700 shadow-2xs">
                <div className="text-[10px] text-slate-400 font-sans font-normal">Hình vuông b²</div>
                <div className="text-lg">{bSquared} ô</div>
              </div>
              <span className="text-emerald-700 text-xl font-bold">=</span>
              <div className="bg-white px-3 py-2 rounded-xl border border-emerald-300 text-emerald-700 shadow-2xs">
                <div className="text-[10px] text-slate-400 font-sans font-normal">Hình vuông c²</div>
                <div className="text-lg">{cSquared} ô</div>
              </div>
            </div>
          </div>

          {/* Ancient Egyptian Builder Insight */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950 leading-relaxed">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-amber-900">Ứng dụng thực tế của thợ nề:</strong>{' '}
              Từ thời Ai Cập cổ đại xây kim tự tháp, các kỹ sư dùng một sợi dây thắt 12 nút cách đều tạo thành tam giác 3 - 4 - 5 cạnh. Khi căng thẳng sợi dây, góc giữa cạnh 3 và 4 chắc chắn vuông vức 90° để xây tường thẳng đứng!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
