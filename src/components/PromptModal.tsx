import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Sparkles, FileCode2 } from 'lucide-react';
import { PROMPT_TEMPLATES } from '../data/promptsData';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedPromptId, setSelectedPromptId] = useState<string>('master-math-v1');

  if (!isOpen) return null;

  const currentPrompt = PROMPT_TEMPLATES.find((p) => p.id === selectedPromptId) || PROMPT_TEMPLATES[0];

  const handleCopy = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Prompt Chuẩn Dựng "Bản Khung Môn Toán v.01"
              </h3>
              <p className="text-xs text-slate-500">
                Sao chép để dán vào AI Studio, Gemini, ChatGPT hoặc Claude
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prompt selector tabs */}
        <div className="flex items-center gap-1.5 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto">
          {PROMPT_TEMPLATES.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPromptId(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedPromptId === p.id
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p.tags[0]}
            </button>
          ))}
        </div>

        {/* Prompt Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800">{currentPrompt.title}</h4>
            <button
              onClick={() => handleCopy(0, currentPrompt.fullPrompt)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                copiedIndex === 0
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {copiedIndex === 0 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 0 ? 'Đã sao chép!' : 'Sao chép Prompt'}</span>
            </button>
          </div>

          <div className="bg-slate-950 rounded-2xl p-4 text-xs font-mono text-emerald-300/90 whitespace-pre-wrap leading-relaxed select-all">
            {currentPrompt.fullPrompt}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Giao diện thực tế đang chạy trực tiếp trên màn hình của bạn!</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-bold text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  );
};
