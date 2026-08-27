import React from 'react';
import { RegistryStats } from '../types';
import { ShieldCheck, ShieldAlert, Sparkles, Flame, TreePine, Award } from 'lucide-react';

interface StatsOverviewProps {
  stats: RegistryStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
      
      {/* 1. Total Monitored Area */}
      <div className="bg-[#050F1A] border border-[#14354D] rounded-lg p-3.5 flex flex-col justify-between hover:border-[#00F5D4]/50 transition-colors shadow-sm">
        <div className="flex items-center justify-between text-[#64748B] mb-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00F5D4]">Monitored Area</span>
          <TreePine className="w-3.5 h-3.5 text-[#00F5D4]" />
        </div>
        <div>
          <div className="text-xl font-mono font-bold text-white tracking-tight">
            {stats.totalHectaresMonitored.toLocaleString()} <span className="text-xs font-normal text-[#94A3B8]">Ha</span>
          </div>
          <p className="text-[10px] font-mono uppercase text-[#00B4D8] mt-1">{stats.totalSites} Ecosystem Zones</p>
        </div>
      </div>

      {/* 2. Total Verified Minted */}
      <div className="bg-[#050F1A] border border-[#14354D] rounded-lg p-3.5 flex flex-col justify-between hover:border-[#00B4D8]/50 transition-colors shadow-sm">
        <div className="flex items-center justify-between text-[#64748B] mb-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00B4D8]">Total Minted</span>
          <Sparkles className="w-3.5 h-3.5 text-[#00B4D8]" />
        </div>
        <div>
          <div className="text-xl font-mono font-bold text-[#00B4D8] tracking-tight">
            {stats.totalMintedAllTime.toLocaleString()} <span className="text-xs font-normal text-[#94A3B8]">tCO₂e</span>
          </div>
          <p className="text-[10px] font-mono uppercase text-[#10B981] mt-1">IPCC Tier-3 Allometry</p>
        </div>
      </div>

      {/* 3. Tradeable Active Pool (80%) */}
      <div className="bg-[#050F1A] border border-[#10B981]/40 rounded-lg p-3.5 flex flex-col justify-between hover:border-[#00FF9C] transition-colors shadow-[0_0_12px_rgba(16,185,129,0.15)]">
        <div className="flex items-center justify-between text-[#64748B] mb-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00FF9C]">Tradeable Pool</span>
          <Award className="w-3.5 h-3.5 text-[#00FF9C]" />
        </div>
        <div>
          <div className="text-xl font-mono font-bold text-[#00FF9C] tracking-tight">
            {stats.totalTradeableActive.toLocaleString()} <span className="text-xs font-normal text-[#00FF9C]/70">tCO₂e</span>
          </div>
          <p className="text-[10px] font-mono uppercase text-[#00F5D4] mt-1">80% Active Pool</p>
        </div>
      </div>

      {/* 4. Buffer Reserve Pool (20% held back) */}
      <div className="bg-[#050F1A] border border-[#FBBF24]/40 rounded-lg p-3.5 flex flex-col justify-between hover:border-[#FBBF24] transition-colors">
        <div className="flex items-center justify-between text-[#FBBF24] mb-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Buffer Reserve</span>
          <ShieldAlert className="w-3.5 h-3.5 text-[#FBBF24]" />
        </div>
        <div>
          <div className="text-xl font-mono font-bold text-[#FBBF24] tracking-tight">
            {stats.totalBufferHeld.toLocaleString()} <span className="text-xs font-normal text-[#FBBF24]/70">tCO₂e</span>
          </div>
          <p className="text-[10px] font-mono uppercase text-[#94A3B8] mt-1">20% Ring-Fenced</p>
        </div>
      </div>

      {/* 5. Retired Offsets (Permanently Burned) */}
      <div className="bg-[#050F1A] border border-[#14354D] rounded-lg p-3.5 flex flex-col justify-between hover:border-[#00F5D4]/50 transition-colors shadow-sm">
        <div className="flex items-center justify-between text-[#64748B] mb-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00F5D4]">Retired Offsets</span>
          <ShieldCheck className="w-3.5 h-3.5 text-[#00F5D4]" />
        </div>
        <div>
          <div className="text-xl font-mono font-bold text-white tracking-tight">
            {stats.totalRetired.toLocaleString()} <span className="text-xs font-normal text-[#94A3B8]">units</span>
          </div>
          <p className="text-[10px] font-mono uppercase text-[#00B4D8] mt-1">Burn Certificate</p>
        </div>
      </div>

      {/* 6. Reversal Compensation Burns */}
      <div className="bg-[#050F1A] border border-[#14354D] rounded-lg p-3.5 flex flex-col justify-between hover:border-[#F87171]/50 transition-colors shadow-sm">
        <div className="flex items-center justify-between text-[#64748B] mb-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#F87171]">Reversal Burns</span>
          <Flame className="w-3.5 h-3.5 text-[#F87171]" />
        </div>
        <div>
          <div className="text-xl font-mono font-bold text-[#F87171] tracking-tight">
            {stats.totalReversalBurned.toLocaleString()} <span className="text-xs font-normal text-[#94A3B8]">units</span>
          </div>
          <p className="text-[10px] font-mono uppercase text-[#94A3B8] mt-1">Absorbed on Ledger</p>
        </div>
      </div>

    </div>
  );
};

