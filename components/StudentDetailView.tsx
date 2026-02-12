import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { Student } from '../types';
import { db } from '../services/dbService';
import GlassCard from './GlassCard';
import { ArrowLeft, User, AlertTriangle, BrainCircuit, CreditCard, Calendar, Clock, Loader2 } from 'lucide-react';

interface StudentDetailViewProps {
  studentId: string;
  onBack?: () => void;
  studentData?: Student; 
}

const StudentDetailView: React.FC<StudentDetailViewProps> = ({ studentId, onBack, studentData }) => {
  const [student, setStudent] = useState<Student | null>(studentData || null);
  const [loading, setLoading] = useState(!studentData);

  useEffect(() => {
    if (!studentData) {
      const fetchStudent = async () => {
        setLoading(true);
        const data = await db.getStudentById(studentId);
        setStudent(data);
        setLoading(false);
      };
      fetchStudent();
    }
  }, [studentId, studentData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-gray-400 animate-pulse">Retrieving academic records...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <GlassCard className="text-center p-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white">Record Not Found</h3>
        <p className="text-gray-400 mt-2">The student ID {studentId} does not exist in our database.</p>
        {onBack && (
          <button onClick={onBack} className="mt-6 text-indigo-400 hover:text-indigo-300 underline">
            Go Back
          </button>
        )}
      </GlassCard>
    );
  }

  const chartData = Object.entries(student.marks).map(([subject, score]) => ({
    subject: subject.charAt(0).toUpperCase() + subject.slice(1),
    A: score,
    fullMark: 100,
  }));

  const riskColor = 
    student.riskLevel === 'High' ? 'text-red-400' : 
    student.riskLevel === 'Medium' ? 'text-amber-400' : 
    'text-emerald-400';

  const riskBg = 
    student.riskLevel === 'High' ? 'bg-red-500/20 border-red-500/30' : 
    student.riskLevel === 'Medium' ? 'bg-amber-500/20 border-amber-500/30' : 
    'bg-emerald-500/20 border-emerald-500/30';

  return (
    <div className="space-y-6 animate-fade-in">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>
      )}

      <GlassCard className="flex flex-col md:flex-row justify-between items-center gap-6 border-l-4 border-indigo-500">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg border-4 border-[#0f172a]">
             <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{student.name}</h1>
            <p className="text-gray-400 font-mono text-sm">CAMPUS ID: {student.id} • Status: <span className="text-emerald-400">Active</span></p>
          </div>
        </div>
        
        <div className={`px-6 py-3 rounded-2xl border ${riskBg} flex flex-col items-center min-w-[150px]`}>
            <span className="text-gray-300 text-xs uppercase tracking-widest font-bold mb-1">Academic Health</span>
            <span className={`text-2xl font-black ${riskColor} flex items-center gap-2`}>
                {student.riskLevel === 'High' && <AlertTriangle className="w-5 h-5"/>}
                {student.riskLevel}
            </span>
            <span className="text-[10px] text-gray-500 mt-1 uppercase">Score: {student.riskScore}</span>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
            <GlassCard>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <BrainCircuit className="text-indigo-400" /> Proficiency Radar
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name={student.name} dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>

            <GlassCard>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <CreditCard className="text-emerald-400" /> Account Statement
                </h3>
                <div className="space-y-3">
                    {student.dues.map((due) => (
                        <div key={due.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-lg ${due.status === 'Paid' ? 'bg-emerald-500/20' : due.status === 'Overdue' ? 'bg-red-500/20' : 'bg-amber-500/20'}`}>
                                    {due.status === 'Paid' ? <Clock className="w-5 h-5 text-emerald-400" /> : <Calendar className="w-5 h-5 text-amber-400" />}
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm">{due.category}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Due: {due.dueDate}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-white">${due.amount}</p>
                                <p className={`text-[10px] font-black uppercase ${due.status === 'Paid' ? 'text-emerald-400' : due.status === 'Overdue' ? 'text-red-400' : 'text-amber-400'}`}>
                                    {due.status}
                                </p>
                            </div>
                        </div>
                    ))}
                    {student.dues.length === 0 && <p className="text-gray-500 italic text-center text-sm py-4">No outstanding balance.</p>}
                </div>
            </GlassCard>
        </div>

        <div className="space-y-6">
             <GlassCard className="flex items-center justify-between p-8 bg-gradient-to-r from-transparent to-indigo-500/5">
                <div>
                    <h4 className="text-xl font-bold text-gray-200">Current Attendance</h4>
                    <p className="text-gray-500 text-sm">Semester 1 • 2025</p>
                </div>
                <div className="relative w-24 h-24 flex items-center justify-center group">
                    <svg className="transform -rotate-90 w-full h-full transition-transform duration-500 group-hover:scale-105">
                        <circle cx="48" cy="48" r="42" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                        <circle 
                          cx="48" cy="48" r="42" 
                          stroke={student.attendance < 75 ? "#f43f5e" : "#10b981"} 
                          strokeWidth="8" 
                          fill="transparent" 
                          strokeDasharray={`${student.attendance * 2.64} 264`} 
                          strokeLinecap="round"
                        />
                    </svg>
                    <span className="absolute text-2xl font-black text-white">{student.attendance}%</span>
                </div>
             </GlassCard>

             <GlassCard>
                 <h4 className="text-lg font-bold text-gray-200 mb-6 flex items-center gap-2">
                   <Clock className="w-5 h-5 text-indigo-400" /> Performance Breakdown
                 </h4>
                 <div className="grid grid-cols-2 gap-4">
                     {(Object.entries(student.marks) as [string, number][]).map(([subject, score]) => (
                         <div key={subject} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                             <p className="capitalize text-gray-500 text-[10px] font-bold tracking-widest mb-2">{subject}</p>
                             <div className="flex justify-between items-end">
                                <span className="text-2xl font-black text-white">{score}</span>
                                <span className={`text-[10px] font-black uppercase ${score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                                    {score >= 80 ? 'Elite' : score >= 60 ? 'Avg' : 'At Risk'}
                                </span>
                             </div>
                         </div>
                     ))}
                 </div>
             </GlassCard>

             <GlassCard className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-500/30">
                 <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-300" />
                    AI Assistant insight
                 </h4>
                 <p className="text-sm text-gray-300 leading-relaxed italic">
                     {student.riskLevel === 'High' 
                        ? `Attention required: ${student.name}'s attendance of ${student.attendance}% is below the university threshold. Recommend enrolling in the 'Academic Comeback' mentorship program immediately.`
                        : student.riskLevel === 'Medium'
                        ? `Stable but inconsistent. High performance in social sciences is currently balancing lower STEM scores. Peer tutoring for Mathematics is advised.`
                        : `Exemplary standing. ${student.name} is on track for the Dean's List. Encourage participation in undergraduate research projects.`
                     }
                 </p>
             </GlassCard>
        </div>
      </div>
    </div>
  );
};

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
);

export default StudentDetailView;