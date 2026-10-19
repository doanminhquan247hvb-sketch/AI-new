import React, { useState } from 'react';
import { PromptTemplate } from '../../types';
import { Copy, Check, ChevronDown, ChevronUp, Sparkles, BookOpen, ExternalLink, CheckCircle2 } from 'lucide-react';

interface PromptCardProps {
  prompt: PromptTemplate;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Banner / Tags */}
      <div className="p-5 md:p-6 border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            {prompt.level}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {prompt.tags.map((tag, idx) => (
              <span key={idx} className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 leading-snug">
          {prompt.title}
        </h3>
        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
          {prompt.summary}
        </p>

        {/* Key Features Bullet Points */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Đặc điểm thiết kế dễ hiểu:
          </span>
          {prompt.keyFeatures.map((feat, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-4 bg-slate-50/70 flex items-center justify-between gap-2 border-t border-slate-100">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer py-1.5 px-2 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          <span>{isExpanded ? 'Thu gọn prompt' : 'Xem toàn bộ prompt'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
            copied
              ? 'bg-emerald-600 text-white shadow-emerald-200'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-indigo-300'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Đã sao chép!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Sao chép Prompt</span>
            </>
          )}
        </button>
      </div>

      {/* Expanded Prompt Content */}
      {isExpanded && (
        <div className="p-5 bg-slate-900 text-slate-100 border-t border-slate-800 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto select-all">
          {prompt.fullPrompt}
        </div>
      )}
    </div>
  );
};
