import React from 'react';
import { CarbonCredit } from '../types';
import { Award, CheckCircle2, ShieldCheck, Download, X, Printer, TreePine } from 'lucide-react';

interface CertificateModalProps {
  credit: CarbonCredit | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  credit,
  isOpen,
  onClose
}) => {
  if (!isOpen || !credit || !credit.retiredDetails) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#050F1A] border border-[#14354D] rounded-lg w-full max-w-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] my-8 text-white font-mono">
        
        {/* Top Control Bar */}
        <div className="px-6 py-3 border-b border-[#14354D] flex items-center justify-between bg-[#030712]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#00F5D4] uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Gov. of India MRV Offset Proof</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs uppercase tracking-wider bg-[#0B2236] hover:bg-[#14354D] text-[#E0E7EB] border border-[#14354D] transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-[#64748B] hover:text-white hover:bg-[#0B2236] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Ornamental Content */}
        <div className="p-8 bg-[#030712] border-2 border-[#14354D] m-4 rounded relative">
          
          {/* Subtle Background Emblem */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <TreePine className="w-72 h-72 text-[#00F5D4]" />
          </div>

          <div className="relative text-center space-y-4">
            
            {/* Header / Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded bg-[#00F5D4]/15 border border-[#00F5D4]/40 flex items-center justify-center text-[#00F5D4] mb-2 shadow-[0_0_20px_rgba(0,245,212,0.35)]">
                <Award className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] bg-gradient-to-r from-[#00F5D4] via-[#00B4D8] to-[#00F5D4] bg-clip-text text-transparent">
                POSEIDON BLUE CARBON REGISTRY OF INDIA
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight uppercase mt-1">
                Certificate of Carbon Retirement
              </h2>
              <div className="text-xs text-[#94A3B8] mt-1">
                Certificate ID: <span className="text-[#00F5D4] font-bold">{credit.retiredDetails.certificateNumber}</span>
              </div>
            </div>

            <div className="w-24 h-0.5 bg-gradient-to-r from-[#00F5D4] via-[#00B4D8] to-[#10B981] mx-auto my-2"></div>

            {/* Main Statement */}
            <p className="text-xs text-[#94A3B8] max-w-lg mx-auto leading-relaxed">
              This document certifies the permanent on-chain retirement and environmental extinguishment of <strong className="text-white">1.0 Metric Tonne of CO₂ Equivalent (tCO₂e)</strong> sequestered in verified Indian coastal mangrove wetlands.
            </p>

            {/* Beneficiary Highlight Box */}
            <div className="p-4 rounded bg-[#050F1A] border border-[#14354D] max-w-md mx-auto text-center">
              <span className="text-[9px] uppercase font-bold text-[#64748B] block tracking-widest">
                Extinguished on Behalf of
              </span>
              <div className="text-sm font-bold text-[#00F5D4] mt-0.5 uppercase">
                {credit.retiredDetails.beneficiary}
              </div>
              <div className="text-xs text-[#94A3B8] italic mt-1 font-sans">
                "{credit.retiredDetails.reason}"
              </div>
            </div>

            {/* Specifics Grid */}
            <div className="grid grid-cols-2 gap-3 text-left max-w-md mx-auto text-xs bg-[#050F1A] p-3.5 rounded border border-[#14354D]">
              <div>
                <span className="text-[#64748B] text-[9px] block uppercase tracking-wider">Credit Token ID</span>
                <span className="font-bold text-white">{credit.id}</span>
              </div>
              <div>
                <span className="text-[#64748B] text-[9px] block uppercase tracking-wider">Provenance Site</span>
                <span className="font-bold text-[#E0E7EB]">{credit.siteName}</span>
              </div>
              <div>
                <span className="text-[#64748B] text-[9px] block uppercase tracking-wider">Retirement Date</span>
                <span className="text-[#94A3B8]">{new Date(credit.retiredDetails.retiredAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-[#64748B] text-[9px] block uppercase tracking-wider">Methodology Standard</span>
                <span className="text-[#00D1FF] font-bold">{credit.standard}</span>
              </div>
            </div>

            {/* Cryptographic Burn Seal */}
            <div className="pt-2 text-center">
              <div className="text-[10px] text-[#64748B] truncate max-w-md mx-auto">
                Ledger Burn Tx: <span className="text-[#94A3B8]">{credit.retiredDetails.burnTxHash}</span>
              </div>
              <div className="text-[10px] text-[#00F5D4] mt-1 flex items-center justify-center gap-1 uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Immutable Proof: Extinguished on Indian Blue Carbon Ledger</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

