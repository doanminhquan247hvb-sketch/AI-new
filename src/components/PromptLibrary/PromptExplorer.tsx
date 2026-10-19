import React, { useState } from 'react';
import { PROMPT_TEMPLATES } from '../../data/promptsData';
import { PromptCard } from './PromptCard';
import { Sparkles, Terminal, Search, Filter, Lightbulb, BookMarked } from 'lucide-react';

export const PromptExplorer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPrompts = PROMPT_TEMPLATES.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="prompts-library-section" className="scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Bộ Prompt Chuẩn Có Sẵn (Copy & Dùng Ngay)
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Kho Prompt "Bản Khung Môn Toán v.01"
          </h2>
          <p className="text-slate-600 text-sm md:text-base mt-1 max-w-2xl">
            Các cấu trúc prompt chuẩn được tối ưu hóa cho AI Studio, Gemini, ChatGPT, Claude... để dựng ngay giao diện học Toán trực quan, sư phạm và dễ hiểu nhất.
          </p>
        </div>

        {/* Tip Badge */}
        <div className="bg-amber-50 border border-amber-200/80 p-3 rounded-xl flex items-start gap-2.5 max-w-sm">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 leading-tight">
            <strong>Mẹo dùng prompt:</strong> Bạn chỉ cần bấm <em>"Sao chép Prompt"</em> và dán trực tiếp vào AI Studio hoặc ChatGPT để AI tạo ngay mã nguồn hoàn chỉnh!
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Tất cả Prompt' },
            { id: 'master', label: 'Khung Tổng Quát (Master)' },
            { id: 'concept', label: 'Khái niệm & Đồ thị' },
            { id: 'geometry', label: 'Hình học (Pytago)' },
            { id: 'solver', label: 'Giải từng bước' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo chủ đề, thẻ tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPrompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>
    </section>
  );
};
