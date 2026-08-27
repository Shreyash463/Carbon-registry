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
      <div className="bg-[#080D11] border border-[#1E293B] rounded-lg p-3.5 flex flex-col justify-between hover:border-[#00FF9C]/40 transition-colors">
        <div className="flex items-center justify-between text-[#64748B] mb-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Monitored Area</span>
          <TreePine className="w-3.5 h-3.5 text-[#00FF9C]" />
        </div>
        <div>
          <div className="text-xl font-mono font-bold text-white tracking-tight">
            {stats.totalHectaresMonitored.toLocaleString()} <span className="text-xs font-normal text-[#64748B]">Ha</span>
          </div>
          <p className="text-[10px] font-mono uppercase text-[#94A3B8] mt-1">{stats.totalSites} Ecosystem Zones</p>
        </div>
      </div>

      {/* 2. Total Verified Minted */}
      <div className="bg-[#080D11] border border-[#1E293B] rounded-lg p-3.5 flex flex-col justify-between hover:border-[#00D1FF]/40 transition-colors">
        <div className="flex items-center justify-between text-[#64748B] mb-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Total Minted</span>
          <Sparkles className="w-3.5 h-3.5 text-[#00D1FF]" />
        </div>
        <div>
          <div className="text-xl font-mono font-bold text-[#00D1FF] tracking-tight">
            {stats.totalMintedAllTime.toLocaleString()} <span className="text-xs font-normal text-[#64748B]">tCO₂e</span>
          </div>
          <p className="text-[10px] font-mono uppercase text-[#00FF9C] mt-1">IPCC Tier-3 Allometry</p>
        </div>
      </div>

      {/* 3. Tradeable Active Pool (80%) */}
      <div className="bg-[#080D11] border border-[#1E293B] rounded-lg p-3.5 flex flex-col justify-between hover:border-[#00FF9C]/50 transition-colors bg-[#080D11]/90">
        <div className="flex items-center justify-between text-[#64748B] mb-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Tradeable Pool</span>
          <Award className="w-3.5 h-3.5 text-[#00FF9C]" />
        </div>
        <div>
          <div className="text-xl font-mono font-bold text-[#00FF9C] tracking-tight">
            {stats.totalTradeableActive.toLocaleString()} <span className="text-xs font-normal text-[#00FF9C]/60">tCO₂e</span>
          </div>
          <p className="text-[10px] font-mono uppercase text-[#94A3B8] mt-1">80% Active Pool</p>
        </div>
      </div>

      {/* 4. Buffer Reserve Pool (20% held back) */}
      <div className="bg-[#080D11] border border-[#FF8A00]/30 rounded-lg p-3.5 flex flex-col justify-between hover:border-[#FF8A00] transition-colors">
        <div className="flex items-center justify-between text-[#FF8A00] mb-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Buffer Reserve</span>
          <ShieldAlert className="w-3.5 h-3.5 text-[#FF8A00]" />
        </div>
        <div>
          <div className="text-xl font-mono font-bold text-[#FF8A00] tracking-tight">
            {stats.totalBufferHeld.toLocaleString()} <span className="text-xs font-normal text-[#FF8A00]/70">tCO₂e</span>
          </div>
          <p className="text-[10px] font-mono uppercase text-[#94A3B8] mt-1">20% Ring-Fenced</p>
        </div>
      </div>

      {/* 5. Retired Offsets (Permanently Burned) */}
      <div className="bg-[#080D11] border border-[#1E293B] rounded-lg p-3.5 flex flex-col justify-between hover:border-[#00D1FF]/40 transition-colors">
        <div className="flex items-center justify-between text-[#64748B] mb-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Retired Offsets</span>
          <ShieldCheck className="w-3.5 h-3.5 text-[#00D1FF]" />
        </div>
        <div>
          <div className="text-xl font-mono font-bold text-white tracking-tight">
            {stats.totalRetired.toLocaleString()} <span className="text-xs font-normal text-[#64748B]">units</span>
          </div>
          <p className="text-[10px] font-mono uppercase text-[#94A3B8] mt-1">Burn Certificate</p>
        </div>
      </div>

      {/* 6. Reversal Compensation Burns */}
      <div className="bg-[#080D11] border border-[#1E293B] rounded-lg p-3.5 flex flex-col justify-between hover:border-[#FF4444]/40 transition-colors">
        <div className="flex items-center justify-between text-[#64748B] mb-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Reversal Burns</span>
          <Flame className="w-3.5 h-3.5 text-[#FF4444]" />
        </div>
        <div>
          <div className="text-xl font-mono font-bold text-[#FF4444] tracking-tight">
            {stats.totalReversalBurned.toLocaleString()} <span className="text-xs font-normal text-[#64748B]">units</span>
          </div>
          <p className="text-[10px] font-mono uppercase text-[#94A3B8] mt-1">Absorbed on Ledger</p>
        </div>
      </div>

    </div>
  );
};

