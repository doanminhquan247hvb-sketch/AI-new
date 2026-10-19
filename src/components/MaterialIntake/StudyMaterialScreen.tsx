import React, { useState, useEffect } from 'react';
import { SubjectItem, StudyMaterial } from '../../types';
import { DEFAULT_SUBJECTS, INITIAL_STUDY_MATERIALS } from '../../data/defaultMaterials';
import { SubjectTopicSelector } from './SubjectTopicSelector';
import { MaterialInputForm } from './MaterialInputForm';
import { MaterialList } from './MaterialList';
import { MaterialDetailModal } from './MaterialDetailModal';
import { MaterialEditModal } from './MaterialEditModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { SaveLoadSnapshotModal } from '../SnapshotManager/SaveLoadSnapshotModal';
import { BookOpen, Sparkles, Plus, GraduationCap, HeartHandshake, CheckCircle2, Database, FolderOpen, Save } from 'lucide-react';
import { sound } from '../../utils/sound';
import { generateMaterialSummary } from '../../utils/summaryGenerator';
import { INITIAL_REVIEW_CARDS, INITIAL_REVIEW_QUIZZES } from '../../data/defaultReviewData';
import { INITIAL_PRACTICE_QUESTIONS } from '../../data/defaultPracticeQuestions';

interface StudyMaterialScreenProps {
  onGoToSimulation?: () => void;
  onGoToReview?: () => void;
  onGoToSummary?: () => void;
}

const STORAGE_KEY_MATERIALS = 'toan_truc_quan_materials_v2';
const STORAGE_KEY_SUBJECTS = 'toan_truc_quan_subjects_v2';

