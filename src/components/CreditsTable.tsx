import React, { useState } from 'react';
import { CarbonCredit, CreditStatus } from '../types';
import { 
  Coins, 
  Search, 
  Filter, 
  Flame, 
  Award, 
  ShieldAlert, 
  CheckCircle2, 
  ShieldX, 
  Eye,
  FileCheck2,
  SlidersHorizontal
} from 'lucide-react';

interface CreditsTableProps {
  credits: CarbonCredit[];
  onOpenRetireModal: (credit: CarbonCredit) => void;
  onOpenCertificateModal: (credit: CarbonCredit) => void;
}

export const CreditsTable: React.FC<CreditsTableProps> = ({
  credits,
  onOpenRetireModal,
  onOpenCertificateModal
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredCredits = credits.filter(credit => {
    const matchesStatus = filterStatus === 'ALL' || credit.status === filterStatus;
    const matchesSearch = 
      credit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (credit.retiredDetails?.beneficiary || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: CreditStatus) => {
    switch (status) {
      case 'TRADEABLE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00FF9C]/15 text-[#00FF9C] border border-[#00FF9C]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_6px_#00FF9C]"></span>
            ACTIVE TRADEABLE
          </span>
        );
      case 'BUFFER_RESERVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF8A00]/15 text-[#FF8A00] border border-[#FF8A00]/40">
            <ShieldAlert className="w-3 h-3 text-[#FF8A00]" />
            BUFFER HELD (20%)
          </span>
        );
      case 'RETIRED_OFFSET':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00D1FF]/15 text-[#00D1FF] border border-[#00D1FF]/40">
            <CheckCircle2 className="w-3 h-3 text-[#00D1FF]" />
            RETIRED (OFFSET)
          </span>
        );
      case 'REVERSAL_BURNED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF4444]/20 text-[#FF4444] border border-[#FF4444]/60">
            <ShieldX className="w-3 h-3 text-[#FF4444]" />
            REVERSAL BURNED
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Control Bar: Filters & Search */}
      <div className="bg-[#080D11] border border-[#1E293B] rounded-lg p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {[
            { id: 'ALL', label: 'ALL POOLS' },
            { id: 'TRADEABLE', label: 'ACTIVE TRADEABLE' },
            { id: 'BUFFER_RESERVE', label: 'BUFFER RESERVE (20%)' },
            { id: 'RETIRED_OFFSET', label: 'RETIRED OFFSETS' },
            { id: 'REVERSAL_BURNED', label: 'REVERSAL BURNED' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === tab.id
                  ? 'bg-[#00FF9C] text-[#05080A] font-bold shadow-[0_0_10px_rgba(0,255,156,0.3)]'
                  : 'bg-[#0F171C] text-[#94A3B8] border border-[#1E293B] hover:text-white hover:border-[#00FF9C]/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative min-w-[260px]">
          <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Serial, Site, Beneficiary..."
            className="w-full bg-[#05080A] border border-[#1E293B] rounded pl-9 pr-3 py-1.5 text-xs font-mono text-white placeholder-[#64748B] focus:outline-none focus:border-[#00FF9C]"
          />
        </div>

      </div>

      {/* Credits Table */}
      <div className="bg-[#080D11] border border-[#1E293B] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#05080A] text-[#64748B] font-mono uppercase tracking-widest text-[10px]">
                <th className="py-3 px-4">Serial Token ID</th>
                <th className="py-3 px-4">Provenance Site</th>
                <th className="py-3 px-4">Vintage</th>
                <th className="py-3 px-4">Volume</th>
                <th className="py-3 px-4">Registry Status</th>
                <th className="py-3 px-4">Ledger Tx</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] font-mono">
              {filteredCredits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#64748B] text-xs font-mono">
                    NO CARBON TOKENS MATCHING FILTER CRITERIA
                  </td>
                </tr>
              ) : (
                filteredCredits.map((credit) => (
                  <tr key={credit.id} className="hover:bg-[#0F171C]/70 transition-colors">
                    
                    {/* Serial ID */}
                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                      {credit.id}
                    </td>

                    {/* Site */}
                    <td className="py-3 px-4 text-[#E0E7EB] font-sans font-medium">
                      {credit.siteName}
                    </td>

                    {/* Vintage */}
                    <td className="py-3 px-4 text-[#94A3B8]">
                      {credit.vintageYear}
                    </td>

                    {/* Volume */}
                    <td className="py-3 px-4 font-bold text-[#00FF9C]">
                      {credit.tonnage.toFixed(1)} tCO₂e
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(credit.status)}
                    </td>

                    {/* Tx Hash */}
                    <td className="py-3 px-4 text-[11px] text-[#64748B]">
                      {credit.mintTxHash.slice(0, 10)}...{credit.mintTxHash.slice(-6)}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {credit.status === 'TRADEABLE' && (
                        <button
                          onClick={() => onOpenRetireModal(credit)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider bg-[#FF8A00]/20 hover:bg-[#FF8A00]/30 text-[#FF8A00] border border-[#FF8A00]/50 transition-colors cursor-pointer"
                        >
                          <Flame className="w-3 h-3" />
                          <span>RETIRE</span>
                        </button>
                      )}

                      {credit.status === 'RETIRED_OFFSET' && (
                        <button
                          onClick={() => onOpenCertificateModal(credit)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-semibold uppercase tracking-wider bg-[#00D1FF]/15 text-[#00D1FF] border border-[#00D1FF]/40 hover:bg-[#00D1FF]/25 transition-colors cursor-pointer"
                        >
                          <FileCheck2 className="w-3 h-3 text-[#00D1FF]" />
                          <span>CERTIFICATE</span>
                        </button>
                      )}

                      {credit.status === 'BUFFER_RESERVE' && (
                        <span className="text-[10px] text-[#FF8A00] uppercase tracking-wider">
                          LOCKED BUFFER
                        </span>
                      )}

                      {credit.status === 'REVERSAL_BURNED' && (
                        <span className="text-[10px] text-[#FF4444] uppercase tracking-wider">
                          DISTURBANCE BURN
                        </span>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#05080A] border-t border-[#1E293B] flex items-center justify-between text-xs text-[#64748B] font-mono">
          <span>Displaying {filteredCredits.length} serialized carbon credit tokens</span>
          <span className="text-[10px] uppercase">1 Token = 1.0 Metric Tonne CO₂e Permanently Sequestered</span>
        </div>
      </div>

    </div>
  );
};
