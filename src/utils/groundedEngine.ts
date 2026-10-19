import { StudyMaterial, ReviewCard, QuizQuestionItem, PracticeQuestion } from '../types';

export interface GroundingPackage {
  topic: string;
  subject: string;
  sources: {
    id: string;
    title: string;
    type: string;
    content: string;
    keyPoints?: string[];
    summary?: string;
  }[];
  analysisPreview: {
    summary: string;
    keyPoints: string[];
    coreFormulas: string[];
    commonMistakes: string[];
    intuitionNotes: string[];
  };
  studyPack: {
    flashcards: {
      question: string;
      answer: string;
      formula?: string;
      keyRule?: string;
    }[];
    quizQuestions: {
      question: string;
      explanation: string;
      tip?: string;
    }[];
    practiceQuestions: {
      prompt: string;
      explanation: string;
      formulaOrRef?: string;
    }[];
  };
}

/**
 * Build a structured Grounding Package (sources, analysisPreview, studyPack)
 * for any given topic from the application's stored datasets.
 */
export function buildGroundingPackage(
  topic: string,
  materials: StudyMaterial[],
  flashcards: ReviewCard[],
  quizItems: QuizQuestionItem[],
  practiceQuestions: PracticeQuestion[]
): GroundingPackage {
  // 1. Sources: filter materials by topic
  const matchedMaterials = materials.filter(
    (m) => m.topic.toLowerCase().includes(topic.toLowerCase()) || topic.toLowerCase().includes(m.topic.toLowerCase())
  );
  const activeMaterials = matchedMaterials.length > 0 ? matchedMaterials : materials.slice(0, 2);

  const sources = activeMaterials.map((m) => ({
    id: m.id,
    title: m.title,
    type: m.type,
    content: m.content,
    keyPoints: m.keyPoints,
    summary: m.summary,
  }));

  // 2. AnalysisPreview: aggregate summary, key points, formulas
  const allSummaries = activeMaterials.map((m) => m.summary).filter(Boolean).join(' \n');
  const allKeyPoints = Array.from(new Set(activeMaterials.flatMap((m) => m.keyPoints || [])));

  // Extract core formulas & rules from materials and flashcards
  const matchedFlashcards = flashcards.filter(
    (fc) => fc.topic.toLowerCase().includes(topic.toLowerCase()) || topic.toLowerCase().includes(fc.topic.toLowerCase())
  );
  const activeFlashcards = matchedFlashcards.length > 0 ? matchedFlashcards : flashcards.slice(0, 3);

  const coreFormulas = Array.from(
    new Set(activeFlashcards.map((fc) => fc.formula).filter(Boolean) as string[])
  );

  const analysisPreview = {
    summary: allSummaries || `Tóm tắt trọng tâm chủ đề ${topic}: Bản chất toán học, các quy tắc biến đổi và định lý ứng dụng thực tế.`,
    keyPoints: allKeyPoints.length > 0 ? allKeyPoints : [
      `Bản chất chủ đề ${topic}: Giữ vững quy tắc cốt lõi đã học.`,
      `Công thức tính toán cơ bản và mối liên hệ giữa các đại lượng.`,
      `Tránh nhầm lẫn các trường hợp đặc biệt.`,
    ],
    coreFormulas: coreFormulas.length > 0 ? coreFormulas : ['c² = a² + b² (Định lý Pytago)', 'A + B = C ⟺ A = C - B (Chuyển vế đổi dấu)'],
    commonMistakes: [
      'Quên đổi dấu khi chuyển vế',
      'Nhầm lẫn giữa cạnh huyền và cạnh góc vuông',
      'Áp dụng định lý khi tam giác chưa vuông',
    ],
    intuitionNotes: [
      'Hình dung trực quan bằng diện tích các hình vuông dựng trên các cạnh',
      'Cân thăng bằng hai vế: thêm/bớt cùng một lượng thì cân vẫn thăng bằng',
    ],
  };

  // 3. StudyPack: Flashcards, Quiz, Practice
  const matchedQuiz = quizItems.filter(
    (q) => q.topic.toLowerCase().includes(topic.toLowerCase()) || topic.toLowerCase().includes(q.topic.toLowerCase())
  );
  const activeQuiz = matchedQuiz.length > 0 ? matchedQuiz : quizItems.slice(0, 3);

  const matchedPractice = practiceQuestions.filter(
    (p) => p.topic.toLowerCase().includes(topic.toLowerCase()) || topic.toLowerCase().includes(p.topic.toLowerCase())
  );
  const activePractice = matchedPractice.length > 0 ? matchedPractice : practiceQuestions.slice(0, 3);

  const studyPack = {
    flashcards: activeFlashcards.map((fc) => ({
      question: fc.question,
      answer: fc.answer,
      formula: fc.formula,
      keyRule: fc.keyRule,
    })),
    quizQuestions: activeQuiz.map((q) => ({
      question: q.question,
      explanation: q.explanation,
      tip: q.tip,
    })),
    practiceQuestions: activePractice.map((p) => ({
      prompt: p.prompt,
      explanation: p.explanation,
      formulaOrRef: p.curriculumRef || p.explanation,
    })),
  };

  return {
    topic,
    subject: activeMaterials[0]?.subject || 'Toán Học',
    sources,
    analysisPreview,
    studyPack,
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isGrounded?: boolean;
  citationSource?: 'sources' | 'analysisPreview' | 'studyPack' | null;
  citationSnippet?: string;
}

/**
 * Intelligent client-side grounding verification engine.
 * Ensures strict enforcement of:
 * "nếu câu hỏi không có trong tài liệu hoặc không suy ra được từ tài liệu, phải trả lời rõ:
 * 'Nội dung này nằm ngoài phạm vi tài liệu đã cung cấp.'"
 */
export function queryClientGroundedEngine(
  query: string,
  pkg: GroundingPackage
): {
  reply: string;
  isGrounded: boolean;
  citationSource: 'sources' | 'analysisPreview' | 'studyPack' | null;
  citationSnippet: string | null;
} {
  const qLower = query.toLowerCase().trim();

  // 1. Check for obviously ungrounded questions (general chatter, other domains, outside curriculum)
  const ungroundedKeywords = [
    'thời tiết', 'hôm nay ăn gì', 'thủ đô', 'paris', 'pháp', 'hà nội ở đâu', 'tổng thống',
    'lập trình', 'python', 'javascript', 'react', 'code', 'html', 'css',
    'bóng đá', 'ronaldo', 'messi', 'ca sĩ', 'bài hát', 'phim', 'tình yêu',
    'bitcoin', 'chứng khoán', 'chiến tranh thế giới', 'địa lý thế giới'
  ];

  const topicKeywords: Record<string, string[]> = {
    'pytago': ['pytago', 'pythagore', 'tam giác vuông', 'cạnh huyền', 'cạnh góc vuông', 'bình phương', 'ba số pytago', '3, 4, 5', 'bc²', 'ab²', 'ac²', 'định lý đảo', 'tam giác'],
    'phương trình': ['phương trình', 'chuyển vế', 'đổi dấu', 'ẩn x', 'nghiệm', 'bậc nhất', 'ax + b', 'dấu bằng', 'vế trái', 'vế phải', 'cân bằng'],
    'phân số': ['phân số', 'tử số', 'mẫu số', 'rút gọn', 'quy đồng', 'tỷ số', 'tỉ số', 'bánh pizza', 'phần chia', 'tối giản', 'chia hết', 'cộng phân số', 'nhân phân số'],
    'hàm số': ['hàm số', 'đồ thị', 'bậc nhất', 'y = ax + b', 'hệ số góc', 'tung độ gốc', 'song song', 'cắt nhau', 'tọa độ', 'trục hoành', 'trục tung'],
  };

  // Find if question matches current topic or material text
  let isRelatedToCurrentTopic = false;
  const currentTopicKey = Object.keys(topicKeywords).find((k) => pkg.topic.toLowerCase().includes(k)) || '';

  if (currentTopicKey) {
    const validWords = topicKeywords[currentTopicKey];
    if (validWords.some((w) => qLower.includes(w))) {
      isRelatedToCurrentTopic = true;
    }
  } else {
    // Check in raw source text
    const fullText = (
      pkg.sources.map((s) => s.content).join(' ') +
      ' ' +
      pkg.analysisPreview.keyPoints.join(' ') +
      ' ' +
      pkg.analysisPreview.summary +
      ' ' +
      pkg.studyPack.flashcards.map((f) => f.question + ' ' + f.answer).join(' ')
    ).toLowerCase();

    // Check if substantial words from query appear in source
    const queryWords = qLower.split(/\s+/).filter((w) => w.length > 2);
    const matchCount = queryWords.filter((w) => fullText.includes(w)).length;
    if (matchCount >= 2 || (queryWords.length <= 2 && matchCount >= 1)) {
      isRelatedToCurrentTopic = true;
    }
  }

  // If question explicitly triggers ungrounded topics or has 0 match with topic
  const hasUngroundedWord = ungroundedKeywords.some((w) => qLower.includes(w));

  if (hasUngroundedWord || !isRelatedToCurrentTopic) {
    return {
      reply: `Nội dung này nằm ngoài phạm vi tài liệu đã cung cấp.\n\n💡 Trợ lý chỉ được phép giải đáp kiến thức có trong tài liệu chủ đề "${pkg.topic}". Em hãy hỏi về các định nghĩa, công thức hoặc câu hỏi bài tập có trong bài học nhé!`,
      isGrounded: false,
      citationSource: null,
      citationSnippet: null,
    };
  }

  // 2. Question IS grounded: Match against sources, analysisPreview, or studyPack
  // A. Check in Flashcards (StudyPack)
  for (const fc of pkg.studyPack.flashcards) {
    const qKey = fc.question.toLowerCase();
    if (
      qLower.includes('công thức') ||
      qLower.includes('phát biểu') ||
      qLower.includes('định lý') ||
      qLower.includes('là gì') ||
      qLower.includes('thế nào') ||
      qLower.includes('quy tắc')
    ) {
      if (
        (qLower.includes('đảo') && qKey.includes('đảo')) ||
        (qLower.includes('bộ ba') && qKey.includes('bộ ba')) ||
        (qLower.includes('chuyển vế') && qKey.includes('chuyển vế')) ||
        (!qLower.includes('đảo') && !qLower.includes('bộ ba') && !qKey.includes('đảo') && !qKey.includes('bộ ba'))
      ) {
        let answerText = `📖 Theo tài liệu ôn tập của chủ đề "${pkg.topic}":\n\n`;
        if (fc.formula) {
          answerText += `📐 **Công thức cốt lõi:** ${fc.formula}\n\n`;
        }
        answerText += `${fc.answer}\n\n`;
        if (fc.keyRule) {
          answerText += `⚡ **Quy tắc cần nhớ:** ${fc.keyRule}\n`;
        }

        return {
          reply: answerText,
          isGrounded: true,
          citationSource: 'studyPack',
          citationSnippet: `Trích từ Thẻ ghi nhớ: "${fc.question}"`,
        };
      }
    }
  }

  // B. Check in AnalysisPreview (Key Points & Summary)
  if (
    qLower.includes('mấu chốt') ||
    qLower.includes('tóm tắt') ||
    qLower.includes('lưu ý') ||
    qLower.includes('sai lầm') ||
    qLower.includes('bẫy') ||
    qLower.includes('bản chất')
  ) {
    let reply = `🔍 **Phân tích mấu chốt theo tài liệu [analysisPreview]:**\n\n`;
    reply += `📝 **Tóm tắt bài học:** ${pkg.analysisPreview.summary}\n\n`;
    reply += `🔑 **Các điểm mấu chốt then chốt:**\n`;
    pkg.analysisPreview.keyPoints.forEach((kp, i) => {
      reply += `${i + 1}. ${kp}\n`;
    });
    if (qLower.includes('sai') || qLower.includes('bẫy') || qLower.includes('nhầm')) {
      reply += `\n⚠️ **Sai lầm thường gặp cần tránh:**\n`;
      pkg.analysisPreview.commonMistakes.forEach((m, i) => {
        reply += `- ${m}\n`;
      });
    }

    return {
      reply,
      isGrounded: true,
      citationSource: 'analysisPreview',
      citationSnippet: `Trích từ Bản phân tích mấu chốt & Tóm tắt bài học`,
    };
  }

  // C. Check in Sources (Raw Materials)
  for (const src of pkg.sources) {
    if (src.content) {
      return {
        reply: `📚 **Căn cứ tài liệu gốc [sources - ${src.title}]:**\n\n${src.content.slice(0, 450)}${src.content.length > 450 ? '...' : ''}\n\n💡 **Ghi nhớ:** Em có thể kết hợp áp dụng công thức: ${pkg.analysisPreview.coreFormulas[0] || ''}`,
        isGrounded: true,
        citationSource: 'sources',
        citationSnippet: `Trích từ Tài liệu nguồn: "${src.title}"`,
      };
    }
  }

  // D. General grounded response from analysisPreview
  return {
    reply: `📖 **Theo tài liệu học tập của chủ đề "${pkg.topic}":**\n\n${pkg.analysisPreview.summary}\n\n📐 **Công thức chính:** ${pkg.analysisPreview.coreFormulas.join(' ; ')}\n\nEm cần thầy/cô giải thích rõ hơn phần công thức hay làm thử câu hỏi bài tập nhé!`,
    isGrounded: true,
    citationSource: 'analysisPreview',
    citationSnippet: `Trích từ Tài liệu tóm tắt & Điểm mấu chốt`,
  };
}

/**
 * Dispatch message to server grounded API, fallback to client engine seamlessly
 */
export async function askGroundedChatbot(
  query: string,
  pkg: GroundingPackage
): Promise<{
  reply: string;
  isGrounded: boolean;
  citationSource: 'sources' | 'analysisPreview' | 'studyPack' | null;
  citationSnippet: string | null;
}> {
  try {
    let customKey = '';
    try {
      customKey = localStorage.getItem('toan_truc_quan_gemini_api_key') || '';
    } catch {}

    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(customKey ? { 'x-gemini-api-key': customKey } : {}),
      },
      body: JSON.stringify({
        message: query,
        topic: pkg.topic,
        sources: pkg.sources,
        analysisPreview: pkg.analysisPreview,
        studyPack: pkg.studyPack,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.reply && !data.fallback) {
        const isUngrounded = data.reply.includes('Nội dung này nằm ngoài phạm vi tài liệu đã cung cấp.');
        return {
          reply: data.reply,
          isGrounded: !isUngrounded,
          citationSource: isUngrounded ? null : 'analysisPreview',
          citationSnippet: isUngrounded ? null : 'Được đối chiếu trực tiếp qua Gemini Grounding',
        };
      }
    }
  } catch (err) {
    console.warn('Backend chat API unavailable, falling back to client engine:', err);
  }

  // Client-side grounded fallback engine
  return queryClientGroundedEngine(query, pkg);
}
