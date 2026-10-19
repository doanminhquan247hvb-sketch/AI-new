import React, { useState } from 'react';
import { StudyMaterial } from '../../types';
import {
  X,
  Copy,
  Check,
  Calendar,
  Layers,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  ExternalLink,
  BookOpen,
  Sparkles,
  Download,
  Pencil,
  RotateCw,
  CheckCircle2,
  ListChecks,
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface MaterialDetailModalProps {
  material: StudyMaterial | null;
  onClose: () => void;
  onEdit?: (material: StudyMaterial) => void;
  onGoToSimulation?: () => void;
  onGenerateSummary?: (materialId: string) => void;
}

export const MaterialDetailModal: React.FC<MaterialDetailModalProps> = ({
  material,
  onClose,
  onEdit,
  onGoToSimulation,
  onGenerateSummary,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!material) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(material.content);
    setCopied(true);
    sound.playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySummary = () => {
    if (!material.summary) return;
    const textToCopy = `[TÓM TẮT BÀI HỌC - ${material.title}]\n\n${material.summary}\n\nĐIỂM THEN CHỐT:\n${(material.keyPoints || []).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSummary(true);
    sound.playSuccess();
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/60">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                {material.subject}
              </span>
              <span className="font-semibold text-slate-600">
                • {material.topic}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
              {material.title}
            </h3>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 md:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Text Content */}
          {material.type === 'text' && (
            <div className="space-y-3">
              <div className="p-4 md:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line selection:bg-indigo-200">
                {material.content}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>{material.wordCount || 0} từ</span>
                <span>Thêm lúc: {material.createdAt}</span>
              </div>
            </div>
          )}

          {/* Image Content */}
          {material.type === 'image' && (
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 overflow-hidden flex items-center justify-center">
                <img
                  src={material.content}
                  alt={material.title}
                  className="max-h-96 w-auto object-contain rounded-xl"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-medium text-slate-700">
                  {material.imageFileName || 'Hình ảnh học tập'} ({material.imageSize || 'Đã tối ưu'})
                </span>
                <span>Thêm lúc: {material.createdAt}</span>
              </div>
            </div>
          )}

          {/* URL Content */}
          {material.type === 'url' && (
            <div className="space-y-4 p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {material.urlDomain || 'Trang web học tập'}
                  </h4>
                  <a
                    href={material.content}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-600 hover:underline break-all font-medium"
                  >
                    {material.content}
                  </a>
                </div>
              </div>

              {material.previewNote && (
                <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-indigo-100 italic">
                  Ghi chú: {material.previewNote}
                </p>
              )}

              <div className="pt-2">
                <a
                  href={material.content}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Truy cập trang bài giảng</span>
                </a>
              </div>
            </div>
          )}

          {/* Student helpful advice */}
          {material.previewNote && material.type !== 'url' && (
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Ghi chú của em: {material.previewNote}</span>
            </div>
          )}

          {/* PROMPT #03: Summary + Key Points Section */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-white border border-indigo-200/90 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                    Tóm Tắt Ngắn & Điểm Then Chốt (Summary + Key Points)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Nội dung cốt lõi, bám sát chủ đề {material.topic}, phù hợp học sinh lớp 7 trở lên
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  💾 Lưu LocalStorage
                </span>
                {material.summarizedAt && (
                  <span className="text-slate-400 font-semibold hidden sm:inline">
                    {material.summarizedAt}
                  </span>
                )}
              </div>
            </div>

            {material.summary ? (
              <div className="space-y-3.5 animate-fadeIn">
                {/* Short Summary Block */}
                <div className="p-3.5 bg-white rounded-xl border border-indigo-100/80 shadow-2xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 block mb-1">
                    📖 Summary (Tóm tắt ngắn, dễ hiểu):
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {material.summary}
                  </p>
                </div>

                {/* Key Points List */}
                {material.keyPoints && material.keyPoints.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 block mb-1">
                      🔑 Key Points (Điểm then chốt cốt lõi):
                    </span>
                    <div className="grid grid-cols-1 gap-1.5">
                      {material.keyPoints.map((point, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-white/90 rounded-xl border border-slate-200/80 text-xs font-semibold text-slate-800 flex items-start gap-2 shadow-2xs"
                        >
                          <span className="shrink-0">{point.slice(0, 2)}</span>
                          <span className="leading-relaxed flex-1">{point.slice(2).trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions: Copy & Regenerate */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <button
                    onClick={handleCopySummary}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    {copiedSummary ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Đã chép Summary!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép Summary + Key Points</span>
                      </>
                    )}
                  </button>

                  {onGenerateSummary && (
                    <button
                      onClick={() => onGenerateSummary(material.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl font-bold transition-all cursor-pointer"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Tạo Lại Summary Mới</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 bg-white/80 rounded-xl border border-dashed border-indigo-200 p-4 space-y-3">
                <p className="text-xs text-slate-600 font-medium">
                  Bài học này chưa có bản tóm tắt và điểm then chốt.
                </p>
                {onGenerateSummary && (
                  <button
                    onClick={() => onGenerateSummary(material.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Tạo Summary & Key Points Ngay</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Đã sao chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Sao chép nội dung</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                  onEdit(material);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
                title="Sửa tiêu đề hoặc nội dung nguồn học liệu này"
              >
                <Pencil className="w-3.5 h-3.5 text-indigo-600" />
                <span>Sửa bài học</span>
              </button>
            )}

            {material.subject === 'Toán Học' && onGoToSimulation && (
              <button
                onClick={() => {
                  onClose();
                  onGoToSimulation();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Mở mô phỏng trực quan</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Đóng lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
