
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../services/dbService';
import { Bus } from '../types';
import { BUS_STATUS_COLORS } from '../constants';
import GlassCard from './GlassCard';
import { 
  Bus as BusIcon, 
  Users, 
  MapPin, 
  AlertCircle, 
  RefreshCw, 
  Search, 
  X, 
  Filter, 
  ArrowUpDown,
  Clock,
  Loader2,
  Map as MapIcon,
  Maximize2
} from 'lucide-react';
import { findBusStops } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

type SortOption = 'route' | 'occupancy' | 'status';
type CrowdFilter = 'All' | 'Low' | 'Medium' | 'Heavy';

const BusPanel: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('route');
  const [filterCrowd, setFilterCrowd] = useState<CrowdFilter>('All');
  
  const [locQuery, setLocQuery] = useState('');
  const [locResult, setLocResult] = useState<string | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(false);

  const [selectedBusForMap, setSelectedBusForMap] = useState<Bus | null>(null);

  const loadBuses = async () => {
    setIsDataLoading(true);
    try {
      const data = await db.getAllBuses();
      setBuses(data);
    } catch (error) {
      console.error("Failed to load buses:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    loadBuses();
  }, []);

  const handleLocSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locQuery.trim()) return;
    setLoadingLoc(true);
    const res = await findBusStops(locQuery);
    setLocResult(res);
    setLoadingLoc(false);
  };

  const processedBuses = useMemo(() => {
    let result = [...buses];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(b => 
        b.route.toLowerCase().includes(term) || 
        b.id.toLowerCase().includes(term)
      );
    }

    if (filterCrowd !== 'All') {
      result = result.filter(b => b.crowdLevel === filterCrowd);
    }

    result.sort((a, b) => {
      if (sortBy === 'route') {
        return a.route.localeCompare(b.route);
      } else if (sortBy === 'occupancy') {
        const aPct = a.currentOccupancy / a.capacity;
        const bPct = b.currentOccupancy / b.capacity;
        return bPct - aPct;
      } else if (sortBy === 'status') {
        if (a.status === b.status) return 0;
        return a.status === 'Delayed' ? -1 : 1;
      }
      return 0;
    });

    return result;
  }, [buses, searchTerm, sortBy, filterCrowd]);

  if (isDataLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-gray-400 font-medium">Syncing transit network...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Route Map Modal */}
      {selectedBusForMap && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedBusForMap(null)} />
          <div className="relative w-full max-w-5xl h-[80vh] bg-[#0f172a] border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <BusIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{selectedBusForMap.route}</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Tracking Live Position • ID: {selectedBusForMap.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedBusForMap(null)}
                className="p-3 hover:bg-white/10 rounded-2xl transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 relative bg-black">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/search?key=${process.env.API_KEY}&q=${encodeURIComponent(selectedBusForMap.route + " " + selectedBusForMap.nextStop)}&zoom=15`}
                allowFullScreen
              ></iframe>
              <div className="absolute bottom-6 left-6 right-6">
                <GlassCard className="p-4 border-white/20 bg-black/60 backdrop-blur-xl flex items-center justify-between" hoverEffect={false}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center animate-pulse">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-indigo-300 font-black uppercase tracking-tighter">Current Target Stop</p>
                      <p className="text-white font-bold">{selectedBusForMap.nextStop}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Status</p>
                    <p className={`font-black ${selectedBusForMap.status === 'On Time' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {selectedBusForMap.status.toUpperCase()}
                    </p>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Transit Fleet</h2>
          <p className="text-gray-400">Live capacity monitoring and schedule tracking.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="relative flex-1 md:min-w-[260px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text"
              placeholder="Search route or bus ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-10 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-all"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            {(['All', 'Low', 'Medium', 'Heavy'] as CrowdFilter[]).map((level) => (
              <button
                key={level}
                onClick={() => setFilterCrowd(level)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  filterCrowd === level 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-sm text-gray-300 outline-none cursor-pointer font-bold"
            >
              <option value="route" className="bg-[#0f172a]">By Route</option>
              <option value="occupancy" className="bg-[#0f172a]">By Occupancy</option>
              <option value="status" className="bg-[#0f172a]">By Status</option>
            </select>
          </div>

          <button 
            onClick={loadBuses}
            className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-indigo-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {processedBuses.length > 0 ? (
          processedBuses.map((bus) => {
            const occupancyPct = (bus.currentOccupancy / bus.capacity) * 100;
            return (
              <GlassCard key={bus.id} className="relative overflow-hidden group border-white/5 p-8 flex flex-col h-full">
                {/* Visual Map Texture Overlay */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
                   <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '12px 12px' }}></div>
                </div>

                <div className="absolute top-6 right-6">
                   <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      bus.crowdLevel === 'Heavy' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                      bus.crowdLevel === 'Medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                   }`}>
                      {bus.crowdLevel}
                   </div>
                </div>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className={`p-4 rounded-2xl ${bus.crowdLevel === 'Heavy' ? 'bg-rose-500/20' : 'bg-indigo-500/20'}`}>
                    <BusIcon className={`w-10 h-10 ${bus.crowdLevel === 'Heavy' ? 'text-rose-400' : 'text-indigo-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">{bus.route}</h3>
                    <p className="text-xs text-gray-500 font-mono tracking-tighter uppercase">Bus ID: {bus.id}</p>
                  </div>
                </div>

                <div className="space-y-6 flex-1">
                  <div className="flex justify-between items-end text-xs uppercase tracking-widest font-black">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-500" /> Occupancy
                    </span>
                    <span className="text-white">
                      {bus.currentOccupancy} / {bus.capacity}
                    </span>
                  </div>
                  
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${BUS_STATUS_COLORS[bus.crowdLevel]}`}
                      style={{ width: `${occupancyPct}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center py-4 border-y border-white/5">
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                      <MapPin className="w-4 h-4 text-indigo-500" />
                      <span className="uppercase tracking-tight">Next Stop:</span>
                      <span className="text-gray-100">{bus.nextStop}</span>
                    </div>
                    {bus.status !== 'On Time' ? (
                      <div className="flex items-center gap-1.5 text-rose-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
                        <AlertCircle className="w-4 h-4" />
                        {bus.status}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                        <Clock className="w-4 h-4" />
                        On Time
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button 
                    onClick={() => setSelectedBusForMap(bus)}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-indigo-600/20 active:scale-95 group"
                  >
                    <MapIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Track Route
                  </button>
                  <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            );
          })
        ) : (
          <div className="col-span-full py-24 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
            <Filter className="w-16 h-16 text-gray-800 mx-auto mb-6 opacity-20" />
            <h3 className="text-xl font-bold text-gray-500">No buses found matching your filters</h3>
            <button onClick={() => {setSearchTerm(''); setFilterCrowd('All');}} className="mt-4 text-indigo-400 hover:text-indigo-300 font-bold text-sm">
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      <GlassCard className="mt-8 border-l-4 border-indigo-500 overflow-hidden relative">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none" />
        <h3 className="text-xl font-black mb-6 flex items-center gap-3 relative z-10">
            <div className="p-2 rounded-lg bg-indigo-500/10"><MapPin className="text-indigo-400 w-5 h-5"/></div>
            Campus Route Query
        </h3>
        <form onSubmit={handleLocSearch} className="flex flex-col md:flex-row gap-4 mb-6 relative z-10">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              <input 
                  type="text" 
                  value={locQuery}
                  onChange={(e) => setLocQuery(e.target.value)}
                  placeholder="e.g., 'What are the stops for Route A?'"
                  className="w-full bg-[#020617] border border-white/10 rounded-2xl pl-14 pr-4 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
              />
            </div>
            <button 
                type="submit"
                disabled={loadingLoc}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
            >
                {loadingLoc ? <Loader2 className="w-5 h-5 animate-spin" /> : "Grounding Analysis"}
            </button>
        </form>
        {locResult && (
            <div className="p-6 bg-[#020617] rounded-2xl border border-white/5 text-gray-300 text-sm leading-relaxed prose prose-invert max-w-none animate-fade-in shadow-inner">
                <ReactMarkdown>{locResult}</ReactMarkdown>
            </div>
        )}
      </GlassCard>
    </div>
  );
};

export default BusPanel;
