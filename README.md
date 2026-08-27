# Blue Carbon Registry
### Blockchain-Audited Blue Carbon MRV & Credit Registry for Indian Mangrove Ecosystems
**Smart India Hackathon (Problem Statement: SIH26193)**

---

## ⚡ The Single Start Command

To install dependencies and run the entire unified frontend + backend application:

```bash
npm run dev
```

> **Zero manual wiring required:** The app boots Express on port `3000`, hosts the full cryptographic MRV consensus engine and REST API endpoints, initializes the genesis blockchain ledger, and serves the interactive React SPA through Vite dev middleware from a single terminal.

---

## 🌊 Executive Summary & Value Proposition

India hosts over 4,992 sq. km of mangrove forest cover (Sundarbans, Pichavaram, Bhitarkanika, Coringa, Andaman, and Gulf of Kutch). Mangroves sequester carbon at **up to 4–10x the rate of mature tropical rainforests** (terrestrial forests store ~250 tC/ha, while blue carbon wetlands store >1,000 tC/ha in deep anaerobic soil pools).

However, global voluntary carbon credit markets have suffered from **data fraud, unverified claims, 6–18 month manual verification lags, and catastrophic reversal risks**.

**Blue Carbon Registry solves this through two architectural breakthroughs:**
1. **Tri-Source Automated Consensus Engine:** Cross-examines Sentinel-2 optical/SAR satellite feeds, RTK-LiDAR drone telemetry, and in-situ IoT soil redox/flux sensors before authorizing credit minting.
2. **Built-in 80/20 Buffer Reserve Safeguard:** Mints 80% tradeable credits and ring-fences 20% into a permanent non-tradeable reserve pool. When extreme cyclones or dieback cause canopy loss, the system automatically burns buffer tokens on-chain, **protecting credit buyers from market insolvency and eliminating "phantom credits."**

---

## 🎤 3-Minute Presentation Script for Judges

When demonstrating this live to hackathon judges, follow this concise script:

### Step 1: The Cautionary Tale (30 seconds)
> *"Judges, in 2021–2022, Web3 carbon tokenization platforms like Toucan Protocol tokenized over 20 million carbon credits onto blockchains. But UC Berkeley and Bloomberg investigations revealed that **over 28% of those tokenized credits were 'zombie credits'** — issued for forests that had already burned down or been clear-cut years earlier. Putting bad data on a blockchain just makes carbon fraud faster.*
>
> *Our platform solves this at the root: **Real-time physical MRV consensus before minting, plus an automated on-chain Buffer Reserve safeguard**."*

### Step 2: Tri-Source Consensus & Carbon Math (45 seconds)
> *"In our **Sites & MRV** dashboard, let's select the **Pichavaram Mangrove Estuary** and click **'Run MRV Consensus'**. Notice that our system doesn't rely on a single satellite photo. It correlates three independent data streams:
> 1. **Sentinel-2 Satellite:** NDVI (0.77) and C-band SAR radar backscatter.
> 2. **RTK-LiDAR Drone:** Canopy height (11.8m) and crown closure (82%).
> 3. **In-situ IoT Mesh:** Deep Soil Organic Carbon (2.95% topsoil SOC) and anaerobic redox potential (-145 mV).
>
> *Our engine evaluates inter-source variance against a 14% tolerance ceiling. Once consensus is certified, it applies IPCC Tier-3 Indian mangrove allometry (Komiyama allometric model calibrated for Rhizophoraceae/Avicenniaceae) and commits a new block with a SHA-256 Merkle proof."*

### Step 3: The 80/20 Buffer Reserve Differentiator (45 seconds)
> *"Notice the minting breakdown: **80% is tradeable liquidity, but 20% is held back in a ring-fenced Buffer Reserve**.
>
> *Now let's switch to the **Buffer Reserve tab** and simulate a **Category-4 Super Cyclone** hitting the Sundarbans. The canopy suffers a 38% defoliation loss. Our next MRV audit detects an 11,700 tCO₂e deficit.
>
> *Instead of commercial buyers discovering their credits are worthless, **our smart registry immediately executes an automated Reversal Burn on the site's buffer pool**. The loss is absorbed on-chain, and circulating credits held by corporate buyers remain 100% solvent."*

