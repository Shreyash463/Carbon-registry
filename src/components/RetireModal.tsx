import React, { useState } from 'react';
import { CarbonCredit, LedgerBlock } from '../types';
import { Flame, X, CheckCircle2, ShieldAlert, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RetireModalProps {
  credit: CarbonCredit | null;
  isOpen: boolean;
  onClose: () => void;
  onRetireSuccess: (result: {
    retiredCredit: CarbonCredit;
    retirementBlock: LedgerBlock;
    certificateNumber: string;
  }) => void;
}

export const RetireModal: React.FC<RetireModalProps> = ({
  credit,
  isOpen,
  onClose,
  onRetireSuccess
}) => {
  const [beneficiary, setBeneficiary] = useState('Tata Steel Sustainability Net-Zero Initiative');
  const [reason, setReason] = useState('Scope-1 Emissions Compensation for Indian Coastal Operations (2026)');
  const [isRetiring, setIsRetiring] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !credit) return null;

  const handleRetire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beneficiary.trim() || !reason.trim()) {
      setErrorMsg('Please provide both beneficiary organization and offset purpose.');
      return;
    }

    setIsRetiring(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/credits/retire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creditId: credit.id,
          beneficiary,
          reason
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to retire credit.');
      }

      try {
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.7 }
        });
      } catch {}

      onRetireSuccess({
        retiredCredit: data.retiredCredit,
        retirementBlock: data.retirementBlock,
        certificateNumber: data.certificateNumber
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while retiring credit');
    } finally {
      setIsRetiring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#050F1A] border border-[#14354D] rounded-lg w-full max-w-lg overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#14354D] flex items-center justify-between bg-[#030712]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#FBBF24]/15 border border-[#FBBF24]/40 flex items-center justify-center text-[#FBBF24]">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono text-white tracking-tight uppercase">
                Permanently Retire Carbon Token
              </h2>
              <p className="text-xs font-mono text-[#64748B]">
                Token ID: <span className="font-mono text-[#00F5D4] font-bold">{credit.id}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#64748B] hover:text-white hover:bg-[#0B2236] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleRetire} className="p-6 space-y-4 font-mono">
          
          <div className="p-3.5 rounded bg-[#030712] border border-[#14354D] text-xs">
            <div className="flex justify-between items-center text-[#64748B] mb-1">
              <span>Provenance Site:</span>
              <span className="font-bold text-white font-sans">{credit.siteName}</span>
            </div>
            <div className="flex justify-between items-center text-[#64748B] mb-1">
              <span>Credit Volume:</span>
              <span className="font-bold text-[#00F5D4]">1.0 tCO₂e (Metric Tonne)</span>
            </div>
            <div className="flex justify-between items-center text-[#64748B]">
              <span>Standard Protocol:</span>
              <span className="font-bold text-[#00B4D8]">{credit.standard}</span>
            </div>
          </div>

          <div className="p-3 rounded bg-[#FBBF24]/10 border border-[#FBBF24]/40 text-xs text-[#FBBF24] flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Irreversible Burn:</strong> Retiring this credit permanently extinguishes it from the tradeable ledger to prevent double-counting. An immutable certificate will be issued.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5">
              Beneficiary Entity / Organization
            </label>
            <input
              type="text"
              required
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
              placeholder="e.g. Tata Steel Ltd. Sustainability Wing"
              className="w-full bg-[#030712] border border-[#14354D] rounded px-3.5 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#FBBF24]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5">
              Retirement Purpose / Claim Reason
            </label>
            <textarea
              required
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Scope 1 Annual Decarbonization Claim 2026"
              className="w-full bg-[#030712] border border-[#14354D] rounded px-3.5 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#FBBF24] resize-none"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded bg-[#F87171]/15 border border-[#F87171] text-xs text-[#F87171]">
              {errorMsg}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#14354D] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-xs uppercase tracking-wider text-[#64748B] hover:text-white hover:bg-[#0B2236] transition-colors cursor-pointer border border-[#14354D]"
            >
              CANCEL
            </button>

            <button
              type="submit"
              disabled={isRetiring}
              className="flex items-center gap-2 px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider bg-[#FBBF24]/20 hover:bg-[#FBBF24]/30 text-[#FBBF24] border border-[#FBBF24]/60 transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(255,138,0,0.25)]"
            >
              {isRetiring ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>BURNING ON LEDGER...</span>
                </>
              ) : (
                <>
                  <Flame className="w-3.5 h-3.5" />
                  <span>BURN & ISSUE CERTIFICATE</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

