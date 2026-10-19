import React, { useState, useEffect } from 'react';
import { StudyMaterial } from '../../types';
import { INITIAL_STUDY_MATERIALS } from '../../data/defaultMaterials';
import { generateMaterialSummary } from '../../utils/summaryGenerator';
import { sound } from '../../utils/sound';
import {
  Sparkles,
  BookOpen,
  Copy,
  Check,
  RotateCw,
  Search,
  Filter,
  Plus,
  PlayCircle,
  GraduationCap,
  FolderInput,
  Download,
  Printer,
  ChevronRight,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Compass,
  FileText,
  Pencil,
  Save,
  X,
  Layers,
  Table,
  LayoutGrid,
} from 'lucide-react';

const STORAGE_KEY_MATERIALS = 'toan_truc_quan_materials_v2';

interface SummaryKeyPointsScreenProps {
  onGoToSimulation: (topic?: string) => void;
  onGoToReview: () => void;
  onGoToIntake: () => void;
}

export const SummaryKeyPointsScreen: React.FC<SummaryKeyPointsScreenProps> = ({
  onGoToSimulation,
  onGoToReview,
  onGoToIntake,
}) => {
  // Load materials from localStorage
  const [materials, setMaterials] = useState<StudyMaterial[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MATERIALS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_STUDY_MATERIALS;
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [pointCategory, setPointCategory] = useState<'all' | 'nature' | 'formula' | 'intuition' | 'trap'>('all');
  const [viewLayout, setViewLayout] = useState<'cards' | 'matrix'>('cards');

  // Copy Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Edit Modal State
  const [editingMaterial, setEditingMaterial] = useState<StudyMaterial | null>(null);
  const [editSummary, setEditSummary] = useState('');
  const [editKeyPointsText, setEditKeyPointsText] = useState('');

  // Save to LocalStorage whenever materials change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MATERIALS, JSON.stringify(materials));
    } catch {
      // ignore
    }
  }, [materials]);

  // Unique topics
  const topics = Array.from(new Set(materials.map((m) => m.topic)));

  // Materials with summary stats
  const totalSummarized = materials.filter((m) => !!m.summary).length;
  const totalPoints = materials.reduce((acc, m) => acc + (m.keyPoints?.length || 0), 0);

  // Filtered materials
  const filteredMaterials = materials.filter((m) => {
    if (selectedTopic !== 'all' && m.topic !== selectedTopic) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = m.title.toLowerCase().includes(q);
      const inTopic = m.topic.toLowerCase().includes(q);
      const inSummary = (m.summary || '').toLowerCase().includes(q);
      const inPoints = (m.keyPoints || []).some((kp) => kp.toLowerCase().includes(q));
      if (!inTitle && !inTopic && !inSummary && !inPoints) return false;
    }
    return true;
  });

  // Action: Single material regenerate summary
  const handleRegenerate = (id: string) => {
    sound.playSuccess();
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const res = generateMaterialSummary(m);
          return {
            ...m,
            summary: res.summary,
            keyPoints: res.keyPoints,
            summarizedAt: res.summarizedAt,
          };
        }
        return m;
      })
    );
  };

  // Action: Batch generate for all
  const handleGenerateAll = () => {
    sound.playSuccess();
    setMaterials((prev) =>
      prev.map((m) => {
        const res = generateMaterialSummary(m);
        return {
          ...m,
          summary: res.summary,
          keyPoints: res.keyPoints,
          summarizedAt: res.summarizedAt,
        };
      })
    );
  };

  // Action: Copy single material summary + key points
  const handleCopySingle = (m: StudyMaterial) => {
    if (!m.summary) return;
    const pointsFormatted = (m.keyPoints || []).map((p) => `  ${p}`).join('\n');
    const text = `📘 [TÓM TẮT & ĐIỂM MẤU CHỐT - ${m.title}]\nChủ đề: ${m.topic}\n\n📖 TÓM TẮT CỐT LÕI:\n${m.summary}\n\n🔑 CÁC ĐIỂM MẤU CHỐT THEN CHỐT:\n${pointsFormatted}`;
    navigator.clipboard.writeText(text);
    setCopiedId(m.id);
    sound.playSuccess();
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Action: Copy all summaries as Cheat-sheet Markdown
  const handleCopyAllMarkdown = () => {
    sound.playSuccess();
    const sections = materials
      .filter((m) => !!m.summary)
      .map(
        (m, idx) =>
          `### ${idx + 1}. ${m.title} (${m.topic})\n**Tóm tắt cốt lõi:**\n${m.summary}\n\n**Điểm mấu chốt:**\n${(
            m.keyPoints || []
          )
            .map((p) => `- ${p}`)
            .join('\n')}`
      )
      .join('\n\n---\n\n');

    const header = `# SỔ TAY TÓM TẮT & ĐIỂM MẤU CHỐT TOÁN HỌC TRỰC QUAN (LỚP 7+)\n*Trích xuất tự động • Cập nhật: ${new Date().toLocaleDateString('vi-VN')}*\n\n`;
    navigator.clipboard.writeText(header + sections);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Action: Open Edit modal
  const handleOpenEdit = (m: StudyMaterial) => {
    sound.playClick();
    setEditingMaterial(m);
    setEditSummary(m.summary || '');
    setEditKeyPointsText((m.keyPoints || []).join('\n'));
  };

  // Action: Save Edit modal
  const handleSaveEdit = () => {
    if (!editingMaterial) return;
    sound.playSuccess();
    const pts = editKeyPointsText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    setMaterials((prev) =>
      prev.map((m) =>
        m.id === editingMaterial.id
          ? {
              ...m,
              summary: editSummary.trim() || undefined,
              keyPoints: pts.length > 0 ? pts : undefined,
              summarizedAt: `Hôm nay, ${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`,
            }
          : m
      )
    );
    setEditingMaterial(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header Banner: Dedicated Section Identity */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl border border-indigo-400/30 shadow-xl shadow-indigo-950/20 relative overflow-hidden">
        <div className="absolute top-0 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 left-10 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center font-black shadow-lg shadow-purple-500/30 shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                  Kho Tóm Tắt & Điểm Mấu Chốt (Summary + Key Points)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-500/30 text-purple-200 border border-purple-400/30">
                  Chuẩn Sư Phạm Lớp 7+
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  💾 Lưu LocalStorage
                </span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-100/90 max-w-3xl leading-relaxed">
                Khu vực chuyên biệt cô đọng mọi kiến thức toán học thành <strong>Tóm tắt ngắn, dễ hiểu</strong> và <strong>Các điểm mấu chốt then chốt</strong>. Không lặp từ khóa máy móc, tập trung bản chất trực quan, công thức vàng và bẫy sai lầm đề thi!
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleGenerateAll}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-violet-500 hover:from-purple-400 hover:to-indigo-400 text-white rounded-xl text-xs font-black shadow-md shadow-purple-950/40 transition-all cursor-pointer hover:scale-102 active:scale-98"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Tạo Lại Tất Cả</span>
            </button>

            <button
              onClick={handleCopyAllMarkdown}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-102 active:scale-98"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Đã Sao Chép Toàn Bộ!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-purple-300" />
                  <span>Xuất Sổ Tay Markdown</span>
                </>
              )}
            </button>

            <button
              onClick={onGoToReview}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-emerald-500/20 hover:scale-102 active:scale-98"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Ôn Luyện Thẻ</span>
            </button>
          </div>
        </div>

        {/* Highlight Stats Bar */}
        <div className="mt-5 pt-4 border-t border-indigo-400/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
            <span className="text-[11px] text-indigo-200 block">Số bài học đã tóm tắt</span>
            <span className="text-lg font-black text-white">{totalSummarized} / {materials.length} bài</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
            <span className="text-[11px] text-indigo-200 block">Tổng điểm mấu chốt</span>
            <span className="text-lg font-black text-amber-300">{totalPoints} điểm then chốt</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
            <span className="text-[11px] text-indigo-200 block">Phạm vi chuyên đề</span>
            <span className="text-lg font-black text-purple-300">{topics.length} chuyên đề</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
            <span className="text-[11px] text-indigo-200 block">Tiêu chuẩn kiểm duyệt</span>
            <span className="text-lg font-black text-emerald-300">Bản chất CPA & Tránh bẫy</span>
          </div>
        </div>
      </div>

      {/* 2. Control Toolbar: Search, Filters & View Toggle */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên bài, khái niệm, công thức, bẫy thi..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600">
              <button
                onClick={() => { sound.playClick(); setViewLayout('cards'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  viewLayout === 'cards'
                    ? 'bg-white text-purple-700 shadow-2xs font-extrabold'
                    : 'hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Thẻ Sổ Tay</span>
              </button>
              <button
                onClick={() => { sound.playClick(); setViewLayout('matrix'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  viewLayout === 'matrix'
                    ? 'bg-white text-purple-700 shadow-2xs font-extrabold'
                    : 'hover:text-slate-900'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Bảng Tra Cứu</span>
              </button>
            </div>

            <button
              onClick={onGoToIntake}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-2xl text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nạp Thêm Bài</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-purple-600" /> Chủ đề:
          </span>
          <button
            onClick={() => setSelectedTopic('all')}
            className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
              selectedTopic === 'all'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({materials.length})
          </button>
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                selectedTopic === t
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Content: Layout Cards or Matrix */}
      {viewLayout === 'cards' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredMaterials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-purple-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
            >
              {/* Card Top: Topic, Title & Controls */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                      {item.topic}
                    </span>
                    {item.summarizedAt && (
                      <span className="text-[10px] text-slate-400 font-semibold">
                        Cập nhật: {item.summarizedAt}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleRegenerate(item.id)}
                      title="Tạo lại Tóm tắt & Điểm mấu chốt"
                      className="p-1.5 rounded-xl hover:bg-purple-50 text-slate-400 hover:text-purple-600 transition-all cursor-pointer"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(item)}
                      title="Chỉnh sửa tóm tắt & điểm mấu chốt"
                      className="p-1.5 rounded-xl hover:bg-purple-50 text-slate-400 hover:text-purple-600 transition-all cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleCopySingle(item)}
                      title="Sao chép tóm tắt & điểm mấu chốt"
                      className="p-1.5 rounded-xl hover:bg-purple-50 text-slate-400 hover:text-purple-600 transition-all cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-black text-slate-900 group-hover:text-purple-900 transition-colors leading-snug">
                  {item.title}
                </h3>

                {/* Summary Block */}
                {item.summary ? (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/80 via-indigo-50/40 to-white border border-purple-200/70 shadow-2xs space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>📖 Tóm Tắt Ngắn (Summary)</span>
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      {item.summary}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center">
                    <button
                      onClick={() => handleRegenerate(item.id)}
                      className="text-xs text-purple-600 font-bold hover:underline cursor-pointer"
                    >
                      + Bấm vào đây để tạo Tóm tắt & Điểm mấu chốt ngay
                    </button>
                  </div>
                )}

                {/* Key Points Block */}
                {item.keyPoints && item.keyPoints.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-900 block">
                      🔑 Các Điểm Mấu Chốt Then Chốt (Key Points):
                    </span>
                    <div className="space-y-1.5">
                      {item.keyPoints.map((point, pIdx) => {
                        const iconChar = point.slice(0, 2);
                        const textPart = point.slice(2).trim();
                        const isTrap = point.includes('Bẫy') || point.includes('⚠️');
                        const isFormula = point.includes('Công thức') || point.includes('📐');

                        return (
                          <div
                            key={pIdx}
                            className={`p-2.5 rounded-xl border text-xs font-semibold leading-relaxed flex items-start gap-2 shadow-2xs ${
                              isTrap
                                ? 'bg-rose-50/80 border-rose-200/80 text-rose-950'
                                : isFormula
                                ? 'bg-amber-50/80 border-amber-200/80 text-amber-950'
                                : 'bg-slate-50/90 border-slate-200/70 text-slate-800'
                            }`}
                          >
                            <span className="shrink-0 text-sm">{iconChar}</span>
                            <span className="flex-1">{textPart}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Jump to Simulation or Review */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopySingle(item)}
                  className="text-[11px] font-bold text-slate-500 hover:text-purple-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Đã chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onGoToSimulation(item.topic)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <PlayCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Mô Phỏng Bài Này</span>
                  </button>
                  <button
                    onClick={onGoToReview}
                    className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                    <span>Ôn Thẻ Này</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Matrix / Table View for Quick Cheat-sheet Scanning */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-1/5">Bài học & Chuyên đề</th>
                  <th className="py-3.5 px-4 w-2/5">📖 Tóm tắt cốt lõi (Summary)</th>
                  <th className="py-3.5 px-4 w-2/5">🔑 Điểm mấu chốt & Bẫy thi</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMaterials.map((item) => (
                  <tr key={item.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-4 px-4 align-top">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 mb-1">
                        {item.topic}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {item.title}
                      </h4>
                    </td>
                    <td className="py-4 px-4 align-top font-medium text-slate-800 leading-relaxed">
                      {item.summary ? (
                        <p className="p-2.5 bg-purple-50/50 rounded-xl border border-purple-100">
                          {item.summary}
                        </p>
                      ) : (
                        <span className="text-slate-400 italic">Chưa có tóm tắt</span>
                      )}
                    </td>
                    <td className="py-4 px-4 align-top space-y-1.5">
                      {item.keyPoints && item.keyPoints.length > 0 ? (
                        item.keyPoints.map((kp, kIdx) => (
                          <div
                            key={kIdx}
                            className="p-1.5 bg-slate-50 border border-slate-200/70 rounded-lg text-[11px] font-medium text-slate-800 flex items-start gap-1.5"
                          >
                            <span>{kp.slice(0, 2)}</span>
                            <span className="flex-1">{kp.slice(2).trim()}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">Chưa có điểm mấu chốt</span>
                      )}
                    </td>
                    <td className="py-4 px-4 align-top text-center space-y-1.5">
                      <button
                        onClick={() => handleCopySingle(item)}
                        className="w-full py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] transition-all cursor-pointer"
                      >
                        {copiedId === item.id ? 'Đã chép' : 'Sao chép'}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="w-full py-1 px-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-bold text-[11px] transition-all cursor-pointer"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => onGoToSimulation(item.topic)}
                        className="w-full py-1 px-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg font-bold text-[11px] transition-all cursor-pointer"
                      >
                        Mô phỏng
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Edit Modal for Summary & Key Points */}
      {editingMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-black text-slate-900">
                  Chỉnh Sửa Tóm Tắt & Điểm Mấu Chốt
                </h3>
              </div>
              <button
                onClick={() => setEditingMaterial(null)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Bài học: <span className="font-extrabold text-purple-700">{editingMaterial.title}</span>
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  📖 Tóm tắt ngắn, dễ hiểu (Summary):
                </label>
                <textarea
                  rows={4}
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs leading-relaxed focus:bg-white focus:ring-2 focus:ring-purple-400 focus:outline-none font-medium text-slate-800"
                  placeholder="Nhập 2-3 câu làm nổi bật bản chất kiến thức..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  🔑 Các điểm mấu chốt then chốt (Mỗi dòng một điểm mấu chốt):
                </label>
                <textarea
                  rows={5}
                  value={editKeyPointsText}
                  onChange={(e) => setEditKeyPointsText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono leading-relaxed focus:bg-white focus:ring-2 focus:ring-purple-400 focus:outline-none text-slate-800"
                  placeholder="📌 Bản chất trực quan: ...&#10;📐 Công thức vàng: ...&#10;💡 Phương pháp tư duy: ...&#10;⚠️ Bẫy sai lầm đề thi: ..."
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingMaterial(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-md shadow-purple-500/25 transition-all cursor-pointer"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
