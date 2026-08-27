import { GoogleGenAI } from '@google/genai';
import { MangroveSite, ConsensusResult } from '../types/index.ts';

/**
 * Generates an AI-grounded MRV summary and multi-source anomaly analysis
 */
export async function generateAIMRVSummary(
  site: MangroveSite, 
  consensus: ConsensusResult
): Promise<{ summary: string; isAiGenerated: boolean }> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return {
      summary: generateDeterministicMRVSummary(site, consensus),
      isAiGenerated: false
    };
  }

  try {
    const ai = new GoogleGenAI({});
    const prompt = `
You are the Lead Scientific MRV Auditor for the Indian National Blue Carbon Registry (MoEFCC/NCCR).
Analyze the following multi-source telemetry data for an Indian mangrove ecosystem and provide a concise, authoritative 3-4 sentence verification summary.

SITE DETAILS:
- Name: ${site.name} (${site.state}, ${site.region})
- Ecosystem Type: ${site.ecosystemType}
- Monitored Area: ${site.totalAreaHa} Hectares
- Dominant Species: ${site.dominantSpecies.join(', ')}
- Baseline Biomass: ${site.baselineBiomassTonsHa} t/ha

TELEMETRY READINGS:
1. Sentinel-2/1 Satellite: NDVI ${site.telemetry.satellite.ndvi}, EVI ${site.telemetry.satellite.evi}, SAR Backscatter ${site.telemetry.satellite.sarBackscatterDb} dB, Canopy Area ${site.telemetry.satellite.canopyAreaHa} Ha, Cloud Cover ${site.telemetry.satellite.cloudCoverPct}%
2. Drone LiDAR: Canopy Height ${site.telemetry.drone.canopyHeightM} m, Stem Density ${site.telemetry.drone.stemDensityHa} stems/ha, Crown Closure ${site.telemetry.drone.crownClosurePct}%, Hyperspectral Chl-a ${site.telemetry.drone.hyperspectralChlA} mg/m²
3. In-situ IoT Ground Mesh: Top 30cm SOC ${site.telemetry.groundSensors.socPercent30cm}%, Deep SOC ${site.telemetry.groundSensors.socPercent100cm}%, Salinity ${site.telemetry.groundSensors.salinityPsu} PSU, Redox ${site.telemetry.groundSensors.redoxPotentialMv} mV, CO2 Flux ${site.telemetry.groundSensors.co2FluxGcm2Day} g C/m²/day

CONSENSUS & SEQUESTRATION:
- Multi-Source Consensus: ${consensus.passed ? 'PASSED' : 'FAILED'} (Confidence: ${consensus.confidenceScore}%, Max Inter-Source Variance: ${consensus.variancePct}%)
- Reconciled Total Sequestration: ${consensus.reconciledAnnualSequestrationTCO2e} tCO2e
- Tradeable Credits (80%): ${consensus.tradeableCredits} units
- Buffer Reserve Allocation (20%): ${consensus.bufferReserveCredits} units

Write a professional audit finding explaining whether consensus was achieved, highlighting key ecological indicators, confirming the 80/20 buffer reserve safeguard, and noting compliance with Indian FSI/IPCC Tier-3 Wetland Blue Carbon standards.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
    });

    const text = response.text?.trim();
    if (text) {
      return { summary: text, isAiGenerated: true };
    }
  } catch (error) {
    console.warn('Gemini API call failed or not configured, using deterministic scientific fallback:', error);
  }

  return {
    summary: generateDeterministicMRVSummary(site, consensus),
    isAiGenerated: false
  };
}

/**
 * Deterministic fallback audit summary calibrated to Indian Mangrove scientific standards
 */
export function generateDeterministicMRVSummary(site: MangroveSite, consensus: ConsensusResult): string {
  if (consensus.passed) {
    return `MRV Audit for ${site.name} confirmed multi-tier consensus with ${consensus.confidenceScore}% confidence. Sentinel-2 spectral indices (NDVI ${site.telemetry.satellite.ndvi}) closely correlated with LiDAR canopy height (${site.telemetry.drone.canopyHeightM}m) and in-situ soil organic carbon (${site.telemetry.groundSensors.socPercent30cm}% topsoil SOC) within a tight ${consensus.variancePct}% variance window. Reconciled net annual sequestration of ${consensus.reconciledAnnualSequestrationTCO2e.toLocaleString()} tCO₂e was certified under IPCC Tier-3 Wetland allometry, provisioning ${consensus.tradeableCredits.toLocaleString()} tradeable credits and ring-fencing ${consensus.bufferReserveCredits.toLocaleString()} credits in the 20% non-tradeable buffer pool against reversal risk.`;
  } else {
    return `MRV Audit flagged an inter-source consensus variance of ${consensus.variancePct}%, exceeding the ${consensus.toleranceThresholdPct}% allowable threshold for ${site.name}. Sensor discrepancies between optical satellite canopy indices and IoT ground soil flux require field re-calibration before carbon credit minting can be authorized.`;
  }
}
