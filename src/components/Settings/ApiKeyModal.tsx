import React, { useState, useEffect } from 'react';
import {
  Key,
  Save,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  Server,
  Terminal,
  Code,
  ArrowRight,
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY_API_KEY = 'toan_truc_quan_gemini_api_key';

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'proxy' | 'local'>('proxy');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_API_KEY);
        if (stored) {
          setSavedKey(stored);
          setApiKeyInput(stored);
          setActiveTab('local');
        } else {
          setSavedKey(null);
          setApiKeyInput('');
          setActiveTab('proxy');
        }
      } catch {}
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = apiKeyInput.trim();
    if (!trimmed) return;

    sound.playSuccess();
    try {
      localStorage.setItem(STORAGE_KEY_API_KEY, trimmed);
      setSavedKey(trimmed);
      setSuccessMessage('Đã lưu Gemini API Key thành công trên trình duyệt (Local-Only)!');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch {
      alert('Không thể lưu vào localStorage.');
    }
  };

  const handleDelete = () => {
    sound.playPop();
    try {
      localStorage.removeItem(STORAGE_KEY_API_KEY);
      setSavedKey(null);
      setApiKeyInput('');
      setSuccessMessage('Đã xóa Local Key! Ứng dụng đã chuyển về chế độ Serverless Proxy an toàn.');
      setActiveTab('proxy');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch {}
  };

  const handleSwitchToProxy = () => {
    handleDelete();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">
                Kiến Trúc API & Bảo Mật Triển Khai
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Serverless Proxy (Khuyên dùng) • Local-Only Key (Thử nghiệm)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 px-5 pt-2.5 gap-3 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('proxy')}
            className={`pb-2.5 px-3 text-xs font-black border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'proxy'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Serverless Proxy (An Toàn)</span>
          </button>
          <button
            onClick={() => setActiveTab('local')}
            className={`pb-2.5 px-3 text-xs font-black border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'local'
                ? 'border-amber-500 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-600" />
            <span>Local Key {savedKey ? '(Đang bật)' : ''}</span>
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'proxy' ? (
            <div className="space-y-3.5 animate-fadeIn">
              {/* Proxy Active Status */}
              <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200/90 text-emerald-950 space-y-2">
                <div className="flex items-center gap-1.5 font-black text-emerald-900 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Chế độ Serverless Proxy đã kích hoạt sẵn (`/api/gemini`)</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                  Frontend gọi đến hàm trung gian <code>/api/gemini</code>. Server backend tự động lấy <code>GEMINI_API_KEY</code> từ biến môi trường để gọi Google, đảm bảo không bao giờ để lộ key ra ngoài trình duyệt.
                </p>
              </div>

              {/* 4 Steps Explanation for K12 Students */}
              <div className="space-y-2">
                <span className="font-black text-slate-800 text-xs block">
                  4 Bước Chuyển Sang Serverless Proxy (Vercel / Netlify):
                </span>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    1️⃣ Xóa logic lưu key local
                  </span>
                  <p className="text-[11px] text-slate-600">
                    Bấm nút "Xóa Local Key" bên dưới để xóa <code>localStorage</code>. Không gửi header <code>x-gemini-api-key</code> từ trình duyệt.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    2️⃣ Viết file proxy function
                  </span>
                  <p className="text-[11px] text-slate-600">
                    Tạo file <code>api/gemini.ts</code> nhận câu hỏi từ frontend, lấy key từ biến môi trường và gọi Google Gemini SDK.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    3️⃣ Cấu hình biến môi trường (Environment Variable)
                  </span>
                  <p className="text-[11px] text-slate-600">
                    Thêm <code>GEMINI_API_KEY="AIzaSy..."</code> vào Vercel / Netlify Settings ➔ Environment Variables. Không commit key lên Git.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    4️⃣ Sửa luồng fetch ở Frontend
                  </span>
                  <p className="text-[11px] text-slate-600">
                    Gọi <code>fetch('/api/gemini', &#123; method: 'POST', body: ... &#125;)</code> thay vì gọi thẳng tới máy chủ của Google.
                  </p>
                </div>
              </div>

              {savedKey && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-amber-900 font-bold">
                    ⚠️ Máy bạn đang lưu 1 local key. Bấm nút để xóa và chuyển hẳn sang proxy:
                  </span>
                  <button
                    onClick={handleSwitchToProxy}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer"
                  >
                    Xóa Local Key
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 animate-fadeIn">
              {/* Security & Round Info Box */}
              <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200 text-amber-950 space-y-2">
                <div className="flex items-center gap-1.5 font-black text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Lưu ý bảo mật (Chế độ Local-Only - Round 5):</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-900 font-medium">
                  <li>Đây là <strong>key cá nhân</strong> của riêng bạn.</li>
                  <li>Chỉ được lưu <strong>cục bộ (local-only)</strong> trong trình duyệt hiện tại.</li>
                  <li>Tuyệt đối <strong>không hardcode key</strong> trong mã nguồn và không commit lên Git.</li>
                  <li>⚠️ <em>Chưa an toàn tuyệt đối khi deploy public</em> (Hãy dùng tab Serverless Proxy khi xuất bản app).</li>
                </ul>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="space-y-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 flex items-center justify-between">
                    <span>Nhập Gemini API Key cá nhân:</span>
                    {savedKey && (
                      <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Đã lưu trên máy
                      </span>
                    )}
                  </label>

                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="VD: AIzaSyD..."
                      className="w-full p-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      title={showKey ? 'Ẩn key' : 'Hiện key'}
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  {savedKey ? (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa Key</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                    >
                      Đóng
                    </button>
                    <button
                      type="submit"
                      disabled={!apiKeyInput.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Lưu Key</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Kiến trúc Serverless Proxy • An toàn khi Deploy</span>
          <button
            onClick={onClose}
            className="text-indigo-600 font-bold hover:underline cursor-pointer"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