export const StudyMaterialScreen: React.FC<StudyMaterialScreenProps> = ({
  onGoToSimulation,
  onGoToReview,
  onGoToSummary,
}) => {
  // Load state from localStorage or fallback to defaults (only math)
  const [subjects, setSubjects] = useState<SubjectItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SUBJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name === 'Toán Học') {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_SUBJECTS;
  });

  const [materials, setMaterials] = useState<StudyMaterial[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MATERIALS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_STUDY_MATERIALS;
  });

  // Current Subject & Topic being studied: Strictly 'Toán Học'
  const selectedSubject = 'Toán Học';
  const [selectedTopic, setSelectedTopic] = useState<string>('Phân số & Tỷ số');

  // Modal detail view
  const [viewingMaterial, setViewingMaterial] = useState<StudyMaterial | null>(null);

  // Edit Modal state (Update in CRUD)
  const [editingMaterial, setEditingMaterial] = useState<StudyMaterial | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Delete Confirm Modal state (Delete in CRUD without window.confirm)
  const [deletingMaterial, setDeletingMaterial] = useState<StudyMaterial | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Snapshot modal state
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);

  // Sync to localStorage whenever materials change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MATERIALS, JSON.stringify(materials));
    } catch {
      // ignore
    }
  }, [materials]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SUBJECTS, JSON.stringify(subjects));
    } catch {
      // ignore
    }
  }, [subjects]);

  // Listen to global app_snapshot_restored event to sync active topic & materials
  useEffect(() => {
    const handleSnapshotRestored = (e: any) => {
      const snap = e.detail;
      if (snap) {
        setSelectedTopic(snap.topic);
        try {
          const saved = localStorage.getItem(STORAGE_KEY_MATERIALS);
          if (saved) setMaterials(JSON.parse(saved));
        } catch {}
      }
    };
    window.addEventListener('app_snapshot_restored', handleSnapshotRestored);
    return () => window.removeEventListener('app_snapshot_restored', handleSnapshotRestored);
  }, []);

  // Handler: Add new topic to math subject
  const handleAddTopic = (_subjectName: string, newTopicName: string) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.name === 'Toán Học') {
          if (s.topics.includes(newTopicName)) return s;
          return { ...s, topics: [...s.topics, newTopicName] };
        }
        return s;
      })
    );
    setSelectedTopic(newTopicName);
  };

  // Handler: CREATE - Add study material with automatic summary & key points
  const handleAddMaterial = (materialData: Omit<StudyMaterial, 'id' | 'createdAt'>) => {
    // Generate summary and key points
    const summaryRes = generateMaterialSummary({
      ...materialData,
      id: '',
      createdAt: '',
    });

    const newMaterial: StudyMaterial = {
      ...materialData,
      id: `mat-${Date.now()}`,
      createdAt: 'Vừa xong',
      summary: summaryRes.summary,
      keyPoints: summaryRes.keyPoints,
      summarizedAt: summaryRes.summarizedAt,
    };
    setMaterials((prev) => [newMaterial, ...prev]);
  };

  // Handler: Generate Summary & Key Points for a single material
  const handleGenerateSummary = (id: string) => {
    sound.playSuccess();
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const res = generateMaterialSummary(m);
          const updated = {
            ...m,
            summary: res.summary,
            keyPoints: res.keyPoints,
            summarizedAt: res.summarizedAt,
          };
          if (viewingMaterial && viewingMaterial.id === id) {
            setViewingMaterial(updated);
          }
          return updated;
        }
        return m;
      })
    );
  };

  // Handler: Batch Generate Summary & Key Points for all materials
  const handleGenerateAllSummaries = () => {
    sound.playSuccess();
    setMaterials((prev) =>
      prev.map((m) => {
        const res = generateMaterialSummary(m);
        const updated = {
          ...m,
          summary: res.summary,
          keyPoints: res.keyPoints,
          summarizedAt: res.summarizedAt,
        };
        if (viewingMaterial && viewingMaterial.id === m.id) {
          setViewingMaterial(updated);
        }
        return updated;
      })
    );
  };

  // Handler: READ/VIEW - Open detail modal
  const handleViewMaterial = (material: StudyMaterial) => {
    setViewingMaterial(material);
  };

  // Handler: UPDATE - Open edit modal
  const handleOpenEdit = (material: StudyMaterial) => {
    setEditingMaterial(material);
    setIsEditModalOpen(true);
  };

  // Handler: UPDATE - Save updated material
  const handleSaveEdit = (updatedMaterial: StudyMaterial) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === updatedMaterial.id ? updatedMaterial : m))
    );
    if (viewingMaterial && viewingMaterial.id === updatedMaterial.id) {
      setViewingMaterial(updatedMaterial);
    }
  };

  // Handler: DELETE - Request delete (opens friendly modal instead of window.confirm)
  const handleRequestDelete = (id: string) => {
    const target = materials.find((m) => m.id === id);
    if (target) {
      setDeletingMaterial(target);
      setIsDeleteModalOpen(true);
      sound.playClick();
    }
  };

  // Handler: DELETE - Confirm delete
  const handleConfirmDelete = () => {
    if (deletingMaterial) {
      setMaterials((prev) => prev.filter((m) => m.id !== deletingMaterial.id));
      setIsDeleteModalOpen(false);
      setDeletingMaterial(null);
      sound.playSuccess();
    }
  };

  // Handler: Reset to default samples
  const handleResetDefaults = () => {
    setMaterials(INITIAL_STUDY_MATERIALS);
    try {
      localStorage.setItem(STORAGE_KEY_MATERIALS, JSON.stringify(INITIAL_STUDY_MATERIALS));
    } catch {
      // ignore
    }
    sound.playSuccess();
  };

  // Handler: Toggle pin
  const handleTogglePin = (id: string) => {
    sound.playClick();
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isPinned: !m.isPinned } : m))
    );
  };

  return (
    <section id="study-material-intake-screen" className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-4 rounded-3xl border border-indigo-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              Góc Nạp Học Liệu Môn Toán (Nhập Bài Học Đầu Vào)
            </h2>
            <p className="text-xs text-slate-600">
              Lưu trữ mọi ghi chép công thức, đề bài tập, hình ảnh trang sách và link bài học môn Toán
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
          <button
            onClick={() => { sound.playClick(); setIsSnapshotModalOpen(true); }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer"
            title="Lưu hoặc mở bộ ôn tập (Snapshots)"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Lưu / Mở Bộ Ôn Tập</span>
          </button>

          <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-xl text-slate-700 border border-slate-200 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Ưu tiên Text-First
          </span>
          {onGoToSummary && (
            <button
              onClick={() => { sound.playClick(); onGoToSummary(); }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kho Tóm Tắt & Key Points</span>
            </button>
          )}
          {onGoToReview && (
            <button
              onClick={() => { sound.playClick(); onGoToReview(); }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Ôn Tập & Review Thẻ</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. Subject & Topic Selector (Math Specialized) */}
      <SubjectTopicSelector
        subjects={subjects}
        selectedSubject={selectedSubject}
        selectedTopic={selectedTopic}
        onSelectTopic={(topicName) => setSelectedTopic(topicName)}
        onAddTopic={handleAddTopic}
      />

      {/* 2. CREATE: Text-First & Multi-Source Input Form */}
      <MaterialInputForm
        currentSubject={selectedSubject}
        currentTopic={selectedTopic}
        onAddMaterial={handleAddMaterial}
      />

      {/* 3. READ, UPDATE, DELETE: List of Added Materials with LocalStorage */}
      <MaterialList
        materials={materials}
        onDeleteMaterial={handleRequestDelete}
        onEditMaterial={handleOpenEdit}
        onTogglePin={handleTogglePin}
        onViewDetail={handleViewMaterial}
        onGoToSimulation={onGoToSimulation}
        onResetDefaults={handleResetDefaults}
        onGenerateSummary={handleGenerateSummary}
        onGenerateAllSummaries={handleGenerateAllSummaries}
      />

      {/* Detail Modal (READ) */}
      <MaterialDetailModal
        material={viewingMaterial}
        onClose={() => setViewingMaterial(null)}
        onEdit={(mat) => handleOpenEdit(mat)}
        onGoToSimulation={onGoToSimulation}
        onGenerateSummary={handleGenerateSummary}
      />

      {/* Edit Modal (UPDATE) */}
      <MaterialEditModal
        material={editingMaterial}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingMaterial(null);
        }}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Modal (DELETE) */}
      <DeleteConfirmModal
        material={deletingMaterial}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingMaterial(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Save & Load Snapshot Modal */}
      <SaveLoadSnapshotModal
        isOpen={isSnapshotModalOpen}
        onClose={() => setIsSnapshotModalOpen(false)}
        currentSubject={selectedSubject}
        currentTopic={selectedTopic}
        materials={materials}
        reviewCards={INITIAL_REVIEW_CARDS}
        quizQuestions={INITIAL_REVIEW_QUIZZES}
        practiceQuestions={INITIAL_PRACTICE_QUESTIONS}
        onSnapshotLoaded={(snap) => {
          setSelectedTopic(snap.topic);
          try {
            const saved = localStorage.getItem(STORAGE_KEY_MATERIALS);
            if (saved) setMaterials(JSON.parse(saved));
          } catch {}
        }}
      />
    </section>
  );
};
