import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import { db } from '../services/dbService';
import { Student, Bus } from '../types';
import StudentDetailView from './StudentDetailView';
import { 
  Lock, 
  User, 
  ChevronRight, 
  Loader2, 
  Info, 
  ShieldCheck, 
  Database, 
  Activity, 
  Server, 
  LogOut,
  LayoutDashboard,
  Check,
  Zap,
  Cpu
} from 'lucide-react';
import { MOCK_STUDENTS, MOCK_BUSES } from '../constants';

type UserRole = 'student' | 'admin';

interface AdminProfile {
  id: string;
  name: string;
  role: 'Administrator';
  lastLogin: string;
}

const ProfileView: React.FC = () => {
  const [role, setRole] = useState<UserRole>('student');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState<Student | AdminProfile | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (role === 'student') {
        const student = await db.getStudentById(loginId.trim().toUpperCase());
        if (student) {
          setCurrentUser(student);
          setIsLoggedIn(true);
          sessionStorage.setItem('loggedInUser', JSON.stringify({ id: student.id, type: 'student' }));
          if (rememberMe) localStorage.setItem('savedUserId', student.id);
        } else {
          setError('Student verification failed. Check ID.');
        }
      } else {
        // Simple Admin Check for Demo
        if (loginId.toUpperCase() === 'ADMIN' && password === '1234') {
          const adminData: AdminProfile = {
            id: 'ADMIN-01',
            name: 'System Administrator',
            role: 'Administrator',
            lastLogin: new Date().toLocaleString()
          };
          setCurrentUser(adminData);
          setIsLoggedIn(true);
          sessionStorage.setItem('loggedInUser', JSON.stringify({ id: 'ADMIN', type: 'admin' }));
        } else {
          setError('Invalid Admin credentials.');
        }
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
    setLoginId(localStorage.getItem('savedUserId') || '');
    setPassword('');
    sessionStorage.removeItem('loggedInUser');
  };

  useEffect(() => {
    const checkSession = async () => {
      const sessionStr = sessionStorage.getItem('loggedInUser');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        if (session.type === 'student') {
          const student = await db.getStudentById(session.id);
          if (student) {
            setCurrentUser(student);
            setIsLoggedIn(true);
            setRole('student');
          }
        } else if (session.type === 'admin') {
          setCurrentUser({
            id: 'ADMIN-01',
            name: 'System Administrator',
            role: 'Administrator',
            lastLogin: new Date().toLocaleString()
          });
          setIsLoggedIn(true);
          setRole('admin');
        }
      }
    };
    checkSession();
  }, []);

  const AdminDashboard = ({ admin }: { admin: AdminProfile }) => (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4">
        <div>
          <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-1">Root Privileges Active</p>
          <h2 className="text-4xl font-black text-white tracking-tight">Admin Command Center</h2>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all font-bold text-xs uppercase tracking-widest"
        >
          Terminate Session <LogOut className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="border-indigo-500/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400"><ShieldCheck /></div>
            <div>
              <p className="text-xs text-gray-500 font-black uppercase tracking-widest">Active Operator</p>
              <p className="text-white font-bold">{admin.name}</p>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 uppercase font-bold">Node: {admin.id}</p>
        </GlassCard>

        <GlassCard className="border-emerald-500/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400"><Activity /></div>
            <div>
              <p className="text-xs text-gray-500 font-black uppercase tracking-widest">System Pulse</p>
              <p className="text-white font-bold text-lg">98.4% Nominal</p>
            </div>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-[98%] bg-emerald-500" />
          </div>
        </GlassCard>

        <GlassCard className="border-amber-500/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400"><Server /></div>
            <div>
              <p className="text-xs text-gray-500 font-black uppercase tracking-widest">Managed Fleet</p>
              <p className="text-white font-bold text-lg">{MOCK_STUDENTS.length} Students • {MOCK_BUSES.length} Transit</p>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 uppercase font-bold">Latency: 42ms</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-0 overflow-hidden border-white/5 h-full">
            <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
            <h3 className="font-black text-white uppercase tracking-widest text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" /> Administrative Logs
            </h3>
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded">Live Feed</span>
            </div>
            <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
            {[
                { action: 'Auth Success', target: 'System Administrator', time: 'Just Now', status: 'Secure' },
                { action: 'Risk Re-calc', target: 'Student Database', time: '12m ago', status: 'Complete' },
                { action: 'Route Update', target: 'Transit Fleet B102', time: '1h ago', status: 'Synced' },
                { action: 'Grounding Sync', target: 'Google Maps API', time: '3h ago', status: 'Active' },
                { action: 'Backup Cron', target: 'AWS-S3-Campus', time: '6h ago', status: 'Success' },
            ].map((log, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                    <div>
                    <p className="text-sm font-bold text-white">{log.action}</p>
                    <p className="text-xs text-gray-500">{log.target}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400">{log.time}</p>
                    <p className="text-[10px] text-emerald-400 uppercase font-black">{log.status}</p>
                </div>
                </div>
            ))}
            </div>
        </GlassCard>

        <div className="space-y-6">
            <GlassCard className="border-l-4 border-amber-500">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500"><Zap className="w-6 h-6" /></div>
                    <div>
                        <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">Global Override</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">Broadcast emergency notifications to all students or manually trigger a transit fleet recalibration.</p>
                        <div className="flex gap-3 mt-4">
                            <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors">Broadcast</button>
                            <button className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors">Fleet Recal</button>
                        </div>
                    </div>
                </div>
            </GlassCard>
            <GlassCard className="border-l-4 border-indigo-500">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500"><Cpu className="w-6 h-6" /></div>
                    <div>
                        <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">Resource Allocation</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">Monitor campus server utilization and Gemini API quota consumption in real-time.</p>
                        <div className="mt-4 flex items-center gap-4">
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[45%] bg-indigo-500" />
                            </div>
                            <span className="text-[10px] font-black text-indigo-400">45% LOAD</span>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
      </div>
    </div>
  );

  if (isLoggedIn && currentUser) {
    if (role === 'admin') {
      return <AdminDashboard admin={currentUser as AdminProfile} />;
    }
    
    return (
      <div className="animate-fade-in pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-1">Student Access Granted</p>
              <h2 className="text-4xl font-black text-white tracking-tight">Welcome, {(currentUser as Student).name.split(' ')[0]}</h2>
            </div>
            <button 
                onClick={handleLogout}
                className="group flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 hover:border-red-500/30 transition-all duration-300"
            >
                End Session
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
        <StudentDetailView studentId={(currentUser as Student).id} studentData={currentUser as Student} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in p-4">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Lock className="w-3.5 h-3.5" /> Campus Verification Gate
        </div>
        <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">Unified Identity</h2>
        <p className="text-gray-400 max-w-sm mx-auto">Select your portal and authenticate to access the ScholarAI campus matrix.</p>
      </div>

      <GlassCard className="w-full max-w-md p-0 relative overflow-hidden group border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 blur-[60px] rounded-full pointer-events-none" />
        
        <div className="flex p-1 bg-black/40 border-b border-white/5">
          <button 
            onClick={() => { setRole('student'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${role === 'student' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <User className="w-4 h-4" /> Student
          </button>
          <button 
            onClick={() => { setRole('admin'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${role === 'admin' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <ShieldCheck className="w-4 h-4" /> Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6 relative z-10">
            <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                  {role === 'student' ? 'University ID' : 'Administrative ID'}
                </label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                        type="text" 
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        placeholder={role === 'student' ? "e.g. S001" : "e.g. ADMIN"}
                        className="w-full bg-[#0f172a] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono"
                        required
                    />
                </div>
            </div>

            {role === 'admin' && (
              <div className="animate-in slide-in-from-top-4">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Master Key</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••"
                        className="w-full bg-[#0f172a] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono"
                        required
                    />
                </div>
                <p className="text-[9px] text-gray-600 mt-2 italic">Credentials: ADMIN / 1234</p>
              </div>
            )}

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
                <span className="text-xs text-gray-400 font-semibold group-hover/check:text-gray-300">Maintain Link</span>
              </label>
              <button type="button" className="text-xs text-indigo-400 font-bold hover:underline">Access Policy</button>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3 animate-pulse">
                    <Info className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
            )}

            <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group/btn"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sync Identity <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></>}
            </button>
        </form>

        <div className="p-6 bg-white/5 border-t border-white/5 text-center">
            <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase tracking-tighter">
                {role === 'student' ? 'DEMO IDS: S001 TO S005' : 'SECURE ADMIN PORTAL ACTIVE'}
            </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default ProfileView;