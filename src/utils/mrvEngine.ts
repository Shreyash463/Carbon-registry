import { 
  MangroveSite, 
  ConsensusResult, 
  SatelliteTelemetry, 
  DroneTelemetry, 
  GroundTelemetry 
} from '../types/index.ts';

/**
 * Initial seeded Indian Mangrove Ecosystem sites
 */
export const INITIAL_MANGROVE_SITES: MangroveSite[] = [
  {
    id: 'thane-creek-mh-01',
    name: 'Thane Creek Flamingo Sanctuary & Mangrove Basin',
    state: 'Maharashtra',
    region: 'Mumbai-Thane Estuarine Belt, Konkan Coast',
    coordinates: { lat: 19.1238, lng: 72.9812 },
    totalAreaHa: 1690,
    dominantSpecies: ['Avicennia marina', 'Sonneratia apetala', 'Rhizophora mucronata', 'Acanthus ilicifolius'],
    ecosystemType: 'Estuarine Complex',
    baselineBiomassTonsHa: 148.0,
    lastVerificationDate: '2026-08-10T10:00:00Z',
    verificationStatus: 'VERIFIED',
    healthScore: 95,
    totalCreditsMinted: 14200,
    activeBufferReserve: 2840,
    telemetry: {
      satellite: {
        ndvi: 0.78,
        evi: 0.60,
        ndwi: 0.41,
        sarBackscatterDb: -11.2,
        canopyAreaHa: 1610,
        cloudCoverPct: 2.5,
        sensor: 'Sentinel-2B MSI & Sentinel-1 SAR',
        timestamp: '2026-08-25T05:20:00Z'
      },
      drone: {
        canopyHeightM: 12.4,
        stemDensityHa: 2100,
        crownClosurePct: 84.0,
        hyperspectralChlA: 42.5,
        surveyDate: '2026-08-25T08:00:00Z',
        droneModel: 'DJI Matrice 350 RTK + Zenmuse L2 LiDAR'
      },
      groundSensors: {
        socPercent30cm: 3.40,
        socPercent100cm: 2.10,
        soilBulkDensityGcm3: 0.88,
        salinityPsu: 22.0,
        redoxPotentialMv: -165,
        waterTableCm: 8.5,
        sedimentAccretionMmYr: 4.8,
        co2FluxGcm2Day: 4.80,
        activeNodeCount: 18,
        meshStatus: 'ONLINE'
      }
    }
  },
  {
    id: 'vikhroli-mahim-mh-02',
    name: 'Vikhroli & Mahim Creek Mangrove Reserve',
    state: 'Maharashtra',
    region: 'Mumbai Urban Mangrove Shield',
    coordinates: { lat: 19.0984, lng: 72.9298 },
    totalAreaHa: 850,
    dominantSpecies: ['Avicennia marina', 'Sonneratia alba', 'Aegiceras corniculatum'],
    ecosystemType: 'Estuarine Complex',
    baselineBiomassTonsHa: 132.0,
    lastVerificationDate: '2026-07-22T09:15:00Z',
    verificationStatus: 'PENDING_MRV',
    healthScore: 92,
    totalCreditsMinted: 6100,
    activeBufferReserve: 1220,
    telemetry: {
      satellite: {
        ndvi: 0.74,
        evi: 0.56,
        ndwi: 0.38,
        sarBackscatterDb: -12.0,
        canopyAreaHa: 810,
        cloudCoverPct: 3.1,
        sensor: 'Sentinel-2B MSI',
        timestamp: '2026-08-24T06:00:00Z'
      },
      drone: {
        canopyHeightM: 10.8,
        stemDensityHa: 2200,
        crownClosurePct: 81.0,
        hyperspectralChlA: 38.0,
        surveyDate: '2026-08-24T10:30:00Z',
        droneModel: 'DJI Matrice 350 RTK'
      },
      groundSensors: {
        socPercent30cm: 3.10,
        socPercent100cm: 1.90,
        soilBulkDensityGcm3: 0.90,
        salinityPsu: 24.5,
        redoxPotentialMv: -150,
        waterTableCm: 6.8,
        sedimentAccretionMmYr: 4.2,
        co2FluxGcm2Day: 4.20,
        activeNodeCount: 12,
        meshStatus: 'ONLINE'
      }
    }
  },
  {
    id: 'malvan-sindhudurg-mh-03',
    name: 'Sindhudurg Malvan Estuary & Coral-Mangrove Creek',
    state: 'Maharashtra',
    region: 'South Konkan Marine Eco-Zone',
    coordinates: { lat: 16.0592, lng: 73.4682 },
    totalAreaHa: 1240,
    dominantSpecies: ['Rhizophora mucronata', 'Bruguiera gymnorhiza', 'Ceriops tagal', 'Sonneratia caseolaris'],
    ecosystemType: 'Deltaic Mangrove',
    baselineBiomassTonsHa: 165.0,
    lastVerificationDate: '2026-08-05T11:45:00Z',
    verificationStatus: 'PENDING_MRV',
    healthScore: 97,
    totalCreditsMinted: 11200,
    activeBufferReserve: 2240,
    telemetry: {
      satellite: {
        ndvi: 0.82,
        evi: 0.65,
        ndwi: 0.45,
        sarBackscatterDb: -10.4,
        canopyAreaHa: 1210,
        cloudCoverPct: 1.8,
        sensor: 'Sentinel-2A MSI & Landsat-9',
        timestamp: '2026-08-25T03:30:00Z'
      },
      drone: {
        canopyHeightM: 14.8,
        stemDensityHa: 1850,
        crownClosurePct: 86.0,
        hyperspectralChlA: 46.5,
        surveyDate: '2026-08-25T07:15:00Z',
        droneModel: 'DJI Matrice 350 RTK + Zenmuse L2 LiDAR'
      },
      groundSensors: {
        socPercent30cm: 3.80,
        socPercent100cm: 2.45,
        soilBulkDensityGcm3: 0.80,
        salinityPsu: 18.2,
        redoxPotentialMv: -185,
        waterTableCm: 10.2,
        sedimentAccretionMmYr: 5.8,
        co2FluxGcm2Day: 5.30,
        activeNodeCount: 15,
        meshStatus: 'ONLINE'
      }
    }
  },
  {
    id: 'ratnagiri-bhatye-mh-04',
    name: 'Ratnagiri Bhatye Estuary Mangroves',
    state: 'Maharashtra',
    region: 'Kajali River Estuary, Konkan Coast',
    coordinates: { lat: 16.9806, lng: 73.3031 },
    totalAreaHa: 980,
    dominantSpecies: ['Sonneratia alba', 'Avicennia officinalis', 'Kandelia candel'],
    ecosystemType: 'Estuarine Complex',
    baselineBiomassTonsHa: 140.0,
    lastVerificationDate: '2026-06-18T14:00:00Z',
    verificationStatus: 'PENDING_MRV',
    healthScore: 93,
    totalCreditsMinted: 7400,
    activeBufferReserve: 1480,
    telemetry: {
      satellite: {
        ndvi: 0.76,
        evi: 0.58,
        ndwi: 0.40,
        sarBackscatterDb: -11.5,
        canopyAreaHa: 940,
        cloudCoverPct: 2.9,
        sensor: 'Sentinel-2B MSI',
        timestamp: '2026-08-23T04:45:00Z'
      },
      drone: {
        canopyHeightM: 11.6,
        stemDensityHa: 2000,
        crownClosurePct: 82.0,
        hyperspectralChlA: 40.2,
        surveyDate: '2026-08-23T09:00:00Z',
        droneModel: 'Quantum-Systems Trinity F90+'
      },
      groundSensors: {
        socPercent30cm: 3.25,
        socPercent100cm: 2.00,
        soilBulkDensityGcm3: 0.89,
        salinityPsu: 23.0,
        redoxPotentialMv: -160,
        waterTableCm: 7.5,
        sedimentAccretionMmYr: 4.5,
        co2FluxGcm2Day: 4.50,
        activeNodeCount: 11,
        meshStatus: 'ONLINE'
      }
    }
  },
  {
    id: 'sundarbans-01',
    name: 'Sundarbans Delta Zone-A (Jharkhali)',
    state: 'West Bengal',
    region: 'Ganges-Brahmaputra Delta',
    coordinates: { lat: 22.0156, lng: 88.7022 },
    totalAreaHa: 4260,
    dominantSpecies: ['Rhizophora mucronata', 'Avicennia marina', 'Bruguiera gymnorhiza', 'Ceriops decandra'],
    ecosystemType: 'Deltaic Mangrove',
    baselineBiomassTonsHa: 168.4,
    lastVerificationDate: '2026-07-15T09:30:00Z',
    verificationStatus: 'VERIFIED',
    healthScore: 94,
    totalCreditsMinted: 18450,
    activeBufferReserve: 3690,
    telemetry: {
      satellite: {
        ndvi: 0.81,
        evi: 0.64,
        ndwi: 0.38,
        sarBackscatterDb: -10.8,
        canopyAreaHa: 4180,
        cloudCoverPct: 4.2,
        sensor: 'Sentinel-2B MSI & Sentinel-1 C-Band SAR',
        timestamp: '2026-08-20T04:12:00Z'
      },
      drone: {
        canopyHeightM: 15.2,
        stemDensityHa: 1920,
        crownClosurePct: 86.4,
        hyperspectralChlA: 44.8,
        surveyDate: '2026-08-21T06:45:00Z',
        droneModel: 'DJI Matrice 350 RTK + Zenmuse L2 LiDAR'
      },
      groundSensors: {
        socPercent30cm: 3.65,
        socPercent100cm: 2.28,
        soilBulkDensityGcm3: 0.82,
        salinityPsu: 17.5,
        redoxPotentialMv: -175,
        waterTableCm: 9.4,
        sedimentAccretionMmYr: 5.2,
        co2FluxGcm2Day: 5.14,
        activeNodeCount: 24,
        meshStatus: 'ONLINE'
      }
    }
  },
  {
    id: 'pichavaram-02',
    name: 'Pichavaram Mangrove Estuary',
    state: 'Tamil Nadu',
    region: 'Vellar-Coleroon Estuarine Complex',
    coordinates: { lat: 11.4289, lng: 79.7824 },
    totalAreaHa: 1100,
    dominantSpecies: ['Avicennia marina', 'Rhizophora apiculata', 'Sonneratia apetala'],
    ecosystemType: 'Estuarine Complex',
    baselineBiomassTonsHa: 142.0,
    lastVerificationDate: '2026-06-28T11:00:00Z',
    verificationStatus: 'PENDING_MRV',
    healthScore: 91,
    totalCreditsMinted: 5200,
    activeBufferReserve: 1040,
    telemetry: {
      satellite: {
        ndvi: 0.77,
        evi: 0.59,
        ndwi: 0.42,
        sarBackscatterDb: -12.1,
        canopyAreaHa: 1065,
        cloudCoverPct: 2.1,
        sensor: 'Sentinel-2B MSI & Landsat-9 OLI-2',
        timestamp: '2026-08-22T05:30:00Z'
      },
      drone: {
        canopyHeightM: 11.8,
        stemDensityHa: 2150,
        crownClosurePct: 82.0,
        hyperspectralChlA: 39.5,
        surveyDate: '2026-08-22T08:15:00Z',
        droneModel: 'Quantum-Systems Trinity F90+ Multispectral'
      },
      groundSensors: {
        socPercent30cm: 2.95,
        socPercent100cm: 1.85,
        soilBulkDensityGcm3: 0.91,
        salinityPsu: 24.2,
        redoxPotentialMv: -145,
        waterTableCm: 6.2,
        sedimentAccretionMmYr: 4.1,
        co2FluxGcm2Day: 4.35,
        activeNodeCount: 12,
        meshStatus: 'ONLINE'
      }
    }
  },
  {
    id: 'bhitarkanika-03',
    name: 'Bhitarkanika Sanctuary (Brahmani Delta)',
    state: 'Odisha',
    region: 'Brahmani-Baitarani River Delta',
    coordinates: { lat: 20.7246, lng: 86.8712 },
    totalAreaHa: 2450,
    dominantSpecies: ['Heritiera fomes (Sundari)', 'Excoecaria agallocha', 'Xylocarpus granatum'],
    ecosystemType: 'Deltaic Mangrove',
    baselineBiomassTonsHa: 185.0,
    lastVerificationDate: '2026-05-18T14:20:00Z',
    verificationStatus: 'PENDING_MRV',
    healthScore: 89,
    totalCreditsMinted: 11800,
    activeBufferReserve: 2360,
    telemetry: {
      satellite: {
        ndvi: 0.79,
        evi: 0.61,
        ndwi: 0.35,
        sarBackscatterDb: -11.0,
        canopyAreaHa: 2390,
        cloudCoverPct: 5.5,
        sensor: 'Sentinel-2A MSI & Sentinel-1 SAR',
        timestamp: '2026-08-19T06:00:00Z'
      },
      drone: {
        canopyHeightM: 16.4,
        stemDensityHa: 1680,
        crownClosurePct: 85.0,
        hyperspectralChlA: 46.2,
        surveyDate: '2026-08-20T09:00:00Z',
        droneModel: 'DJI Matrice 350 RTK + Zenmuse L2 LiDAR'
      },
      groundSensors: {
        socPercent30cm: 4.10,
        socPercent100cm: 2.65,
        soilBulkDensityGcm3: 0.78,
        salinityPsu: 14.8,
        redoxPotentialMv: -190,
        waterTableCm: 11.0,
        sedimentAccretionMmYr: 6.0,
        co2FluxGcm2Day: 5.80,
        activeNodeCount: 16,
        meshStatus: 'ONLINE'
      }
    }
  },
  {
    id: 'coringa-04',
    name: 'Coringa Wildlife Mangrove Zone',
    state: 'Andhra Pradesh',
    region: 'Godavari Estuary Mangroves',
    coordinates: { lat: 16.8924, lng: 82.2612 },
    totalAreaHa: 1800,
    dominantSpecies: ['Avicennia officinalis', 'Rhizophora mucronata', 'Lumnitzera racemosa'],
    ecosystemType: 'Estuarine Complex',
    baselineBiomassTonsHa: 135.5,
    lastVerificationDate: '2026-04-10T10:15:00Z',
    verificationStatus: 'PENDING_MRV',
    healthScore: 87,
    totalCreditsMinted: 7600,
    activeBufferReserve: 1520,
    telemetry: {
      satellite: {
        ndvi: 0.74,
        evi: 0.56,
        ndwi: 0.39,
        sarBackscatterDb: -12.8,
        canopyAreaHa: 1720,
        cloudCoverPct: 3.8,
        sensor: 'Sentinel-2B MSI',
        timestamp: '2026-08-21T05:00:00Z'
      },
      drone: {
        canopyHeightM: 10.5,
        stemDensityHa: 2050,
        crownClosurePct: 78.5,
        hyperspectralChlA: 37.0,
        surveyDate: '2026-08-21T11:30:00Z',
        droneModel: 'Quantum-Systems Trinity F90+'
      },
      groundSensors: {
        socPercent30cm: 2.75,
        socPercent100cm: 1.60,
        soilBulkDensityGcm3: 0.94,
        salinityPsu: 26.5,
        redoxPotentialMv: -130,
        waterTableCm: 5.5,
        sedimentAccretionMmYr: 3.8,
        co2FluxGcm2Day: 3.90,
        activeNodeCount: 10,
        meshStatus: 'ONLINE'
      }
    }
  },
  {
    id: 'andaman-05',
    name: 'Baratang Island Mangrove Creeks',
    state: 'Andaman & Nicobar',
    region: 'Middle Andaman Archipelago',
    coordinates: { lat: 12.1298, lng: 92.7485 },
    totalAreaHa: 1650,
    dominantSpecies: ['Rhizophora stylosa', 'Bruguiera sexangula', 'Nypa fruticans'],
    ecosystemType: 'Island Creek',
    baselineBiomassTonsHa: 198.0,
    lastVerificationDate: '2026-07-02T08:00:00Z',
    verificationStatus: 'PENDING_MRV',
    healthScore: 96,
    totalCreditsMinted: 9200,
    activeBufferReserve: 1840,
    telemetry: {
      satellite: {
        ndvi: 0.84,
        evi: 0.68,
        ndwi: 0.44,
        sarBackscatterDb: -9.8,
        canopyAreaHa: 1630,
        cloudCoverPct: 6.0,
        sensor: 'Sentinel-2A MSI & Sentinel-1 SAR',
        timestamp: '2026-08-20T02:15:00Z'
      },
      drone: {
        canopyHeightM: 18.2,
        stemDensityHa: 1750,
        crownClosurePct: 89.2,
        hyperspectralChlA: 48.6,
        surveyDate: '2026-08-21T04:00:00Z',
        droneModel: 'DJI Matrice 350 RTK + Zenmuse L2 LiDAR'
      },
      groundSensors: {
        socPercent30cm: 4.45,
        socPercent100cm: 3.10,
        soilBulkDensityGcm3: 0.72,
        salinityPsu: 31.0,
        redoxPotentialMv: -210,
        waterTableCm: 14.5,
        sedimentAccretionMmYr: 7.2,
        co2FluxGcm2Day: 6.40,
        activeNodeCount: 14,
        meshStatus: 'ONLINE'
      }
    }
  },
  {
    id: 'kutch-06',
    name: 'Gulf of Kutch Marine Reserve',
    state: 'Gujarat',
    region: 'Arid Coastal Dwarf Mangroves',
    coordinates: { lat: 22.4674, lng: 69.8324 },
    totalAreaHa: 3100,
    dominantSpecies: ['Avicennia marina var. acutissima'],
    ecosystemType: 'Arid Dwarf Mangrove',
    baselineBiomassTonsHa: 78.0,
    lastVerificationDate: '2026-06-12T12:00:00Z',
    verificationStatus: 'PENDING_MRV',
    healthScore: 82,
    totalCreditsMinted: 6400,
    activeBufferReserve: 1280,
    telemetry: {
      satellite: {
        ndvi: 0.63,
        evi: 0.44,
        ndwi: 0.28,
        sarBackscatterDb: -14.5,
        canopyAreaHa: 2950,
        cloudCoverPct: 1.0,
        sensor: 'Sentinel-2B MSI & Landsat-9',
        timestamp: '2026-08-22T06:10:00Z'
      },
      drone: {
        canopyHeightM: 4.8,
        stemDensityHa: 3100,
        crownClosurePct: 68.0,
        hyperspectralChlA: 28.5,
        surveyDate: '2026-08-22T10:00:00Z',
        droneModel: 'DJI Mavic 3 Enterprise Thermal/RGB'
      },
      groundSensors: {
        socPercent30cm: 1.85,
        socPercent100cm: 1.15,
        soilBulkDensityGcm3: 1.18,
        salinityPsu: 42.0,
        redoxPotentialMv: -95,
        waterTableCm: 3.2,
        sedimentAccretionMmYr: 2.1,
        co2FluxGcm2Day: 2.65,
        activeNodeCount: 8,
        meshStatus: 'ONLINE'
      }
    }
  }
];

