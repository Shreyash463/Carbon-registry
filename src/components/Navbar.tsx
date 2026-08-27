import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  FileCheck2, 
  Coins, 
  ShieldAlert, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Radio
} from 'lucide-react';
import { LedgerVerificationResult } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  verificationResult: LedgerVerificationResult | null;
  onVerifyLedger: () => void;
  isVerifying: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  verificationResult,
  onVerifyLedger,
  isVerifying
}) => {
  const isCompromised = verificationResult && !verificationResult.isValid;

  const navItems = [
    { id: 'sites', label: 'Sites & MRV', icon: Layers },
    { id: 'ledger', label: 'Blockchain Ledger', icon: ShieldCheck },
    { id: 'credits', label: 'Credit Registry', icon: Coins },
    { id: 'buffer', label: 'Buffer Reserve', icon: ShieldAlert }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#080D11]/95 border-b border-[#1E293B] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand zone: Immersive geometric diamond logo */}
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00FF9C] to-[#00D1FF] rounded-sm rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,156,0.35)] shrink-0">
              <div className="w-3.5 h-3.5 bg-[#05080A] rounded-xs"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight uppercase text-white leading-none">
                <span className="text-[#00FF9C]">Blue</span>Carbon Registry
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#64748B] mt-1">
                National MRV Consensus & Carbon Ledger
              </span>
            </div>
          </div>

          {/* Navigation Links: 5 items single-line */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#05080A]/60 p-1 rounded-lg border border-[#1E293B]/70">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'bg-[#161F27] text-[#00FF9C] border border-[#00FF9C]/40 shadow-[0_0_10px_rgba(0,255,156,0.15)]' 
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#0F171C]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00FF9C]' : 'text-[#64748B]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Zone: Telemetry status and Ledger Verification trigger */}
          <div className="flex items-center gap-4">
            
            {/* Live Telemetry Node Tag */}
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[9px] uppercase tracking-widest text-[#64748B]">Network Status</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_8px_#00FF9C] animate-pulse"></span>
                <span className="text-[11px] font-mono text-[#00FF9C]">ACTIVE / P2P</span>
              </div>
            </div>

            {/* Audit Button */}
            <button
              onClick={onVerifyLedger}
              disabled={isVerifying}
              title="Recomputes SHA-256 cryptographic hashes for the entire blockchain"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-mono font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                isCompromised
                  ? 'bg-[#FF4444]/20 text-[#FF4444] border border-[#FF4444] hover:bg-[#FF4444]/30 shadow-[0_0_12px_rgba(255,68,68,0.3)] animate-pulse'
                  : 'bg-[#0F171C] text-[#00FF9C] border border-[#00FF9C]/40 hover:bg-[#00FF9C]/10 hover:border-[#00FF9C] shadow-[0_0_10px_rgba(0,255,156,0.15)]'
              }`}
            >
              {isVerifying ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00D1FF]" />
              ) : isCompromised ? (
                <AlertTriangle className="w-3.5 h-3.5 text-[#FF4444]" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF9C]" />
              )}
              <span>
                {isVerifying ? 'AUDITING...' : isCompromised ? 'TAMPERED!' : 'LEDGER VALID'}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="lg:hidden flex overflow-x-auto px-4 py-2 border-t border-[#1E293B] gap-1 bg-[#080D11] no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-mono uppercase tracking-wider whitespace-nowrap ${
                isActive 
                  ? 'bg-[#161F27] text-[#00FF9C] border border-[#00FF9C]/40' 
                  : 'text-[#94A3B8] hover:bg-[#0F171C]'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

