import React, { useState, useRef } from 'react';
import { MaterialType, StudyMaterial } from '../../types';
import {
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Upload,
  Clipboard,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Trash2,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  RotateCw,
} from 'lucide-react';
import { sound } from '../../utils/sound';
import { generateMaterialSummary } from '../../utils/summaryGenerator';

interface MaterialInputFormProps {
  currentSubject: string;
  currentTopic: string;
  onAddMaterial: (material: Omit<StudyMaterial, 'id' | 'createdAt'>) => void;
}

export const MaterialInputForm: React.FC<MaterialInputFormProps> = ({
  currentSubject,
  currentTopic,
  onAddMaterial,
}) => {
  // Text-first experience: default tab is 'text'
  const [activeType, setActiveType] = useState<MaterialType>('text');

  // Common Fields
  const [title, setTitle] = useState('');
  const [previewNote, setPreviewNote] = useState('');
  const [customSummary, setCustomSummary] = useState('');
  const [customKeyPoints, setCustomKeyPoints] = useState('');
  const [showSummarySection, setShowSummarySection] = useState(true);

  // Text Form State
  const [textContent, setTextContent] = useState('');

  // Image Form State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState('');
  const [imageSize, setImageSize] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // URL Form State
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');

  // Status message
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Character & word count for text
  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
  const charCount = textContent.length;

  // Student quick templates for text-first
  const quickTemplates = [
    {
      label: '📝 Ghi nhớ bài học',
      title: 'Tóm tắt trọng tâm bài học: ' + currentTopic,
      body: `1. Khái niệm cốt lõi:\n- ...\n\n2. Bản chất và ứng dụng thực tế:\n- ...\n\n3. Những điều cần lưu ý để không nhầm lẫn:\n- ...`,
    },
    {
      label: '❓ Đề bài tập cần giải',
      title: 'Bài tập ' + currentTopic + ' cần lời giải chi tiết',
      body: `Đề bài:\nCho ...\nYêu cầu: Tính / Chứng minh ...\n\nPhần em đã làm được:\n- Bước 1: ...\n\nChỗ em đang bị mắc lại:\n- ...`,
    },
    {
      label: '💡 Công thức & Mẹo nhớ',
      title: 'Mẹo nhớ nhanh công thức ' + currentTopic,
      body: `Công thức chính: ...\nÝ nghĩa các đại lượng:\n- a là ...\n- b là ...\nCách nhớ bằng hình ảnh liên tưởng: ...`,
    },
  ];

  // Quick sample images for testing
  const sampleImages = [
    {
      label: 'Ảnh 1: Sơ đồ phân số miếng bánh',
      name: 'so-do-banh-pizza-sgk.png',
      size: '142 KB',
      title: 'Sách giáo khoa: Minh họa phân số 3/4 chiếc bánh',
      svgData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="260" viewBox="0 0 500 260"><rect width="100%" height="100%" fill="%23f1f5f9" rx="12"/><circle cx="150" cy="130" r="70" fill="%23fed7aa" stroke="%23ea580c" stroke-width="4"/><path d="M 150 130 L 150 60 A 70 70 0 1 1 80 130 Z" fill="%23f97316"/><text x="150" y="235" font-family="sans-serif" font-size="13" font-weight="bold" fill="%239a3412" text-anchor="middle">3/4 Chiếc bánh Pizza</text><rect x="280" y="90" width="160" height="70" rx="8" fill="%23e0e7ff" stroke="%234f46e5" stroke-width="3"/><rect x="280" y="90" width="120" height="70" rx="6" fill="%236366f1"/><text x="360" y="200" font-family="sans-serif" font-size="13" font-weight="bold" fill="%233730a3" text-anchor="middle">Thanh Socola (3/4 phần)</text></svg>',
    },
    {
      label: 'Ảnh 2: Chiếc cân thăng bằng đại số',
      name: 'can-thang-bang-daiso.png',
      size: '198 KB',
      title: 'Ảnh chụp vở: Mô hình cân thăng bằng tìm x',
      svgData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="260" viewBox="0 0 500 260"><rect width="100%" height="100%" fill="%23f8fafc" rx="12"/><polygon points="250,190 230,230 270,230" fill="%23475569"/><line x1="120" y1="130" x2="380" y2="130" stroke="%23334155" stroke-width="6"/><rect x="100" y="90" width="36" height="36" rx="6" fill="%236366f1"/><text x="118" y="113" font-family="sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">x</text><rect x="142" y="90" width="36" height="36" rx="6" fill="%236366f1"/><text x="160" y="113" font-family="sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">x</text><circle cx="130" cy="70" r="9" fill="%23f59e0b"/><circle cx="155" cy="70" r="9" fill="%23f59e0b"/><rect x="300" y="95" width="80" height="30" rx="6" fill="%2310b981"/><text x="340" y="115" font-family="sans-serif" font-size="13" font-weight="bold" fill="white" text-anchor="middle">10 Quả cân</text><text x="250" y="50" font-family="sans-serif" font-size="16" font-weight="bold" fill="%231e293b" text-anchor="middle">2x + 2 = 10 (Cân Thăng Bằng)</text></svg>',
    },
  ];

  // Quick sample links for testing
  const sampleLinks = [
    {
      title: 'Khan Academy Tiếng Việt: Phân số trực quan',
      url: 'https://vi.khanacademy.org/math/cc-fourth-grade-math/fraction-basics',
      note: 'Bài giảng miễn phí có hình ảnh minh họa sinh động',
    },
    {
      title: 'Video YouTube: Hiểu bản chất Định lý Pytago trong 3 phút',
      url: 'https://youtube.com/watch?v=pythagorean-theorem-visual-proof',
      note: 'Clip mô phỏng nước rót đầy các ô vuông',
    },
  ];

  // Handle file drop & select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setStatusMessage('⚠️ Vui lòng chọn file hình ảnh (PNG, JPG, JPEG, SVG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
      setImageFileName(file.name);
      setImageSize(`${(file.size / 1024).toFixed(0)} KB`);
      if (!title) {
        setTitle(`Ảnh chụp: ${file.name.replace(/\.[^/.]+$/, '')}`);
      }
      sound.playSuccess();
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        setTextContent((prev) => (prev ? prev + '\n' + clipText : clipText));
        sound.playClick();
      }
    } catch {
      // Fallback if permission not granted
      setStatusMessage('Không thể truy cập bộ nhớ tạm. Em có thể bấm phím Ctrl+V để dán nhé!');
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleAutoGenerateSummary = () => {
    const contentToUse =
      activeType === 'text'
        ? textContent.trim()
        : activeType === 'url'
        ? urlInput.trim()
        : imageFileName || 'Ảnh bài học';
    if (!contentToUse && !title.trim()) {
      setStatusMessage('Em hãy nhập tiêu đề hoặc nội dung trước để hệ thống tạo tóm tắt nhé!');
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }
    sound.playSuccess();
    const res = generateMaterialSummary({
      id: '',
      title: title.trim() || `Bài học môn ${currentSubject} - ${currentTopic}`,
      type: activeType,
      subject: currentSubject,
      topic: currentTopic,
      content: contentToUse,
      createdAt: '',
    });
    setCustomSummary(res.summary);
    setCustomKeyPoints(res.keyPoints.join('\n'));
    setShowSummarySection(true);
    setStatusMessage('✨ Đã tự động trích xuất Tóm tắt & Điểm mấu chốt!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const keyPointsArray = customKeyPoints
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (activeType === 'text') {
      if (!textContent.trim()) {
        setStatusMessage('Em hãy nhập nội dung ghi chép hoặc đề bài trước khi lưu nhé!');
        setTimeout(() => setStatusMessage(null), 3000);
        return;
      }
      const finalTitle = title.trim() || `Ghi chép môn ${currentSubject}: ${currentTopic}`;
      onAddMaterial({
        title: finalTitle,
        type: 'text',
        subject: currentSubject,
        topic: currentTopic,
        content: textContent.trim(),
        previewNote: previewNote.trim() || 'Ghi chép bài học',
        wordCount,
        summary: customSummary.trim() || undefined,
        keyPoints: keyPointsArray.length > 0 ? keyPointsArray : undefined,
      });
      setTextContent('');
      setTitle('');
      setPreviewNote('');
      setCustomSummary('');
      setCustomKeyPoints('');
    } else if (activeType === 'image') {
      if (!imagePreview) {
        setStatusMessage('Em hãy tải lên hoặc chọn một ảnh chụp bài tập trước khi lưu nhé!');
        setTimeout(() => setStatusMessage(null), 3000);
        return;
      }
      const finalTitle = title.trim() || `Ảnh chụp môn ${currentSubject} - ${currentTopic}`;
      onAddMaterial({
        title: finalTitle,
        type: 'image',
        subject: currentSubject,
        topic: currentTopic,
        content: imagePreview,
        imageFileName: imageFileName || 'anh-bai-hoc.png',
        imageSize: imageSize || '150 KB',
        previewNote: previewNote.trim() || 'Ảnh chụp tài liệu học tập',
        summary: customSummary.trim() || undefined,
        keyPoints: keyPointsArray.length > 0 ? keyPointsArray : undefined,
      });
      setImagePreview(null);
      setImageFileName('');
      setImageSize('');
      setTitle('');
      setPreviewNote('');
      setCustomSummary('');
      setCustomKeyPoints('');
    } else if (activeType === 'url') {
      if (!urlInput.trim()) {
        setUrlError('Vui lòng nhập đường link bài giảng hoặc trang web');
        return;
      }
      try {
        let fullUrl = urlInput.trim();
        if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
          fullUrl = 'https://' + fullUrl;
        }
        const parsed = new URL(fullUrl);
        setUrlError('');
        const finalTitle = title.trim() || `Tài liệu từ ${parsed.hostname}`;
        onAddMaterial({
          title: finalTitle,
          type: 'url',
          subject: currentSubject,
          topic: currentTopic,
          content: fullUrl,
          urlDomain: parsed.hostname,
          previewNote: previewNote.trim() || `Bài giảng trực tuyến (${parsed.hostname})`,
          summary: customSummary.trim() || undefined,
          keyPoints: keyPointsArray.length > 0 ? keyPointsArray : undefined,
        });
        setUrlInput('');
        setTitle('');
        setPreviewNote('');
        setCustomSummary('');
        setCustomKeyPoints('');
      } catch {
        setUrlError('Đường link chưa hợp lệ. Ví dụ đúng: https://khanacademy.org');
        return;
      }
    }

    sound.playSuccess();
    setStatusMessage('Đã lưu bài học thành công vào kho học liệu của em!');
    setTimeout(() => setStatusMessage(null), 3500);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow space-y-5">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/40"></span>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              2. Thêm Học Liệu Cho Bài Học Này
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ưu tiên nhập ghi chép văn bản (Text-First), tải ảnh chụp sách hoặc dán đường link bài giảng
          </p>
        </div>

        {/* 3 Source Type Tabs - Text First highlighted with visual flair */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 self-start sm:self-auto shadow-inner">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveType('text');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeType === 'text'
                ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-900/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>1. Ghi chép (Text-First)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveType('image');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeType === 'image'
                ? 'bg-white text-amber-700 shadow-xs ring-1 ring-slate-900/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
            <span>2. Ảnh chụp sách / vở</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveType('url');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeType === 'url'
                ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-slate-900/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>3. Đường dẫn bài giảng</span>
          </button>
        </div>
      </div>

      {/* Success / Warning Message */}
      {statusMessage && (
        <div className="flex items-center gap-2 p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-950 rounded-2xl text-xs font-bold shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Form Submission */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
            Tiêu đề bài học / Tên ghi chép:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`Ví dụ: Tóm tắt lý thuyết ${currentTopic}, Bài tập 3 trang 42 SGK...`}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/90 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 bg-slate-50/60 hover:bg-white transition-all font-medium shadow-2xs"
          />
        </div>

        {/* TAB 1: TEXT-FIRST (Primary Experience) */}
        {activeType === 'text' && (
          <div className="space-y-3 bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100/80">
            {/* Action bar above textarea */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-black text-indigo-900 uppercase tracking-wide mr-1">✨ Mẫu bài học nhanh:</span>
                {quickTemplates.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setTitle(tpl.title);
                      setTextContent(tpl.body);
                    }}
                    className="text-[11px] px-3 py-1 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl transition-all font-bold cursor-pointer shadow-2xs hover:scale-102"
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="flex items-center gap-1.5 text-[11px] px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-all font-bold cursor-pointer shadow-2xs"
              >
                <Clipboard className="w-3.5 h-3.5 text-slate-500" /> Dán từ bộ nhớ tạm
              </button>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={8}
                placeholder={`Em hãy nhập nội dung bài học, định nghĩa, công thức hoặc dán đề bài tập cần giải vào đây...\n\nVí dụ: "Hôm nay cô giáo dạy về ${currentTopic}. Em cần lưu ý quy tắc: khi quy đồng mẫu số thì nhân cả tử và mẫu với thừa số phụ..."`}
                className="w-full p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 bg-white transition-all leading-relaxed font-normal resize-y shadow-2xs"
              />

              {/* Word & Char counter footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 mt-1">
                <span className="flex items-center gap-1 font-medium text-slate-500">
                  <BookOpen className="w-3 h-3 text-indigo-500" />
                  Trải nghiệm Text-First tập trung • Đọc êm dịu
                </span>
                <span className="font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  {wordCount} từ • {charCount} ký tự
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: IMAGE UPLOADER */}
        {activeType === 'image' && (
          <div className="space-y-3 bg-amber-50/30 p-4 rounded-2xl border border-amber-100/80">
            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/70 scale-[1.01]'
                  : 'border-amber-300 hover:border-amber-500 bg-white/80 hover:bg-white shadow-2xs'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                  <div className="max-h-60 overflow-hidden rounded-2xl border border-slate-200 inline-block bg-white p-2.5 shadow-sm">
                    <img
                      src={imagePreview}
                      alt="Ảnh bài học xem trước"
                      className="max-h-52 max-w-full object-contain mx-auto rounded-xl"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-3 text-xs">
                    <span className="font-bold text-slate-800">{imageFileName}</span>
                    <span className="text-slate-400 font-medium">({imageSize})</span>
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFileName('');
                        setImageSize('');
                      }}
                      className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Chọn ảnh khác
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center shadow-md shadow-amber-500/25">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">
                      Kéo thả ảnh chụp trang sách hoặc bài tập vào đây
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Hoặc bấm chuột để duyệt tệp ảnh từ máy (hỗ trợ PNG, JPG, SVG, WebP)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Sample Images for student demo */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-black text-amber-900 uppercase tracking-wide">📸 Thử nhanh ảnh mẫu:</span>
              {sampleImages.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setImagePreview(s.svgData);
                    setImageFileName(s.name);
                    setImageSize(s.size);
                    setTitle(s.title);
                  }}
                  className="text-[11px] px-3 py-1 bg-white hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold transition-all cursor-pointer shadow-2xs hover:scale-102"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: URL / LINK */}
        {activeType === 'url' && (
          <div className="space-y-3 bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100/80">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Địa chỉ liên kết bài giảng (URL):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    setUrlError('');
                  }}
                  placeholder="Dán link bài học vào đây (ví dụ: https://vi.khanacademy.org hoặc link YouTube...)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 bg-white transition-all font-medium shadow-2xs"
                />
                <LinkIcon className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3 pointer-events-none" />
              </div>
              {urlError && <p className="text-xs text-rose-600 font-semibold mt-1">{urlError}</p>}
            </div>

            {/* Quick sample URLs */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-black text-emerald-900 uppercase tracking-wide">🔗 Gợi ý link hay:</span>
              {sampleLinks.map((lnk, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setUrlInput(lnk.url);
                    setTitle(lnk.title);
                    setPreviewNote(lnk.note);
                  }}
                  className="text-[11px] px-3 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold transition-all cursor-pointer shadow-2xs hover:scale-102"
                >
                  🔗 {lnk.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Note / Tag for all */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Ghi chú nhắc nhở cho em (tùy chọn):
          </label>
          <input
            type="text"
            value={previewNote}
            onChange={(e) => setPreviewNote(e.target.value)}
            placeholder="Ví dụ: Ôn trước kỳ thi giữa kỳ, Nhờ thầy cô giảng lại câu cuối..."
            className="w-full px-4 py-2 rounded-2xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50/40 font-medium"
          />
        </div>

        {/* PROMPT #03: Tóm tắt & Điểm mấu chốt (Summary & Key Points) */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-slate-50 border border-indigo-200/80 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setShowSummarySection(!showSummarySection)}
              className="flex items-center gap-2 text-left cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-indigo-950 block">
                  Tóm Tắt & Điểm Mấu Chốt (Summary + Key Points)
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Tự động trích xuất nội dung cốt lõi chuẩn sư phạm lớp 7+
                </span>
              </div>
              {showSummarySection ? (
                <ChevronUp className="w-4 h-4 text-slate-400 ml-1" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
              )}
            </button>

            <button
              type="button"
              onClick={handleAutoGenerateSummary}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs hover:scale-102"
            >
              <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
              <span>✨ Tự Động Trích Xuất Ngay</span>
            </button>
          </div>

          {showSummarySection && (
            <div className="space-y-3 pt-2 border-t border-indigo-100/70 animate-fadeIn">
              {/* Summary field */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  📖 Tóm tắt ngắn, dễ hiểu (Summary):
                </label>
                <textarea
                  rows={2}
                  value={customSummary}
                  onChange={(e) => setCustomSummary(e.target.value)}
                  placeholder="Nhập hoặc bấm 'Tự động trích xuất' để hệ thống tóm tắt bản chất 2-3 câu..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white resize-y"
                />
              </div>

              {/* Key points field */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  🔑 Các điểm mấu chốt then chốt (Mỗi dòng một điểm mấu chốt):
                </label>
                <textarea
                  rows={3}
                  value={customKeyPoints}
                  onChange={(e) => setCustomKeyPoints(e.target.value)}
                  placeholder="📌 Bản chất trực quan: ...&#10;📐 Công thức vàng: ...&#10;💡 Phương pháp tư duy: ...&#10;⚠️ Bẫy sai lầm đề thi: ..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white font-mono text-[11px] resize-y"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40"
          >
            <PlusCircle className="w-4 h-4 text-indigo-200" />
            <span>Lưu Vào Góc Học Tập Của Em</span>
          </button>
        </div>
      </form>
    </div>
  );
};
