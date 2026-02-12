import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import { db } from '../services/dbService';
import { Student } from '../types';
import StudentDetailView from './StudentDetailView';
import { Lock, User, ChevronRight, Loader2, Info } from 'lucide-react';

const ProfileView: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const student = await db.getStudentById(studentId.trim().toUpperCase());
      
      if (student) {
        setCurrentUser(student);
        setIsLoggedIn(true);
        sessionStorage.setItem('loggedInStudentId', student.id);
        if (rememberMe) {
          localStorage.setItem('savedStudentId', student.id);
        } else {
          localStorage.removeItem('savedStudentId');
        }
      } else {
        setError('Verification Failed. Check Student ID.');
      }
    } catch (err) {
      setError('System Error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setStudentId(localStorage.getItem('savedStudentId') || '');
    sessionStorage.removeItem('loggedInStudentId');
  };

  useEffect(() => {
    const checkSession = async () => {
      const savedId = sessionStorage.getItem('loggedInStudentId') || localStorage.getItem('savedStudentId');
      if (savedId) {
        const student = await db.getStudentById(savedId);
        if (student) {
          setCurrentUser(student);
          setIsLoggedIn(true);
        }
      }
    };
    checkSession();
  }, []);

  if (isLoggedIn && currentUser) {
    return (
      <div className="animate-fade-in pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-1">Student Portal</p>
              <h2 className="text-4xl font-black text-white tracking-tight">Welcome, {currentUser.name.split(' ')[0]}</h2>
            </div>
            <button 
                onClick={handleLogout}
                className="group flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 hover:border-red-500/30 transition-all duration-300"
            >
                Log Out
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
        <StudentDetailView studentId={currentUser.id} studentData={currentUser} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in p-4">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Lock className="w-3.5 h-3.5" /> Secure Access
        </div>
        <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">Student Hub</h2>
        <p className="text-gray-400 max-w-sm mx-auto">Access your global campus profile, academic performance, and financial records.</p>
      </div>

      <GlassCard className="w-full max-w-md p-10 relative overflow-hidden group border-white/10">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-indigo-600/20 transition-all duration-700" />
        
        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">University Credential</label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                        type="text" 
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                        placeholder="e.g. S001"
                        className="w-full bg-[#0f172a] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono"
                        required
                    />
                </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group/check">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${rememberMe ? 'bg-indigo-500 border-indigo-500' : 'bg-white/5 border-white/10 group-hover/check:border-white/30'}`}>
                  {rememberMe && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-xs text-gray-400 font-semibold group-hover/check:text-gray-300">Remember Me</span>
              </label>
              <button type="button" className="text-xs text-indigo-400 font-bold hover:underline">Support</button>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3 animate-shake">
                    <Info className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
            )}

            <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group/btn"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></>}
            </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase tracking-tighter">
                DEMO CREDENTIALS: <span className="text-indigo-400/80">S001</span> THRU <span className="text-indigo-400/80">S005</span>
            </p>
        </div>
      </GlassCard>
    </div>
  );
};

const Check = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

export default ProfileView;