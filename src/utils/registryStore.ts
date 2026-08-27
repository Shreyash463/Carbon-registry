import { 
  MangroveSite, 
  CarbonCredit, 
  LedgerBlock, 
  RegistryStats, 
  ConsensusResult,
  CreditStatus
} from '../types/index.ts';
import { INITIAL_MANGROVE_SITES, runMRVConsensusCheck, simulateDegradationEvent } from './mrvEngine.ts';
import { calculateMerkleRoot, computeBlockHash, generateValidatorSignature, verifyLedgerChain } from './cryptoLedger.ts';

export class RegistryStore {
  private sites: MangroveSite[] = [];
  private credits: CarbonCredit[] = [];
  private ledger: LedgerBlock[] = [];
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    // Initialization will be explicitly awaited on startup
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      this.sites = JSON.parse(JSON.stringify(INITIAL_MANGROVE_SITES));
      this.credits = [];
      this.ledger = [];

    // 1. Create Genesis Block
    const genesisTime = '2026-01-01T00:00:00.000Z';
    const genesisData = {
      notes: 'Official Genesis Block: National Blue Carbon MRV Registry (MoEFCC / FSI / NCCR-INDIA)',
      totalTCO2e: 0
    };
    const genesisMerkle = await calculateMerkleRoot(genesisData, undefined, genesisTime);
    const genesisHash = await computeBlockHash(
      0,
      genesisTime,
      'GENESIS',
      '0000000000000000000000000000000000000000000000000000000000000000',
      genesisMerkle,
      genesisData
    );
    const genesisSig = await generateValidatorSignature(genesisHash, 0);

    const genesisBlock: LedgerBlock = {
      index: 0,
      timestamp: genesisTime,
      blockType: 'GENESIS',
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
      hash: genesisHash,
      merkleRoot: genesisMerkle,
      data: genesisData,
      validatorSignature: genesisSig
    };
    this.ledger.push(genesisBlock);

    // 2. Seed initial verified batches for Sundarbans, Pichavaram, and Bhitarkanika
    const seedBatches = [
      { site: this.sites[0], totalTons: 18450, batchId: 'BATCH-2026-SUN-01', date: '2026-07-15T10:00:00Z' },
      { site: this.sites[1], totalTons: 5200, batchId: 'BATCH-2026-PIC-01', date: '2026-06-28T11:30:00Z' },
      { site: this.sites[2], totalTons: 11800, batchId: 'BATCH-2026-BHI-01', date: '2026-05-18T15:00:00Z' }
    ];

    for (const item of seedBatches) {
      const bufferCount = Math.round(item.totalTons * 0.2);
      const tradeableCount = item.totalTons - bufferCount;
      const prevBlock = this.ledger[this.ledger.length - 1];

      const blockData = {
        batchId: item.batchId,
        tradeableCredits: tradeableCount,
        bufferCredits: bufferCount,
        totalTCO2e: item.totalTons,
        mrvMetrics: {
          ndvi: item.site.telemetry.satellite.ndvi,
          lidarHeightM: item.site.telemetry.drone.canopyHeightM,
          socPercent: item.site.telemetry.groundSensors.socPercent30cm,
          consensusVariancePct: 4.8,
          confidencePct: 96.2
        },
        notes: `Seeded baseline MRV certification for ${item.site.name}`
      };

      const merkle = await calculateMerkleRoot(blockData, item.site.id, item.date);
      const blockHash = await computeBlockHash(
        this.ledger.length,
        item.date,
        'CREDIT_MINT',
        prevBlock.hash,
        merkle,
        blockData,
        item.site.id
      );
      const sig = await generateValidatorSignature(blockHash, this.ledger.length);

      const mintBlock: LedgerBlock = {
        index: this.ledger.length,
        timestamp: item.date,
        blockType: 'CREDIT_MINT',
        siteId: item.site.id,
        siteName: item.site.name,
        previousHash: prevBlock.hash,
        hash: blockHash,
        merkleRoot: merkle,
        data: blockData,
        validatorSignature: sig
      };
      this.ledger.push(mintBlock);

      // Create serialized carbon credits sample pool
      const prefix = item.site.id.substring(0, 3).toUpperCase();
      // Generate individual serialized tokens (represent full batch)
      const representativeCount = Math.min(25, item.totalTons);
      const sampleBuffer = Math.round(representativeCount * 0.2);
      const sampleTradeable = representativeCount - sampleBuffer;

      for (let i = 1; i <= sampleTradeable; i++) {
        const idNum = String(i).padStart(4, '0');
        this.credits.push({
          id: `IN-MNG-${prefix}-2026-${idNum}`,
          batchId: item.batchId,
          siteId: item.site.id,
          siteName: item.site.name,
          vintageYear: 2026,
          tonnage: 1.0,
          status: 'TRADEABLE',
          mintedAt: item.date,
          mintTxHash: blockHash,
          blockIndex: mintBlock.index,
          standard: 'India-FSI Tier-3 Blue Carbon Standard'
        });
      }

      for (let i = sampleTradeable + 1; i <= representativeCount; i++) {
        const idNum = String(i).padStart(4, '0');
        this.credits.push({
          id: `IN-MNG-${prefix}-2026-${idNum}`,
          batchId: item.batchId,
          siteId: item.site.id,
          siteName: item.site.name,
          vintageYear: 2026,
          tonnage: 1.0,
          status: 'BUFFER_RESERVE',
          mintedAt: item.date,
          mintTxHash: blockHash,
          blockIndex: mintBlock.index,
          standard: 'India-FSI Tier-3 Blue Carbon Standard'
        });
      }
    }

