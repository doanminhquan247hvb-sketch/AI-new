export type GradeLevel = 'primary' | 'secondary' | 'highschool' | 'general';

export type MathTopic = 'fractions' | 'algebra' | 'geometry' | 'functions' | 'statistics';

export type TeachingStyle = 'metaphor' | 'interactive_slider' | 'gamified' | 'step_by_step';

export interface PromptTemplate {
  id: string;
  title: string;
  category: 'master' | 'concept' | 'solver' | 'game' | 'geometry';
  level: string;
  summary: string;
  tags: string[];
  fullPrompt: string;
  useCase: string;
  keyFeatures: string[];
}

export interface QuizQuestion {
  id: string;
  topic: MathTopic;
  question: string;
  visualHint?: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export type MaterialType = 'text' | 'image' | 'url';

export interface SubjectItem {
  id: string;
  name: string;
  iconName: string;
  badgeColor: string;
  topics: string[];
}

export interface StudyMaterial {
  id: string;
  title: string;
  type: MaterialType;
  subject: string;
  topic: string;
  content: string;
  previewNote?: string;
  imageFileName?: string;
  imageSize?: string;
  urlDomain?: string;
  createdAt: string;
  isPinned?: boolean;
  wordCount?: number;
  summary?: string;
  keyPoints?: string[];
  summarizedAt?: string;
}

export type MasteryLevel = 'need_review' | 'learning' | 'mastered';

export interface ReviewCard {
  id: string;
  sourceMaterialId?: string;
  subject?: string;
  topic: string;
  title: string;
  cardCategory?: 'concept' | 'definition' | 'example' | 'distinction' | 'rule_note';
  question: string;
  hint?: string;
  answer: string;
  example?: string;
  distinction?: string;
  ruleNote?: string;
  formula?: string;
  keyRule?: string;
  visualMetaphor?: string;
  summary?: string;
  keyPoints?: string[];
  mastery: MasteryLevel;
  lastReviewedAt?: string;
  reviewCount: number;
}

export interface ReviewQuizItem {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tip?: string;
}

export type QuizAnswerType = 'multiple_choice' | 'true_false' | 'fill_blank';

export interface QuizQuestionItem {
  id: string;
  topic: string;
  question: string;
  type?: QuizAnswerType;
  options?: string[];
  correctIndex?: number;
  correctBool?: boolean;
  acceptableAnswers?: string[];
  explanation: string;
  tip?: string;
  subject?: string;
}

export interface SavedQuizPackage {
  id: string;
  title: string;
  description: string;
  topic: string;
  subject?: string;
  questions: QuizQuestionItem[];
  createdAt?: string;
}

export type PracticeQuestionType = 'true_false' | 'multiple_choice' | 'fill_blank' | 'short_answer';

export type TargetGrade = 'Lớp 6' | 'Lớp 7' | 'Lớp 8' | 'Lớp 9';

export interface PracticeQuestion {
  id: string;
  topic: string;
  gradeLevel: TargetGrade;
  type: PracticeQuestionType;
  prompt: string;
  contextNote?: string;
  // Cho Đúng / Sai
  correctBool?: boolean;
  // Cho Lựa chọn
  options?: string[];
  correctOptionIndex?: number;
  // Cho Điền từ / số ngắn
  acceptableAnswers?: string[];
  blankPlaceholder?: string;
  // Cho Hỏi-đáp ngắn
  referenceAnswer?: string;
  keywords?: string[];
  // Lời giải sư phạm bám sát SGK
  explanation: string;
  curriculumRef?: string;
  createdAt: string;
  userAnswer?: string | boolean | number;
  isCorrect?: boolean;
}

export interface SubjectTopicSnapshot {
  id: string;
  name: string; // Tên ngắn dễ nhớ, có thể đổi
  subject: string;
  topic: string;
  createdAt: string;
  updatedAt: string;
  sources: StudyMaterial[]; // snapshot working copy của tài liệu
  analysisPreview: {
    summary: string;
    keyPoints: string[];
    coreFormulas: string[];
    commonMistakes: string[];
    intuitionNotes: string[];
  };
  studyPack: {
    flashcards: ReviewCard[];
    quizQuestions: QuizQuestionItem[];
    practiceQuestions: PracticeQuestion[];
  };
  metadata: {
    totalMaterials: number;
    totalFlashcards: number;
    totalQuizzes: number;
    totalPractice: number;
    version: string;
    note?: string;
  };
}

