
import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ShieldCheck, FileText, User } from 'lucide-react';

interface Props {
  content: string;
}

export const DocumentPreview: React.FC<Props> = ({ content }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header Preview Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-navy-900 border border-gold-400/20 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold-400/10 flex items-center justify-center border border-gold-400/30">
            <ShieldCheck size={20} className="text-gold-400" />
          </div>
          <div>
            <span className="text-[10px] font-black text-gold-500 uppercase tracking-[0.2em] block">Văn bản đang soạn thảo</span>
            <span className="text-xs font-bold text-white flex items-center gap-1">
              <User size={12} className="text-gold-400" /> Tác giả: VANHA
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gold-400/5 rounded-full border border-gold-400/10">
           <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse shadow-[0_0_8px_#c5a021]"></div>
           <span className="text-[10px] font-black text-gold-400 uppercase tracking-widest">AI Analysis Active</span>
        </div>
      </div>

      {/* Main Paper Area - Dark Navy background with Gold Text */}
      <div className="flex-1 bg-navy-950 rounded-xl overflow-hidden flex flex-col border border-gold-400/20 shadow-2xl relative">
        <div className="h-1.5 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 w-full"></div>
        
        <div className="flex-1 p-10 md:p-16 overflow-y-auto custom-scrollbar">
          {content ? (
            <article className="prose prose-invert prose-sm md:prose-base max-w-none 
              prose-headings:gold-text-shadow prose-headings:font-black prose-headings:uppercase
              prose-p:text-gold-100 prose-p:leading-relaxed prose-p:text-justify
              prose-strong:text-gold-400 prose-strong:font-bold
              prose-table:border prose-table:border-gold-400/20
              prose-li:text-gold-200">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
              <div className="mt-20 pt-10 border-t border-gold-400/10 text-right italic text-gold-500/60 text-sm">
                Bản thảo được khởi tạo bởi SKKN Master AI • Giáo viên: VANHA
              </div>
              <div ref={bottomRef} className="h-10" />
            </article>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-8">
              <div className="w-28 h-28 border-2 border-gold-400/20 rounded-full flex items-center justify-center relative bg-navy-900/50">
                 <div className="absolute inset-0 border-4 border-gold-400/5 rounded-full animate-ping"></div>
                 <FileText size={40} className="text-gold-500/30" />
              </div>
              <div className="text-center space-y-3">
                <p className="text-gold-400 font-black tracking-[0.2em] uppercase gold-text-shadow">Hệ thống sẵn sàng</p>
                <p className="text-xs text-gold-500/50 uppercase font-medium">Chào thầy/cô VANHA, hãy bắt đầu nhập thông tin đề tài</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
