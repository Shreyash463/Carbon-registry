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
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] shadow-[0_0_6px_#00F5D4] animate-pulse"></span>
            MINTED / ACTIVE
          </span>
        );
      case 'PENDING_MRV':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4]"></span>
            MRV READY
          </span>
        );
      case 'DEGRADED_ALERT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F87171]/20 text-[#F87171] border border-[#F87171]/60 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-[#F87171]" />
            DISTURBANCE ALERT
          </span>
        );
      case 'ANOMALY_FLAGGED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]"></span>
            ANOMALY DELTA
          </span>
        );
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-[#00F5D4]';
    if (score >= 75) return 'text-[#00F5D4]';
    if (score >= 55) return 'text-[#FBBF24]';
    return 'text-[#F87171]';
  };

  return (
    <div 
      onClick={() => onSelect(site)}
      className={`bg-[#050F1A] border rounded-lg overflow-hidden transition-all flex flex-col justify-between cursor-pointer ${
        isSelected 
          ? 'border-l-4 border-l-[#00F5D4] border-[#00F5D4]/60 shadow-[0_0_20px_rgba(0,245,212,0.2)] bg-[#071724]' 
          : 'border-[#14354D] hover:border-[#00F5D4]/40 hover:bg-[#071724]'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#14354D]">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#64748B] uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#00F5D4]" />
              <span>{site.state}, IN</span>
              <span className="text-[#14354D]">|</span>
              <span className="text-[#94A3B8]">{site.ecosystemType}</span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight uppercase">
              {site.name}
            </h3>
          </div>
          <div>{getStatusBadge(site.verificationStatus)}</div>
        </div>

        {/* Primary metrics summary */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-[#14354D] text-xs font-mono">
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
            <span className="font-bold text-[#00F5D4]">
              {site.totalCreditsMinted > 0 ? `${site.totalCreditsMinted.toLocaleString()} t` : '0.0 t'}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Independent Data Source Feeds */}
      <div className="p-3.5 bg-[#030712]/60 space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] flex items-center justify-between">
          <span>Tri-Source MRV Telemetry</span>
          <span className="text-[#00F5D4] text-[9px] flex items-center gap-1 font-bold">
            <span className="w-1 h-1 rounded-full bg-[#00F5D4]"></span>
            SYNCED
          </span>
        </div>

        {/* Source 1: Satellite */}
        <div className="bg-[#0B2236] border border-[#14354D] rounded p-2 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-[#00B4D8]/15 text-[#00B4D8] flex items-center justify-center border border-[#00B4D8]/30 shrink-0">
              <Satellite className="w-3 h-3" />
            </div>
            <div>
              <div className="text-[#E2E8F0] text-[11px] font-semibold flex items-center gap-1.5">
                <span>Sentinel-2 SAR</span>
                <span className="text-[10px] text-[#00B4D8] font-bold">NDVI {site.telemetry.satellite.ndvi}</span>
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
        <div className="bg-[#0B2236] border border-[#14354D] rounded p-2 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30 shrink-0">
              <Plane className="w-3 h-3" />
            </div>
            <div>
              <div className="text-[#E2E8F0] text-[11px] font-semibold flex items-center gap-1.5">
                <span>RTK-LiDAR Drone</span>
                <span className="text-[10px] text-[#10B981] font-bold">H: {site.telemetry.drone.canopyHeightM}m</span>
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
        <div className="bg-[#0B2236] border border-[#14354D] rounded p-2 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-[#00F5D4]/15 text-[#00F5D4] flex items-center justify-center border border-[#00F5D4]/30 shrink-0">
              <Radio className="w-3 h-3" />
            </div>
            <div>
              <div className="text-[#E2E8F0] text-[11px] font-semibold flex items-center gap-1.5">
                <span>IoT Mesh Sensor</span>
                <span className="text-[10px] text-[#00F5D4] font-bold">SOC {site.telemetry.groundSensors.socPercent30cm}%</span>
              </div>
              <div className="text-[10px] text-[#64748B]">
                Salinity: {site.telemetry.groundSensors.salinityPsu} PSU | {site.telemetry.groundSensors.redoxPotentialMv} mV
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[9px] text-[#64748B] uppercase block">{site.telemetry.groundSensors.activeNodeCount} Nodes</span>
            <span className="text-[10px] text-[#00F5D4] font-bold">{site.telemetry.groundSensors.meshStatus}</span>
          </div>
        </div>
      </div>

      {/* Dominant Species Tags */}
      <div className="px-3.5 py-2 bg-[#050F1A] border-t border-[#14354D] flex flex-wrap gap-1.5">
        {site.dominantSpecies.slice(0, 2).map((species, i) => (
          <span key={i} className="text-[10px] font-mono italic px-2 py-0.5 rounded bg-[#0B2236] border border-[#14354D] text-[#94A3B8]">
            {species}
          </span>
        ))}
        {site.dominantSpecies.length > 2 && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0B2236] text-[#64748B]">
            +{site.dominantSpecies.length - 2}
          </span>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-3 border-t border-[#14354D] flex items-center gap-2 bg-[#050F1A]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVerify(site);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded bg-gradient-to-r from-[#00F5D4] via-[#00B4D8] to-[#10B981] hover:opacity-90 text-[#030712] text-xs font-bold font-mono tracking-widest uppercase transition-all cursor-pointer shadow-[0_0_15px_rgba(0,245,212,0.3)]"
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
          className="flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded bg-[#F87171]/15 hover:bg-[#F87171]/25 text-[#F87171] border border-[#F87171]/40 text-xs font-mono font-semibold uppercase transition-all cursor-pointer"
        >
          <Wind className="w-3.5 h-3.5 text-[#F87171]" />
          <span className="hidden sm:inline">CYCLONE SIM</span>
        </button>
      </div>
    </div>
  );
};

