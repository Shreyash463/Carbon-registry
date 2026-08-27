import React from 'react';
import { MangroveSite } from '../types';
import { 
  Satellite, 
  Plane, 
  Radio, 
  Play, 
  AlertTriangle, 
  MapPin, 
  TreePine, 
  ShieldCheck,
  Zap,
  Activity,
  Wind
} from 'lucide-react';

interface SiteCardProps {
  site: MangroveSite;
  onVerify: (site: MangroveSite) => void;
  onDegrade: (site: MangroveSite) => void;
  onSelect: (site: MangroveSite) => void;
  isSelected?: boolean;
}

export const SiteCard: React.FC<SiteCardProps> = ({
  site,
  onVerify,
  onDegrade,
  onSelect,
  isSelected
}) => {
  const getStatusBadge = (status: MangroveSite['verificationStatus']) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00FF9C]/15 text-[#00FF9C] border border-[#00FF9C]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_6px_#00FF9C] animate-pulse"></span>
            MINTED / ACTIVE
          </span>
        );
      case 'PENDING_MRV':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00D1FF]/15 text-[#00D1FF] border border-[#00D1FF]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D1FF]"></span>
            MRV READY
          </span>
        );
      case 'DEGRADED_ALERT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF4444]/20 text-[#FF4444] border border-[#FF4444]/60 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-[#FF4444]" />
            DISTURBANCE ALERT
          </span>
        );
      case 'ANOMALY_FLAGGED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF8A00]/20 text-[#FF8A00] border border-[#FF8A00]/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00]"></span>
            ANOMALY DELTA
          </span>
        );
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-[#00FF9C]';
    if (score >= 75) return 'text-[#00D1FF]';
    if (score >= 55) return 'text-[#FF8A00]';
    return 'text-[#FF4444]';
  };

  return (
    <div 
      onClick={() => onSelect(site)}
      className={`bg-[#080D11] border rounded-lg overflow-hidden transition-all flex flex-col justify-between cursor-pointer ${
        isSelected 
          ? 'border-l-4 border-l-[#00FF9C] border-[#00FF9C]/50 shadow-[0_0_20px_rgba(0,255,156,0.15)] bg-[#0B1218]' 
          : 'border-[#1E293B] hover:border-[#1E293B]/80 hover:bg-[#0B1218]'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#1E293B]">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#64748B] uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#00FF9C]" />
              <span>{site.state}, IN</span>
              <span className="text-[#1E293B]">|</span>
              <span className="text-[#94A3B8]">{site.ecosystemType}</span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight uppercase">
              {site.name}
            </h3>
          </div>
          <div>{getStatusBadge(site.verificationStatus)}</div>
        </div>

        {/* Primary metrics summary */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-[#1E293B] text-xs font-mono">
          <div>
            <span className="text-[#64748B] block text-[10px] uppercase tracking-widest">Monitored</span>
            <span className="font-bold text-white">{site.totalAreaHa.toLocaleString()} Ha</span>
          </div>
          <div>
            <span className="text-[#64748B] block text-[10px] uppercase tracking-widest">Health</span>
            <span className={`font-bold ${getHealthColor(site.healthScore)}`}>
              {site.healthScore}/100
            </span>
          </div>
          <div>
            <span className="text-[#64748B] block text-[10px] uppercase tracking-widest">Minted Pool</span>
            <span className="font-bold text-[#00FF9C]">
              {site.totalCreditsMinted > 0 ? `${site.totalCreditsMinted.toLocaleString()} t` : '0.0 t'}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Independent Data Source Feeds */}
      <div className="p-3.5 bg-[#05080A]/60 space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] flex items-center justify-between">
          <span>Tri-Source MRV Telemetry</span>
          <span className="text-[#00FF9C] text-[9px] flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#00FF9C]"></span>
            SYNCED
          </span>
        </div>

        {/* Source 1: Satellite */}
        <div className="bg-[#0F171C] border border-[#1E293B] rounded p-2 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-[#00D1FF]/10 text-[#00D1FF] flex items-center justify-center border border-[#00D1FF]/30 shrink-0">
              <Satellite className="w-3 h-3" />
            </div>
            <div>
              <div className="text-[#E0E7EB] text-[11px] font-semibold flex items-center gap-1.5">
                <span>Sentinel-2 SAR</span>
                <span className="text-[10px] text-[#00D1FF]">NDVI {site.telemetry.satellite.ndvi}</span>
              </div>
              <div className="text-[10px] text-[#64748B]">
                SAR: {site.telemetry.satellite.sarBackscatterDb} dB | {site.telemetry.satellite.canopyAreaHa} Ha
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[9px] text-[#64748B] uppercase block">Cloud</span>
            <span className="text-[11px] text-white">{site.telemetry.satellite.cloudCoverPct}%</span>
          </div>
        </div>

        {/* Source 2: Drone */}
        <div className="bg-[#0F171C] border border-[#1E293B] rounded p-2 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-[#00FF9C]/10 text-[#00FF9C] flex items-center justify-center border border-[#00FF9C]/30 shrink-0">
              <Plane className="w-3 h-3" />
            </div>
            <div>
              <div className="text-[#E0E7EB] text-[11px] font-semibold flex items-center gap-1.5">
                <span>RTK-LiDAR Drone</span>
                <span className="text-[10px] text-[#00FF9C]">H: {site.telemetry.drone.canopyHeightM}m</span>
              </div>
              <div className="text-[10px] text-[#64748B]">
                Crown: {site.telemetry.drone.crownClosurePct}% | {site.telemetry.drone.stemDensityHa} stems/Ha
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[9px] text-[#64748B] uppercase block">Chl-a</span>
            <span className="text-[11px] text-white">{site.telemetry.drone.hyperspectralChlA}</span>
          </div>
        </div>

        {/* Source 3: Ground IoT */}
        <div className="bg-[#0F171C] border border-[#1E293B] rounded p-2 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-[#FF8A00]/10 text-[#FF8A00] flex items-center justify-center border border-[#FF8A00]/30 shrink-0">
              <Radio className="w-3 h-3" />
            </div>
            <div>
              <div className="text-[#E0E7EB] text-[11px] font-semibold flex items-center gap-1.5">
                <span>IoT Mesh Sensor</span>
                <span className="text-[10px] text-[#FF8A00]">SOC {site.telemetry.groundSensors.socPercent30cm}%</span>
              </div>
              <div className="text-[10px] text-[#64748B]">
                Salinity: {site.telemetry.groundSensors.salinityPsu} PSU | {site.telemetry.groundSensors.redoxPotentialMv} mV
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[9px] text-[#64748B] uppercase block">{site.telemetry.groundSensors.activeNodeCount} Nodes</span>
            <span className="text-[10px] text-[#00FF9C] font-bold">{site.telemetry.groundSensors.meshStatus}</span>
          </div>
        </div>
      </div>

      {/* Dominant Species Tags */}
      <div className="px-3.5 py-2 bg-[#080D11] border-t border-[#1E293B] flex flex-wrap gap-1.5">
        {site.dominantSpecies.slice(0, 2).map((species, i) => (
          <span key={i} className="text-[10px] font-mono italic px-2 py-0.5 rounded bg-[#0F171C] border border-[#1E293B] text-[#94A3B8]">
            {species}
          </span>
        ))}
        {site.dominantSpecies.length > 2 && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0F171C] text-[#64748B]">
            +{site.dominantSpecies.length - 2}
          </span>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-3 border-t border-[#1E293B] flex items-center gap-2 bg-[#080D11]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVerify(site);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded bg-[#00FF9C] hover:bg-[#00D1FF] text-[#05080A] text-xs font-bold font-mono tracking-widest uppercase transition-all cursor-pointer shadow-[0_0_12px_rgba(0,255,156,0.2)]"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>RUN MRV CONSENSUS</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDegrade(site);
          }}
          title="Simulate Category-4 Cyclone or severe defoliation to trigger automated Buffer Reserve Burn"
          className="flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded bg-[#FF4444]/15 hover:bg-[#FF4444]/25 text-[#FF4444] border border-[#FF4444]/40 text-xs font-mono font-semibold uppercase transition-all cursor-pointer"
        >
          <Wind className="w-3.5 h-3.5 text-[#FF4444]" />
          <span className="hidden sm:inline">CYCLONE SIM</span>
        </button>
      </div>
    </div>
  );
};

