import React, { useState } from 'react';
import { MangroveSite } from '../types';
import { SiteCard } from './SiteCard';
import { IndiaMapView } from './IndiaMapView';
import { Map, Grid, Filter, Sparkles, Layers, ShieldAlert, CheckCircle2, SlidersHorizontal } from 'lucide-react';

interface SitesViewProps {
  sites: MangroveSite[];
  onVerifySite: (site: MangroveSite) => void;
  onDegradeSite: (site: MangroveSite) => void;
}

export const SitesView: React.FC<SitesViewProps> = ({
  sites,
  onVerifySite,
  onDegradeSite
}) => {
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedSiteId, setSelectedSiteId] = useState<string>(sites[0]?.id || 'thane-creek-mh-01');
  const [viewMode, setViewMode] = useState<'GRID' | 'MAP_AND_GRID'>('MAP_AND_GRID');

  // Order states so Maharashtra is always first prioritized
  const rawStates = Array.from(new Set(sites.map(s => s.state)));
  const sortedStates = rawStates.filter(s => s !== 'Maharashtra');
  const states = ['ALL', ...(rawStates.includes('Maharashtra') ? ['Maharashtra'] : []), ...sortedStates];

  const filteredSites = sites.filter(site => {
    if (selectedState === 'ALL') return true;
    return site.state === selectedState;
  });

  const selectedSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="bg-[#080D11] border border-[#1E293B] rounded-lg p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* State Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          <div className="flex items-center gap-1 text-[#64748B] font-mono uppercase text-[10px] tracking-widest mr-2 shrink-0">
            <SlidersHorizontal className="w-3 h-3 text-[#00FF9C]" />
            <span>Region:</span>
          </div>
          {states.map(state => (
            <button
              key={state}
              onClick={() => setSelectedState(state)}
              className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedState === state
                  ? 'bg-[#00FF9C] text-[#05080A] font-bold shadow-[0_0_10px_rgba(0,255,156,0.3)]'
                  : 'bg-[#0F171C] text-[#94A3B8] border border-[#1E293B] hover:text-white hover:border-[#00FF9C]/40'
              }`}
            >
              {state === 'ALL' ? 'ALL REGIONS (IN)' : state}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-[#05080A] p-1 rounded border border-[#1E293B] text-xs font-mono">
          <button
            onClick={() => setViewMode('MAP_AND_GRID')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all cursor-pointer uppercase text-[11px] font-semibold ${
              viewMode === 'MAP_AND_GRID'
                ? 'bg-[#161F27] text-[#00FF9C] border border-[#00FF9C]/40'
                : 'text-[#64748B] hover:text-white'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Spatial Grid</span>
          </button>

          <button
            onClick={() => setViewMode('GRID')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all cursor-pointer uppercase text-[11px] font-semibold ${
              viewMode === 'GRID'
                ? 'bg-[#161F27] text-[#00FF9C] border border-[#00FF9C]/40'
                : 'text-[#64748B] hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Deck Only</span>
          </button>
        </div>

      </div>

      {/* Spatial Map View if enabled */}
      {viewMode === 'MAP_AND_GRID' && (
        <IndiaMapView
          sites={filteredSites}
          selectedSiteId={selectedSiteId}
          onSelectSite={(site) => setSelectedSiteId(site.id)}
          onVerifySite={onVerifySite}
        />
      )}

      {/* Site Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1E293B]">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 font-mono">
            <Layers className="w-4 h-4 text-[#00FF9C]" />
            <span>Monitored Mangrove Wetland Fleet ({filteredSites.length} Sectors)</span>
          </h2>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]">
            Automated Tri-Source Consensus
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSites.map(site => (
            <SiteCard
              key={site.id}
              site={site}
              onVerify={onVerifySite}
              onDegrade={onDegradeSite}
              onSelect={(s) => setSelectedSiteId(s.id)}
              isSelected={selectedSiteId === site.id}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