    // Seed one retired credit to show lifecycle
    if (this.credits.length > 0) {
      const tradeable = this.credits.find(c => c.status === 'TRADEABLE');
      if (tradeable) {
        tradeable.status = 'RETIRED_OFFSET';
        tradeable.retiredDetails = {
          retiredAt: '2026-08-01T14:10:00Z',
          beneficiary: 'Tata Steel Sustainability Scope-1 Offset Initiative',
          reason: 'Voluntary Net Zero Mangrove Restoration Retirement (Q3-2026)',
          certificateNumber: 'CERT-IN-BCR-2026-0089',
          burnTxHash: '0x7e88b2a194c5e3d7...f902'
        };

        const prevBlock = this.ledger[this.ledger.length - 1];
        const retireTime = '2026-08-01T14:10:00Z';
        const retireData = {
          retiredCreditId: tradeable.id,
          beneficiary: tradeable.retiredDetails.beneficiary,
          reason: tradeable.retiredDetails.reason,
          certificateNumber: tradeable.retiredDetails.certificateNumber,
          totalTCO2e: 1.0,
          notes: `Permanent offset retirement of credit unit ${tradeable.id}`
        };

        const merkle = await calculateMerkleRoot(retireData, tradeable.siteId, retireTime);
        const blockHash = await computeBlockHash(
          this.ledger.length,
          retireTime,
          'CREDIT_RETIREMENT',
          prevBlock.hash,
          merkle,
          retireData,
          tradeable.siteId
        );
        const sig = await generateValidatorSignature(blockHash, this.ledger.length);

        this.ledger.push({
          index: this.ledger.length,
          timestamp: retireTime,
          blockType: 'CREDIT_RETIREMENT',
          siteId: tradeable.siteId,
          siteName: tradeable.siteName,
          previousHash: prevBlock.hash,
          hash: blockHash,
          merkleRoot: merkle,
          data: retireData,
          validatorSignature: sig
        });
      }
    }

