import React from 'react';
import GlassCard from './GlassCard';
import { MOCK_STUDENTS, MOCK_BUSES } from '../constants';
import { TrendingUp, Users, AlertTriangle, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const atRiskCount = MOCK_STUDENTS.filter(s => s.riskLevel === 'High' || s.riskLevel === 'Medium').length;
  const busyBusesCount = MOCK_BUSES.filter(b => b.crowdLevel === 'Heavy').length;
  const avgAttendance = Math.round(MOCK_STUDENTS.reduce((acc, curr) => acc + curr.attendance, 0) / MOCK_STUDENTS.length);

  const stats = [
    { title: 'Students at Risk', value: atRiskCount, icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { title: 'Avg Attendance', value: `${avgAttendance}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'Crowded Buses', value: busyBusesCount, icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { title: 'Active Routes', value: MOCK_BUSES.length, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome Back, Admin</h1>
        <p className="text-gray-400">Here's what's happening on campus today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={index} className="flex items-center gap-4">
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-xl font-bold text-white mb-4">Recent Alerts</h3>
          <div className="space-y-4">
            {MOCK_BUSES.filter(b => b.status !== 'On Time').map(bus => (
              <div key={bus.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <div>
                    <p className="text-white font-medium">{bus.route}</p>
                    <p className="text-xs text-gray-400">{bus.status} at {bus.nextStop}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-300">{bus.id}</span>
              </div>
            ))}
            {MOCK_STUDENTS.filter(s => s.riskLevel === 'High').map(student => (
               <div key={student.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <div>
                    <p className="text-white font-medium">{student.name}</p>
                    <p className="text-xs text-gray-400">Critical Risk Level Detected</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300">{student.id}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group">
              <TrendingUp className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-white">Generate Report</p>
              <p className="text-xs text-gray-500">Weekly academic summary</p>
            </button>
            <button className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group">
              <Users className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-white">Notify Students</p>
              <p className="text-xs text-gray-500">Send push alerts to all</p>
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;