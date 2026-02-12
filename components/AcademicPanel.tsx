import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Student } from '../types';
import { db } from '../services/dbService';
import GlassCard from './GlassCard';
import { analyzeAcademicRisk } from '../services/geminiService';
import { BrainCircuit, AlertTriangle, GraduationCap, ChevronRight, Search, X, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AcademicPanelProps {
  onSelectStudent?: (id: string) => void;
}

const AcademicPanel: React.FC<AcademicPanelProps> = ({ onSelectStudent }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsDataLoading(true);
      const data = await db.getAllStudents();
      setStudents(data);
      setIsDataLoading(false);
    };
    loadData();
  }, []);

  const handleAnalyze = async () => {
    setIsLoading(true);
    const result = await analyzeAcademicRisk(students);
    setAnalysis(result);
    setIsLoading(false);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayStudents = searchTerm 
    ? filteredStudents 
    : [...students].sort((a,b) => (a.riskScore || 0) - (b.riskScore || 0)).slice(0, 4);

  if (isDataLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-gray-400">Syncing with campus servers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Academic Fleet</h2>
          <p className="text-gray-400">Advanced algorithmic performance tracking and risk mitigation.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text"
              placeholder="Filter by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3 font-bold text-white shadow-xl hover:shadow-indigo-600/30 disabled:opacity-50 transition-all active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-3 text-sm">
              {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <BrainCircuit className="h-5 w-5" />}
              {isLoading ? 'Processing Risk Vectors...' : 'Run Gemini Analysis'}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="col-span-2 min-h-[450px] border-b-4 border-indigo-500/30">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10"><GraduationCap className="text-indigo-400 w-5 h-5" /></div>
            Cohort Performance Analytics
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={students}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px' }} 
              />
              <Bar dataKey="attendance" fill="#6366f1" name="Attendance %" radius={[6, 6, 0, 0]} />
              <Bar dataKey="riskScore" fill="#f43f5e" name="Risk Vector" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <div className="space-y-4">
           <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-2 px-2">
             {searchTerm ? `Matches (${filteredStudents.length})` : 'Intervention Priority'}
           </h3>
           <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
             {displayStudents.length > 0 ? (
               displayStudents.map((student) => (
                 <button key={student.id} onClick={() => onSelectStudent && onSelectStudent(student.id)} className="w-full text-left group">
                   <GlassCard className="flex items-center justify-between p-5 border-white/5" hoverEffect={true}>
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-10 rounded-full ${student.riskLevel === 'High' ? 'bg-red-500' : student.riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <div>
                          <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{student.name}</h4>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                            <span>Vector: <span className="text-gray-300">{student.riskScore}</span></span>
                            <span>• ID: <span className="text-indigo-400/80">{student.id}</span></span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                   </GlassCard>
                 </button>
               ))
             ) : (
               <div className="text-center py-12 bg-white/5 rounded-3xl border border-dashed border-white/10">
                 <Search className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                 <p className="text-gray-500 font-bold text-sm tracking-tight">No results for "{searchTerm}"</p>
               </div>
             )}
           </div>
        </div>
      </div>

      {analysis && (
        <GlassCard className="border-l-8 border-indigo-500 bg-indigo-500/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full" />
          <h3 className="text-xl font-black mb-6 text-white flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-indigo-400" />
            Strategic Intelligence Report
          </h3>
          <div className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed font-medium">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
);

export default AcademicPanel;