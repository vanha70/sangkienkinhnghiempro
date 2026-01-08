
import React, { useState } from 'react';
import { UserInfo, GenerationStep, GenerationState } from './types';
import { STEPS_INFO } from './constants';
import { initializeGeminiChat, sendMessageStream } from './services/geminiService';
import { SKKNForm } from './components/SKKNForm';
import { DocumentPreview } from './components/DocumentPreview';
import { Button } from './components/Button';
import { Download, ChevronRight, CheckCircle, ShieldCheck, Layers, User } from 'lucide-react';

const App: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    topic: '',
    subject: '',
    grade: '',
    school: '',
    textbook: ''
  });

  const [state, setState] = useState<GenerationState>({
    step: GenerationStep.INPUT_FORM,
    messages: [],
    fullDocument: '',
    isStreaming: false,
    error: null
  });

  const handleUserChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const startGeneration = async () => {
    if (!process.env.API_KEY) {
      setState(prev => ({ ...prev, error: "Cấu hình API Key không hợp lệ." }));
      return;
    }

    try {
      setState(prev => ({ ...prev, step: GenerationStep.OUTLINE, isStreaming: true, error: null }));
      initializeGeminiChat();

      const initMessage = `Chào chuyên gia. Tôi là giáo viên VANHA, cần viết SKKN.
      Thông tin:
      - Đề tài: ${userInfo.topic}
      - Môn học: ${userInfo.subject}
      - Khối: ${userInfo.grade}
      - Trường: ${userInfo.school}
      - Bộ sách: ${userInfo.textbook}
      Hãy bắt đầu Dàn ý chi tiết cho tôi.`;

      let generatedText = "";
      await sendMessageStream(initMessage, (chunk) => {
        generatedText += chunk;
        setState(prev => ({ ...prev, fullDocument: generatedText }));
      });
      setState(prev => ({ ...prev, isStreaming: false }));
    } catch (error: any) {
      setState(prev => ({ ...prev, isStreaming: false, error: error.message }));
    }
  };

  const generateNextSection = async () => {
    const nextStepMap: Record<number, { prompt: string, nextStep: GenerationStep }> = {
      [GenerationStep.OUTLINE]: { prompt: "Viết chi tiết Phần I & II.", nextStep: GenerationStep.PART_I_II },
      [GenerationStep.PART_I_II]: { prompt: "Viết chi tiết Phần III.", nextStep: GenerationStep.PART_III },
      [GenerationStep.PART_III]: { prompt: "Viết chi tiết Giải pháp 1.", nextStep: GenerationStep.PART_IV_SOL1 },
      [GenerationStep.PART_IV_SOL1]: { prompt: "Viết các giải pháp còn lại.", nextStep: GenerationStep.PART_IV_SOL2 },
      [GenerationStep.PART_IV_SOL2]: { prompt: "Viết Phần V, VI và Phụ lục.", nextStep: GenerationStep.PART_V_VI },
      [GenerationStep.PART_V_VI]: { prompt: "", nextStep: GenerationStep.COMPLETED }
    };

    const currentAction = nextStepMap[state.step];
    if (!currentAction) return;

    setState(prev => ({ ...prev, isStreaming: true, error: null, step: currentAction.nextStep }));
    try {
      await sendMessageStream(currentAction.prompt, (chunk) => {
        setState(prev => ({ ...prev, fullDocument: prev.fullDocument + chunk }));
      });
      setState(prev => ({ ...prev, isStreaming: false, step: currentAction.nextStep === GenerationStep.PART_V_VI ? GenerationStep.COMPLETED : currentAction.nextStep }));
    } catch (error: any) {
      setState(prev => ({ ...prev, isStreaming: false, error: error.message }));
    }
  };

  const exportToWord = () => {
    // @ts-ignore
    const htmlContent = marked.parse(state.fullDocument);
    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><style>body { font-family: 'Times New Roman'; padding: 2cm; }</style></head>
    <body>
      <div style="text-align: right; font-style: italic; color: #666;">Người thực hiện: VANHA</div>
      ${htmlContent}
    </body></html>`;
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SKKN_VANHA_${new Date().getFullYear()}.doc`;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-navy-950 text-gold-200">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-80 bg-navy-900 flex-col h-screen sticky top-0 border-r border-gold-400/20 shadow-2xl z-20">
        <div className="p-10 border-b border-gold-400/10">
          <div className="flex flex-col items-center gap-4 text-center">
             <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-700 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(197,160,33,0.4)]">
                <ShieldCheck className="text-navy-950" size={32} strokeWidth={2.5} />
             </div>
             <div>
                <h1 className="text-xl font-black text-gold-400 gold-text-shadow tracking-tighter uppercase leading-tight">SKKN MASTER</h1>
                <p className="text-[10px] text-gold-300/60 font-black tracking-[0.4em] uppercase mt-1">VANHA EDITION</p>
             </div>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-1 overflow-y-auto mt-4">
          {Object.entries(STEPS_INFO).map(([key, info]) => {
            const stepNum = parseInt(key);
            if (stepNum > 7) return null;
            const isActive = state.step === stepNum;
            const isCompleted = state.step > stepNum;
            
            return (
              <div key={key} className={`p-4 rounded-xl flex items-center gap-4 transition-all duration-300 ${isActive ? 'bg-gold-400/10 border border-gold-400/30' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${isCompleted ? 'bg-gold-500 border-gold-500 text-navy-950' : isActive ? 'border-gold-400 text-gold-400 shadow-[0_0_8px_rgba(197,160,33,0.5)]' : 'border-navy-700 text-navy-600'}`}>
                  {isCompleted ? <CheckCircle size={16} strokeWidth={3} /> : stepNum + 1}
                </div>
                <div className="flex-1">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-white' : isCompleted ? 'text-gold-300/80' : 'text-navy-600'}`}>{info.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-8 border-t border-gold-400/10 bg-navy-950/50">
           <div className="flex items-center gap-3 mb-6 p-4 bg-gold-400/5 rounded-xl border border-gold-400/10">
              <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-navy-950 font-black shadow-lg shadow-gold-900/40">VH</div>
              <div>
                <p className="text-[10px] font-black text-gold-500 uppercase tracking-widest">Giáo viên</p>
                <p className="text-sm font-black text-white uppercase gold-text-shadow">VANHA</p>
              </div>
           </div>

           {state.step > 0 && (
             <div className="space-y-4">
               {state.step < GenerationStep.COMPLETED && (
                 <Button onClick={generateNextSection} className="w-full h-12" isLoading={state.isStreaming} icon={<ChevronRight size={18}/>}>Viết tiếp phần mới</Button>
               )}
               <Button variant="outline" onClick={exportToWord} className="w-full h-12" icon={<Download size={18}/>}>Tải bản WORD</Button>
             </div>
           )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden p-6 lg:p-14 relative bg-navy-950">
        {/* Mobile Header */}
        <div className="lg:hidden mb-8 flex items-center justify-between bg-navy-900 p-5 rounded-2xl border border-gold-400/20 shadow-2xl">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-gold-500 rounded-lg">
                <ShieldCheck className="text-navy-950" size={20} />
              </div>
              <span className="font-black text-gold-400 text-sm tracking-widest uppercase gold-text-shadow">SKKN - VANHA</span>
           </div>
           <div className="px-4 py-1.5 bg-gold-400/10 border border-gold-400/30 rounded-lg text-gold-400 text-[10px] font-black uppercase tracking-widest">
              Giai đoạn {state.step + 1}
           </div>
        </div>

        {state.error && (
            <div className="absolute top-6 right-6 left-6 z-50 bg-red-950/90 border border-red-500/50 text-white p-5 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                <div className="flex-1 text-sm font-bold uppercase tracking-tight">Hệ thống báo lỗi: {state.error}</div>
            </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {state.step === GenerationStep.INPUT_FORM ? (
            <div className="h-full flex items-center justify-center py-10">
              <SKKNForm userInfo={userInfo} onChange={handleUserChange} onSubmit={startGeneration} isSubmitting={state.isStreaming} />
            </div>
          ) : (
            <div className="max-w-6xl mx-auto w-full h-full pb-10">
              <DocumentPreview content={state.fullDocument} />
            </div>
          )}
        </div>

        {/* Mobile Floating Action */}
        {!state.isStreaming && state.step > 0 && state.step < GenerationStep.COMPLETED && (
          <div className="lg:hidden fixed bottom-8 left-8 right-8 z-40">
            <Button onClick={generateNextSection} variant="primary" className="w-full h-14 shadow-[0_10px_30px_rgba(197,160,33,0.3)]">Tiếp tục soạn thảo</Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
