import React from 'react';
import { LayoutDashboard, GraduationCap, Bus, Settings, CircleUser } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.ACADEMIC, label: 'Academics', icon: GraduationCap },
    { id: ViewState.BUSES, label: 'Bus Transit', icon: Bus },
    { id: ViewState.PROFILE, label: 'Student Portal', icon: CircleUser },
  ];

  return (
    <div className="w-20 lg:w-64 h-screen fixed left-0 top-0 bg-[#0f172a]/80 backdrop-blur-xl border-r border-white/10 flex flex-col z-40 transition-all duration-300">
      <div className="p-6 flex items-center justify-center lg:justify-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">S</span>
        </div>
        <span className="hidden lg:block font-bold text-xl tracking-tight text-white">ScholarAI</span>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          // Check if parent state is active for details sub-view
          const isActive = currentView === item.id || (item.id === ViewState.ACADEMIC && currentView === ViewState.STUDENT_DETAIL);
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 text-indigo-400' : 'group-hover:text-indigo-300'}`} />
              <span className="hidden lg:block font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_10px_#6366f1]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
          <Settings className="w-5 h-5" />
          <span className="hidden lg:block font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;