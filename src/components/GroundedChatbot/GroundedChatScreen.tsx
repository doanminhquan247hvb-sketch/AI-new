import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  BookOpen,
  FileText,
  Layers,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Library,
  Copy,
  Check,
  X,
  Compass,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { StudyMaterial, ReviewCard, QuizQuestionItem, PracticeQuestion } from '../../types';
import { INITIAL_STUDY_MATERIALS } from '../../data/defaultMaterials';
import { INITIAL_REVIEW_CARDS, INITIAL_REVIEW_QUIZZES } from '../../data/defaultReviewData';
import { INITIAL_PRACTICE_QUESTIONS } from '../../data/defaultPracticeQuestions';
import {
  buildGroundingPackage,
  askGroundedChatbot,
  ChatMessage,
  GroundingPackage,
} from '../../utils/groundedEngine';
import { sound } from '../../utils/sound';

interface GroundedChatScreenProps {
  onGoToSimulation?: (topicName?: string) => void;
  onGoToQuiz?: () => void;
  onGoToIntake?: () => void;
}

const STORAGE_KEY_MATERIALS = 'toan_truc_quan_materials_v2';
const STORAGE_KEY_CHAT_HISTORY = 'toan_truc_quan_grounded_chat_v1';

export const GroundedChatScreen: React.FC<GroundedChatScreenProps> = ({
  onGoToSimulation,
  onGoToQuiz,
  onGoToIntake,
}) => {
  // 1. Datasets & Active Topic
  const [materials] = useState<StudyMaterial[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MATERIALS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_STUDY_MATERIALS;
  });

  const [reviewCards] = useState<ReviewCard[]>(INITIAL_REVIEW_CARDS);
  const [quizItems] = useState<QuizQuestionItem[]>(INITIAL_REVIEW_QUIZZES);
  const [practiceQuestions] = useState<PracticeQuestion[]>(INITIAL_PRACTICE_QUESTIONS);

  const availableTopics = Array.from(new Set(materials.map((m) => m.topic)));
  const [currentTopic, setCurrentTopic] = useState<string>(
    availableTopics[0] || 'Định Lý Pytago'
  );

  // Grounding Package for current topic
  const [groundingPkg, setGroundingPkg] = useState<GroundingPackage>(() =>
    buildGroundingPackage(currentTopic, materials, reviewCards, quizItems, practiceQuestions)
  );

  useEffect(() => {
    const pkg = buildGroundingPackage(currentTopic, materials, reviewCards, quizItems, practiceQuestions);
    setGroundingPkg(pkg);
  }, [currentTopic, materials, reviewCards, quizItems, practiceQuestions]);

  // 2. Chat history
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_CHAT_HISTORY}_${currentTopic}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        content: `Chào em! Thầy/Cô là **Trợ lý Ôn Bài Grounded** cho chủ đề **"${currentTopic}"**.\n\n🔒 **Cam kết:** Thầy/Cô **chỉ giải đáp chính xác trong phạm vi tài liệu bài học** (*sources*, *analysisPreview*, *studyPack*). Nếu câu hỏi ngoài tài liệu, thầy/cô sẽ thông báo rõ ràng để em ôn tập đúng trọng tâm.\n\nEm muốn hỏi gì về bài học này?`,
        timestamp: 'Vừa xong',
        isGrounded: true,
        citationSource: 'analysisPreview',
        citationSnippet: 'Đã nạp đầy đủ tài liệu nguồn và gói bài tập.',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_CHAT_HISTORY}_${currentTopic}`, JSON.stringify(messages));
    } catch {}
  }, [messages, currentTopic]);

  // State
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'sources' | 'analysisPreview' | 'studyPack'>('sources');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Actions
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    sound.playClick();
    setInputValue('');

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await askGroundedChatbot(query, groundingPkg);

      if (result.isGrounded) {
        sound.playSuccess();
      } else {
        sound.playPop();
      }

      const botMessage: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        content: result.reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isGrounded: result.isGrounded,
        citationSource: result.citationSource,
        citationSnippet: result.citationSnippet || undefined,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        content: 'Nội dung này nằm ngoài phạm vi tài liệu đã cung cấp.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isGrounded: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    sound.playPop();
    const resetMsg: ChatMessage = {
      id: `msg-welcome-${Date.now()}`,
      sender: 'assistant',
      content: `Thầy/Cô đã làm mới phiên trò chuyện cho chủ đề **"${currentTopic}"**.\n\nEm hãy chọn một câu hỏi gợi ý bên dưới hoặc tự nhập câu hỏi để ôn bài nhé!`,
      timestamp: 'Vừa xong',
      isGrounded: true,
      citationSource: 'analysisPreview',
    };
    setMessages([resetMsg]);
    try {
      localStorage.removeItem(`${STORAGE_KEY_CHAT_HISTORY}_${currentTopic}`);
    } catch {}
  };

  const handleCopy = (id: string, text: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Quick Starter Cards for effortless 1-click learning
  const starterCards = [
    {
      title: 'Công thức & Định nghĩa',
      desc: 'Phát biểu định lý và hệ thức tính toán cốt lõi',
      icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
      color: 'bg-indigo-50/80 hover:bg-indigo-100/80 border-indigo-200 text-indigo-950',
      query: `Phát biểu định nghĩa và công thức cốt lõi của chủ đề ${currentTopic}?`,
    },
    {
      title: 'Điểm mấu chốt & Bẫy thi',
      desc: 'Các sai lầm thường gặp và mẹo làm bài đúng',
      icon: <Sparkles className="w-4 h-4 text-purple-600" />,
      color: 'bg-purple-50/80 hover:bg-purple-100/80 border-purple-200 text-purple-950',
      query: `Những điểm mấu chốt và bẫy sai lầm cần tránh khi làm bài ${currentTopic}?`,
    },
    {
      title: 'Ví dụ áp dụng trong bài',
      desc: 'Xem lời giải mẫu từng bước bám sát SGK',
      icon: <Compass className="w-4 h-4 text-teal-600" />,
      color: 'bg-teal-50/80 hover:bg-teal-100/80 border-teal-200 text-teal-950',
      query: `Cho một ví dụ áp dụng cụ thể có trong tài liệu bài học ${currentTopic}?`,
    },
    {
      title: 'Thử hỏi ngoài bài học',
      desc: 'Kiểm tra quy tắc từ chối của chatbot',
      icon: <AlertCircle className="w-4 h-4 text-amber-600" />,
      color: 'bg-amber-50/80 hover:bg-amber-100/80 border-amber-200 text-amber-950',
      query: `Thủ đô của nước Pháp là gì và hôm nay thời tiết thế nào?`,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-3">
      {/* 1. TOP HEADER BAR: CLEAN, MINIMALIST & INTUITIVE */}
      <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Bot Identity & Topic Dropdown */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-black shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black text-slate-900 whitespace-nowrap">
              Trợ Lý Ôn Bài:
            </span>
            <div className="relative">
              <select
                value={currentTopic}
                onChange={(e) => {
                  sound.playClick();
                  setCurrentTopic(e.target.value);
                }}
                className="text-xs font-extrabold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-200/80 rounded-xl py-1 pl-2.5 pr-7 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {availableTopics.map((top) => (
                  <option key={top} value={top}>
                    {top}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-indigo-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right: Clean Action Badges */}
        <div className="flex items-center gap-2">
          {/* Grounding Scope Button */}
          <button
            onClick={() => {
              sound.playClick();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            title="Xem danh sách tài liệu nạp (sources, analysisPreview, studyPack)"
          >
            <Library className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Tài liệu nạp</span>
            <span className="text-[10px] bg-white px-1.5 py-0.2 rounded-full font-black text-slate-600">
              {groundingPkg.sources.length + 2}
            </span>
          </button>

          {/* Reset Chat Button */}
          <button
            onClick={handleResetChat}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Làm mới cuộc trò chuyện"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. CHAT CANVAS & MESSAGE STREAM */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md flex flex-col h-[520px] sm:h-[580px] overflow-hidden relative">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/40">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isRefusal = msg.content.includes(
              'Nội dung này nằm ngoài phạm vi tài liệu đã cung cấp.'
            );

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[88%] sm:max-w-[80%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                } animate-fadeIn`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-2xs ${
                    isUser
                      ? 'bg-slate-900'
                      : isRefusal
                      ? 'bg-amber-500'
                      : 'bg-indigo-600'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1 max-w-full">
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                      isUser
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-xs font-medium'
                        : isRefusal
                        ? 'bg-amber-50/90 border border-amber-300/80 text-amber-950 rounded-tl-xs'
                        : 'bg-white border border-slate-200/90 text-slate-900 rounded-tl-xs'
                    }`}
                  >
                    {/* Refusal Notice Header */}
                    {isRefusal && !isUser && (
                      <div className="flex items-center gap-1.5 text-amber-900 font-black text-xs pb-1.5 mb-1.5 border-b border-amber-200/80">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Thông báo ngoài phạm vi tài liệu:</span>
                      </div>
                    )}

                    {/* Formatted Text */}
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.content.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx} className={pIdx > 0 ? 'mt-2' : ''}>
                          {paragraph.split('**').map((part, partIdx) =>
                            partIdx % 2 === 1 ? (
                              <strong key={partIdx} className="font-black text-slate-950">
                                {part}
                              </strong>
                            ) : (
                              part
                            )
                          )}
                        </p>
                      ))}
                    </div>

                    {/* Citation Source Pill (Discreet & Elegant) */}
                    {!isUser && msg.isGrounded && msg.citationSource && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-[10px] text-slate-400">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Căn cứ: [{msg.citationSource}]
                        </span>
                        <span className="truncate italic max-w-[200px]">
                          {msg.citationSnippet}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Timestamp & Copy Action */}
                  <div
                    className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-slate-600 p-0.5 cursor-pointer"
                      title="Sao chép"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Quick Starter Cards (Shown when conversation is fresh) */}
          {messages.length <= 1 && (
            <div className="pt-2 pb-1 space-y-2 animate-fadeIn">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block px-1">
                Gợi ý câu hỏi ôn bài 1 chạm:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {starterCards.map((card, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(card.query)}
                    className={`p-3 rounded-2xl border text-left transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-start gap-2.5 ${card.color}`}
                  >
                    <div className="p-1.5 rounded-xl bg-white shadow-2xs shrink-0 mt-0.5">
                      {card.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black truncate">{card.title}</div>
                      <div className="text-[11px] text-slate-600 line-clamp-1 mt-0.5 font-medium">
                        {card.desc}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-2.5 max-w-[80%] mr-auto animate-fadeIn">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-2xs">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 text-xs text-slate-500 shadow-2xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                <span className="font-bold text-indigo-700 ml-1 text-xs">
                  Đang đối chiếu tài liệu [{currentTopic}]...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 3. INPUT AREA: MODERN FLOATING PILL */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-slate-50/90 hover:bg-slate-50 focus-within:bg-white border border-slate-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 rounded-2xl p-1.5 sm:p-2 transition-all shadow-inner"
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Đặt câu hỏi ôn bài về "${currentTopic}" (Nhấn Enter để gửi)...`}
              className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-transparent border-0 focus:outline-none resize-none font-medium placeholder:text-slate-400 text-slate-900"
            />

            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2 sm:p-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40 text-white rounded-xl font-bold transition-all cursor-pointer shadow-xs active:scale-95 disabled:cursor-not-allowed shrink-0"
              title="Gửi câu hỏi"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
            <span>
              🔒 <strong>Grounded:</strong> Trả lời trong <code>sources</code>, <code>analysisPreview</code>, <code>studyPack</code>.
            </span>
            <span className="hidden sm:inline">Enter để gửi • Shift+Enter xuống dòng</span>
          </div>
        </div>
      </div>

      {/* 4. MODAL: PHẠM VI TÀI LIỆU GROUNDING (GỌN GÀNG, ĐẸP MẮT) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900">
                    Phạm Vi Tri Thức Grounding: {currentTopic}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Chatbot bị chặn hoàn toàn mọi kiến thức bên ngoài 3 khối này
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 px-5 pt-2 gap-2 bg-slate-50/60">
              <button
                onClick={() => setModalTab('sources')}
                className={`pb-2.5 px-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                  modalTab === 'sources'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. sources ({groundingPkg.sources.length})
              </button>
              <button
                onClick={() => setModalTab('analysisPreview')}
                className={`pb-2.5 px-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                  modalTab === 'analysisPreview'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                2. analysisPreview
              </button>
              <button
                onClick={() => setModalTab('studyPack')}
                className={`pb-2.5 px-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                  modalTab === 'studyPack'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                3. studyPack
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 flex-1 overflow-y-auto space-y-3 text-xs">
              {modalTab === 'sources' && (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-500 font-medium">
                    Các tài liệu nguồn gốc đã được nạp cho chủ đề này:
                  </p>
                  {groundingPkg.sources.map((s, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                      <div className="font-black text-slate-900">{s.title}</div>
                      <div className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {s.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {modalTab === 'analysisPreview' && (
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200/80">
                    <span className="font-black text-purple-900 block mb-1">Tóm tắt mấu chốt:</span>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      {groundingPkg.analysisPreview.summary}
                    </p>
                  </div>

                  <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200/80">
                    <span className="font-black text-indigo-900 block mb-1">Công thức cốt lõi:</span>
                    <p className="font-bold text-indigo-700 text-xs">
                      {groundingPkg.analysisPreview.coreFormulas.join(' ; ')}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="font-black text-slate-800 block mb-1">Các điểm mấu chốt then chốt:</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                      {groundingPkg.analysisPreview.keyPoints.map((kp, i) => (
                        <li key={i}>{kp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {modalTab === 'studyPack' && (
                <div className="space-y-2.5">
                  <p className="text-[11px] text-slate-500 font-medium">
                    Gói bài tập, câu hỏi luyện tập và flashcard:
                  </p>
                  {groundingPkg.studyPack.flashcards.map((fc, i) => (
                    <div key={i} className="p-2.5 bg-amber-50/40 rounded-xl border border-amber-200/80">
                      <div className="font-bold text-slate-900">Q: {fc.question}</div>
                      <div className="text-slate-600 text-[11px] mt-0.5">A: {fc.answer}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
