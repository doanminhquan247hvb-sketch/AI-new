import { SubjectTopicSnapshot, StudyMaterial, ReviewCard, QuizQuestionItem, PracticeQuestion } from '../types';
import { INITIAL_STUDY_MATERIALS } from '../data/defaultMaterials';
import { INITIAL_REVIEW_CARDS, INITIAL_REVIEW_QUIZZES } from '../data/defaultReviewData';
import { INITIAL_PRACTICE_QUESTIONS } from '../data/defaultPracticeQuestions';
import { buildGroundingPackage } from './groundedEngine';

export const STORAGE_KEY_SNAPSHOTS = 'toan_truc_quan_topic_snapshots_v1';
export const STORAGE_KEY_ACTIVE_TOPIC = 'toan_truc_quan_active_topic_v1';
export const STORAGE_KEY_ACTIVE_SUBJECT = 'toan_truc_quan_active_subject_v1';
export const STORAGE_KEY_MATERIALS = 'toan_truc_quan_materials_v2';
export const STORAGE_KEY_CARDS = 'toan_truc_quan_review_cards_v1';

/**
 * Generate default initial snapshots so user can immediately test Save/Load
 */
export function getDefaultSnapshots(): SubjectTopicSnapshot[] {
  const pythagorasPkg = buildGroundingPackage(
    'Định Lý Pytago',
    INITIAL_STUDY_MATERIALS,
    INITIAL_REVIEW_CARDS,
    INITIAL_REVIEW_QUIZZES,
    INITIAL_PRACTICE_QUESTIONS
  );

  const fractionsPkg = buildGroundingPackage(
    'Phân số & Tỷ số',
    INITIAL_STUDY_MATERIALS,
    INITIAL_REVIEW_CARDS,
    INITIAL_REVIEW_QUIZZES,
    INITIAL_PRACTICE_QUESTIONS
  );

  const pythagorasSources = INITIAL_STUDY_MATERIALS.filter((m) =>
    m.topic.toLowerCase().includes('pytago')
  );

  const fractionsSources = INITIAL_STUDY_MATERIALS.filter((m) =>
    m.topic.toLowerCase().includes('phân số')
  );

  return [
    {
      id: 'snap-pytagor-01',
      name: 'Toán 7 - Định Lý Pytago',
      subject: 'Toán Học',
      topic: 'Định Lý Pytago',
      createdAt: '10/10/2026, 09:30',
      updatedAt: '12/10/2026, 14:15',
      sources: pythagorasSources.length > 0 ? pythagorasSources : INITIAL_STUDY_MATERIALS.slice(0, 1),
      analysisPreview: pythagorasPkg.analysisPreview,
      studyPack: {
        flashcards: INITIAL_REVIEW_CARDS.filter((c) => c.topic.includes('Pytago')),
        quizQuestions: INITIAL_REVIEW_QUIZZES.filter((q) => q.topic.includes('Pytago')),
        practiceQuestions: INITIAL_PRACTICE_QUESTIONS.filter((p) => p.topic.includes('Pytago')),
      },
      metadata: {
        totalMaterials: pythagorasSources.length || 1,
        totalFlashcards: 3,
        totalQuizzes: 4,
        totalPractice: 3,
        version: '1.0',
        note: 'Bộ ôn tập chuẩn tam giác vuông & hệ thức bình phương cạnh huyền',
      },
    },
    {
      id: 'snap-fractions-02',
      name: 'Toán 6 - Phân Số & Tỷ Số',
      subject: 'Toán Học',
      topic: 'Phân số & Tỷ số',
      createdAt: '11/10/2026, 08:20',
      updatedAt: '11/10/2026, 16:40',
      sources: fractionsSources.length > 0 ? fractionsSources : INITIAL_STUDY_MATERIALS.slice(0, 1),
      analysisPreview: fractionsPkg.analysisPreview,
      studyPack: {
        flashcards: INITIAL_REVIEW_CARDS.filter((c) => c.topic.includes('Phân số')),
        quizQuestions: INITIAL_REVIEW_QUIZZES.filter((q) => q.topic.includes('Phân số')),
        practiceQuestions: INITIAL_PRACTICE_QUESTIONS.filter((p) => p.topic.includes('Phân số')),
      },
      metadata: {
        totalMaterials: fractionsSources.length || 1,
        totalFlashcards: 2,
        totalQuizzes: 3,
        totalPractice: 3,
        version: '1.0',
        note: 'Gói ôn tập rút gọn phân số, quy đồng và bài toán tỷ số thực tế',
      },
    },
  ];
}

/**
 * Get all stored snapshots from localStorage
 */
export function getStoredSnapshots(): SubjectTopicSnapshot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SNAPSHOTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  const defaults = getDefaultSnapshots();
  saveStoredSnapshots(defaults);
  return defaults;
}

/**
 * Save snapshots list to localStorage
 */
