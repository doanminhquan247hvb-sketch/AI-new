import React, { useState } from 'react';
import { StudyMaterial, MaterialType } from '../../types';
import {
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Search,
  Pin,
  Trash2,
  ExternalLink,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  PlayCircle,
  Copy,
  Check,
  Filter,
  Pencil,
  Database,
  RotateCw,
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface MaterialListProps {
  materials: StudyMaterial[];
  onDeleteMaterial: (id: string) => void;
  onEditMaterial: (material: StudyMaterial) => void;
  onTogglePin: (id: string) => void;
  onViewDetail: (material: StudyMaterial) => void;
  onGoToSimulation?: () => void;
  onResetDefaults?: () => void;
  onGenerateSummary?: (id: string) => void;
  onGenerateAllSummaries?: () => void;
}

export const MaterialList: React.FC<MaterialListProps> = ({
  materials,
  onDeleteMaterial,
  onEditMaterial,
  onTogglePin,
  onViewDetail,
  onGoToSimulation,
  onResetDefaults,
  onGenerateSummary,
  onGenerateAllSummaries,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | MaterialType>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract unique math topics
  const availableTopics = Array.from(new Set(materials.map((m) => m.topic)));

  // Filter materials
  const filteredMaterials = materials.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesTopic = topicFilter === 'all' || item.topic === topicFilter;

    return matchesSearch && matchesType && matchesTopic;
  });

  // Sort: pinned items first, then by date/id
  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    sound.playClick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderTypeBadge = (type: MaterialType) => {
    switch (type) {
      case 'text':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
            <FileText className="w-3 h-3" /> Ghi chép
          </span>
        );
      case 'image':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
            <ImageIcon className="w-3 h-3" /> Ảnh trang sách
          </span>
        );
      case 'url':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
            <LinkIcon className="w-3 h-3" /> Bài giảng link
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow space-y-5">
      {/* Header & Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-sm shadow-indigo-500/40"></span>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              3. Kho Học Liệu Em Đã Nạp ({materials.length} bài)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Danh sách tất cả ghi chép, hình ảnh trang sách và liên kết học tập em đã lưu trữ
          </p>
        </div>

        {/* Quick summary counts & LocalStorage status */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold rounded-xl shadow-2xs" title="Dữ liệu được tự động lưu trong LocalStorage trình duyệt">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Lưu LocalStorage</span>
          </span>

          {onGenerateAllSummaries && (
            <button
              onClick={() => {
                sound.playSuccess();
                onGenerateAllSummaries();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              title="Tự động tạo Summary và Key Points cho tất cả bài học trong kho"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Tạo Summary Tất Cả</span>
            </button>
          )}

          <span className="px-2.5 py-1.5 bg-indigo-50/80 text-indigo-800 border border-indigo-200/60 font-bold rounded-xl shadow-2xs">
            📝 {materials.filter((m) => m.type === 'text').length} Văn bản
          </span>
          <span className="px-2.5 py-1.5 bg-amber-50/80 text-amber-800 border border-amber-200/60 font-bold rounded-xl shadow-2xs">
            📸 {materials.filter((m) => m.type === 'image').length} Ảnh
          </span>
          <span className="px-2.5 py-1.5 bg-emerald-50/80 text-emerald-800 border border-emerald-200/60 font-bold rounded-xl shadow-2xs">
            🔗 {materials.filter((m) => m.type === 'url').length} Link
          </span>
          {onResetDefaults && (
            <button
              onClick={onResetDefaults}
              className="text-[11px] px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl transition-all cursor-pointer"
              title="Khôi phục danh sách bài học mặc định ban đầu"
            >
              Đặt lại mẫu
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search input */}
        <div className="relative md:col-span-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tiêu đề, môn, nội dung..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50/50"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        {/* Topic Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-2xl border border-slate-200 text-xs text-slate-700 font-medium bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="all">Tất cả chủ đề Toán</option>
            {availableTopics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/70">
          <button
            onClick={() => setTypeFilter('all')}
            className={`flex-1 py-1 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center ${
              typeFilter === 'all'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setTypeFilter('text')}
            className={`flex-1 py-1 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center ${
              typeFilter === 'text'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Văn bản
          </button>
          <button
            onClick={() => setTypeFilter('image')}
            className={`flex-1 py-1 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center ${
              typeFilter === 'image'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ảnh
          </button>
          <button
            onClick={() => setTypeFilter('url')}
            className={`flex-1 py-1 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center ${
              typeFilter === 'url'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Link
          </button>
        </div>
      </div>

      {/* Materials List Render */}
      {sortedMaterials.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-800">
            Chưa tìm thấy học liệu nào phù hợp
          </p>
          <p className="text-[11px] text-slate-500">
            Em hãy thử đổi bộ lọc hoặc thêm ghi chép mới ở bước 2 phía trên nhé!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedMaterials.map((item) => {
            const isText = item.type === 'text';
            const isImage = item.type === 'image';
            const isUrl = item.type === 'url';

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 relative group ${
                  item.isPinned
                    ? 'border-indigo-300 bg-indigo-50/25 shadow-xs'
                    : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                {/* Card Top: Badges & Pin action */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {renderTypeBadge(item.type)}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Toán Học
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 truncate max-w-[150px]">
                      {item.topic}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onTogglePin(item.id)}
                      title={item.isPinned ? 'Bỏ ghim' : 'Ghim bài học quan trọng'}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                        item.isPinned
                          ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Pin className={`w-3.5 h-3.5 ${item.isPinned ? 'fill-amber-500' : ''}`} />
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        onEditMaterial(item);
                      }}
                      title="Sửa tiêu đề hoặc nội dung nguồn"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteMaterial(item.id)}
                      title="Xóa bài học này"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Body: Title & Content Preview */}
                <div className="space-y-1.5 flex-1">
                  <h3
                    onClick={() => onViewDetail(item)}
                    className="font-bold text-slate-900 text-xs sm:text-sm hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2"
                  >
                    {item.title}
                  </h3>

                  {/* Content Preview by Type */}
                  {isText && (
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed whitespace-pre-line bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                      {item.content}
                    </p>
                  )}

                  {isImage && (
                    <div
                      onClick={() => onViewDetail(item)}
                      className="relative max-h-36 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 cursor-pointer group-hover:opacity-95"
                    >
                      <img
                        src={item.content}
                        alt={item.title}
                        className="w-full h-32 object-contain bg-white"
                      />
                      <div className="absolute bottom-1 right-1 text-[10px] px-2 py-0.5 rounded-md bg-slate-900/80 text-white font-medium backdrop-blur-xs">
                        {item.imageSize || 'Hình ảnh'}
                      </div>
                    </div>
                  )}

                  {isUrl && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-semibold truncate">
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.content}</span>
                      </div>
                      {item.previewNote && (
                        <p className="text-[11px] text-slate-500 italic">
                          {item.previewNote}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* PROMPT #03: Summary + Key Points Preview on Card */}
                {item.summary ? (
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-slate-50 border border-indigo-100/90 text-xs space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-extrabold text-indigo-900 flex items-center gap-1.5 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Summary & Điểm cốt lõi</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md">
                          Lớp 7+
                        </span>
                        {onGenerateSummary && (
                          <button
                            onClick={() => onGenerateSummary(item.id)}
                            title="Tạo lại Summary & Key points"
                            className="p-1 hover:bg-white text-indigo-600 rounded-md transition-all cursor-pointer"
                          >
                            <RotateCw className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-700 line-clamp-2 leading-relaxed text-[11px] font-medium">
                      {item.summary}
                    </p>

                    {item.keyPoints && item.keyPoints.length > 0 && (
                      <div className="space-y-1 pt-1.5 border-t border-indigo-100/60">
                        {item.keyPoints.slice(0, 2).map((kp, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700 font-medium truncate">
                            <span className="shrink-0">{kp.slice(0, 2)}</span>
                            <span className="truncate">{kp.slice(2).trim()}</span>
                          </div>
                        ))}
                        {item.keyPoints.length > 2 && (
                          <span
                            onClick={() => onViewDetail(item)}
                            className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer block pt-0.5"
                          >
                            + Xem thêm {item.keyPoints.length - 2} điểm then chốt trong chi tiết...
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  onGenerateSummary && (
                    <button
                      onClick={() => onGenerateSummary(item.id)}
                      className="w-full py-2 px-3 rounded-xl bg-purple-50/80 hover:bg-purple-100 text-purple-800 border border-purple-200/80 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs group"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-600 group-hover:scale-110 transition-transform" />
                      <span>Tạo Summary & Key Points Ngay</span>
                    </button>
                  )
                )}

                {/* Card Footer: Metadata & Action buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {item.createdAt}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isText && (
                      <button
                        onClick={() => handleCopyText(item.id, item.content)}
                        className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all cursor-pointer"
                        title="Sao chép văn bản"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}

                    {isUrl && (
                      <a
                        href={item.content}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-md transition-all inline-flex items-center gap-1 font-semibold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Mở trang
                      </a>
                    )}

                    <button
                      onClick={() => {
                        sound.playClick();
                        onEditMaterial(item);
                      }}
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 border border-indigo-200/60"
                      title="Sửa tiêu đề hoặc nội dung bài học"
                    >
                      <Pencil className="w-3 h-3 text-indigo-600" /> Sửa
                    </button>

                    <button
                      onClick={() => onViewDetail(item)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3 text-indigo-600" /> Xem chi tiết
                    </button>
                  </div>
                </div>

                {/* If Math Topic, suggest opening visualizer */}
                {item.subject === 'Toán Học' && onGoToSimulation && (
                  <button
                    onClick={onGoToSimulation}
                    className="w-full mt-1 py-1.5 px-3 rounded-xl bg-indigo-50/90 hover:bg-indigo-100 border border-indigo-200/80 text-indigo-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <PlayCircle className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Thực hành trực quan chủ đề này trên Bàn Mô Phỏng</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
