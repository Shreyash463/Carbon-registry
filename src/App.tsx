import React, { useState, useEffect, useCallback } from 'react';
import { 
  MangroveSite, 
  CarbonCredit, 
  LedgerBlock, 
  RegistryStats, 
  LedgerVerificationResult,
  ConsensusResult
} from './types';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { SitesView } from './components/SitesView';
import { LedgerExplorer } from './components/LedgerExplorer';
import { CreditsTable } from './components/CreditsTable';
import { BufferReserveView } from './components/BufferReserveView';
import { MRVVerificationModal } from './components/MRVVerificationModal';
import { RetireModal } from './components/RetireModal';
import { CertificateModal } from './components/CertificateModal';
import { AlertTriangle, CheckCircle2, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('sites');
  
  // Data State
  const [sites, setSites] = useState<MangroveSite[]>([]);
  const [credits, setCredits] = useState<CarbonCredit[]>([]);
  const [ledger, setLedger] = useState<LedgerBlock[]>([]);
  const [stats, setStats] = useState<RegistryStats>({
    totalMintedAllTime: 0,
    totalTradeableActive: 0,
    totalBufferHeld: 0,
    totalRetired: 0,
    totalReversalBurned: 0,
    bufferReserveRatio: 20,
    totalHectaresMonitored: 0,
    totalSites: 0,
    activeLedgerBlocks: 0
  });

  // Verification & Loading State
  const [verificationResult, setVerificationResult] = useState<LedgerVerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessingReversal, setIsProcessingReversal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'warning' } | null>(null);

  // Modals State
  const [activeMRVSite, setActiveMRVSite] = useState<MangroveSite | null>(null);
  const [retireTargetCredit, setRetireTargetCredit] = useState<CarbonCredit | null>(null);
  const [certificateCredit, setCertificateCredit] = useState<CarbonCredit | null>(null);

  // Fetch initial registry state
  const loadRegistryData = useCallback(async () => {
    try {
      const [sitesRes, creditsRes, ledgerRes, statsRes] = await Promise.all([
        fetch('/api/sites'),
        fetch('/api/credits'),
        fetch('/api/ledger'),
        fetch('/api/stats')
      ]);

      const [sitesData, creditsData, ledgerData, statsData] = await Promise.all([
        sitesRes.json(),
        creditsRes.json(),
        ledgerRes.json(),
        statsRes.json()
      ]);

      if (sitesData.success) setSites(sitesData.sites);
      if (creditsData.success) setCredits(creditsData.credits);
      if (ledgerData.success) setLedger(ledgerData.ledger);
      if (statsData.success) setStats(statsData.stats);

      // Run initial cryptographic verification silently
      const verifyRes = await fetch('/api/ledger/verify');
      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        setVerificationResult(verifyData.verification);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRegistryData();
  }, [loadRegistryData]);

  // Toast notification helper
  const showToast = (text: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  // 1. Verify Ledger action
  const handleVerifyLedger = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/ledger/verify');
      const data = await res.json();
      if (data.success) {
        setVerificationResult(data.verification);
        if (data.verification.isValid) {
          showToast(`Consensus Verified: All ${data.verification.totalBlocks} blocks passed cryptographic SHA-256 integrity check.`, 'success');
        } else {
          showToast(`Cryptographic Tampering Detected at Block #${data.verification.firstInvalidBlockIndex}!`, 'error');
        }
      }
    } catch (err: any) {
      showToast('Ledger verification failed.', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  // 2. Tamper Ledger action (Demo feature)
  const handleTamperLedger = async (blockIndex: number) => {
    try {
      const res = await fetch('/api/ledger/tamper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockIndex, fakeCreditsCount: 999999 })
      });
      const data = await res.json();
      if (data.success) {
        await loadRegistryData();
        showToast(`Maliciously altered Block #${blockIndex}. Click 'Verify Ledger Integrity' to see the audit engine detect it!`, 'warning');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // 3. Repair / Reset Ledger
  const handleRepairLedger = async () => {
    try {
      const res = await fetch('/api/ledger/repair', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await loadRegistryData();
        showToast('Ledger successfully restored to verified state.', 'success');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // 4. Verification completed callback
  const handleVerificationComplete = (result: {
    site: MangroveSite;
    consensus: ConsensusResult;
    mintBlock: LedgerBlock;
    newCredits: CarbonCredit[];
  }) => {
    // Update local state without full reload
    setSites(prev => prev.map(s => s.id === result.site.id ? result.site : s));
    setLedger(prev => [...prev, result.mintBlock]);
    setCredits(prev => [...result.newCredits, ...prev]);
    loadRegistryData(); // refresh totals
    showToast(`Successfully verified & minted ${result.consensus.reconciledAnnualSequestrationTCO2e.toLocaleString()} credits for ${result.site.name}!`, 'success');
  };

  // 5. Trigger Reversal / Disturbance simulation
  const handleTriggerReversal = async (siteId: string, severity: 'MODERATE_SURGE' | 'SEVERE_CYCLONE') => {
    setIsProcessingReversal(true);
    try {
      const res = await fetch('/api/mrv/simulate-degradation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, severity })
      });
      const data = await res.json();
      if (data.success) {
        await loadRegistryData();
        showToast(`Reversal event processed: Burned ${data.burnedReserveCredits.toLocaleString()} buffer credits to absorb ${data.biomassLossTCO2e.toLocaleString()} tCO₂e ecological loss.`, 'warning');
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to simulate disturbance', 'error');
    } finally {
      setIsProcessingReversal(false);
    }
  };

  // 6. Credit Retirement Success callback
  const handleRetireSuccess = (result: {
    retiredCredit: CarbonCredit;
    retirementBlock: LedgerBlock;
    certificateNumber: string;
  }) => {
    setRetireTargetCredit(null);
    setCertificateCredit(result.retiredCredit);
    loadRegistryData();
    showToast(`Carbon Credit ${result.retiredCredit.id} permanently retired. Certificate issued!`, 'success');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#05080A] flex flex-col items-center justify-center text-[#E0E7EB] font-mono">
        <RefreshCw className="w-8 h-8 animate-spin text-[#00FF9C] mb-3" />
        <p className="text-xs uppercase font-bold tracking-widest text-white">Booting Indian Blue Carbon MRV Registry...</p>
        <p className="text-[10px] text-[#64748B] mt-1 tracking-wider uppercase">Initializing SHA-256 Ledger & Ingesting Mangrove Telemetry</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05080A] text-[#E0E7EB] flex flex-col antialiased selection:bg-[#00FF9C]/30 selection:text-[#00FF9C]">
      
      {/* Navigation Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        verificationResult={verificationResult}
        onVerifyLedger={handleVerifyLedger}
        isVerifying={isVerifying}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className={`mb-6 p-3.5 rounded border text-xs font-mono flex items-center justify-between shadow-lg transition-all animate-in fade-in slide-in-from-top-2 ${
            toastMessage.type === 'success'
              ? 'bg-[#05080A] border-[#00FF9C] text-[#00FF9C] shadow-[0_0_15px_rgba(0,255,156,0.2)]'
              : toastMessage.type === 'error'
                ? 'bg-[#05080A] border-[#FF4444] text-[#FF4444] shadow-[0_0_15px_rgba(255,68,68,0.2)]'
                : 'bg-[#05080A] border-[#FF8A00] text-[#FF8A00] shadow-[0_0_15px_rgba(255,138,0,0.2)]'
          }`}>
            <div className="flex items-center gap-2.5">
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#00FF9C] shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[#FF8A00] shrink-0" />
              )}
              <span className="font-semibold uppercase tracking-wider">{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-[#64748B] hover:text-white ml-3 underline cursor-pointer"
            >
              [DISMISS]
            </button>
          </div>
        )}

        {/* Global Stats Overview Bar */}
        <StatsOverview stats={stats} />

        {/* Active Tab View Rendering */}
        {activeTab === 'sites' && (
          <SitesView
            sites={sites}
            onVerifySite={(site) => setActiveMRVSite(site)}
            onDegradeSite={(site) => handleTriggerReversal(site.id, 'SEVERE_CYCLONE')}
          />
        )}

        {activeTab === 'ledger' && (
          <LedgerExplorer
            ledger={ledger}
            verificationResult={verificationResult}
            onVerifyLedger={handleVerifyLedger}
            isVerifying={isVerifying}
            onTamperLedger={handleTamperLedger}
            onRepairLedger={handleRepairLedger}
          />
        )}

        {activeTab === 'credits' && (
          <CreditsTable
            credits={credits}
            onOpenRetireModal={(credit) => setRetireTargetCredit(credit)}
            onOpenCertificateModal={(credit) => setCertificateCredit(credit)}
          />
        )}

        {activeTab === 'buffer' && (
          <BufferReserveView
            sites={sites}
            stats={stats}
            onTriggerReversal={handleTriggerReversal}
            isProcessingReversal={isProcessingReversal}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#1E293B] bg-[#05080A] py-5 text-center text-xs text-[#64748B] font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase tracking-wider">National Blue Carbon Registry</span>
            <span>•</span>
            <span className="text-[#94A3B8]">Ministry of Environment, Forest and Climate Change (MoEFCC)</span>
          </div>
          <div className="text-[#64748B] text-[10px] uppercase tracking-widest">
            IPCC Tier-3 Wetland Allometry • SHA-256 Cryptographic Ledger • 80/20 Buffer Reserve
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MRVVerificationModal
        site={activeMRVSite}
        isOpen={activeMRVSite !== null}
        onClose={() => setActiveMRVSite(null)}
        onVerificationComplete={handleVerificationComplete}
      />

      <RetireModal
        credit={retireTargetCredit}
        isOpen={retireTargetCredit !== null}
        onClose={() => setRetireTargetCredit(null)}
        onRetireSuccess={handleRetireSuccess}
      />

      <CertificateModal
        credit={certificateCredit}
        isOpen={certificateCredit !== null}
        onClose={() => setCertificateCredit(null)}
      />

    </div>
  );
}