/**
 * Executes multi-source consensus check and calculates allometric carbon sequestration
 */
export function runMRVConsensusCheck(
  site: MangroveSite,
  bufferRatioPct: number = 20,
  toleranceThresholdPct: number = 14
): ConsensusResult {
  const { satellite, drone, groundSensors } = site.telemetry;

  // 1. Satellite Estimation (Above Ground Biomass t/ha)
  // Calibrated to Indian Sentinel-2 NDVI + EVI + SAR backscatter
  const canopyFactor = (satellite.canopyAreaHa / site.totalAreaHa);
  const isArid = site.ecosystemType === 'Arid Dwarf Mangrove';
  const satBase = site.baselineBiomassTonsHa;

  const satOpticalAGB = (satBase * 0.96) * Math.pow(satellite.ndvi / (isArid ? 0.62 : 0.76), 1.25) * (1 + (satellite.evi - (isArid ? 0.42 : 0.55)) * 0.3);
  const sarCorrection = Math.max(0.92, Math.min(1.10, 1 + (satellite.sarBackscatterDb + (isArid ? 14.0 : 11.5)) * 0.015));
  const satelliteAGBEst = Number((satOpticalAGB * sarCorrection * canopyFactor).toFixed(2));

  // 2. Drone LiDAR & High-Res Telemetry Estimation (Above Ground Biomass t/ha)
  // Komiyama / FSI Allometric Height & Crown equation: AGB = k * H * (Crown/100) * (Density factor)
  const expectedHeight = isArid ? 5.0 : (satBase * 0.082 + 1.2);
  const densityFactor = Math.min(1.15, Math.max(0.85, drone.stemDensityHa / (isArid ? 3000 : 1900)));
  const droneAGBEst = Number(((satBase * 0.97) * (drone.canopyHeightM / expectedHeight) * (drone.crownClosurePct / (isArid ? 70 : 84)) * (0.85 + 0.15 * densityFactor)).toFixed(2));

  // 3. Ground IoT Station Biomass & Soil Organic Carbon (SOC) Estimation (t/ha equivalent)
  // IPCC Wetland Supplement Tier-3 calibration: root-to-shoot & SOC stock ratio
  const expectedSOC = isArid ? 1.85 : (satBase * 0.019 + 0.45);
  const expectedFlux = isArid ? 2.65 : 4.5;
  const socFactor = groundSensors.socPercent30cm / expectedSOC;
  const fluxFactor = groundSensors.co2FluxGcm2Day / expectedFlux;
  const groundSOCEst = Number(((satBase * 0.96) * (0.65 * socFactor + 0.35 * fluxFactor)).toFixed(2));

  // Cross-source variance calculations
  const meanAGB = (satelliteAGBEst + droneAGBEst + groundSOCEst) / 3;
  const deltaSatDrone = Math.abs(satelliteAGBEst - droneAGBEst) / meanAGB * 100;
  const deltaDroneGround = Math.abs(droneAGBEst - groundSOCEst) / meanAGB * 100;
  const deltaGroundSat = Math.abs(groundSOCEst - satelliteAGBEst) / meanAGB * 100;

  const maxVariance = Math.max(deltaSatDrone, deltaDroneGround, deltaGroundSat);
  const variancePct = Number(maxVariance.toFixed(2));

  const anomalyFlags: string[] = [];

  if (satellite.cloudCoverPct > 15) {
    anomalyFlags.push(`Satellite cloud cover (${satellite.cloudCoverPct}%) exceeds optimal threshold; optical NDVI may have higher uncertainty.`);
  }
  if (groundSensors.meshStatus !== 'ONLINE') {
    anomalyFlags.push(`Ground IoT mesh is reporting ${groundSensors.meshStatus}; partial node coverage.`);
  }
  if (deltaSatDrone > toleranceThresholdPct) {
    anomalyFlags.push(`Satellite-to-Drone variance (${deltaSatDrone.toFixed(1)}%) exceeds ${toleranceThresholdPct}% tolerance threshold.`);
  }
  if (deltaDroneGround > toleranceThresholdPct) {
    anomalyFlags.push(`Drone-to-Ground variance (${deltaDroneGround.toFixed(1)}%) exceeds ${toleranceThresholdPct}% tolerance threshold.`);
  }

  const passed = variancePct <= toleranceThresholdPct;
  const confidenceScore = Number(Math.max(70, Math.min(99.4, 100 - (variancePct * 1.35))).toFixed(1));

  // IPCC Wetland Supplement Tier-3 Allometric Carbon Sequestration Math
  // Gross biomass: AGB + Below-ground Root Biomass (BGB = 0.49 * AGB)
  const reconciledBiomassPerHa = meanAGB;
  const bgbPerHa = reconciledBiomassPerHa * 0.49;
  const totalBiomassPerHa = reconciledBiomassPerHa + bgbPerHa;
  const carbonTonsPerHa = totalBiomassPerHa * 0.47; // Carbon fraction of biomass ~47%

  // Net annual sequestration increment rate (calibrated by health score and baseline)
  const annualIncrementFactor = 0.048 * (site.healthScore / 100) * (groundSensors.co2FluxGcm2Day / 4.5);
  const netCarbonSequesteredTonsHa = carbonTonsPerHa * annualIncrementFactor;

  // Convert Carbon to CO2 equivalent: 1 tC = (44/12) tCO2e = 3.667 tCO2e
  const grossTCO2e = netCarbonSequesteredTonsHa * 3.6667 * site.totalAreaHa;
  
  // Apply 5% FSI conservative uncertainty discount
  const netTCO2e = Math.max(0, grossTCO2e * 0.95);
  const reconciledAnnualSequestrationTCO2e = Math.round(netTCO2e);

  // Buffer Reserve Split (default 80% Tradeable / 20% Reserve)
  const bufferReserveCredits = Math.round(reconciledAnnualSequestrationTCO2e * (bufferRatioPct / 100));
  const tradeableCredits = reconciledAnnualSequestrationTCO2e - bufferReserveCredits;

  const summary = passed
    ? `Consensus verified across Sentinel-2 Satellite, RTK-LiDAR Drone, and ${groundSensors.activeNodeCount} in-situ IoT nodes with ${confidenceScore}% confidence. Max inter-source variance was ${variancePct}%, well below the ${toleranceThresholdPct}% tolerance ceiling. Total verified carbon sequestration for ${site.name} is ${reconciledAnnualSequestrationTCO2e.toLocaleString()} tCO₂e (${tradeableCredits.toLocaleString()} tradeable credits, ${bufferReserveCredits.toLocaleString()} allocated to permanent buffer reserve).`
    : `Consensus failed: Inter-source variance reached ${variancePct}%, which exceeds the ${toleranceThresholdPct}% tolerance limit. Carbon credit minting blocked until sensors are re-calibrated or drone survey is re-run.`;

  return {
    passed,
    confidenceScore,
    variancePct,
    satelliteAGBEst,
    droneAGBEst,
    groundSOCEst,
    grossBiomassTonsHa: Number(reconciledBiomassPerHa.toFixed(1)),
    reconciledAnnualSequestrationTCO2e,
    tradeableCredits,
    bufferReserveCredits,
    bufferRatioPct,
    toleranceThresholdPct,
    sourceAgreement: {
      satelliteVsDroneDeltaPct: Number(deltaSatDrone.toFixed(2)),
      droneVsGroundDeltaPct: Number(deltaDroneGround.toFixed(2)),
      groundVsSatelliteDeltaPct: Number(deltaGroundSat.toFixed(2))
    },
    anomalyFlags,
    summary,
    methodology: 'India-FSI Tier-3 Wetland Blue Carbon Consensus Framework (NCCR-MoEFCC)',
    allometricEquation: 'AGB = 0.0509 * ρ * (DBH)² * H_lidar | BGB = 0.49 * AGB | SOC = Σ(depth * bulk_density * SOC%)'
  };
}

