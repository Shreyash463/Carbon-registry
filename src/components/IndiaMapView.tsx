import React from 'react';
import { MangroveSite } from '../types';
import { MapPin, Navigation, Eye, CheckCircle2, AlertTriangle, Play, Crosshair } from 'lucide-react';

interface IndiaMapViewProps {
  sites: MangroveSite[];
  selectedSiteId: string;
  onSelectSite: (site: MangroveSite) => void;
  onVerifySite: (site: MangroveSite) => void;
}

export const IndiaMapView: React.FC<IndiaMapViewProps> = ({
  sites,
  selectedSiteId,
  onSelectSite,
  onVerifySite
}) => {
  const selectedSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  // Relative SVG pin coordinates mapped to Indian coastline
  const siteCoordinatesMap: Record<string, { x: number; y: number }> = {
    'sundarbans-01': { x: 74, y: 44 }, // West Bengal Sundarbans
    'bhitarkanika-03': { x: 71, y: 49 }, // Odisha Bhitarkanika
    'coringa-04': { x: 64, y: 62 }, // Andhra Coringa
    'pichavaram-02': { x: 58, y: 77 }, // Tamil Nadu Pichavaram
    'kutch-06': { x: 26, y: 42 }, // Gujarat Gulf of Kutch
    'andaman-05': { x: 88, y: 72 } // Andaman Baratang
  };

  return (
    <div className="bg-[#080D11] border border-[#1E293B] rounded-lg p-5 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#1E293B]">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-[#00FF9C]" />
            <span>National Mangrove Spatial Monitoring Grid</span>
          </h2>
          <p className="text-[11px] font-mono text-[#64748B] mt-0.5 uppercase tracking-wider">
            Geospatial tracking of monitored Indian blue carbon wetland coordinates
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-[#00FF9C]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_6px_#00FF9C]"></span> ACTIVE MINTED
          </span>
          <span className="flex items-center gap-1.5 text-[#00D1FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D1FF]"></span> AUDIT READY
          </span>
          <span className="flex items-center gap-1.5 text-[#FF4444]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4444] animate-pulse"></span> REVERSAL ALERT
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Schematic Map Graphic */}
        <div className="lg:col-span-7 bg-[#05080A] border border-[#1E293B] rounded-lg p-4 relative min-h-[320px] flex items-center justify-center overflow-hidden">
          
          {/* India Coastal Silhouette Vector Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#00FF9C] fill-current">
              <path d="M 30,20 L 45,15 L 60,18 L 70,28 L 76,40 L 73,48 L 65,60 L 58,75 L 53,88 L 48,78 L 40,65 L 32,50 L 22,44 L 25,35 Z" />
            </svg>
          </div>

          {/* Grid lines */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>

          {/* Interactive Pins */}
          <div className="relative w-full h-72 max-w-md mx-auto">
            {sites.map((site) => {
              const coords = siteCoordinatesMap[site.id] || { x: 50, y: 50 };
              const isSelected = selectedSite?.id === site.id;
              const isDegraded = site.verificationStatus === 'DEGRADED_ALERT';
              const isPending = site.verificationStatus === 'PENDING_MRV';

              return (
                <button
                  key={site.id}
                  onClick={() => onSelectSite(site)}
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform duration-200 z-10 ${
                    isSelected ? 'scale-125 z-20' : 'hover:scale-110'
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Ripple ring */}
                    <span className={`absolute -inset-2 rounded-full opacity-60 animate-ping ${
                      isDegraded ? 'bg-[#FF4444]' : (isPending ? 'bg-[#00D1FF]' : 'bg-[#00FF9C]')
                    }`}></span>
                    
                    {/* Pin Marker */}
                    <div className={`w-7 h-7 rounded border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#00FF9C] text-[#05080A] border-white shadow-[0_0_15px_#00FF9C]'
                        : isDegraded
                          ? 'bg-[#080D11] border-[#FF4444] text-[#FF4444]'
                          : isPending
                            ? 'bg-[#080D11] border-[#00D1FF] text-[#00D1FF]'
                            : 'bg-[#080D11] border-[#00FF9C] text-[#00FF9C]'
                    }`}>
                      <MapPin className="w-3.5 h-3.5 fill-current" />
                    </div>

                    {/* Tooltip Label on Hover / Selected */}
                    <div className={`absolute top-full mt-1.5 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border pointer-events-none transition-opacity ${
                      isSelected 
                        ? 'opacity-100 bg-[#0F171C] text-[#00FF9C] border-[#00FF9C] shadow-lg' 
                        : 'opacity-0 group-hover:opacity-100 bg-[#080D11] text-[#E0E7EB] border-[#1E293B]'
                    }`}>
                      {site.name.split(' ')[0]} ({site.state})
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="absolute bottom-2 left-3 text-[9px] text-[#64748B] font-mono uppercase tracking-widest">
            CRS: EPSG:4326 | WGS84 Geodetic Calibrated
          </div>
        </div>

        {/* Right: Selected Site Detailed Telemetry Card */}
        {selectedSite && (
          <div className="lg:col-span-5 bg-[#05080A] border border-[#1E293B] rounded-lg p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00FF9C]">
                  Target Telemetry
                </span>
                <span className="text-[10px] text-[#64748B] font-mono">
                  {selectedSite.coordinates.lat.toFixed(4)}°N, {selectedSite.coordinates.lng.toFixed(4)}°E
                </span>
              </div>

              <h3 className="text-base font-bold text-white uppercase font-mono mb-1">
                {selectedSite.name}
              </h3>
              <p className="text-[11px] font-mono text-[#64748B] mb-3 uppercase">
                {selectedSite.region} • {selectedSite.ecosystemType}
              </p>

              {/* Grid telemetry summary */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3">
                <div className="p-2.5 bg-[#0F171C] rounded border border-[#1E293B]">
                  <span className="text-[9px] uppercase tracking-wider text-[#64748B] block">Monitored Area</span>
                  <span className="font-bold text-white text-xs">{selectedSite.totalAreaHa.toLocaleString()} Ha</span>
                </div>
                <div className="p-2.5 bg-[#0F171C] rounded border border-[#1E293B]">
                  <span className="text-[9px] uppercase tracking-wider text-[#64748B] block">NDVI Index</span>
                  <span className="font-bold text-[#00D1FF] text-xs">{selectedSite.telemetry.satellite.ndvi}</span>
                </div>
                <div className="p-2.5 bg-[#0F171C] rounded border border-[#1E293B]">
                  <span className="text-[9px] uppercase tracking-wider text-[#64748B] block">LiDAR Height</span>
                  <span className="font-bold text-[#00FF9C] text-xs">{selectedSite.telemetry.drone.canopyHeightM} m</span>
                </div>
                <div className="p-2.5 bg-[#0F171C] rounded border border-[#1E293B]">
                  <span className="text-[9px] uppercase tracking-wider text-[#64748B] block">Soil Carbon</span>
                  <span className="font-bold text-[#FF8A00] text-xs">{selectedSite.telemetry.groundSensors.socPercent30cm}% (30cm)</span>
                </div>
              </div>

              {/* Dominant Species */}
              <div className="mb-4">
                <span className="text-[10px] uppercase tracking-widest font-mono text-[#64748B] block mb-1">Dominant Flora Species</span>
                <div className="flex flex-wrap gap-1">
                  {selectedSite.dominantSpecies.map((sp, i) => (
                    <span key={i} className="text-[10px] font-mono italic px-2 py-0.5 rounded bg-[#0F171C] text-[#94A3B8] border border-[#1E293B]">
                      {sp}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Run verification button */}
            <div className="pt-3 border-t border-[#1E293B] flex items-center gap-2">
              <button
                onClick={() => onVerifySite(selectedSite)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-[#00FF9C] hover:bg-[#00D1FF] text-[#05080A] text-xs font-bold font-mono tracking-widest uppercase transition-all cursor-pointer shadow-[0_0_12px_rgba(0,255,156,0.2)]"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>LAUNCH MRV CONSENSUS RUN</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

