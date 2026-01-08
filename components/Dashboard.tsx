
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { FileCheck, Clock, FileWarning, TrendingUp } from 'lucide-react';
import { Initiative, Status } from '../types';

interface DashboardProps {
  initiatives: Initiative[];
}

const Dashboard: React.FC<DashboardProps> = ({ initiatives }) => {
  const stats = {
    total: initiatives.length,
    approved: initiatives.filter(i => i.status === Status.APPROVED).length,
    pending: initiatives.filter(i => i.status === Status.PENDING).length,
    draft: initiatives.filter(i => i.status === Status.DRAFT).length,
  };

  const pieData = [
    { name: 'Đã duyệt', value: stats.approved, color: '#10b981' },
    { name: 'Đang chờ', value: stats.pending, color: '#f59e0b' },
    { name: 'Bản nháp', value: stats.draft, color: '#6366f1' },
  ];

  const barData = [
    { month: 'T1', count: 2 },
    { month: 'T2', count: 5 },
    { month: 'T3', count: 3 },
    { month: 'T4', count: 8 },
    { month: 'T5', count: 12 },
    { month: 'T6', count: 4 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng số SKKN', value: stats.total, icon: TrendingUp, color: 'bg-indigo-500' },
          { label: 'Đã được duyệt', value: stats.approved, icon: FileCheck, color: 'bg-emerald-500' },
          { label: 'Đang chờ xử lý', value: stats.pending, icon: Clock, color: 'bg-amber-500' },
          { label: 'Số bản nháp', value: stats.draft, icon: FileWarning, color: 'bg-blue-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-xl text-white`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Thống kê viết bài theo tháng</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Trạng thái phê duyệt</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{item.name}</span>
                <span className="font-semibold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Hoạt động gần đây</h3>
        <div className="space-y-4">
          {initiatives.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-600 font-bold uppercase">
                {item.subject.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-800 truncate">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-1">Năm học: {item.year} • {item.subject}</p>
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                item.status === Status.APPROVED ? 'bg-emerald-100 text-emerald-700' :
                item.status === Status.PENDING ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
          {initiatives.length === 0 && <p className="text-center text-slate-400 py-4">Chưa có hoạt động nào.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