/**
 * Simulates a severe ecological disturbance (e.g. Super Cyclone storm surge or defoliation)
 * to demonstrate the automated Buffer Reserve Reversal Trigger
 */
export function simulateDegradationEvent(
  site: MangroveSite,
  severity: 'MODERATE_SURGE' | 'SEVERE_CYCLONE' = 'SEVERE_CYCLONE'
): {
  degradedSite: MangroveSite;
  biomassLossTCO2e: number;
  triggerEvent: string;
} {
  const isSevere = severity === 'SEVERE_CYCLONE';
  const triggerEvent = isSevere 
    ? 'Severe Tropical Cyclone Storm Surge (Category 4 Tidal Inundation & Canopy Loss)'
    : 'Moderate Tidal Surge Defoliation & High Salinity Stress';

  const canopyReduction = isSevere ? 0.38 : 0.20; // 38% or 20% loss
  const healthDrop = isSevere ? 36 : 18;

  const degradedSite: MangroveSite = {
    ...site,
    verificationStatus: 'DEGRADED_ALERT',
    healthScore: Math.max(35, site.healthScore - healthDrop),
    telemetry: {
      satellite: {
        ...site.telemetry.satellite,
        ndvi: Number((site.telemetry.satellite.ndvi * (1 - canopyReduction * 0.8)).toFixed(2)),
        evi: Number((site.telemetry.satellite.evi * (1 - canopyReduction * 0.85)).toFixed(2)),
        sarBackscatterDb: Number((site.telemetry.satellite.sarBackscatterDb - (isSevere ? 3.5 : 1.8)).toFixed(1)),
        canopyAreaHa: Math.round(site.telemetry.satellite.canopyAreaHa * (1 - canopyReduction)),
        timestamp: new Date().toISOString()
      },
      drone: {
        ...site.telemetry.drone,
        canopyHeightM: Number((site.telemetry.drone.canopyHeightM * (1 - canopyReduction * 0.6)).toFixed(1)),
        crownClosurePct: Number((site.telemetry.drone.crownClosurePct * (1 - canopyReduction)).toFixed(1)),
        hyperspectralChlA: Number((site.telemetry.drone.hyperspectralChlA * (1 - canopyReduction * 0.7)).toFixed(1)),
        surveyDate: new Date().toISOString()
      },
      groundSensors: {
        ...site.telemetry.groundSensors,
        salinityPsu: Number((site.telemetry.groundSensors.salinityPsu * (isSevere ? 1.6 : 1.3)).toFixed(1)),
        redoxPotentialMv: site.telemetry.groundSensors.redoxPotentialMv + (isSevere ? 85 : 45),
        co2FluxGcm2Day: Number((site.telemetry.groundSensors.co2FluxGcm2Day * (1 - canopyReduction * 0.9)).toFixed(2))
      }
    }
  };

  // Estimated carbon loss in tons of CO2e
  const biomassLossTCO2e = Math.round(site.totalAreaHa * (isSevere ? 0.75 : 0.35) * 3.667);

  return {
    degradedSite,
    biomassLossTCO2e,
    triggerEvent
  };
}
