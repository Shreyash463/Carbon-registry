import React, { useState } from 'react';
import { LedgerBlock, LedgerVerificationResult } from '../types';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Link, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Bug, 
  Wrench, 
  FileText, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
  Terminal,
  Cpu
} from 'lucide-react';

interface LedgerExplorerProps {
  ledger: LedgerBlock[];
  verificationResult: LedgerVerificationResult | null;
  onVerifyLedger: () => void;
  isVerifying: boolean;
  onTamperLedger: (blockIndex: number) => void;
  onRepairLedger: () => void;
}

export const LedgerExplorer: React.FC<LedgerExplorerProps> = ({
  ledger,
  verificationResult,
  onVerifyLedger,
  isVerifying,
  onTamperLedger,
  onRepairLedger
}) => {
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
  const [tamperTargetIndex, setTamperTargetIndex] = useState<number>(1);
  const [tamperSuccessNotice, setTamperSuccessNotice] = useState<string | null>(null);

  const isCompromised = verificationResult && !verificationResult.isValid;

  const handleTamperClick = () => {
    onTamperLedger(tamperTargetIndex);
    setTamperSuccessNotice(`Deliberately mutated data payload inside Block #${tamperTargetIndex}. Click "Verify Ledger Integrity" to watch the cryptographic validator detect the broken chain!`);
  };

  const getBlockTypeBadge = (type: LedgerBlock['blockType']) => {
    switch (type) {
      case 'GENESIS':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#14354D] text-[#94A3B8] border border-[#14354D]">GENESIS</span>;
      case 'CREDIT_MINT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/40">MINT_EVENT</span>;
      case 'BUFFER_REVERSAL_BURN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F87171]/20 text-[#F87171] border border-[#F87171]/60">REVERSAL_BURN</span>;
      case 'CREDIT_RETIREMENT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/40">RETIREMENT</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#14354D] text-[#94A3B8]">{type}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Demo Control Center */}
      <div className="bg-[#050F1A] border border-[#14354D] rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#14354D]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#00F5D4] mb-1">
              <Cpu className="w-4 h-4" />
              <span>Permissioned Cryptographic Hash Chain</span>
            </div>
            <h2 className="text-xl font-bold font-mono text-white tracking-tight uppercase">
              Blockchain Ledger Explorer & Proof Engine
            </h2>
            <p className="text-xs font-mono text-[#94A3B8] mt-1 max-w-2xl">
              Every carbon minting, buffer reserve allocation, retirement, and reversal event is committed to a SHA-256 hash chain with Merkle proofs.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onVerifyLedger}
              disabled={isVerifying}
              className="flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-bold uppercase tracking-wider bg-[#00F5D4] hover:bg-[#00B4D8] text-[#030712] transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_12px_rgba(0,245,212,0.25)]"
            >
              {isVerifying ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span>VERIFY LEDGER CHAIN</span>
            </button>

            <button
              onClick={onRepairLedger}
              className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono uppercase tracking-wider bg-[#0B2236] hover:bg-[#0B2236] text-[#E0E7EB] border border-[#14354D] transition-colors cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5 text-[#00B4D8]" />
              <span>RESTORE CANONICAL</span>
            </button>
          </div>
        </div>

        {/* Cryptographic Audit Simulator Tool */}
        <div className="mt-4 pt-4 border-t border-[#14354D] bg-[#030712] rounded-lg p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-[#F87171]/15 border border-[#F87171]/40 flex items-center justify-center text-[#F87171] shrink-0">
                <Bug className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
                  <span>Security Audit Tool: Simulate Data Alteration</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#F87171]/20 text-[#F87171] border border-[#F87171]/40">
                    CRYPTOGRAPHIC AUDIT TEST
                  </span>
                </h4>
                <p className="text-[11px] font-mono text-[#64748B] mt-0.5">
                  Mutates the stored data payload of a block to demonstrate how SHA-256 hash chaining detects unauthorized modifications.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={tamperTargetIndex}
                onChange={(e) => setTamperTargetIndex(Number(e.target.value))}
                className="bg-[#050F1A] border border-[#14354D] text-xs font-mono text-[#E0E7EB] rounded px-3 py-2 focus:outline-none focus:border-[#F87171]"
              >
                {ledger.filter(b => b.index > 0).map(b => (
                  <option key={b.index} value={b.index}>
                    Block #{b.index} ({b.blockType})
                  </option>
                ))}
              </select>

              <button
                onClick={handleTamperClick}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-mono font-bold uppercase tracking-wider bg-[#F87171]/20 hover:bg-[#F87171]/30 text-[#F87171] border border-[#F87171]/60 transition-colors cursor-pointer"
              >
                <Bug className="w-3.5 h-3.5 text-[#F87171]" />
                <span>TAMPER BLOCK #{tamperTargetIndex}</span>
              </button>
            </div>
          </div>

          {tamperSuccessNotice && (
            <div className="mt-3 p-3 rounded bg-[#F87171]/15 border border-[#F87171]/50 text-xs font-mono text-[#F87171] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#F87171] shrink-0" />
                <span>{tamperSuccessNotice}</span>
              </span>
              <button 
                onClick={() => setTamperSuccessNotice(null)}
                className="text-[#94A3B8] hover:text-white text-xs uppercase underline ml-2 cursor-pointer"
              >
                DISMISS
              </button>
            </div>
          )}
        </div>

        {/* Verification Status Banner */}
        {verificationResult && (
          <div className={`mt-4 p-4 rounded-lg border flex items-start gap-3.5 font-mono ${
            verificationResult.isValid
              ? 'bg-[#00F5D4]/10 border-[#00F5D4]/40 text-[#00F5D4]'
              : 'bg-[#F87171]/15 border-[#F87171] text-[#F87171] animate-pulse'
          }`}>
            <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
              verificationResult.isValid ? 'bg-[#00F5D4] text-[#030712]' : 'bg-[#F87171] text-white'
            }`}>
              {verificationResult.isValid ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-widest">
                  {verificationResult.isValid ? 'Ledger Chain 100% Valid & Intact' : 'CRITICAL: Cryptographic Chain Broken!'}
                </h4>
                <span className="text-[10px] opacity-75">
                  AUDITED: {new Date(verificationResult.verifiedAt).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-xs mt-1 leading-relaxed opacity-90 text-[#E0E7EB]">
                {verificationResult.details}
              </p>
              {!verificationResult.isValid && verificationResult.firstInvalidBlockIndex !== null && (
                <div className="mt-2 text-xs font-mono bg-[#030712] p-2.5 rounded border border-[#F87171]/60 text-white space-y-1">
                  <div>First Invalid Target: <span className="font-bold text-[#F87171]">Block #{verificationResult.firstInvalidBlockIndex}</span></div>
                  <div className="truncate text-[#94A3B8]">Stored Hash: {verificationResult.actualHash}</div>
                  <div className="truncate text-[#00F5D4]">Expected Canonical Hash: {verificationResult.expectedHash}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Visual Hash-Chain Blocks */}
      <div className="space-y-4 font-mono">
        <div className="flex items-center justify-between text-xs text-[#64748B] px-1 uppercase tracking-widest">
          <span>
            Ledger Blocks Sequence ({ledger.length} Blocks)
          </span>
          <span>Chain Tip: Block #{ledger.length - 1}</span>
        </div>

        {ledger.map((block, idx) => {
          const auditInfo = verificationResult?.chainAudit.find(a => a.index === block.index);
          const isInvalid = auditInfo && !auditInfo.isValid;
          const isSelected = selectedBlockIndex === block.index;

          return (
            <div key={block.index} className="relative">
              
              {/* Connector Link Line to Previous Block */}
              {idx > 0 && (
                <div className="flex items-center justify-center my-1">
                  <div className={`flex items-center gap-1.5 px-3 py-0.5 rounded text-[10px] font-mono border ${
                    isInvalid 
                      ? 'bg-[#F87171]/20 text-[#F87171] border-[#F87171]' 
                      : 'bg-[#030712] text-[#00F5D4]/80 border-[#14354D]'
                  }`}>
                    <Link className="w-3 h-3 text-[#00B4D8]" />
                    <span>PREV_HASH: {block.previousHash.slice(0, 12)}...{block.previousHash.slice(-8)}</span>
                  </div>
                </div>
              )}

              {/* Block Card */}
              <div 
                className={`bg-[#050F1A] border rounded-lg overflow-hidden transition-all ${
                  isInvalid 
                    ? 'border-[#F87171] ring-1 ring-[#F87171]/50 shadow-[0_0_15px_rgba(255,68,68,0.3)]' 
                    : (block.tampered 
                        ? 'border-[#FBBF24]' 
                        : 'border-[#14354D] hover:border-[#00F5D4]/40')
                }`}
              >
                {/* Block Card Top Row */}
                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center font-mono font-bold text-xs ${
                      block.index === 0 
                        ? 'bg-[#14354D] text-white' 
                        : (isInvalid ? 'bg-[#F87171]/20 text-[#F87171] border border-[#F87171]' : 'bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/40')
                    }`}>
                      #{block.index}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        {getBlockTypeBadge(block.blockType)}
                        {block.siteName && (
                          <span className="text-xs font-bold uppercase text-white font-mono">
                            {block.siteName}
                          </span>
                        )}
                        {block.tampered && (
                          <span className="text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded bg-[#F87171]/20 text-[#F87171] border border-[#F87171]/60 animate-pulse">
                            TAMPERED
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#64748B] font-mono mt-0.5">
                        {new Date(block.timestamp).toUTCString()}
                      </div>
                    </div>
                  </div>

                  {/* Hash snapshot */}
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <span className="text-[9px] text-[#64748B] block uppercase tracking-widest font-mono">Block Hash (SHA-256)</span>
                      <span className={`text-xs font-mono font-semibold ${isInvalid ? 'text-[#F87171]' : 'text-[#00B4D8]'}`}>
                        {block.hash.slice(0, 16)}...{block.hash.slice(-12)}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedBlockIndex(isSelected ? null : block.index)}
                      className="px-2.5 py-1.5 rounded bg-[#0B2236] hover:bg-[#0B2236] text-[#94A3B8] hover:text-white transition-colors cursor-pointer text-xs font-mono uppercase flex items-center gap-1 border border-[#14354D]"
                    >
                      <span>{isSelected ? 'HIDE' : 'INSPECT'}</span>
                      {isSelected ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Block Key Payload Highlights */}
                <div className="px-4 py-2.5 bg-[#030712] border-t border-[#14354D] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-4 text-[#E0E7EB]">
                    {block.data.totalTCO2e !== undefined && (
                      <div>
                        <span className="text-[#64748B] text-[10px] uppercase">Tonnage: </span>
                        <span className="font-bold text-[#00F5D4]">{block.data.totalTCO2e.toLocaleString()} tCO₂e</span>
                      </div>
                    )}
                    {block.data.tradeableCredits !== undefined && (
                      <div>
                        <span className="text-[#64748B] text-[10px] uppercase">Tradeable (80%): </span>
                        <span className="font-bold text-white">{block.data.tradeableCredits.toLocaleString()}</span>
                      </div>
                    )}
                    {block.data.bufferCredits !== undefined && (
                      <div>
                        <span className="text-[#64748B] text-[10px] uppercase">Buffer (20%): </span>
                        <span className="font-bold text-[#FBBF24]">{block.data.bufferCredits.toLocaleString()}</span>
                      </div>
                    )}
                    {block.data.retiredCreditId && (
                      <div>
                        <span className="text-[#64748B] text-[10px] uppercase">Retired Token: </span>
                        <span className="font-mono text-[#00B4D8]">{block.data.retiredCreditId}</span>
                      </div>
                    )}
                    {block.data.burnedReserveCredits !== undefined && (
                      <div>
                        <span className="text-[#64748B] text-[10px] uppercase">Burned Reserve: </span>
                        <span className="font-bold text-[#F87171]">-{block.data.burnedReserveCredits.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-[#94A3B8] truncate max-w-md italic font-mono">
                    {block.data.notes}
                  </div>
                </div>

                {/* Expanded Details / JSON Inspector */}
                {isSelected && (
                  <div className="p-4 bg-[#030712] border-t border-[#14354D] space-y-3 text-xs font-mono">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] block mb-1">Cryptographic Headers</span>
                        <div className="space-y-1 text-[11px] bg-[#050F1A] p-3 rounded border border-[#14354D]">
                          <div><span className="text-[#64748B]">Index:</span> {block.index}</div>
                          <div className="truncate"><span className="text-[#64748B]">Hash:</span> <span className="text-[#00F5D4]">{block.hash}</span></div>
                          <div className="truncate"><span className="text-[#64748B]">PrevHash:</span> {block.previousHash}</div>
                          <div className="truncate"><span className="text-[#64748B]">MerkleRoot:</span> {block.merkleRoot}</div>
                          <div className="truncate"><span className="text-[#64748B]">ValidatorSig:</span> {block.validatorSignature}</div>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] block mb-1">Payload JSON</span>
                        <pre className="p-3 rounded bg-[#050F1A] border border-[#14354D] text-[11px] text-[#00F5D4] overflow-x-auto max-h-36">
                          {JSON.stringify(block.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

