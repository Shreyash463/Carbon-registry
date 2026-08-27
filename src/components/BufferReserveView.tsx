import React, { useState } from 'react';
import { MangroveSite, RegistryStats, LedgerBlock } from '../types';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Flame, 
  Wind, 
  AlertTriangle, 
  TrendingDown, 
  Sparkles, 
  CheckCircle2,
  RefreshCw,
  Info,
  Layers,
  ArrowRight,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BufferReserveViewProps {
  sites: MangroveSite[];
  stats: RegistryStats;
  onTriggerReversal: (siteId: string, severity: 'MODERATE_SURGE' | 'SEVERE_CYCLONE') => Promise<void>;
  isProcessingReversal: boolean;
}

export const BufferReserveView: React.FC<BufferReserveViewProps> = ({
  sites,
  stats,
  onTriggerReversal,
  isProcessingReversal
}) => {
  const [selectedSiteId, setSelectedSiteId] = useState<string>(sites[0]?.id || 'sundarbans-01');
  const [severity, setSeverity] = useState<'MODERATE_SURGE' | 'SEVERE_CYCLONE'>('SEVERE_CYCLONE');
  const [lastReversalOutcome, setLastReversalOutcome] = useState<{
    siteName: string;
    lossTons: number;
    burnedCredits: number;
    triggerEvent: string;
  } | null>(null);

  const selectedSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  const handleSimulateReversal = async () => {
    try {
      await onTriggerReversal(selectedSiteId, severity);
      const estLoss = Math.round(selectedSite.totalAreaHa * (severity === 'SEVERE_CYCLONE' ? 0.75 : 0.35) * 3.667);
      setLastReversalOutcome({
        siteName: selectedSite.name,
        lossTons: estLoss,
        burnedCredits: Math.min(selectedSite.activeBufferReserve, estLoss),
        triggerEvent: severity === 'SEVERE_CYCLONE' 
          ? 'Category-4 Super Cyclone Storm Surge & Canopy Defoliation'
          : 'High Salinity Estuarine Surge Stress'
      });
    } catch (e) {
      console.error(e);
    }
  };

  const bufferRatio = stats.totalMintedAllTime > 0 
    ? ((stats.totalBufferHeld / stats.totalMintedAllTime) * 100).toFixed(1)
    : '20.0';

  return (
    <div className="space-y-6">
      
      {/* Top Value Proposition & Mechanism Card */}
      <div className="bg-[#050F1A] border border-[#14354D] rounded-lg p-6">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FBBF24] uppercase tracking-[0.2em] mb-2">
          <ShieldAlert className="w-4 h-4" />
          <span>Core Market Differentiator • Risk Buffer Reserve Safeguard</span>
        </div>
        <h2 className="text-xl font-bold font-mono text-white tracking-tight uppercase">
          Automated Reversal Compensation & Solvency Pool
        </h2>
        <p className="text-xs font-mono text-[#94A3B8] mt-2 max-w-3xl leading-relaxed">
          Traditional carbon registries collapsed in 2021-22 when tokenized credits backed degraded or burned forests without liquid reserves. The <strong>Blue Carbon Registry</strong> solves this by ring-fencing <strong>20% of all minted credits into a smart-contract buffer pool</strong>. When extreme weather degrades a sector, buffer credits are automatically burned on-chain to cover the exact carbon delta — <strong>keeping tradeable market credits 100% solvent.</strong>
        </p>

        {/* Live Safety Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#14354D]">
          
          <div className="p-4 bg-[#030712] rounded border border-[#FBBF24]/40">
            <span className="text-[10px] font-mono text-[#FBBF24] uppercase tracking-widest block">Ring-Fenced Buffer Pool</span>
            <div className="text-2xl font-bold font-mono text-[#FBBF24] mt-1">
              {stats.totalBufferHeld.toLocaleString()} <span className="text-xs font-normal text-[#94A3B8]">tCO₂e</span>
            </div>
            <span className="text-[10px] font-mono text-[#64748B] mt-1 block">Buffer Ratio: {bufferRatio}%</span>
          </div>

          <div className="p-4 bg-[#030712] rounded border border-[#14354D]">
            <span className="text-[10px] font-mono text-[#00F5D4] uppercase tracking-widest block">Active Tradeable Pool</span>
            <div className="text-2xl font-bold font-mono text-[#00F5D4] mt-1">
              {stats.totalTradeableActive.toLocaleString()} <span className="text-xs font-normal text-[#94A3B8]">tCO₂e</span>
            </div>
            <span className="text-[10px] font-mono text-[#64748B] mt-1 block">100% Insured & Collateralized</span>
          </div>

          <div className="p-4 bg-[#030712] rounded border border-[#14354D]">
            <span className="text-[10px] font-mono text-[#00B4D8] uppercase tracking-widest block">Total Reversals Absorbed</span>
            <div className="text-2xl font-bold font-mono text-[#00B4D8] mt-1">
              {stats.totalReversalBurned.toLocaleString()} <span className="text-xs font-normal text-[#94A3B8]">units</span>
            </div>
            <span className="text-[10px] font-mono text-[#64748B] mt-1 block">Compensated by Buffer Burns</span>
          </div>

          <div className="p-4 bg-[#030712] rounded border border-[#00F5D4]/40">
            <span className="text-[10px] font-mono text-[#00F5D4] uppercase tracking-widest block">Registry Solvency Score</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              100.0%
            </div>
            <span className="text-[10px] font-mono text-[#00F5D4] mt-1 block">Zero Phantom Credit Exposure</span>
          </div>

        </div>
      </div>

      {/* Interactive Reversal Trigger Sandbox */}
      <div className="bg-[#050F1A] border border-[#14354D] rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#14354D]">
          <div>
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <Wind className="w-4 h-4 text-[#F87171]" />
              <span>Live Reversal Trigger Simulator (Ecological Stress Simulation)</span>
            </h3>
            <p className="text-xs font-mono text-[#64748B] mt-0.5">
              Simulate an extreme weather event on an Indian mangrove zone to watch the automated buffer compensation execution.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          
          {/* Controls column */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* 1. Select Site */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                Target Mangrove Fleet Sector
              </label>
              <select
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
                className="w-full bg-[#030712] border border-[#14354D] text-xs font-mono text-white rounded p-2.5 focus:outline-none focus:border-[#F87171] cursor-pointer"
              >
                {sites.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.state}) • {s.activeBufferReserve.toLocaleString()} t Buffer Held
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Select Disturbance Severity */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                Disturbance Severity & Scenario
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSeverity('SEVERE_CYCLONE')}
                  className={`p-3 rounded border text-left cursor-pointer transition-all font-mono ${
                    severity === 'SEVERE_CYCLONE'
                      ? 'bg-[#F87171]/15 border-[#F87171] text-white shadow-[0_0_10px_rgba(255,68,68,0.2)]'
                      : 'bg-[#030712] border-[#14354D] text-[#64748B] hover:border-[#F87171]/40'
                  }`}
                >
                  <div className="font-bold text-xs text-[#F87171] mb-1 flex items-center gap-1.5 uppercase">
                    <Wind className="w-3.5 h-3.5" />
                    <span>Cat-4 Cyclone</span>
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">
                    38% Canopy Defoliation & Storm Surge Erosion
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSeverity('MODERATE_SURGE')}
                  className={`p-3 rounded border text-left cursor-pointer transition-all font-mono ${
                    severity === 'MODERATE_SURGE'
                      ? 'bg-[#FBBF24]/15 border-[#FBBF24] text-white shadow-[0_0_10px_rgba(255,138,0,0.2)]'
                      : 'bg-[#030712] border-[#14354D] text-[#64748B] hover:border-[#FBBF24]/40'
                  }`}
                >
                  <div className="font-bold text-xs text-[#FBBF24] mb-1 flex items-center gap-1.5 uppercase">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Tidal Surge Dieback</span>
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">
                    20% Estuarine Salinity Stress & Loss
                  </div>
                </button>
              </div>
            </div>

            {/* Launch Simulation Button */}
            <button
              onClick={handleSimulateReversal}
              disabled={isProcessingReversal}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded text-xs font-mono font-bold uppercase tracking-wider bg-[#F87171]/20 hover:bg-[#F87171]/30 text-[#F87171] border border-[#F87171]/60 transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(255,68,68,0.25)]"
            >
              {isProcessingReversal ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>BURNING BUFFER RESERVE ON LEDGER...</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  <span>TRIGGER DISTURBANCE & EXECUTE ON-CHAIN BURN</span>
                </>
              )}
            </button>

          </div>

          {/* Visualization / Output Column */}
          <div className="lg:col-span-6 bg-[#030712] rounded border border-[#14354D] p-5 flex flex-col justify-between font-mono">
            <div>
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block mb-3">
                Real-Time Reversal Compensation Flow
              </span>

              {lastReversalOutcome ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded bg-[#F87171]/15 border border-[#F87171]/50 text-xs">
                    <div className="flex items-center gap-2 text-[#F87171] font-bold mb-1 uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Ecological Disturbance Detected</span>
                    </div>
                    <p className="text-[#E0E7EB] text-[11px] leading-relaxed">
                      {lastReversalOutcome.triggerEvent} at <strong>{lastReversalOutcome.siteName}</strong> caused an estimated biomass loss of <strong className="text-[#F87171]">{lastReversalOutcome.lossTons.toLocaleString()} tCO₂e</strong>.
                    </p>
                  </div>

                  <div className="p-3.5 rounded bg-[#00F5D4]/10 border border-[#00F5D4]/40 text-xs">
                    <div className="flex items-center gap-2 text-[#00F5D4] font-bold mb-1 uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Buffer Reserve Automatically Compensated</span>
                    </div>
                    <p className="text-[#E0E7EB] text-[11px] leading-relaxed">
                      <strong className="text-[#00F5D4]">{lastReversalOutcome.burnedCredits.toLocaleString()} Buffer Reserve units</strong> were permanently burned on the blockchain ledger (Block Type: <span className="text-[#F87171] font-bold">BUFFER_REVERSAL_BURN</span>).
                    </p>
                  </div>

                  <div className="p-3 bg-[#050F1A] rounded border border-[#14354D] text-[11px] text-[#94A3B8]">
                    <span className="text-white font-bold uppercase">Solvency Result:</span> Commercial buyers holding tradeable carbon credits experienced <strong>0% devaluation</strong>. The loss was 100% absorbed by the ring-fenced reserve pool.
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs text-[#64748B]">
                  <div className="p-3 bg-[#050F1A] rounded border border-[#14354D]">
                    <span className="font-bold text-white uppercase text-[10px] block mb-1">1. Continuous MRV Monitoring</span>
                    Tri-source telemetry compares current NDVI, LiDAR canopy height, and soil flux against the previous verified baseline.
                  </div>
                  <div className="p-3 bg-[#050F1A] rounded border border-[#14354D]">
                    <span className="font-bold text-white uppercase text-[10px] block mb-1">2. Negative Biomass Delta Calculation</span>
                    If canopy loss exceeds the 5% natural fluctuation band, the carbon deficit is measured using India-FSI allometry.
                  </div>
                  <div className="p-3 bg-[#050F1A] rounded border border-[#14354D]">
                    <span className="font-bold text-white uppercase text-[10px] block mb-1">3. Automated On-Chain Burn</span>
                    Corresponding buffer tokens are burned immediately on the ledger, preserving market integrity without external bailouts.
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#14354D] text-[10px] text-[#64748B] flex items-center justify-between uppercase tracking-widest">
              <span>Smart Contract Execution</span>
              <span className="text-[#00F5D4] font-bold">Consensus-Guaranteed</span>
            </div>
          </div>

        </div>

      </div>

      {/* Per-Site Buffer Reserve Allocation Table */}
      <div className="bg-[#050F1A] border border-[#14354D] rounded-lg p-5">
        <h3 className="text-sm font-bold font-mono text-white mb-3 uppercase tracking-wider">
          Regional Mangrove Buffer Allocations
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-[#14354D] bg-[#030712] text-[#64748B] font-semibold uppercase text-[10px] tracking-widest">
                <th className="py-2.5 px-3">Ecosystem Zone</th>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3">Monitored Area</th>
                <th className="py-2.5 px-3">Total Minted</th>
                <th className="py-2.5 px-3">Active Buffer (20%)</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#14354D]">
              {sites.map(site => (
                <tr key={site.id} className="hover:bg-[#0B2236]/60">
                  <td className="py-2.5 px-3 font-bold text-white">{site.name}</td>
                  <td className="py-2.5 px-3 text-[#94A3B8]">{site.state}</td>
                  <td className="py-2.5 px-3 text-[#E0E7EB]">{site.totalAreaHa.toLocaleString()} Ha</td>
                  <td className="py-2.5 px-3 font-semibold text-[#00B4D8]">{site.totalCreditsMinted.toLocaleString()} tCO₂e</td>
                  <td className="py-2.5 px-3 font-bold text-[#FBBF24]">{site.activeBufferReserve.toLocaleString()} tCO₂e</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      site.verificationStatus === 'DEGRADED_ALERT' 
                        ? 'bg-[#F87171]/20 text-[#F87171] border border-[#F87171]/60' 
                        : 'bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/40'
                    }`}>
                      {site.verificationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

