import React, { useState } from 'react';
import { SubjectItem } from '../../types';
import { 
  Calculator, 
  Plus, 
  Check, 
  Sparkles,
  Layers
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface SubjectTopicSelectorProps {
  subjects: SubjectItem[];
  selectedSubject: string;
  selectedTopic: string;
  onSelectSubject?: (subjectName: string) => void;
  onSelectTopic: (topicName: string) => void;
  onAddTopic: (subjectName: string, newTopicName: string) => void;
  onAddSubject?: (newSubjectName: string) => void;
}

export const SubjectTopicSelector: React.FC<SubjectTopicSelectorProps> = ({
  subjects,
  selectedSubject,
  selectedTopic,
  onSelectTopic,
  onAddTopic,
}) => {
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicInput, setNewTopicInput] = useState('');

  const currentSubjectItem = subjects.find((s) => s.name === selectedSubject) || subjects[0];

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicInput.trim()) return;
    onAddTopic(selectedSubject, newTopicInput.trim());
    setNewTopicInput('');
    setIsAddingTopic(false);
    sound.playSuccess();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-sm shadow-indigo-500/40"></span>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              1. Chọn Chủ Đề Môn Toán Đang Học
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chuyên biệt cho Môn Toán: Chọn phân môn và bài học để nạp ghi chép hoặc xem mô phỏng trực quan
          </p>
        </div>

        {/* Current Active Indicator Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200/90 text-xs text-indigo-950 font-bold self-start sm:self-auto shadow-2xs">
          <Calculator className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Môn: <strong className="text-indigo-700 font-black">Toán Học</strong></span>
          <span className="text-indigo-300">•</span>
          <span>Chủ đề: <strong className="text-indigo-700 font-black truncate max-w-[170px] inline-block align-bottom">{selectedTopic}</strong></span>
        </div>
      </div>

      {/* Math Banner / Subject Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm shadow-indigo-500/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900">Chương Trình Môn Toán Trực Quan</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">Chuyên Sâu Toán</span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Tập trung hoàn toàn vào các dạng toán đại số, hình học, phân số và đồ thị
            </p>
          </div>
        </div>
        
        {!isAddingTopic && (
          <button
            onClick={() => {
              sound.playClick();
              setIsAddingTopic(true);
            }}
            className="text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-white px-3.5 py-2 rounded-xl border border-indigo-200 hover:border-indigo-300 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-2xs transition-all hover:scale-102"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm bài toán mới
          </button>
        )}
      </div>

      {/* Row: Topics of Mathematics */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Các chủ đề & dạng bài toán:
          </label>
        </div>

        {isAddingTopic && (
          <form onSubmit={handleCreateTopic} className="flex items-center gap-2 mb-3 bg-amber-50/50 p-2.5 rounded-2xl border border-amber-200">
            <input
              type="text"
              value={newTopicInput}
              onChange={(e) => setNewTopicInput(e.target.value)}
              placeholder="Nhập tên bài toán / chuyên đề mới (ví dụ: Hình lăng trụ đứng, Căn bậc hai...)"
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-slate-900"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              Thêm chủ đề
            </button>
            <button
              type="button"
              onClick={() => setIsAddingTopic(false)}
              className="px-3.5 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-100 cursor-pointer"
            >
              Hủy
            </button>
          </form>
        )}

        <div className="flex flex-wrap gap-2">
          {currentSubjectItem?.topics.map((t) => {
            const isTopicSelected = t === selectedTopic;
            return (
              <button
                key={t}
                onClick={() => {
                  sound.playClick();
                  onSelectTopic(t);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer border flex items-center gap-2 ${
                  isTopicSelected
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black border-amber-500 shadow-sm shadow-amber-500/20 ring-2 ring-amber-300/40 translate-y-[-1px]'
                    : 'bg-slate-50/70 hover:bg-white text-slate-700 font-semibold border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <span>{t}</span>
                {isTopicSelected && <Check className="w-3.5 h-3.5 text-slate-950" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