      this.isInitialized = true;
    })();

    await this.initPromise;
  }

  public getSites(): MangroveSite[] {
    return this.sites;
  }

  public getSiteById(id: string): MangroveSite | undefined {
    return this.sites.find(s => s.id === id);
  }

  public getLedger(): LedgerBlock[] {
    return this.ledger;
  }

  public getCredits(statusFilter?: CreditStatus): CarbonCredit[] {
    if (!statusFilter) return this.credits;
    return this.credits.filter(c => c.status === statusFilter);
  }

  public getStats(): RegistryStats {
    let totalMinted = 0;
    let totalBuffer = 0;
    let totalRetired = 0;
    let totalReversal = 0;

    for (const site of this.sites) {
      totalMinted += site.totalCreditsMinted;
      totalBuffer += site.activeBufferReserve;
    }

    const retiredCredits = this.credits.filter(c => c.status === 'RETIRED_OFFSET');
    totalRetired = retiredCredits.length;

    const reversedCredits = this.credits.filter(c => c.status === 'REVERSAL_BURNED');
    totalReversal = reversedCredits.length;

    const totalTradeable = Math.max(0, totalMinted - totalBuffer - totalRetired - totalReversal);
    const totalHectares = this.sites.reduce((acc, s) => acc + s.totalAreaHa, 0);

    return {
      totalMintedAllTime: totalMinted,
      totalTradeableActive: totalTradeable,
      totalBufferHeld: totalBuffer,
      totalRetired,
      totalReversalBurned: totalReversal,
      bufferReserveRatio: 20,
      totalHectaresMonitored: totalHectares,
      totalSites: this.sites.length,
      activeLedgerBlocks: this.ledger.length
    };
  }

  /**
   * Run MRV verification and mint certified carbon credits onto the blockchain ledger
   */
  public async runVerificationAndMint(
    siteId: string, 
    customBufferRatioPct: number = 20,
    aiSummary?: string
  ): Promise<{
    site: MangroveSite;
    consensus: ConsensusResult;
    mintBlock: LedgerBlock;
    newCredits: CarbonCredit[];
  }> {
    const siteIndex = this.sites.findIndex(s => s.id === siteId);
    if (siteIndex === -1) {
      throw new Error(`Mangrove site with ID '${siteId}' not found.`);
    }

    const site = this.sites[siteIndex];
    const consensus = runMRVConsensusCheck(site, customBufferRatioPct);
    if (aiSummary) {
      consensus.aiGeneratedSummary = aiSummary;
    }

    if (!consensus.passed) {
      site.verificationStatus = 'ANOMALY_FLAGGED';
      throw new Error(`Consensus failed (${consensus.variancePct}% variance). Cannot mint credits until anomaly is resolved.`);
    }

    // Update site state
    const now = new Date().toISOString();
    site.verificationStatus = 'VERIFIED';
    site.lastVerificationDate = now;
    site.totalCreditsMinted += consensus.reconciledAnnualSequestrationTCO2e;
    site.activeBufferReserve += consensus.bufferReserveCredits;

    const batchId = `BATCH-${new Date().getFullYear()}-${site.id.substring(0, 3).toUpperCase()}-${String(this.ledger.length).padStart(3, '0')}`;
    const prevBlock = this.ledger[this.ledger.length - 1];

    const blockData = {
      batchId,
      tradeableCredits: consensus.tradeableCredits,
      bufferCredits: consensus.bufferReserveCredits,
      totalTCO2e: consensus.reconciledAnnualSequestrationTCO2e,
      mrvMetrics: {
        ndvi: site.telemetry.satellite.ndvi,
        lidarHeightM: site.telemetry.drone.canopyHeightM,
        socPercent: site.telemetry.groundSensors.socPercent30cm,
        consensusVariancePct: consensus.variancePct,
        confidencePct: consensus.confidenceScore
      },
      notes: consensus.summary
    };

    const merkle = await calculateMerkleRoot(blockData, site.id, now);
    const blockHash = await computeBlockHash(
      this.ledger.length,
      now,
      'CREDIT_MINT',
      prevBlock.hash,
      merkle,
      blockData,
      site.id
    );
    const sig = await generateValidatorSignature(blockHash, this.ledger.length);

    const mintBlock: LedgerBlock = {
      index: this.ledger.length,
      timestamp: now,
      blockType: 'CREDIT_MINT',
      siteId: site.id,
      siteName: site.name,
      previousHash: prevBlock.hash,
      hash: blockHash,
      merkleRoot: merkle,
      data: blockData,
      validatorSignature: sig
    };
    this.ledger.push(mintBlock);

    // Create credit tokens
    const prefix = site.id.substring(0, 3).toUpperCase();
    const newCredits: CarbonCredit[] = [];
    const samplePoolCount = 20; // representative visual units
    const sampleBuffer = Math.round(samplePoolCount * (customBufferRatioPct / 100));
    const sampleTradeable = samplePoolCount - sampleBuffer;

    const startingNum = this.credits.filter(c => c.siteId === site.id).length + 1;

    for (let i = 0; i < sampleTradeable; i++) {
      const idNum = String(startingNum + i).padStart(4, '0');
      const credit: CarbonCredit = {
        id: `IN-MNG-${prefix}-2026-${idNum}`,
        batchId,
        siteId: site.id,
        siteName: site.name,
        vintageYear: 2026,
        tonnage: 1.0,
        status: 'TRADEABLE',
        mintedAt: now,
        mintTxHash: blockHash,
        blockIndex: mintBlock.index,
        standard: 'India-FSI Tier-3 Blue Carbon Standard'
      };
      this.credits.unshift(credit);
      newCredits.push(credit);
    }

    for (let i = 0; i < sampleBuffer; i++) {
      const idNum = String(startingNum + sampleTradeable + i).padStart(4, '0');
      const credit: CarbonCredit = {
        id: `IN-MNG-${prefix}-2026-${idNum}`,
        batchId,
        siteId: site.id,
        siteName: site.name,
        vintageYear: 2026,
        tonnage: 1.0,
        status: 'BUFFER_RESERVE',
        mintedAt: now,
        mintTxHash: blockHash,
        blockIndex: mintBlock.index,
        standard: 'India-FSI Tier-3 Blue Carbon Standard'
      };
      this.credits.unshift(credit);
      newCredits.push(credit);
    }

    return {
      site,
      consensus,
      mintBlock,
      newCredits
    };
  }

  /**
   * Triggers the automated Reversal Burn mechanism when a site experiences severe degradation/loss
   */
  public async triggerReversalDegradation(
    siteId: string, 
    severity: 'MODERATE_SURGE' | 'SEVERE_CYCLONE' = 'SEVERE_CYCLONE'
  ): Promise<{
    degradedSite: MangroveSite;
    biomassLossTCO2e: number;
    burnedReserveCredits: number;
    reversalBlock: LedgerBlock;
    affectedCreditIds: string[];
    triggerEvent: string;
  }> {
    const siteIndex = this.sites.findIndex(s => s.id === siteId);
    if (siteIndex === -1) {
      throw new Error(`Mangrove site with ID '${siteId}' not found.`);
    }

    const site = this.sites[siteIndex];
    const { degradedSite, biomassLossTCO2e, triggerEvent } = simulateDegradationEvent(site, severity);
    this.sites[siteIndex] = degradedSite;

    // Determine how many buffer reserve credits to burn
    const maxBurnable = Math.min(site.activeBufferReserve, biomassLossTCO2e);
    const burnedReserveCredits = maxBurnable;
    degradedSite.activeBufferReserve = Math.max(0, degradedSite.activeBufferReserve - burnedReserveCredits);

    // Find and burn buffer reserve credits in memory
    const siteBufferCredits = this.credits.filter(c => c.siteId === site.id && c.status === 'BUFFER_RESERVE');
    const affectedCreditIds: string[] = [];

    const now = new Date().toISOString();
    const prevBlock = this.ledger[this.ledger.length - 1];

    const blockData = {
      reversalLossTCO2e: biomassLossTCO2e,
      burnedReserveCredits,
      triggerEvent,
      totalTCO2e: -biomassLossTCO2e,
      notes: `AUTOMATED REVERSAL COMPENSATION: Burned ${burnedReserveCredits.toLocaleString()} buffer reserve credits to absorb canopy loss without compromising tradeable market tokens.`
    };

    const merkle = await calculateMerkleRoot(blockData, site.id, now);
    const blockHash = await computeBlockHash(
      this.ledger.length,
      now,
      'BUFFER_REVERSAL_BURN',
      prevBlock.hash,
      merkle,
      blockData,
      site.id
    );
    const sig = await generateValidatorSignature(blockHash, this.ledger.length);

    const reversalBlock: LedgerBlock = {
      index: this.ledger.length,
      timestamp: now,
      blockType: 'BUFFER_REVERSAL_BURN',
      siteId: site.id,
      siteName: site.name,
      previousHash: prevBlock.hash,
      hash: blockHash,
      merkleRoot: merkle,
      data: blockData,
      validatorSignature: sig
    };
    this.ledger.push(reversalBlock);

    // Update affected credits
    let burnCounter = 0;
    for (const credit of siteBufferCredits) {
      if (burnCounter < 5) { // burn representative visible units
        credit.status = 'REVERSAL_BURNED';
        credit.reversalDetails = {
          reversedAt: now,
          triggerEvent,
          reversalLossTCO2e: biomassLossTCO2e,
          burnTxHash: blockHash
        };
        affectedCreditIds.push(credit.id);
        burnCounter++;
      }
    }

    return {
      degradedSite,
      biomassLossTCO2e,
      burnedReserveCredits,
      reversalBlock,
      affectedCreditIds,
      triggerEvent
    };
  }

  /**
   * Retires a tradeable carbon credit and logs permanent burn onto blockchain ledger
   */
  public async retireCredit(
    creditId: string, 
    beneficiary: string, 
    reason: string
  ): Promise<{
    retiredCredit: CarbonCredit;
    retirementBlock: LedgerBlock;
    certificateNumber: string;
  }> {
    const credit = this.credits.find(c => c.id === creditId);
    if (!credit) {
      throw new Error(`Carbon credit with ID '${creditId}' not found.`);
    }

    if (credit.status !== 'TRADEABLE') {
      throw new Error(`Credit ${creditId} cannot be retired because its status is '${credit.status}'. Only tradeable credits can be retired.`);
    }

    const now = new Date().toISOString();
    const certificateNumber = `CERT-IN-BCR-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const prevBlock = this.ledger[this.ledger.length - 1];

    const blockData = {
      retiredCreditId: credit.id,
      beneficiary,
      reason,
      certificateNumber,
      totalTCO2e: credit.tonnage,
      notes: `Permanent offset retirement for ${beneficiary}: ${reason}`
    };

    const merkle = await calculateMerkleRoot(blockData, credit.siteId, now);
    const blockHash = await computeBlockHash(
      this.ledger.length,
      now,
      'CREDIT_RETIREMENT',
      prevBlock.hash,
      merkle,
      blockData,
      credit.siteId
    );
    const sig = await generateValidatorSignature(blockHash, this.ledger.length);

    const retirementBlock: LedgerBlock = {
      index: this.ledger.length,
      timestamp: now,
      blockType: 'CREDIT_RETIREMENT',
      siteId: credit.siteId,
      siteName: credit.siteName,
      previousHash: prevBlock.hash,
      hash: blockHash,
      merkleRoot: merkle,
      data: blockData,
      validatorSignature: sig
    };
    this.ledger.push(retirementBlock);

    credit.status = 'RETIRED_OFFSET';
    credit.retiredDetails = {
      retiredAt: now,
      beneficiary,
      reason,
      certificateNumber,
      burnTxHash: blockHash
    };

    return {
      retiredCredit: credit,
      retirementBlock,
      certificateNumber
    };
  }

  /**
   * Tamper simulation (for live Hackathon demonstration)
   * Deliberately mutates a block's data payload without recalculating its hash
   */
  public tamperWithBlock(blockIndex: number, fakeCreditsCount?: number): {
    tamperedBlock: LedgerBlock;
    originalHash: string;
  } {
    if (blockIndex < 0 || blockIndex >= this.ledger.length) {
      throw new Error(`Invalid block index ${blockIndex}`);
    }

    const block = this.ledger[blockIndex];
    const originalHash = block.hash;

    // Malicious alteration of data payload
    block.tampered = true;
    if (block.data.tradeableCredits !== undefined) {
      block.data.tradeableCredits = fakeCreditsCount || 999999;
    }
    block.data.notes = 'MALICIOUS_TAMPERING: Balance artificially inflated by unauthorized party';

    return {
      tamperedBlock: block,
      originalHash
    };
  }

  /**
   * Resets or restores the ledger state
   */
  public async resetRegistry(): Promise<void> {
    this.isInitialized = false;
    this.initPromise = null;
    await this.initialize();
  }
}

// Singleton store instance
export const registryStore = new RegistryStore();
