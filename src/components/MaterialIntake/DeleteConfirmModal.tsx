import React from 'react';
import { StudyMaterial } from '../../types';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { sound } from '../../utils/sound';

interface DeleteConfirmModalProps {
  material: StudyMaterial | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  material,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !material) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 overflow-hidden space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-black text-slate-900">
            Xác nhận xóa nguồn học liệu
          </h3>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Em có chắc chắn muốn xóa bài học{' '}
            <span className="font-bold text-slate-900">"{material.title}"</span> ({material.topic}) khỏi danh sách không?
          </p>
          <p className="text-[11px] text-rose-600 font-medium mt-1">
            Dữ liệu sẽ được cập nhật và xóa khỏi LocalStorage trên trình duyệt của em.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onConfirm();
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-rose-600/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xác nhận xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
