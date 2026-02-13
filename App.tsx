import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AcademicPanel from './components/AcademicPanel';
import BusPanel from './components/BusPanel';
import ChatWidget from './components/ChatWidget';
import StudentDetailView from './components/StudentDetailView';
import ProfileView from './components/ProfileView';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const handleStudentSelect = (id: string) => {
    setSelectedStudentId(id);
    setCurrentView(ViewState.STUDENT_DETAIL);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.ACADEMIC:
        return <AcademicPanel onSelectStudent={handleStudentSelect} />;
      case ViewState.BUSES:
        return <BusPanel />;
      case ViewState.STUDENT_DETAIL:
        return selectedStudentId 
          ? <StudentDetailView studentId={selectedStudentId} onBack={() => setCurrentView(ViewState.ACADEMIC)} />
          : <AcademicPanel onSelectStudent={handleStudentSelect} />;
      case ViewState.PROFILE:
        return <ProfileView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-app-gradient text-white flex overflow-hidden selection:bg-indigo-500/30">
      {/* Dynamic Background elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 ml-20 lg:ml-64 p-8 overflow-y-auto h-screen relative scroll-smooth bg-transparent">
        <div className="max-w-7xl mx-auto relative z-10">
          {renderView()}
        </div>
      </main>

      <ChatWidget />
    </div>
  );
};

export default App;