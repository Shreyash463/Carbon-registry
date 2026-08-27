import React, { useState, useEffect } from 'react';
import { MangroveSite, ConsensusResult, LedgerBlock, CarbonCredit } from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Satellite, 
  Plane, 
  Radio, 
  ShieldCheck, 
  Coins, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  Calculator,
  ArrowRight,
  ShieldAlert,
  Bot,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MRVVerificationModalProps {
  site: MangroveSite | null;
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: (result: {
    site: MangroveSite;
    consensus: ConsensusResult;
    mintBlock: LedgerBlock;
    newCredits: CarbonCredit[];
  }) => void;
}

export const MRVVerificationModal: React.FC<MRVVerificationModalProps> = ({
  site,
  isOpen,
  onClose,
  onVerificationComplete
}) => {
  const [bufferRatioPct, setBufferRatioPct] = useState(20);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [verificationData, setVerificationData] = useState<{
    site: MangroveSite;
    consensus: ConsensusResult;
    mintBlock: LedgerBlock;
    newCredits: CarbonCredit[];
    isAiGenerated?: boolean;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setVerificationData(null);
      setErrorMsg(null);
      setCurrentStep(0);
      setIsRunning(false);
    }
  }, [isOpen, site]);

  if (!isOpen || !site) return null;

  const handleStartVerification = async () => {
    setIsRunning(true);
    setErrorMsg(null);
    setCurrentStep(1);

    try {
      // Step 1: Ingesting Telemetry
      await new Promise(r => setTimeout(r, 600));
      setCurrentStep(2);

      // Step 2: Cross-Source Tolerance Matrix
      await new Promise(r => setTimeout(r, 700));
      setCurrentStep(3);

      // Step 3: Carbon Sequestration Math
      await new Promise(r => setTimeout(r, 700));
      setCurrentStep(4);

      // Step 4 & 5: Server Verification & Ledger Minting
      const response = await fetch('/api/mrv/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: site.id,
          bufferRatioPct
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'MRV verification failed.');
      }

      setCurrentStep(5);
      await new Promise(r => setTimeout(r, 500));

      setVerificationData({
        site: data.site,
        consensus: data.consensus,
        mintBlock: data.mintBlock,
        newCredits: data.newCredits,
        isAiGenerated: data.isAiGenerated
      });

      // Confetti effect for successful minting
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore if canvas is unavailable
      }

      onVerificationComplete({
        site: data.site,
        consensus: data.consensus,
        mintBlock: data.mintBlock,
        newCredits: data.newCredits
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed');
    } finally {
      setIsRunning(false);
    }
  };

  const steps = [
    { title: 'Telemetry Ingestion', desc: 'Pulling Sentinel-2 optical/SAR, RTK-LiDAR, and in-situ IoT flux nodes' },
    { title: 'Consensus Tolerance Matrix', desc: 'Evaluating cross-source variance against 14% allowable threshold' },
    { title: 'India-FSI Tier-3 Sequestration', desc: 'Executing Komiyama allometric equations (AGB + BGB + SOC pool)' },
    { title: 'Cryptographic Proof & Merkle', desc: 'Building SHA-256 Merkle root and Gov. of India validator signature' },
    { title: '80/20 Ledger Minting', desc: 'Allocating tradeable credits and ring-fencing 20% buffer reserve' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05080A]/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#080D11] border border-[#1E293B] rounded-lg w-full max-w-3xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between bg-[#05080A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#00FF9C]/15 border border-[#00FF9C]/40 flex items-center justify-center text-[#00FF9C]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono text-white tracking-tight uppercase">
                Tri-Source MRV Consensus Audit
              </h2>
              <p className="text-xs font-mono text-[#64748B]">
                {site.name} • {site.totalAreaHa.toLocaleString()} Ha • {site.state}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#64748B] hover:text-white hover:bg-[#161F27] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* If NOT completed yet: show configuration & pipeline */}
          {!verificationData ? (
            <>
              {/* Telemetry Snapshot */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded bg-[#05080A] border border-[#1E293B] text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-[#00D1FF] font-bold mb-1 uppercase text-[10px]">
                    <Satellite className="w-3.5 h-3.5" />
                    <span>Sentinel-2</span>
                  </div>
                  <div className="text-white font-bold text-sm">NDVI {site.telemetry.satellite.ndvi}</div>
                  <div className="text-[#64748B] text-[10px] mt-0.5">Canopy: {site.telemetry.satellite.canopyAreaHa} Ha</div>
                </div>

                <div className="p-3 rounded bg-[#05080A] border border-[#1E293B] text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-[#00FF9C] font-bold mb-1 uppercase text-[10px]">
                    <Plane className="w-3.5 h-3.5" />
                    <span>RTK-LiDAR</span>
                  </div>
                  <div className="text-white font-bold text-sm">{site.telemetry.drone.canopyHeightM}m Height</div>
                  <div className="text-[#64748B] text-[10px] mt-0.5">Crown: {site.telemetry.drone.crownClosurePct}%</div>
                </div>

                <div className="p-3 rounded bg-[#05080A] border border-[#1E293B] text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-[#FF8A00] font-bold mb-1 uppercase text-[10px]">
                    <Radio className="w-3.5 h-3.5" />
                    <span>IoT Mesh</span>
                  </div>
                  <div className="text-white font-bold text-sm">{site.telemetry.groundSensors.socPercent30cm}% SOC</div>
                  <div className="text-[#64748B] text-[10px] mt-0.5">{site.telemetry.groundSensors.activeNodeCount} Nodes Active</div>
                </div>
              </div>

              {/* Buffer Reserve Configurator */}
              <div className="p-4 rounded bg-[#05080A] border border-[#00FF9C]/30 font-mono">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#FF8A00]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Buffer Reserve Allocation Ratio
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#FF8A00] px-2 py-0.5 rounded bg-[#FF8A00]/15 border border-[#FF8A00]/40">
                    {bufferRatioPct}% RESERVE / {100 - bufferRatioPct}% TRADEABLE
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] mb-3">
                  Ring-fenced pool guaranteeing that future cyclone, erosion, or dieback events are auto-compensated without market insolvency.
                </p>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="10"
                    max="40"
                    step="5"
                    value={bufferRatioPct}
                    onChange={(e) => setBufferRatioPct(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full accent-[#00FF9C] cursor-pointer"
                  />
                </div>
              </div>

              {/* Pipeline Step Progress */}
              {isRunning && (
                <div className="space-y-3 pt-2 font-mono">
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest">
                    Executing Consensus Pipeline
                  </h4>
                  <div className="space-y-2">
                    {steps.map((step, idx) => {
                      const stepNum = idx + 1;
                      const isPast = currentStep > stepNum;
                      const isCurrent = currentStep === stepNum;

                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded border text-xs flex items-center justify-between transition-colors ${
                            isCurrent
                              ? 'bg-[#161F27] border-[#00FF9C] text-white shadow-[0_0_10px_rgba(0,255,156,0.2)]'
                              : isPast
                                ? 'bg-[#05080A] border-[#00FF9C]/40 text-[#E0E7EB]'
                                : 'bg-[#05080A] border-[#1E293B] text-[#64748B]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold ${
                              isPast 
                                ? 'bg-[#00FF9C] text-[#05080A]' 
                                : isCurrent 
                                  ? 'bg-[#00FF9C]/20 text-[#00FF9C] border border-[#00FF9C]' 
                                  : 'bg-[#1E293B] text-[#64748B]'
                            }`}>
                              {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : stepNum}
                            </div>
                            <div>
                              <div className="font-bold uppercase tracking-wider">{step.title}</div>
                              <div className="text-[10px] text-[#64748B]">{step.desc}</div>
                            </div>
                          </div>
                          {isCurrent && (
                            <RefreshCw className="w-4 h-4 animate-spin text-[#00FF9C]" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded bg-[#FF4444]/15 border border-[#FF4444] text-xs font-mono text-[#FF4444] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#FF4444] shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </>
          ) : (
            /* Successful MRV Verification Outcome Screen */
            <div className="space-y-5 font-mono">
              
              {/* Success Banner */}
              <div className="p-4 rounded bg-[#00FF9C]/10 border border-[#00FF9C]/40 flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-[#00FF9C] text-[#05080A] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Consensus Certified & Tokens Minted!
                  </h3>
                  <p className="text-xs text-[#00FF9C] mt-0.5">
                    Multi-source verification confirmed with {verificationData.consensus.confidenceScore}% confidence. Max inter-source variance was {verificationData.consensus.variancePct}%.
                  </p>
                </div>
              </div>

              {/* Tonnage & Split Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded bg-[#05080A] border border-[#1E293B]">
                  <span className="text-[10px] text-[#64748B] block uppercase tracking-widest">Reconciled Biomass</span>
                  <div className="text-xl font-bold text-white mt-1">
                    {verificationData.consensus.reconciledAnnualSequestrationTCO2e.toLocaleString()} <span className="text-xs font-normal text-[#64748B]">tCO₂e</span>
                  </div>
                  <span className="text-[10px] text-[#00FF9C] uppercase">IPCC Tier-3 Net Certified</span>
                </div>

                <div className="p-3.5 rounded bg-[#05080A] border border-[#00FF9C]/40">
                  <span className="text-[10px] text-[#00FF9C] block uppercase tracking-widest">Tradeable Credits (80%)</span>
                  <div className="text-xl font-bold text-[#00FF9C] mt-1">
                    {verificationData.consensus.tradeableCredits.toLocaleString()} <span className="text-xs font-normal text-[#64748B]">units</span>
                  </div>
                  <span className="text-[10px] text-[#94A3B8]">Active for Market Sale</span>
                </div>

                <div className="p-3.5 rounded bg-[#05080A] border border-[#FF8A00]/40">
                  <span className="text-[10px] text-[#FF8A00] block uppercase tracking-widest">Buffer Held (20%)</span>
                  <div className="text-xl font-bold text-[#FF8A00] mt-1">
                    {verificationData.consensus.bufferReserveCredits.toLocaleString()} <span className="text-xs font-normal text-[#64748B]">units</span>
                  </div>
                  <span className="text-[10px] text-[#94A3B8]">Ring-Fenced Solvency Reserve</span>
                </div>
              </div>

              {/* Plain-language AI / Auditor Summary */}
              <div className="p-4 rounded bg-[#05080A] border border-[#1E293B]">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-[#00FF9C]" />
                    <span>MRV Compliance & Ecological Statement</span>
                  </span>
                  <span className="text-[9px] font-mono text-[#00FF9C] px-2 py-0.5 rounded bg-[#00FF9C]/15 border border-[#00FF9C]/40">
                    {verificationData.isAiGenerated ? 'Gemini 2.5 Flash Grounded' : 'Official FSI Auditor Baseline'}
                  </span>
                </div>
                <p className="text-xs text-[#E0E7EB] leading-relaxed font-sans">
                  {verificationData.consensus.aiGeneratedSummary || verificationData.consensus.summary}
                </p>
              </div>

              {/* Cryptographic Proof Card */}
              <div className="p-3 rounded bg-[#05080A] border border-[#1E293B] text-xs font-mono">
                <div className="flex items-center justify-between text-[#64748B] mb-1.5 uppercase text-[10px]">
                  <span>Blockchain Mint Block #{verificationData.mintBlock.index}</span>
                  <span className="text-[#00FF9C]">SHA-256 Validated</span>
                </div>
                <div className="text-[#E0E7EB] truncate">
                  Hash: <span className="text-[#00FF9C] font-bold">{verificationData.mintBlock.hash}</span>
                </div>
                <div className="text-[#64748B] truncate text-[10px] mt-0.5">
                  Prev: {verificationData.mintBlock.previousHash}
                </div>
                <div className="text-[#64748B] truncate text-[10px] mt-0.5">
                  Merkle: {verificationData.mintBlock.merkleRoot}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#1E293B] flex items-center justify-between bg-[#05080A] font-mono">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-xs uppercase tracking-wider text-[#64748B] hover:text-white hover:bg-[#161F27] transition-colors cursor-pointer border border-[#1E293B]"
          >
            {verificationData ? 'CLOSE' : 'CANCEL'}
          </button>

          {!verificationData ? (
            <button
              onClick={handleStartVerification}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider bg-[#00FF9C] hover:bg-[#00D1FF] text-[#05080A] transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(0,255,156,0.3)]"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>CALCULATING CONSENSUS...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>EXECUTE MRV & MINT CREDITS</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider bg-[#00FF9C] hover:bg-[#00D1FF] text-[#05080A] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,156,0.3)]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>CONFIRM & UPDATE REGISTRY</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

