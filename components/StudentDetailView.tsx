
import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Area, 
  AreaChart 
} from 'recharts';
import { Student } from '../types';
import { db } from '../services/dbService';
import GlassCard from './GlassCard';
import { 
  ArrowLeft, 
  User, 
  AlertTriangle, 
  BrainCircuit, 
  CreditCard, 
  Calendar, 
  Clock, 
  Loader2, 
  TrendingUp 
} from 'lucide-react';

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
        try {
          const data = await db.getStudentById(studentId);
          setStudent(data);
        } catch (err) {
          console.error("Student Load Error:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchStudent();
    }
  }, [studentId, studentData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-gray-400 font-medium">Loading student matrix...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <GlassCard className="text-center p-12 border-rose-500/20">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white">Record Not Found</h3>
        <p className="text-gray-400 mt-2">ID {studentId} is not in the system.</p>
        {onBack && (
          <button onClick={onBack} className="mt-6 text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-widest text-xs">
            Return to Dashboard
          </button>
        )}
      </GlassCard>
    );
  }

  const marksArray = Object.entries(student.marks) as [string, number][];
  const radarData = marksArray.map(([subject, score]) => ({
    subject: subject.charAt(0).toUpperCase() + subject.slice(1),
    A: score,
    fullMark: 100,
  }));

  const riskStyles = {
    High: 'text-rose-400 bg-rose-500/20 border-rose-500/30',
    Medium: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
    Low: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-4 group font-bold uppercase tracking-widest text-[10px]"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      )}

      <GlassCard className="flex flex-col md:flex-row justify-between items-center gap-8 border-l-4 border-indigo-500">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl border-2 border-white/10">
             <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">{student.name}</h1>
            <p className="text-gray-500 font-mono text-sm tracking-tighter uppercase mt-1">
              CAMPUS ID: {student.id} • AUTH STATUS: <span className="text-emerald-500">VERIFIED</span>
            </p>
          </div>
        </div>
        
        <div className={`px-8 py-4 rounded-3xl border flex flex-col items-center min-w-[180px] ${riskStyles[student.riskLevel]}`}>
            <span className="text-xs uppercase tracking-widest font-black opacity-80 mb-1">Academic Risk</span>
            <span className="text-2xl font-black flex items-center gap-2">
                {student.riskLevel === 'High' && <AlertTriangle className="w-5 h-5"/>}
                {student.riskLevel}
            </span>
            <span className="text-[10px] font-black mt-1 uppercase tracking-tighter opacity-60">SCORE: {student.riskScore}</span>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
            <GlassCard>
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10"><TrendingUp className="text-indigo-400 w-5 h-5" /></div>
                    Performance Trends (GPA)
                </h3>
                <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={student.performanceHistory}>
                            <defs>
                                <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis 
                              dataKey="term" 
                              stroke="#64748b" 
                              fontSize={11} 
                              tickLine={false} 
                              axisLine={false} 
                              dy={10}
                            />
                            <YAxis 
                              domain={[0, 4]} 
                              stroke="#64748b" 
                              fontSize={11} 
                              tickLine={false} 
                              axisLine={false} 
                              dx={-10}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                itemStyle={{ color: '#818cf8' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="gpa" 
                                stroke="#818cf8" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorGpa)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>

            <GlassCard>
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10"><BrainCircuit className="text-indigo-400 w-5 h-5" /></div>
                    Proficiency Matrix
                </h3>
                <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="rgba(255,255,255,0.05)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name={student.name} dataKey="A" stroke="#818cf8" fill="#818cf8" fillOpacity={0.4} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>
        </div>

        <div className="space-y-6">
             <GlassCard className="flex items-center justify-between p-10 bg-gradient-to-r from-transparent to-indigo-500/5">
                <div>
                    <h4 className="text-2xl font-black text-gray-100 tracking-tight">Real-Time Presence</h4>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-widest mt-1">Current Term Attendance</p>
                </div>
                <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="transform -rotate-90 w-full h-full">
                        <circle cx="56" cy="56" r="48" stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="transparent" />
                        <circle 
                          cx="56" cy="56" r="48" 
                          stroke={student.attendance < 75 ? "#f43f5e" : "#10b981"} 
                          strokeWidth="10" 
                          fill="transparent" 
                          strokeDasharray={`${student.attendance * 3.01} 301`} 
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <span className="absolute text-3xl font-black text-white">{student.attendance}%</span>
                </div>
             </GlassCard>

             <GlassCard>
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10"><CreditCard className="text-emerald-400 w-5 h-5" /></div>
                    Financial Standings
                </h3>
                <div className="space-y-4">
                    {student.dues.map((due) => (
                        <div key={due.id} className="flex items-center justify-between p-5 bg-[#020617] rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-5">
                                <div className={`p-3 rounded-xl ${due.status === 'Paid' ? 'bg-emerald-500/20' : due.status === 'Overdue' ? 'bg-rose-500/20' : 'bg-amber-500/20'}`}>
                                    {due.status === 'Paid' ? <Clock className="w-5 h-5 text-emerald-400" /> : <Calendar className="w-5 h-5 text-amber-400" />}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm tracking-tight">{due.category}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Due Date: {due.dueDate}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-black text-white">${due.amount}</p>
                                <p className={`text-[10px] font-black uppercase tracking-tighter ${due.status === 'Paid' ? 'text-emerald-400' : due.status === 'Overdue' ? 'text-rose-400' : 'text-amber-400'}`}>
                                    {due.status}
                                </p>
                            </div>
                        </div>
                    ))}
                    {student.dues.length === 0 && <p className="text-gray-600 italic text-center text-sm py-6">No outstanding transactions found.</p>}
                </div>
            </GlassCard>

             <GlassCard className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30 p-8">
                 <h4 className="text-lg font-black text-white mb-4 flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-white/10"><Sparkles className="w-5 h-5 text-indigo-300" /></div>
                    ScholarAI Recommendation
                 </h4>
                 <p className="text-sm text-gray-300 leading-relaxed font-medium italic">
                     {student.riskLevel === 'High' 
                        ? `URGENT: ${student.name}'s risk vector is critical. Low participation (${student.attendance}%) is statistically correlated with terminal assessment failure. Recommend mandatory academic review.`
                        : student.riskLevel === 'Medium'
                        ? `Cautionary standing: High performance in elective modules is currently masking performance drops in core STEM modules. Weekly tutoring is advised.`
                        : `Exceptional Standing: ${student.name} maintains a robust academic profile. Candidate for advanced research placement and mentorship roles.`
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