export function saveStoredSnapshots(snapshots: SubjectTopicSnapshot[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SNAPSHOTS, JSON.stringify(snapshots));
  } catch {}
}

/**
 * Capture and save current working copy as a complete snapshot
 */
export function saveCurrentWorkingCopySnapshot({
  name,
  subject,
  topic,
  sources,
  analysisPreview,
  studyPack,
  note,
}: {
  name?: string;
  subject: string;
  topic: string;
  sources: StudyMaterial[];
  analysisPreview: SubjectTopicSnapshot['analysisPreview'];
  studyPack: SubjectTopicSnapshot['studyPack'];
  note?: string;
}): SubjectTopicSnapshot {
  const currentSnapshots = getStoredSnapshots();
  const timestamp = new Date().toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const snapshotName = name?.trim() || `${subject} - ${topic}`;

  // Check if updating existing snapshot with same topic/subject
  const existingIndex = currentSnapshots.findIndex(
    (s) => s.topic.toLowerCase() === topic.toLowerCase() && s.subject.toLowerCase() === subject.toLowerCase()
  );

  const newSnapshot: SubjectTopicSnapshot = {
    id: existingIndex >= 0 ? currentSnapshots[existingIndex].id : `snap-${Date.now()}`,
    name: snapshotName,
    subject,
    topic,
    createdAt: existingIndex >= 0 ? currentSnapshots[existingIndex].createdAt : timestamp,
    updatedAt: timestamp,
    sources: sources.length > 0 ? sources : INITIAL_STUDY_MATERIALS.slice(0, 1),
    analysisPreview,
    studyPack,
    metadata: {
      totalMaterials: sources.length,
      totalFlashcards: studyPack.flashcards.length,
      totalQuizzes: studyPack.quizQuestions.length,
      totalPractice: studyPack.practiceQuestions.length,
      version: '1.0',
      note: note || `Snapshot lưu lúc ${timestamp}`,
    },
  };

  let updatedList: SubjectTopicSnapshot[];
  if (existingIndex >= 0) {
    updatedList = [...currentSnapshots];
    updatedList[existingIndex] = newSnapshot;
  } else {
    updatedList = [newSnapshot, ...currentSnapshots];
  }

  saveStoredSnapshots(updatedList);
  return newSnapshot;
}

/**
 * Restore a snapshot into active application state.
 * Emits 'app_snapshot_restored' window event so all components update immediately.
 */
export function restoreSnapshotToAppState(snapshot: SubjectTopicSnapshot): void {
  try {
    // 1. Set active topic & subject
    localStorage.setItem(STORAGE_KEY_ACTIVE_TOPIC, snapshot.topic);
    localStorage.setItem(STORAGE_KEY_ACTIVE_SUBJECT, snapshot.subject);

    // 2. Restore materials (sources working copy)
    const existingMaterialsRaw = localStorage.getItem(STORAGE_KEY_MATERIALS);
    let allMaterials: StudyMaterial[] = [];
    if (existingMaterialsRaw) {
      try {
        allMaterials = JSON.parse(existingMaterialsRaw);
      } catch {}
    }
    // Filter out previous materials for this topic and replace with snapshot's sources
    const otherMaterials = allMaterials.filter(
      (m) => m.topic.toLowerCase() !== snapshot.topic.toLowerCase()
    );
    const mergedMaterials = [...snapshot.sources, ...otherMaterials];
    localStorage.setItem(STORAGE_KEY_MATERIALS, JSON.stringify(mergedMaterials));

    // 3. Restore flashcards
    const existingCardsRaw = localStorage.getItem(STORAGE_KEY_CARDS);
    let allCards: ReviewCard[] = [];
    if (existingCardsRaw) {
      try {
        allCards = JSON.parse(existingCardsRaw);
      } catch {}
    }
    const otherCards = allCards.filter(
      (c) => c.topic.toLowerCase() !== snapshot.topic.toLowerCase()
    );
    const mergedCards = [...snapshot.studyPack.flashcards, ...otherCards];
    localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(mergedCards));

    // 4. Dispatch global event so UI reacts and updates instantly
    window.dispatchEvent(
      new CustomEvent('app_snapshot_restored', {
        detail: snapshot,
      })
    );
  } catch (err) {
    console.error('Failed to restore snapshot:', err);
  }
}

/**
 * Rename a snapshot
 */
export function renameSnapshot(id: string, newName: string): SubjectTopicSnapshot[] {
  const snapshots = getStoredSnapshots();
  const updated = snapshots.map((s) => (s.id === id ? { ...s, name: newName.trim() } : s));
  saveStoredSnapshots(updated);
  return updated;
}

/**
 * Delete a snapshot
 */
export function deleteSnapshot(id: string): SubjectTopicSnapshot[] {
  const snapshots = getStoredSnapshots();
  const updated = snapshots.filter((s) => s.id !== id);
  saveStoredSnapshots(updated);
  return updated;
}
