import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, ArrowRight, HelpCircle, Compass, Sparkles, Table2, Mountain, Car, Activity } from 'lucide-react';
import { sound } from '../../utils/sound';

interface GraphPreset {
  id: string;
  label: string;
  a: number;
  b: number;
  desc: string;
}

const PRESETS: GraphPreset[] = [
  { id: 'p1', label: 'y = x (Đường phân giác)', a: 1, b: 0, desc: 'Dốc 45 độ qua gốc O' },
  { id: 'p2', label: 'y = 2x + 1 (Dốc vừa)', a: 2, b: 1, desc: 'Mỗi 1 bước sang phải, leo cao 2 bước' },
  { id: 'p3', label: 'y = -1.5x + 3 (Xuống dốc)', a: -1.5, b: 3, desc: 'Đi xuống dốc từ trái sang phải' },
  { id: 'p4', label: 'y = 3 (Nằm ngang)', a: 0, b: 3, desc: 'Bằng phẳng, không có độ dốc' },
];

export const LinearGraphVisualizer: React.FC = () => {
  const [a, setA] = useState<number>(1.5);
  const [b, setB] = useState<number>(1);
  const [testX, setTestX] = useState<number>(2);
  const [showSlopeTriangle, setShowSlopeTriangle] = useState<boolean>(true);

  // SVG coordinate scale settings
  const size = 320;
  const origin = 160;
  const scale = 18;

  const toSvgX = (x: number) => origin + x * scale;
  const toSvgY = (y: number) => origin - y * scale;

  // Calculate endpoints for line within range x = -8 to 8
  const x1 = -8;
  const y1 = a * x1 + b;
  const x2 = 8;
  const y2 = a * x2 + b;

  // Test point coordinates
  const testY = a * testX + b;

  // Slope triangle points: from (0, b) to (1, b) then up to (1, a + b)
  const triX0 = 0;
  const triY0 = b;
  const triX1 = 1;
  const triY1 = b;
  const triX2 = 1;
  const triY2 = a + b;

  const handleAChange = (val: number) => {
    sound.playPop(350 + (val + 4) * 40);
    setA(val);
  };

  const handleBChange = (val: number) => {
    sound.playPop(300 + (val + 5) * 35);
    setB(val);
  };

  const applyPreset = (p: GraphPreset) => {
    sound.playClick();
    setA(p.a);
    setB(p.b);
  };

  // Generate table of values
  const tableValues = [-2, -1, 0, 1, 2].map((x) => ({
    x,
    y: Number((a * x + b).toFixed(2)),
  }));

  return (
    <div id="linear-graph-visualizer-card" className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-7 shadow-xs relative overflow-hidden">
      {/* Background soft glow accent */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100/80 text-indigo-900 border border-indigo-200/60 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              Module 3 • Hàm Số Bậc Nhất & Hệ Trục Oxy
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Trực quan hóa độ dốc & tung độ gốc</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-1.5 tracking-tight">
            Đồ Thị y = ax + b: Kéo Tham Số Thấy Ngay Ý Nghĩa
          </h3>
        </div>

        {/* Dynamic Formula Badge */}
        <div className="bg-indigo-50 border border-indigo-200/80 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-2xs">
          <span className="text-xs text-indigo-700 font-bold">Phương trình:</span>
          <span className="font-mono text-base font-black text-indigo-950">
            y = <span className="text-pink-600 font-black">{a}</span>x + <span className="text-emerald-600 font-black">{b >= 0 ? b : `(${b})`}</span>
          </span>
        </div>
      </div>

      {/* Quick Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2 mt-4 pt-1">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Mẫu nhanh:
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => applyPreset(p)}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              a === p.a && b === p.b
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left: SVG Coordinate Plane */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-5 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-2xl relative overflow-hidden min-h-[360px] shadow-inner">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible select-none drop-shadow-sm">
            {/* Grid lines */}
            {[-7, -5, -3, -1, 1, 3, 5, 7].map((unit) => (
              <React.Fragment key={`grid-${unit}`}>
                {/* Vertical grid line */}
                <line
                  x1={toSvgX(unit)}
                  y1={10}
                  x2={toSvgX(unit)}
                  y2={size - 10}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
                {/* Horizontal grid line */}
                <line
                  x1={10}
                  y1={toSvgY(unit)}
                  x2={size - 10}
                  y2={toSvgY(unit)}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
              </React.Fragment>
            ))}

            {/* X Axis */}
            <line x1={10} y1={origin} x2={size - 10} y2={origin} stroke="#94a3b8" strokeWidth="2" />
            <polygon points={`${size - 8},${origin - 4} ${size - 2},${origin} ${size - 8},${origin + 4}`} fill="#94a3b8" />
            <text x={size - 14} y={origin + 16} fill="#cbd5e1" fontSize="12" fontWeight="bold">x</text>

            {/* Y Axis */}
            <line x1={origin} y1={size - 10} x2={origin} y2={10} stroke="#94a3b8" strokeWidth="2" />
            <polygon points={`${origin - 4},12 ${origin},6 ${origin + 4},12`} fill="#94a3b8" />
            <text x={origin + 10} y={16} fill="#cbd5e1" fontSize="12" fontWeight="bold">y</text>

            {/* Origin (0,0) */}
            <text x={origin - 14} y={origin + 14} fill="#64748b" fontSize="10" fontWeight="bold">O</text>

            {/* Slope Triangle if enabled */}
            {showSlopeTriangle && a !== 0 && (
              <g opacity="0.85">
                {/* Horizontal delta X = 1 */}
                <line
                  x1={toSvgX(triX0)}
                  y1={toSvgY(triY0)}
                  x2={toSvgX(triX1)}
                  y2={toSvgY(triY1)}
                  stroke="#ec4899"
                  strokeWidth="2"
                  strokeDasharray="3 2"
                />
                {/* Vertical delta Y = a */}
                <line
                  x1={toSvgX(triX1)}
                  y1={toSvgY(triY1)}
                  x2={toSvgX(triX2)}
                  y2={toSvgY(triY2)}
                  stroke="#ec4899"
                  strokeWidth="2"
                  strokeDasharray="3 2"
                />
                <text
                  x={toSvgX(0.5)}
                  y={toSvgY(b) + (a > 0 ? 12 : -6)}
                  fill="#f472b6"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Δx = 1
                </text>
                <text
                  x={toSvgX(1) + (a > 0 ? 14 : -14)}
                  y={toSvgY(b + a / 2)}
                  fill="#f472b6"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Δy = {a}
                </text>
              </g>
            )}

            {/* Linear Function Line */}
            <line
              x1={toSvgX(x1)}
              y1={toSvgY(y1)}
              x2={toSvgX(x2)}
              y2={toSvgY(y2)}
              stroke="#60a5fa"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Y-intercept Point (0, b) */}
            <circle
              cx={toSvgX(0)}
              cy={toSvgY(b)}
              r="6.5"
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text
              x={toSvgX(0) + 8}
              y={toSvgY(b) - 6}
              fill="#34d399"
              fontSize="11"
              fontWeight="bold"
            >
              (0, {b})
            </text>

            {/* Dynamic test point */}
            <circle
              cx={toSvgX(testX)}
              cy={toSvgY(testY)}
              r="6"
              fill="#f43f5e"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text
              x={toSvgX(testX) + 8}
              y={toSvgY(testY) + 14}
              fill="#fda4af"
              fontSize="10"
              fontWeight="bold"
            >
              ({testX}, {testY.toFixed(1)})
            </text>
          </svg>

          {/* Graph Legend below canvas */}
          <div className="flex flex-wrap items-center justify-between w-full mt-3 px-2 text-xs text-slate-300 gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              Cắt trục Oy tại (0, {b})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-400"></span>
              Tam giác độ dốc Δy/Δx = {a}
            </span>
            <button
              onClick={() => setShowSlopeTriangle(!showSlopeTriangle)}
              className="text-[11px] text-indigo-300 hover:text-white underline cursor-pointer"
            >
              {showSlopeTriangle ? 'Ẩn tam giác dốc' : 'Hiện tam giác dốc'}
            </button>
          </div>
        </div>

        {/* Right: Sliders & Intuitive Explanations */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/70">
            {/* Slider a (Slope) */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="slope-slider-v2" className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                  Hệ số góc (a): Độ nghiêng con dốc
                </label>
                <span className="font-mono font-black text-base text-pink-700 bg-pink-50 px-3 py-0.5 rounded-lg border border-pink-200 shadow-2xs">
                  a = {a}
                </span>
              </div>
              <input
                id="slope-slider-v2"
                type="range"
                min="-4"
                max="4"
                step="0.5"
                value={a}
                onChange={(e) => handleAChange(Number(e.target.value))}
                className="w-full accent-pink-600 h-2.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                <span>Dốc xuống (a &lt; 0)</span>
                <span>Bằng phẳng (a = 0)</span>
                <span>Dốc lên (a &gt; 0)</span>
              </div>
            </div>

            {/* Slider b (Intercept) */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="intercept-slider-v2" className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Tung độ gốc (b): Điểm cắt trục tung Oy
                </label>
                <span className="font-mono font-black text-base text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-lg border border-emerald-200 shadow-2xs">
                  b = {b}
                </span>
              </div>
              <input
                id="intercept-slider-v2"
                type="range"
                min="-5"
                max="5"
                step="1"
                value={b}
                onChange={(e) => handleBChange(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                <span>Dưới gốc O (-5)</span>
                <span>Qua gốc O (b = 0)</span>
                <span>Trên gốc O (+5)</span>
              </div>
            </div>

            {/* Slider Test X */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="testx-slider-v2" className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  Chạy điểm thử nghiệm (x):
                </label>
                <span className="font-mono font-bold text-xs text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  x = {testX} ➔ y = {testY.toFixed(1)}
                </span>
              </div>
              <input
                id="testx-slider-v2"
                type="range"
                min="-5"
                max="5"
                step="1"
                value={testX}
                onChange={(e) => {
                  sound.playPop(450 + Number(e.target.value) * 30);
                  setTestX(Number(e.target.value));
                }}
                className="w-full accent-slate-700 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Table of Values Box */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <Table2 className="w-3.5 h-3.5 text-indigo-600" />
              Bảng giá trị tương ứng (x ➔ y):
            </span>
            <div className="grid grid-cols-5 gap-1 text-center font-mono text-xs">
              {tableValues.map((v) => (
                <div
                  key={v.x}
                  className={`p-1.5 rounded-lg border ${
                    v.x === testX ? 'bg-indigo-50 border-indigo-400 font-black text-indigo-900' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-[10px] text-slate-400">x = {v.x}</div>
                  <div className="text-slate-800 font-bold">y = {v.y}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Intuitive Meaning Cards */}
          <div className={`p-3.5 rounded-2xl border transition-all text-xs leading-relaxed ${
            a > 0 
              ? 'bg-blue-50/80 border-blue-200 text-blue-950'
              : a < 0 
              ? 'bg-amber-50/80 border-amber-200 text-amber-950'
              : 'bg-slate-100 border-slate-200 text-slate-800'
          }`}>
            <strong className="font-bold block mb-1">Ẩn dụ thực tế:</strong>
            {a > 0 && <span><strong>Đồng biến (Leo dốc):</strong> Giống như bạn đang đi xe đạp lên dốc từ trái sang phải. Hệ số a càng lớn thì dốc càng dựng đứng!</span>}
            {a < 0 && <span><strong>Nghịch biến (Đổ dốc):</strong> Giống như con dốc trượt xuống. Đi sang phải càng xa thì độ cao y càng hạ thấp.</span>}
            {a === 0 && <span><strong>Đường nằm ngang (Mặt hồ yên ả):</strong> Bạn đi trên mặt phẳng, độ cao y luôn cố định bằng {b}.</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
