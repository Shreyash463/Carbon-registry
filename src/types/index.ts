export type EcosystemType = 
  | 'Deltaic Mangrove'
  | 'Estuarine Complex'
  | 'Island Creek'
  | 'Arid Dwarf Mangrove';

export type VerificationStatus = 
  | 'VERIFIED'
  | 'PENDING_MRV'
  | 'ANOMALY_FLAGGED'
  | 'DEGRADED_ALERT';

export interface SatelliteTelemetry {
  ndvi: number;
  evi: number;
  ndwi: number;
  sarBackscatterDb: number;
  canopyAreaHa: number;
  cloudCoverPct: number;
  sensor: string;
  timestamp: string;
}

export interface DroneTelemetry {
  canopyHeightM: number;
  stemDensityHa: number;
  crownClosurePct: number;
  hyperspectralChlA: number;
  surveyDate: string;
  droneModel: string;
}

export interface GroundTelemetry {
  socPercent30cm: number;
  socPercent100cm: number;
  soilBulkDensityGcm3: number;
  salinityPsu: number;
  redoxPotentialMv: number;
  waterTableCm: number;
  sedimentAccretionMmYr: number;
  co2FluxGcm2Day: number;
  activeNodeCount: number;
  meshStatus: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
}

export interface MangroveSite {
  id: string;
  name: string;
  state: string;
  region: string;
  coordinates: { lat: number; lng: number };
  totalAreaHa: number;
  dominantSpecies: string[];
  ecosystemType: EcosystemType;
  baselineBiomassTonsHa: number;
  lastVerificationDate: string;
  verificationStatus: VerificationStatus;
  healthScore: number;
  totalCreditsMinted: number;
  activeBufferReserve: number;
  telemetry: {
    satellite: SatelliteTelemetry;
    drone: DroneTelemetry;
    groundSensors: GroundTelemetry;
  };
}

export interface ConsensusResult {
  passed: boolean;
  confidenceScore: number;
  variancePct: number;
  satelliteAGBEst: number;
  droneAGBEst: number;
  groundSOCEst: number;
  grossBiomassTonsHa: number;
  reconciledAnnualSequestrationTCO2e: number;
  tradeableCredits: number;
  bufferReserveCredits: number;
  bufferRatioPct: number;
  toleranceThresholdPct: number;
  sourceAgreement: {
    satelliteVsDroneDeltaPct: number;
    droneVsGroundDeltaPct: number;
    groundVsSatelliteDeltaPct: number;
  };
  anomalyFlags: string[];
  summary: string;
  aiGeneratedSummary?: string;
  methodology: string;
  allometricEquation: string;
}

export type CreditStatus = 
  | 'TRADEABLE'
  | 'BUFFER_RESERVE'
  | 'RETIRED_OFFSET'
  | 'REVERSAL_BURNED';

export interface CarbonCredit {
  id: string;
  batchId: string;
  siteId: string;
  siteName: string;
  vintageYear: number;
  tonnage: number;
  status: CreditStatus;
  mintedAt: string;
  mintTxHash: string;
  blockIndex: number;
  standard: string;
  retiredDetails?: {
    retiredAt: string;
    beneficiary: string;
    reason: string;
    certificateNumber: string;
    burnTxHash: string;
  };
  reversalDetails?: {
    reversedAt: string;
    triggerEvent: string;
    reversalLossTCO2e: number;
    burnTxHash: string;
  };
}

export type BlockType = 
  | 'GENESIS'
  | 'CREDIT_MINT'
  | 'BUFFER_RESERVE_ALLOCATION'
  | 'CREDIT_RETIREMENT'
  | 'BUFFER_REVERSAL_BURN'
  | 'MRV_AUDIT_CHECK';

export interface BlockData {
  batchId?: string;
  tradeableCredits?: number;
  bufferCredits?: number;
  totalTCO2e?: number;
  retiredCreditId?: string;
  beneficiary?: string;
  reason?: string;
  certificateNumber?: string;
  reversalLossTCO2e?: number;
  burnedReserveCredits?: number;
  triggerEvent?: string;
  mrvMetrics?: {
    ndvi: number;
    lidarHeightM: number;
    socPercent: number;
    consensusVariancePct: number;
    confidencePct: number;
  };
  rawConsensusHash?: string;
  notes?: string;
}

export interface LedgerBlock {
  index: number;
  timestamp: string;
  blockType: BlockType;
  siteId?: string;
  siteName?: string;
  previousHash: string;
  hash: string;
  merkleRoot: string;
  data: BlockData;
  validatorSignature: string;
  tampered?: boolean;
}

export interface ChainAuditItem {
  index: number;
  blockType: BlockType;
  storedHash: string;
  recomputedHash: string;
  isValid: boolean;
  previousHashMatch: boolean;
  tamperNote?: string;
}

export interface LedgerVerificationResult {
  isValid: boolean;
  totalBlocks: number;
  firstInvalidBlockIndex: number | null;
  expectedHash: string | null;
  actualHash: string | null;
  details: string;
  verifiedAt: string;
  chainAudit: ChainAuditItem[];
}

export interface RegistryStats {
  totalMintedAllTime: number;
  totalTradeableActive: number;
  totalBufferHeld: number;
  totalRetired: number;
  totalReversalBurned: number;
  bufferReserveRatio: number;
  totalHectaresMonitored: number;
  totalSites: number;
  activeLedgerBlocks: number;
}
