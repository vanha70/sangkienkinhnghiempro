
import React, { useState, useEffect } from 'react';
import { Sparkles, Save, Send, ChevronLeft, Loader2 } from 'lucide-react';
import { Initiative, Status } from '../types';
import { getAISuggestions, generateSKKNStructure } from '../services/geminiService';

interface FormProps {
  initialData?: Initiative | null;
  onSubmit: (data: Partial<Initiative>) => void;
  onCancel: () => void;
}

const InitiativeForm: React.FC<FormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Initiative>>({
    title: '',
    subject: 'Toán học',
    grade: 'Lớp 1',
    year: '2023-2024',
    abstract: '',
    situation: '',
    solutions: '',
    results: '',
    status: Status.DRAFT,
    ...initialData
  });

  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const handleAIHelp = async (field: keyof Initiative, prompt: string) => {
    setIsGenerating(field as string);
    try {
      const context = `Môn: ${formData.subject}, Khối: ${formData.grade}, Tiêu đề: ${formData.title}`;
      const suggestion = await getAISuggestions(prompt, context);
      setFormData(prev => ({ ...prev, [field]: (prev[field] || '') + '\n\n' + suggestion }));
    } finally {
      setIsGenerating(null);
    }
  };

  const handleMagicFill = async () => {
    if (!formData.title) return alert('Vui lòng nhập tiêu đề để AI có cơ sở gợi ý!');
    setIsGenerating('all');
    try {
      const data = await generateSKKNStructure(formData.title || '', formData.subject || '', formData.grade || '');
      if (data) {
        setFormData(prev => ({
          ...prev,
          abstract: data.abstract,
          situation: data.situation,
          solutions: data.solutions.join('\n'),
          results: data.results
        }));
      }
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onCancel}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors"
        >
          <ChevronLeft size={20} />
          Quay lại
        </button>
        <div className="flex gap-3">
          <button 
            onClick={() => onSubmit({ ...formData, status: Status.DRAFT })}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            <Save size={18} />
            Lưu nháp
          </button>
          <button 
            onClick={() => onSubmit({ ...formData, status: Status.PENDING })}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 rounded-xl text-white font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
          >
            <Send size={18} />
            Gửi phê duyệt
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Tên sáng kiến kinh nghiệm</label>
              <input 
                type="text" 
                placeholder="Ví dụ: Một số biện pháp giúp học sinh lớp 1 học tốt môn Toán..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium text-slate-800"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Môn học</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
              >
                <option>Toán học</option>
                <option>Ngữ văn</option>
                <option>Tiếng Anh</option>
                <option>Khoa học tự nhiên</option>
                <option>Lịch sử & Địa lý</option>
                <option>Tin học</option>
                <option>Giáo dục thể chất</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Khối lớp / Năm học</label>
              <div className="grid grid-cols-2 gap-2">
                <select 
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={formData.grade}
                  onChange={e => setFormData({ ...formData, grade: e.target.value })}
                >
                  {Array.from({length: 12}, (_, i) => `Lớp ${i+1}`).map(g => <option key={g}>{g}</option>)}
                </select>
                <select 
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: e.target.value })}
                >
                  <option>2023-2024</option>
                  <option>2024-2025</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex justify-center">
             <button 
              disabled={isGenerating === 'all'}
              onClick={handleMagicFill}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-bold shadow-lg shadow-indigo-200 hover:scale-105 transition-all disabled:opacity-50"
             >
               {isGenerating === 'all' ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />}
               Dùng AI viết sườn nội dung (Magic Write)
             </button>
          </div>

          {/* Form Sections */}
          {[
            { id: 'abstract', label: 'Tóm tắt sáng kiến', prompt: 'Hãy viết một đoạn tóm tắt chuyên nghiệp cho sáng kiến này' },
            { id: 'situation', label: 'Thực trạng vấn đề', prompt: 'Phân tích các khó khăn và thực trạng hiện nay của vấn đề này' },
            { id: 'solutions', label: 'Các biện pháp / Giải pháp', prompt: 'Gợi ý 3 biện pháp cụ thể, mang tính đột phá và thực tế' },
            { id: 'results', label: 'Kết quả đạt được', prompt: 'Mô tả các kết quả mong đợi sau khi áp dụng các biện pháp trên' },
          ].map((section) => (
            <div key={section.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{section.label}</label>
                <button 
                  onClick={() => handleAIHelp(section.id as keyof Initiative, section.prompt)}
                  disabled={!!isGenerating}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors disabled:opacity-50"
                >
                  {isGenerating === section.id ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  GỢI Ý TỪ AI
                </button>
              </div>
              <textarea 
                rows={5}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 leading-relaxed"
                placeholder={`Nhập ${section.label.toLowerCase()}...`}
                value={formData[section.id as keyof Initiative] as string}
                onChange={e => setFormData({ ...formData, [section.id]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InitiativeForm;
