import React, { useState } from 'react';
import { MOCK_BUSES, BUS_STATUS_COLORS, BUS_STATUS_TEXT_COLORS } from '../constants';
import GlassCard from './GlassCard';
import { Bus as BusIcon, Users, MapPin, AlertCircle, RefreshCw, Bell } from 'lucide-react';
import { findBusStops } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const BusPanel: React.FC = () => {
  const [locQuery, setLocQuery] = useState('');
  const [locResult, setLocResult] = useState<string | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(false);

  const handleLocSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!locQuery) return;
      setLoadingLoc(true);
      const res = await findBusStops(locQuery);
      setLocResult(res);
      setLoadingLoc(false);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Smart Bus Transit</h2>
          <p className="text-gray-400">Live crowd monitoring and route status.</p>
        </div>
        <div className="flex gap-4">
             <button className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <RefreshCw className="w-5 h-5 text-gray-300" />
             </button>
             <button className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors relative">
                <Bell className="w-5 h-5 text-gray-300" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {MOCK_BUSES.map((bus) => {
          const occupancyPct = (bus.currentOccupancy / bus.capacity) * 100;
          return (
            <GlassCard key={bus.id} className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                 <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    bus.crowdLevel === 'Heavy' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    bus.crowdLevel === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                 }`}>
                    {bus.crowdLevel} Crowd
                 </div>
              </div>
              
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${bus.crowdLevel === 'Heavy' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                    <BusIcon className={`w-8 h-8 ${bus.crowdLevel === 'Heavy' ? 'text-red-400' : 'text-blue-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{bus.route}</h3>
                    <p className="text-sm text-gray-400">ID: {bus.id}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end text-sm">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Occupancy
                  </span>
                  <span className="text-white font-mono">
                    {bus.currentOccupancy} / {bus.capacity}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-3 w-full bg-gray-700/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${BUS_STATUS_COLORS[bus.crowdLevel]}`}
                    style={{ width: `${occupancyPct}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    Next: {bus.nextStop}
                  </div>
                  {bus.status !== 'On Time' && (
                    <div className="flex items-center gap-1 text-amber-400 text-sm font-medium">
                      <AlertCircle className="w-4 h-4" />
                      {bus.status}
                    </div>
                  )}
                </div>
              </div>

              {/* Red Warning Overlay for Heavy Traffic */}
              {bus.crowdLevel === 'Heavy' && (
                  <div className="absolute inset-0 border-2 border-red-500/30 rounded-2xl pointer-events-none animate-pulse"></div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {/* Map Grounding Feature */}
      <GlassCard className="mt-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="text-indigo-400"/> Find Route & Stops (Maps Grounding)
        </h3>
        <form onSubmit={handleLocSearch} className="flex gap-4 mb-4">
            <input 
                type="text" 
                value={locQuery}
                onChange={(e) => setLocQuery(e.target.value)}
                placeholder="Where is the bus stop for Route A?"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all"
            />
            <button 
                type="submit"
                disabled={loadingLoc}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
                {loadingLoc ? "Searching..." : "Search"}
            </button>
        </form>
        {locResult && (
            <div className="p-4 bg-white/5 rounded-xl text-gray-300 text-sm">
                <ReactMarkdown>{locResult}</ReactMarkdown>
            </div>
        )}
      </GlassCard>
    </div>
  );
};

export default BusPanel;