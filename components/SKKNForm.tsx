
import React from 'react';
import { UserInfo } from '../types';
import { Button } from './Button';
import { BookOpen, School, GraduationCap, Book, PenTool, FileText, User } from 'lucide-react';

interface Props {
  userInfo: UserInfo;
  onChange: (field: keyof UserInfo, value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

// Fix: Move FieldLabel outside the main component to avoid unnecessary re-renders and fix TS children inference
const FieldLabel = ({ children, icon: Icon }: { children: React.ReactNode, icon: any }) => (
  <label className="flex items-center gap-2 text-[10px] font-black text-gold-500 uppercase tracking-[0.2em] mb-4">
    <Icon size={14} className="text-gold-400 shadow-sm" />
    {children}
  </label>
);

export const SKKNForm: React.FC<Props> = ({ userInfo, onChange, onSubmit, isSubmitting }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.name as keyof UserInfo, e.target.value);
  };

  const isFormValid = Object.values(userInfo).every(val => (val as string).trim() !== '');

  return (
    <div className="max-w-4xl mx-auto bg-navy-900 rounded-3xl overflow-hidden border border-gold-400/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
      <div className="bg-gradient-to-r from-navy-900 to-navy-950 p-10 border-b border-gold-400/10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(197,160,33,0.3)]">
            <FileText className="text-navy-950" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gold-400 gold-text-shadow tracking-tight uppercase">Hồ sơ Sáng kiến</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] bg-gold-400/10 text-gold-400 px-3 py-1 rounded-full font-black border border-gold-400/20 uppercase tracking-widest">Giáo viên: VANHA</span>
              <span className="text-[10px] text-navy-400 uppercase font-bold tracking-wider italic">• AI Powered Support</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-12 space-y-12">
        <div className="relative">
          {/* Fix: Usage of FieldLabel with explicit children content */}
          <FieldLabel icon={PenTool}>Chủ đề / Đề tài Sáng kiến kinh nghiệm</FieldLabel>
          <input
            type="text"
            name="topic"
            value={userInfo.topic}
            onChange={handleChange}
            className="w-full bg-navy-950/50 border-b-2 border-navy-800 focus:border-gold-400 py-4 text-xl font-black text-white transition-all outline-none placeholder:text-navy-700 placeholder:font-normal"
            placeholder="VD: Một số giải pháp nâng cao chất lượng dạy học..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          <div>
            <FieldLabel icon={Book}>Môn học đảm nhiệm</FieldLabel>
            <input
              type="text"
              name="subject"
              value={userInfo.subject}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-navy-800 focus:border-gold-400 py-2 text-sm font-bold text-gold-100 outline-none transition-all placeholder:text-navy-700"
              placeholder="VD: Toán học, Hóa học..."
            />
          </div>

          <div>
            <FieldLabel icon={GraduationCap}>Khối lớp / Cấp học</FieldLabel>
            <input
              type="text"
              name="grade"
              value={userInfo.grade}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-navy-800 focus:border-gold-400 py-2 text-sm font-bold text-gold-100 outline-none transition-all placeholder:text-navy-700"
              placeholder="VD: Khối 12, THPT..."
            />
          </div>

          <div>
            <FieldLabel icon={School}>Đơn vị / Trường học</FieldLabel>
            <input
              type="text"
              name="school"
              value={userInfo.school}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-navy-800 focus:border-gold-400 py-2 text-sm font-bold text-gold-100 outline-none transition-all placeholder:text-navy-700"
              placeholder="Nhập tên trường của thầy/cô..."
            />
          </div>

          <div>
            <FieldLabel icon={BookOpen}>Bộ sách / Chương trình</FieldLabel>
            <input
              type="text"
              name="textbook"
              value={userInfo.textbook}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-navy-800 focus:border-gold-400 py-2 text-sm font-bold text-gold-100 outline-none transition-all placeholder:text-navy-700"
              placeholder="VD: Kết nối tri thức, GDPT 2018..."
            />
          </div>
        </div>

        <div className="pt-12 border-t border-navy-800/50 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 text-gold-500/40">
            <User size={16} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] max-w-[250px] leading-relaxed">
              Xác nhận thông tin hồ sơ cho giáo viên <span className="text-gold-400">VANHA</span>
            </p>
          </div>
          <Button 
            onClick={onSubmit} 
            disabled={!isFormValid || isSubmitting} 
            isLoading={isSubmitting}
            className="w-full md:w-auto px-12 h-14"
            variant="primary"
          >
            KHỞI TẠO BẢN THẢO
          </Button>
        </div>
      </div>
    </div>
  );
};
