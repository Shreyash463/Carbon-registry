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
    <header className="sticky top-0 z-40 bg-[#050F1A]/95 border-b border-[#14354D] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand zone: Poseidon Trident & Geometric Diamond Logo */}
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 bg-gradient-to-br from-[#00F5D4] via-[#00B4D8] to-[#10B981] rounded-sm rotate-45 flex items-center justify-center shadow-[0_0_18px_rgba(0,245,212,0.4)] shrink-0">
              <div className="w-4 h-4 bg-[#030712] rounded-xs flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#00F5D4] rounded-full"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wider uppercase text-white leading-none flex items-center gap-1.5">
                <span className="bg-gradient-to-r from-[#00F5D4] via-[#00B4D8] to-[#00F5D4] bg-clip-text text-transparent">POSEIDON</span>
                <span className="text-xs font-mono font-normal text-[#94A3B8] tracking-widest">REGISTRY</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#00B4D8] mt-1">
                Indian Mangrove MRV & Credit Ledger
              </span>
            </div>
          </div>

          {/* Navigation Links: 4 items single-line */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#030712]/80 p-1 rounded-lg border border-[#14354D]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'bg-[#0B2236] text-[#00F5D4] border border-[#00F5D4]/50 shadow-[0_0_12px_rgba(0,245,212,0.25)]' 
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#071724]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00F5D4]' : 'text-[#64748B]'}`} />
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
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] shadow-[0_0_8px_#00F5D4] animate-pulse"></span>
                <span className="text-[11px] font-mono text-[#00F5D4] font-bold">ACTIVE / P2P</span>
              </div>
            </div>

            {/* Audit Button */}
            <button
              onClick={onVerifyLedger}
              disabled={isVerifying}
              title="Recomputes SHA-256 cryptographic hashes for the entire blockchain"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-mono font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                isCompromised
                  ? 'bg-[#F87171]/20 text-[#F87171] border border-[#F87171] hover:bg-[#F87171]/30 shadow-[0_0_12px_rgba(248,113,113,0.3)] animate-pulse'
                  : 'bg-[#0B2236] text-[#00F5D4] border border-[#00F5D4]/40 hover:bg-[#00F5D4]/10 hover:border-[#00F5D4] shadow-[0_0_10px_rgba(0,245,212,0.2)]'
              }`}
            >
              {isVerifying ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00B4D8]" />
              ) : isCompromised ? (
                <AlertTriangle className="w-3.5 h-3.5 text-[#F87171]" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00F5D4]" />
              )}
              <span>
                {isVerifying ? 'AUDITING...' : isCompromised ? 'TAMPERED!' : 'LEDGER VALID'}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="lg:hidden flex overflow-x-auto px-4 py-2 border-t border-[#14354D] gap-1 bg-[#050F1A] no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-mono uppercase tracking-wider whitespace-nowrap ${
                isActive 
                  ? 'bg-[#0B2236] text-[#00F5D4] border border-[#00F5D4]/40' 
                  : 'text-[#94A3B8] hover:bg-[#071724]'
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

