import React, { useState, useEffect, useRef } from 'react';
import { MangroveSite } from '../types';
import { 
  MapPin, 
  Navigation, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Crosshair, 
  Compass, 
  Radio, 
  Satellite, 
  Layers, 
  Sparkles, 
  LocateFixed, 
  ShieldCheck, 
  ExternalLink,
  Info,
  Waves,
  Map as MapIcon,
  X,
  Target
} from 'lucide-react';
import L from 'leaflet';

interface IndiaMapViewProps {
  sites: MangroveSite[];
  selectedSiteId: string;
  onSelectSite: (site: MangroveSite) => void;
  onVerifySite: (site: MangroveSite) => void;
}

interface UserGPSLocation {
  lat: number;
  lng: number;
  accuracyMeters: number;
  timestamp: string;
  nearestSiteName?: string;
  nearestSiteDistanceKm?: number;
  isSimulated?: boolean;
}

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

export const IndiaMapView: React.FC<IndiaMapViewProps> = ({
  sites,
  selectedSiteId,
  onSelectSite,
  onVerifySite
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const userGpsLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Map Layer selection: Satellite is default for rich mangrove visual!
  const [activeLayer, setActiveLayer] = useState<'SATELLITE' | 'DARK' | 'STREET'>('SATELLITE');

  // GPS State
  const [gpsLocation, setGpsLocation] = useState<UserGPSLocation | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsNotice, setGpsNotice] = useState<{ text: string; isError: boolean } | null>(null);

  // Active Region Focus: Defaults to Maharashtra Konkan Coast!
  const [activeRegion, setActiveRegion] = useState<string>('MAHARASHTRA');

  const selectedSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  // Tile layer URL definitions (100% Free & Open, Zero API Key Required)
  const getTileLayerConfig = (layer: 'SATELLITE' | 'DARK' | 'STREET') => {
    switch (layer) {
      case 'SATELLITE':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: 'Esri, Maxar, Earthstar Geographics, USDA, USGS, AeroGRID, IGN'
        };
      case 'DARK':
        return {
          url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
        };
      case 'STREET':
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; OpenStreetMap contributors'
        };
    }
  };

  // 1. Initialize Leaflet Map (Centered on Maharashtra Konkan Coast by default)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default focus: Maharashtra Konkan Coast (Mumbai / Thane / Raigad / Ratnagiri)
    const defaultCenter: [number, number] = [18.8500, 73.1500];

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 8,
      zoomControl: true,
      attributionControl: false
    });

    const initialConfig = getTileLayerConfig('SATELLITE');
    const tileLayer = L.tileLayer(initialConfig.url, {
      maxZoom: 18,
      attribution: initialConfig.attribution
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    markersLayerGroupRef.current = L.layerGroup().addTo(map);
    userGpsLayerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Switch Tile Layers (Satellite vs Dark vs Street)
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    const config = getTileLayerConfig(activeLayer);
    tileLayerRef.current.setUrl(config.url);
  }, [activeLayer]);

  // 3. Render High-Precision Mangrove Sector Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current) return;

    markersLayerGroupRef.current.clearLayers();

    sites.forEach(site => {
      const isSelected = site.id === selectedSiteId;
      const isMH = site.state === 'Maharashtra';
      const isDegraded = site.verificationStatus === 'DEGRADED_ALERT';
      const isPending = site.verificationStatus === 'PENDING_MRV';

      const pinColor = isSelected 
        ? '#00FF9C' 
        : isDegraded 
          ? '#FF4444' 
          : isPending 
            ? '#00D1FF' 
            : (isMH ? '#00FF9C' : '#E0E7EB');

      const glowColor = isMH ? 'rgba(0, 255, 156, 0.45)' : 'rgba(0, 209, 255, 0.35)';

      const markerHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <div style="
            position: absolute;
            width: ${isSelected ? '32px' : '24px'};
            height: ${isSelected ? '32px' : '24px'};
            border-radius: 50%;
            background: ${glowColor};
            animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            width: ${isSelected ? '22px' : '16px'};
            height: ${isSelected ? '22px' : '16px'};
            border-radius: 50%;
            background: ${pinColor};
            border: 2px solid #05080A;
            box-shadow: 0 0 12px ${pinColor};
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
          ">
            ${isMH ? '<div style="width: 5px; height: 5px; border-radius: 50%; background: #05080A;"></div>' : ''}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-mangrove-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([site.coordinates.lat, site.coordinates.lng], {
        icon: customIcon,
        title: site.name
      });

      // Custom Popup
      const popupHtml = `
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 4px; color: #05080A; min-width: 200px;">
          <div style="font-weight: 800; font-size: 12px; text-transform: uppercase; color: #05080A; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px;">
            ${isMH ? '⭐ ' : ''}${site.name}
          </div>
          <div style="color: #0284c7; font-weight: bold; margin-top: 3px; font-size: 10px; text-transform: uppercase;">
            ${site.region} • ${site.totalAreaHa.toLocaleString()} Ha
          </div>
          <div style="margin-top: 5px; font-size: 10px; color: #334155; line-height: 1.4;">
            <div>Sentinel NDVI: <strong>${site.telemetry.satellite.ndvi}</strong> | LiDAR: <strong>${site.telemetry.drone.canopyHeightM}m</strong></div>
            <div>Soil SOC: <strong>${site.telemetry.groundSensors.socPercent30cm}%</strong> | Buffer: <strong>${site.activeBufferReserve.toLocaleString()} tCO₂e</strong></div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectSite(site);
      });

      markersLayerGroupRef.current?.addLayer(marker);
    });
  }, [sites, selectedSiteId, onSelectSite]);

  // 4. Pan to selected site on change
  useEffect(() => {
    if (mapInstanceRef.current && selectedSite) {
      mapInstanceRef.current.panTo([selectedSite.coordinates.lat, selectedSite.coordinates.lng], {
        animate: true,
        duration: 1.2
      });
    }
  }, [selectedSiteId]);

  // 5. Live GPS Geolocation / Simulated Maharashtra GNSS Fix
  const handleAcquireGPS = (simulateMH: boolean = false) => {
    setIsLocating(true);
    setGpsNotice(null);

    const applyGPSCoords = (lat: number, lng: number, accuracy: number, simulated: boolean) => {
      let minDistance = Infinity;
      let closestSiteName = '';

      sites.forEach(site => {
        const dist = calculateDistanceKm(lat, lng, site.coordinates.lat, site.coordinates.lng);
        if (dist < minDistance) {
          minDistance = dist;
          closestSiteName = site.name;
        }
      });

      const gpsData: UserGPSLocation = {
        lat,
        lng,
        accuracyMeters: accuracy,
        timestamp: new Date().toLocaleTimeString(),
        nearestSiteName: closestSiteName,
        nearestSiteDistanceKm: minDistance,
        isSimulated: simulated
      };

      setGpsLocation(gpsData);
      setIsLocating(false);

      if (simulated) {
        setGpsNotice({
          text: 'Locked onto Mumbai/Thane Creek Coastal Telemetry Station (19.1238°N, 72.9812°E). Live RTK sensor telemetry streaming active.',
          isError: false
        });
      } else {
        setGpsNotice({
          text: `Live GPS signal acquired (±${accuracy}m). Nearest Mangrove: ${closestSiteName} (${minDistance} km away).`,
          isError: false
        });
      }

      // Draw GPS Target Marker on Map
      if (mapInstanceRef.current && userGpsLayerGroupRef.current) {
        userGpsLayerGroupRef.current.clearLayers();

        const userPinHtml = `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="
              position: absolute;
              width: 38px;
              height: 38px;
              border-radius: 50%;
              background: rgba(0, 209, 255, 0.4);
              animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
            <div style="
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: #00D1FF;
              border: 3px solid #FFFFFF;
              box-shadow: 0 0 15px #00D1FF;
              z-index: 20;
            "></div>
          </div>
        `;

        const userIcon = L.divIcon({
          html: userPinHtml,
          className: 'user-gps-pin',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const userMarker = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 });
        userMarker.bindPopup(`
          <div style="font-family: monospace; font-size: 11px; color: #05080A; padding: 4px;">
            <strong>${simulated ? '📡 SIMULATED MH COASTAL SENSOR' : '🎯 YOUR LIVE GPS LOCATION'}</strong><br/>
            ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E (±${accuracy}m)<br/>
            Nearest: <strong>${closestSiteName}</strong> (${minDistance} km)
          </div>
        `);

        userGpsLayerGroupRef.current.addLayer(userMarker);
        mapInstanceRef.current.flyTo([lat, lng], 11, { duration: 1.5 });
      }
    };

    if (simulateMH) {
      // Simulate Maharashtra Mumbai / Thane Creek coastal station
      setTimeout(() => {
        applyGPSCoords(19.1238, 72.9812, 4, true);
      }, 500);
      return;
    }

    if (!navigator.geolocation) {
      applyGPSCoords(19.1238, 72.9812, 5, true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        applyGPSCoords(
          position.coords.latitude,
          position.coords.longitude,
          Math.round(position.coords.accuracy || 10),
          false
        );
      },
      (error) => {
        console.warn('Browser GPS permission error, auto-fallback to Maharashtra coastal sensor:', error);
        applyGPSCoords(19.1238, 72.9812, 5, true);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // Quick Region Switch
  const handleSelectRegionPreset = (regionKey: string) => {
    setActiveRegion(regionKey);

    if (!mapInstanceRef.current) return;

    switch (regionKey) {
      case 'MAHARASHTRA':
        const mh = sites.find(s => s.state === 'Maharashtra');
        if (mh) onSelectSite(mh);
        mapInstanceRef.current.flyTo([18.8500, 73.1500], 8, { duration: 1.2 });
        break;
      case 'THANE_MUMBAI':
        const tc = sites.find(s => s.id === 'thane-creek-mh-01');
        if (tc) onSelectSite(tc);
        mapInstanceRef.current.flyTo([19.1238, 72.9812], 12, { duration: 1.2 });
        break;
      case 'SINDHUDURG':
        const mal = sites.find(s => s.id === 'malvan-sindhudurg-mh-03');
        if (mal) onSelectSite(mal);
        mapInstanceRef.current.flyTo([16.0592, 73.4682], 11, { duration: 1.2 });
        break;
      case 'ALL_INDIA':
        const sun = sites.find(s => s.id === 'sundarbans-01');
        if (sun) onSelectSite(sun);
        mapInstanceRef.current.flyTo([20.5937, 78.9629], 5, { duration: 1.5 });
        break;
    }
  };

  return (
    <div className="bg-[#080D11] border border-[#1E293B] rounded-lg p-5 mb-8 font-mono">
      
      {/* Top Header: Title, Controls, GPS Trigger */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 pb-3 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#00FF9C] uppercase tracking-[0.2em] mb-1 font-bold">
            <Radio className="w-4 h-4 text-[#00FF9C] animate-pulse" />
            <span>High-Resolution GIS Radar • Maharashtra Priority Fleet</span>
          </div>
          <h2 className="text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <span>Sentinel-2 Spatial Geodetic & GPS Monitoring Deck</span>
          </h2>
        </div>

        {/* Action Controls & GPS Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Live Device GPS Locate */}
          <button
            onClick={() => handleAcquireGPS(false)}
            disabled={isLocating}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#00D1FF]/20 hover:bg-[#00D1FF]/30 text-[#00D1FF] border border-[#00D1FF]/50 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,209,255,0.2)] disabled:opacity-50"
          >
            <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'FIXING GPS...' : 'LOCATE LIVE GPS'}</span>
          </button>

          {/* Quick Maharashtra Coastal GNSS Pin */}
          <button
            onClick={() => handleAcquireGPS(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#00FF9C]/20 hover:bg-[#00FF9C]/30 text-[#00FF9C] border border-[#00FF9C]/50 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,255,156,0.2)]"
          >
            <Target className="w-3.5 h-3.5" />
            <span>LOCK MH SENSOR</span>
          </button>

          {/* Map Layer Switcher (Satellite / Dark / Topo) */}
          <div className="flex items-center bg-[#05080A] rounded border border-[#1E293B] p-0.5 text-xs">
            <button
              onClick={() => setActiveLayer('SATELLITE')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded uppercase tracking-wider transition-colors cursor-pointer ${
                activeLayer === 'SATELLITE' ? 'bg-[#161F27] text-[#00FF9C] font-bold border border-[#00FF9C]/30' : 'text-[#64748B] hover:text-white'
              }`}
            >
              <Satellite className="w-3 h-3" />
              <span>Satellite</span>
            </button>
            <button
              onClick={() => setActiveLayer('DARK')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded uppercase tracking-wider transition-colors cursor-pointer ${
                activeLayer === 'DARK' ? 'bg-[#161F27] text-[#00D1FF] font-bold border border-[#00D1FF]/30' : 'text-[#64748B] hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Dark Radar</span>
            </button>
            <button
              onClick={() => setActiveLayer('STREET')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded uppercase tracking-wider transition-colors cursor-pointer ${
                activeLayer === 'STREET' ? 'bg-[#161F27] text-[#FF8A00] font-bold border border-[#FF8A00]/30' : 'text-[#64748B] hover:text-white'
              }`}
            >
              <MapIcon className="w-3 h-3" />
              <span>Street/Topo</span>
            </button>
          </div>

        </div>
      </div>

      {/* Region Presets Focus Bar (Maharashtra Prioritized First) */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4 pb-3 border-b border-[#1E293B]/70 text-xs">
        <span className="text-[10px] text-[#64748B] uppercase tracking-widest mr-2 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-[#00FF9C]" />
          <span>Quick Focus:</span>
        </span>

        {[
          { id: 'MAHARASHTRA', label: '⭐ MAHARASHTRA KONKAN BELT' },
          { id: 'THANE_MUMBAI', label: 'THANE CREEK FLAMINGO (MUMBAI)' },
          { id: 'SINDHUDURG', label: 'MALVAN ESTUARY (SOUTH KONKAN)' },
          { id: 'ALL_INDIA', label: 'ALL INDIA NATIONAL VIEW' }
        ].map((preset) => (
          <button
            key={preset.id}
            onClick={() => handleSelectRegionPreset(preset.id)}
            className={`px-3 py-1 rounded text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeRegion === preset.id
                ? 'bg-[#00FF9C] text-[#05080A] font-bold shadow-[0_0_10px_rgba(0,255,156,0.25)]'
                : 'bg-[#05080A] text-[#94A3B8] border border-[#1E293B] hover:text-white hover:border-[#00FF9C]/40'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Live GPS Telemetry Status Notice */}
      {gpsNotice && (
        <div className={`mb-4 p-3 rounded text-xs flex items-center justify-between gap-3 animate-in fade-in ${
          gpsNotice.isError
            ? 'bg-[#FF8A00]/15 border border-[#FF8A00] text-[#FF8A00]'
            : 'bg-[#00D1FF]/10 border border-[#00D1FF]/40 text-[#E0E7EB]'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#00D1FF] shadow-[0_0_8px_#00D1FF] animate-ping"></span>
            <div>
              <span className="font-bold text-white uppercase tracking-wider">
                {gpsLocation?.isSimulated ? '📡 COASTAL GNSS NODE STREAMING:' : '🎯 LIVE GPS GNSS FIX:'}
              </span>{' '}
              <span className="text-[#00D1FF] font-mono">
                {gpsLocation ? `${gpsLocation.lat.toFixed(4)}°N, ${gpsLocation.lng.toFixed(4)}°E (±${gpsLocation.accuracyMeters}m)` : ''}
              </span>{' '}
              <span className="text-[#94A3B8] ml-2">
                • {gpsNotice.text}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setGpsNotice(null)}
            className="text-xs uppercase font-bold text-[#64748B] hover:text-white cursor-pointer ml-3 shrink-0"
          >
            [DISMISS]
          </button>
        </div>
      )}

      {/* Main Grid: Leaflet Satellite Viewport + Selected Sector Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: High-Res Interactive Satellite Map */}
        <div className="lg:col-span-7 bg-[#05080A] border border-[#1E293B] rounded-lg overflow-hidden relative min-h-[400px] flex flex-col justify-between shadow-inner">
          
          {/* Map canvas */}
          <div 
            ref={mapContainerRef} 
            className="w-full h-[400px] bg-[#05080A] z-10"
            style={{ filter: activeLayer === 'DARK' ? 'none' : 'contrast(1.05) brightness(0.95)' }}
          />

          {/* Bottom Coordinate Reference */}
          <div className="bg-[#05080A] border-t border-[#1E293B] px-3 py-1.5 flex items-center justify-between text-[10px] text-[#64748B] z-20">
            <span>DATUM: WGS-84 / EPSG:4326 • HIGH-RES SATELLITE TILES</span>
            <span className="text-[#00FF9C] font-bold">MAHARASHTRA KONKAN MONITORING ACTIVE</span>
          </div>
        </div>

        {/* Right: Selected Site Detailed Telemetry Card */}
        {selectedSite && (
          <div className="lg:col-span-5 bg-[#05080A] border border-[#1E293B] rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#00FF9C] font-bold">
                  {selectedSite.state === 'Maharashtra' ? '⭐ PRIORITY MAHARASHTRA SECTOR' : 'NATIONAL MONITORING SECTOR'}
                </span>
                <span className="text-[10px] text-[#64748B]">
                  {selectedSite.coordinates.lat.toFixed(4)}°N, {selectedSite.coordinates.lng.toFixed(4)}°E
                </span>
              </div>

              <h3 className="text-base font-bold text-white uppercase tracking-tight mb-1">
                {selectedSite.name}
              </h3>
              <p className="text-[11px] text-[#00D1FF] mb-3 uppercase">
                {selectedSite.region} • {selectedSite.ecosystemType}
              </p>

              {/* Grid telemetry summary */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="p-2.5 bg-[#080D11] rounded border border-[#1E293B]">
                  <span className="text-[9px] uppercase tracking-wider text-[#64748B] block">Monitored Area</span>
                  <span className="font-bold text-white text-xs">{selectedSite.totalAreaHa.toLocaleString()} Ha</span>
                </div>
                <div className="p-2.5 bg-[#080D11] rounded border border-[#1E293B]">
                  <span className="text-[9px] uppercase tracking-wider text-[#64748B] block">Sentinel-2 NDVI</span>
                  <span className="font-bold text-[#00D1FF] text-xs">{selectedSite.telemetry.satellite.ndvi}</span>
                </div>
                <div className="p-2.5 bg-[#080D11] rounded border border-[#1E293B]">
                  <span className="text-[9px] uppercase tracking-wider text-[#64748B] block">LiDAR Canopy Height</span>
                  <span className="font-bold text-[#00FF9C] text-xs">{selectedSite.telemetry.drone.canopyHeightM} m</span>
                </div>
                <div className="p-2.5 bg-[#080D11] rounded border border-[#1E293B]">
                  <span className="text-[9px] uppercase tracking-wider text-[#64748B] block">Soil Carbon (30cm)</span>
                  <span className="font-bold text-[#FF8A00] text-xs">{selectedSite.telemetry.groundSensors.socPercent30cm}% SOC</span>
                </div>
              </div>

              {/* Dominant Flora Species */}
              <div className="mb-4">
                <span className="text-[10px] uppercase tracking-widest text-[#64748B] block mb-1">Dominant Mangrove Species</span>
                <div className="flex flex-wrap gap-1">
                  {selectedSite.dominantSpecies.map((sp, i) => (
                    <span key={i} className="text-[10px] italic px-2 py-0.5 rounded bg-[#080D11] text-[#94A3B8] border border-[#1E293B]">
                      {sp}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Run verification button */}
            <div className="pt-3 border-t border-[#1E293B] flex items-center gap-2">
              <button
                onClick={() => onVerifySite(selectedSite)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-[#00FF9C] hover:bg-[#00D1FF] text-[#05080A] text-xs font-bold tracking-widest uppercase transition-all cursor-pointer shadow-[0_0_12px_rgba(0,255,156,0.2)]"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>LAUNCH MRV CONSENSUS RUN</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
