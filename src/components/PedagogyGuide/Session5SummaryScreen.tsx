import React, { useState } from 'react';
import {
  CheckCircle2,
  Sparkles,
  Bot,
  FolderOpen,
  Key,
  ShieldCheck,
  Rocket,
  BookOpen,
  ArrowRight,
  Layers,
  Database,
  Lock,
  Cpu,
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface Session5SummaryScreenProps {
  onGoToIntake?: () => void;
  onGoToChat?: () => void;
  onGoToSnapshot?: () => void;
  onGoToApiKey?: () => void;
}

export const Session5SummaryScreen: React.FC<Session5SummaryScreenProps> = ({
  onGoToIntake,
  onGoToChat,
  onGoToSnapshot,
  onGoToApiKey,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Tổng Kết Thành Quả Buổi 5 • Toán Trực Quan
          </div>

          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
            Bản Tóm Tắt Phát Triển Ứng Dụng (Session 5 Report)
          </h1>

          <p className="text-xs sm:text-sm text-indigo-200/90 max-w-2xl leading-relaxed font-medium">
            Hệ thống hóa toàn bộ các tính năng cốt lõi đã hoàn thiện trong Buổi 5: Từ chu trình học tập khép kín, Trợ lý AI Grounded, Quản lý Save/Load Snapshot đến bảo mật API Key Local-Only.
          </p>

          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              onClick={() => {
                sound.playClick();
                if (onGoToChat) onGoToChat();
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Bot className="w-4 h-4" />
              <span>Trải nghiệm Chat Grounded</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                if (onGoToSnapshot) onGoToSnapshot();
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FolderOpen className="w-4 h-4 text-indigo-300" />
              <span>Quản lý Bộ Ôn Tập (Save/Load)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Core Sections */}
      <div className="space-y-4">
        {/* Section 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
              1
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <span>Vòng đời dùng app đã hoàn thiện đến đâu?</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Hoàn thiện 100%
                </span>
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Ứng dụng đã xây dựng thành công <strong>chu trình học tập khép kín chuẩn sư phạm</strong> cho học sinh phổ thông:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-800 text-xs flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Đầu vào (Intake)
                  </span>
                  <p className="text-[11px] text-slate-500">Nạp ghi chép bài giảng, tài liệu SGK, link online theo phương pháp Text-First.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-800 text-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Xử lý & Tóm tắt
                  </span>
                  <p className="text-[11px] text-slate-500">Tự động sinh tóm tắt, điểm mấu chốt, công thức cốt lõi và các bẫy cần tránh.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-800 text-xs flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" /> Ôn tập & Kiểm tra
                  </span>
                  <p className="text-[11px] text-slate-500">Luyện tập 4 dạng cơ bản, Quiz kiểm tra nhanh và lật thẻ 3D Flashcards ghi nhớ lâu.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
              2
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <span>Chatbot Grounded đã làm được gì?</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                  Strict Grounding
                </span>
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Tích hợp Trợ lý AI thông minh gắn kết chặt chẽ với dữ liệu thực tế của bài học:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 mt-2 font-medium">
                <li>
                  <strong>Chỉ trả lời trong phạm vi tài liệu:</strong> Giới hạn nghiêm ngặt qua 3 khối dữ liệu chuẩn (`sources`, `analysisPreview`, `studyPack`).
                </li>
                <li>
                  <strong>Tự động từ chối thông minh:</strong> Khi học sinh hỏi ngoài bài học (thời tiết, tin tức, lập trình...), bot kiên quyết từ chối đúng chuẩn mẫu: <em className="text-amber-800 font-bold">"Nội dung này nằm ngoài phạm vi tài liệu đã cung cấp."</em>
                </li>
                <li>
                  <strong>Trích dẫn căn cứ minh bạch:</strong> Hiển thị rõ nguồn trích dẫn (`[sources]`, `[analysisPreview]`) trong mỗi câu trả lời.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
              3
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <span>Save/Load, quản lý chủ đề và version đã làm được gì?</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                  Working Copy Snapshot
                </span>
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Cung cấp hệ thống quản lý bộ ôn tập chuyên nghiệp và bền vững trên trình duyệt:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-800 text-xs block mb-0.5">💾 Lưu trọn vẹn (Snapshot)</span>
                  <p className="text-[11px] text-slate-500">Lưu toàn bộ working copy gồm tài liệu, tóm tắt, flashcards và câu hỏi quiz vào `localStorage`.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-800 text-xs block mb-0.5">🔄 Mở & Đổi tên linh hoạt</span>
                  <p className="text-[11px] text-slate-500">Bấm "Mở" để khôi phục tức thì toàn bộ UI về chủ đề mong muốn, hỗ trợ đổi tên ngắn và xóa môn không dùng.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
              4
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <span>Settings local-only key mode đã làm được gì?</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                  Round 5 Security
                </span>
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Thiết lập chế độ quản lý API Key an toàn cho giai đoạn phát triển cục bộ:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 mt-2 font-medium">
                <li>
                  Giao diện Settings trực quan với các hành động: <strong>Lưu, Xóa, Thay thế API Key</strong> cá nhân.
                </li>
                <li>
                  Đảm bảo nguyên tắc <strong>Local-Only</strong>: Khóa chỉ được lưu trên trình duyệt của người dùng, không hardcode vào mã nguồn và không commit lên Git.
                </li>
                <li>
                  Hiển thị cảnh báo rõ ràng: Đây là key cá nhân, chỉ dùng cục bộ, chưa an toàn khi deploy public.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 5 */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-indigo-500/30 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
              5
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>Buổi 6 cần polish và nâng cấp điều gì để deploy an toàn hơn?</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  Round 6 Roadmap
                </span>
              </h3>
              <p className="text-xs text-indigo-200/90 leading-relaxed">
                Để ứng dụng sẵn sàng đưa lên môi trường Production công khai một cách an toàn tuyệt đối, Buổi 6 sẽ tập trung nâng cấp:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="font-bold text-white text-xs flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Server-Side Proxy
                  </span>
                  <p className="text-[11px] text-slate-300">Chuyển hoàn toàn việc xác thực Gemini API về backend proxy, giấu tuyệt đối API key khỏi client.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="font-bold text-white text-xs flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Tối ưu PWA & Offline
                  </span>
                  <p className="text-[11px] text-slate-300">Hỗ trợ Service Worker, cài đặt app lên thiết bị và hoạt động mượt mà ngay cả khi mất mạng.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="font-bold text-white text-xs flex items-center gap-1">
                    <Rocket className="w-3.5 h-3.5 text-amber-400" /> Cloud Sync & Share
                  </span>
                  <p className="text-[11px] text-slate-300">Tính năng đồng bộ đám mây và chia sẻ bộ ôn tập qua liên kết nhanh cho bạn bè cùng học.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