### Step 4: Cryptographic Tamper-Proofing (30 seconds)
> *"Finally, let's open the **Blockchain Ledger tab**. We've provided a live demo tool to simulate malicious database tampering. Let's alter Block #2 to inflate its balance to 999,999 credits.
>
> *When we click **'Verify Ledger Integrity'**, our SHA-256 validator re-computes every block and Merkle root from genesis to tip, immediately catching the altered block in red. This provides immutable compliance provenance for the Ministry of Environment, Forest and Climate Change (MoEFCC) and international buyers."*

---

## 🏛️ Architecture & Pipeline Overview

```
               [ 1. Multi-Source Telemetry Ingestion ]
    ┌───────────────────────┬──────────────────────┬──────────────────────┐
    │  Sentinel-2 / SAR     │  Drone RTK-LiDAR     │  IoT Soil Mesh       │
    │  NDVI, EVI, Radar     │  Canopy Height (m)   │  SOC%, Redox, Flux   │
    └───────────┬───────────┴──────────┬───────────┴──────────┬───────────┘
                │                      │                      │
                └──────────────────────┼──────────────────────┘
                                       ▼
                     [ 2. Tri-Source Consensus Matrix ]
                      • Variance Threshold: Max 14%
                      • Byzantine Sensor Fault Detection
                                       │ (Consensus Passed)
                                       ▼
                  [ 3. India-FSI IPCC Tier-3 Allometry ]
                      • AGB = 0.0509 * ρ * (DBH)² * H
                      • BGB = 0.49 * AGB (Root Biomass)
                      • Soil Carbon = Bulk Density * Depth * SOC%
                                       │
                                       ▼
                 [ 4. 80/20 Minting & Blockchain Ledger ]
                  ├── 80% Tradeable Active Credits
                  └── 20% Non-Tradeable Ring-Fenced Buffer Reserve
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
     [ Regular Lifecycle ]                         [ Reversal Event Trigger ]
     • Secondary Trading                            • Severe Cyclone / Fire Surge
     • Permanent Offset Retirement                  • Negative Biomass Delta
     • Cryptographic Certificate Issuance           • Automated On-Chain Buffer Burn
```

---

## 🛡️ Toucan Protocol Failure Comparison Table

| Dimension | Legacy Web3 (Toucan / Base Carbon Pool) | Blue Carbon Registry (SIH-26193) |
|---|---|---|
| **Data Verification** | Dormant PDF documents from 2008–2015 without current physical MRV checks. | Continuous tri-source MRV consensus (Sentinel-2 + RTK Drone + IoT Mesh). |
| **Reversal & Disturbance** | Zero buffer pool. Burned/logged forests resulted in circulating "zombie credits." | Automated 80/20 Buffer Reserve with smart on-chain compensation burns. |
| **Consensus Threshold** | No tolerance checking; junk credits dumped into liquidity pools. | Byzantine cross-source tolerance check (max 14% delta threshold). |
| **India Allometry** | Generic rainforest equations unsuited for estuarine mangrove species. | Calibrated to Forest Survey of India (FSI) & IPCC Tier-3 equations. |
| **Tamper Proofing** | Heavy smart contracts subject to bridge hacks and gas fees. | Universal SHA-256 hash-chained ledger with on-demand mathematical verification. |

---

## 📂 Project Structure

- `server.ts` — Unified Express server hosting API routes and Vite middleware on port 3000
- `src/types/index.ts` — Core domain types (MangroveSite, ConsensusResult, CarbonCredit, LedgerBlock)
- `src/utils/cryptoLedger.ts` — SHA-256 cryptographic chaining, Merkle roots, validator signatures, and verification engine
- `src/utils/mrvEngine.ts` — India mangrove allometric carbon calculations and disturbance simulator
- `src/utils/registryStore.ts` — In-memory singleton managing ledger blocks, credit tokens, and buffer reverse triggers
- `src/server/aiService.ts` — Gemini 3.7 Flash integration for official MRV compliance statements with scientific fallback
- `src/components/` — React UI components (Navbar, StatsOverview, SitesView, IndiaMapView, MRVVerificationModal, LedgerExplorer, CreditsTable, BufferReserveView, RetireModal, CertificateModal, HackathonBriefing)
