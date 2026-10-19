import React, { useState, useEffect } from 'react';
import { StudyMaterial } from '../../types';
import { X, Save, FileText, Image as ImageIcon, Link as LinkIcon, AlertCircle, Sparkles, RotateCw } from 'lucide-react';
import { sound } from '../../utils/sound';
import { generateMaterialSummary } from '../../utils/summaryGenerator';

interface MaterialEditModalProps {
  material: StudyMaterial | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMaterial: StudyMaterial) => void;
}

export const MaterialEditModal: React.FC<MaterialEditModalProps> = ({
  material,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [previewNote, setPreviewNote] = useState('');
  const [topic, setTopic] = useState('');
  const [summary, setSummary] = useState('');
  const [keyPointsText, setKeyPointsText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (material) {
      setTitle(material.title || '');
      setContent(material.content || '');
      setPreviewNote(material.previewNote || '');
      setTopic(material.topic || '');
      setSummary(material.summary || '');
      setKeyPointsText((material.keyPoints || []).join('\n'));
      setError(null);
    }
  }, [material]);

  if (!isOpen || !material) return null;

  const handleAutoGenerate = () => {
    sound.playSuccess();
    const res = generateMaterialSummary({
      ...material,
      title: title.trim() || material.title,
      topic: topic.trim() || material.topic,
      content: content.trim() || material.content,
    });
    setSummary(res.summary);
    setKeyPointsText(res.keyPoints.join('\n'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề ngắn cho nguồn học liệu.');
      return;
    }
    if (!content.trim()) {
      setError('Vui lòng nhập nội dung hoặc liên kết.');
      return;
    }

    const keyPointsArray = keyPointsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const updated: StudyMaterial = {
      ...material,
      title: title.trim(),
      content: content.trim(),
      previewNote: previewNote.trim() || undefined,
      topic: topic.trim() || material.topic,
      wordCount: material.type === 'text' ? content.trim().split(/\s+/).length : material.wordCount,
      summary: summary.trim() || undefined,
      keyPoints: keyPointsArray.length > 0 ? keyPointsArray : undefined,
      summarizedAt: summary.trim() ? `Hôm nay, ${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}` : material.summarizedAt,
    };

    onSave(updated);
    sound.playSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-3xl max-w-xl w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              {material.type === 'text' && <FileText className="w-5 h-5" />}
              {material.type === 'image' && <ImageIcon className="w-5 h-5" />}
              {material.type === 'url' && <LinkIcon className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Chỉnh Sửa Nguồn Học Liệu (CRUD: Sửa)
              </h3>
              <p className="text-xs text-slate-500">
                Cập nhật tiêu đề hoặc nội dung/liên kết cho bài học
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề ngắn <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Định lý Pytago trong tam giác vuông..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50/50"
            />
          </div>

          {/* Topic */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Chủ đề bài học
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="VD: Phân số & Tỷ số"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50/50"
            />
          </div>

          {/* Content / URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {material.type === 'url'
                ? 'Đường dẫn liên kết (URL)'
                : material.type === 'image'
                ? 'Dữ liệu ảnh / Đường dẫn ảnh'
                : 'Nội dung ghi chép / Công thức'} <span className="text-rose-500">*</span>
            </label>
            {material.type === 'text' ? (
              <textarea
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung bài giảng, ghi chú hoặc công thức..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 leading-relaxed font-normal focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50/50 resize-y"
              />
            ) : (
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={material.type === 'url' ? 'https://...' : 'data:image/...'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50/50 font-mono"
              />
            )}
          </div>

          {/* Preview Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Ghi chú thêm (tùy chọn)
            </label>
            <input
              type="text"
              value={previewNote}
              onChange={(e) => setPreviewNote(e.target.value)}
              placeholder="VD: Cần lưu ý khi làm bài kiểm tra 15 phút..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50/50"
            />
          </div>

          {/* Section: Summary & Key Points (Tóm tắt & Điểm mấu chốt) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-slate-50 border border-indigo-200/80 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-extrabold text-indigo-950">
                  Tóm Tắt & Điểm Mấu Chốt (Summary + Key Points)
                </span>
              </div>
              <button
                type="button"
                onClick={handleAutoGenerate}
                className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
              >
                <RotateCw className="w-3 h-3 text-indigo-600" />
                <span>Tự động tạo tóm tắt</span>
              </button>
            </div>

            {/* Summary Textarea */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                📖 Tóm tắt ngắn, dễ hiểu:
              </label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Tóm tắt ngắn gọn 2-3 câu làm nổi bật bản chất kiến thức..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white resize-y"
              />
            </div>

            {/* Key Points Textarea */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                🔑 Các điểm mấu chốt then chốt (Mỗi dòng một điểm mấu chốt):
              </label>
              <textarea
                rows={4}
                value={keyPointsText}
                onChange={(e) => setKeyPointsText(e.target.value)}
                placeholder="📌 Bản chất trực quan: ...&#10;📐 Công thức vàng: ...&#10;💡 Phương pháp tư duy: ...&#10;⚠️ Bẫy sai lầm đề thi: ..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white font-mono text-[11px] resize-y"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-indigo-600/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
