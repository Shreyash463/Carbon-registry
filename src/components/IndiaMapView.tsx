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
  Key, 
  Satellite, 
  Layers, 
  Sparkles, 
  LocateFixed, 
  ShieldCheck, 
  ExternalLink,
  Info,
  Waves
} from 'lucide-react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

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
}

// Custom dark tactical map styling
const DARK_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#080D11" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#05080A" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94A3B8" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#00FF9C" }]
  },
  {
    featureType: "administrative.province",
    elementType: "geometry.stroke",
    stylers: [{ color: "#00FF9C" }, { weight: 1.5 }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#00D1FF" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#0C1F1A" }]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#00FF9C" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#161F27" }]
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1E293B" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748B" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#04090E" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#00D1FF" }]
  }
];

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
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const userGpsMarkerRef = useRef<google.maps.Marker | null>(null);

  // API Key management
  const envApiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('GOOGLE_MAPS_API_KEY') || envApiKey;
  });
  const [inputKey, setInputKey] = useState<string>(apiKey);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');

  // GPS State
  const [gpsLocation, setGpsLocation] = useState<UserGPSLocation | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Active Region Focus: Default to Maharashtra Konkan Coast!
  const [activeRegion, setActiveRegion] = useState<string>('MAHARASHTRA');

  const selectedSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  // 1. Initialize Google Maps with modern importLibrary
  useEffect(() => {
    if (!apiKey || !mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      try {
        setOptions({
          key: apiKey,
          v: 'weekly',
          solutionChannel: 'gmp_git_agentskills_v1'
        });

        const { Map } = await importLibrary('maps');
        await importLibrary('marker');

        if (!isMounted || !mapContainerRef.current) return;

        // Center prioritizes Maharashtra Konkan Coast by default
        const defaultCenter = { lat: 18.8500, lng: 73.1500 };

        const map = new Map(mapContainerRef.current, {
          center: defaultCenter,
          zoom: 8,
          mapTypeId: mapType,
          styles: mapType === 'roadmap' ? DARK_MAP_STYLES : undefined,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          backgroundColor: '#05080A'
        });

        mapInstanceRef.current = map;
        setIsMapLoaded(true);
        setMapError(null);
      } catch (err: any) {
        console.warn('Google Maps API failed to load with provided key:', err);
        setMapError(err.message || 'Failed to initialize Google Maps. Check API Key.');
        setIsMapLoaded(false);
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [apiKey]);

  // Update map type
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(mapType);
      if (mapType === 'roadmap') {
        mapInstanceRef.current.setOptions({ styles: DARK_MAP_STYLES });
      } else {
        mapInstanceRef.current.setOptions({ styles: null });
      }
    }
  }, [mapType]);

  // 2. Render Google Map Markers
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current) return;

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

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
            : isMH 
              ? '#00FF9C' 
              : '#E0E7EB';

      const marker = new google.maps.Marker({
        position: site.coordinates,
        map: mapInstanceRef.current!,
        title: site.name,
        animation: isSelected ? google.maps.Animation.BOUNCE : undefined,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 11 : (isMH ? 9 : 7),
          fillColor: pinColor,
          fillOpacity: 1,
          strokeColor: '#05080A',
          strokeWeight: 2.5
        }
      });

      // InfoWindow
      const infoContent = document.createElement('div');
      infoContent.className = 'font-mono text-xs p-2 text-slate-900 min-w-[220px]';
      infoContent.innerHTML = `
        <div style="font-weight: bold; color: #05080A; text-transform: uppercase; font-size: 11px;">
          ${site.name}
        </div>
        <div style="font-size: 10px; color: #0284c7; font-weight: bold; margin-top: 2px;">
          ${site.state} • ${site.totalAreaHa.toLocaleString()} Hectares
        </div>
        <div style="font-size: 10px; color: #475569; margin-top: 4px;">
          NDVI: <strong>${site.telemetry.satellite.ndvi}</strong> | LiDAR: <strong>${site.telemetry.drone.canopyHeightM}m</strong>
        </div>
        <div style="font-size: 10px; color: #16a34a; font-weight: bold; margin-top: 4px;">
          Active Buffer: ${site.activeBufferReserve.toLocaleString()} tCO₂e
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({
        content: infoContent
      });

      marker.addListener('click', () => {
        onSelectSite(site);
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });
  }, [isMapLoaded, sites, selectedSiteId, onSelectSite]);

  // 3. Pan to selected site on change
  useEffect(() => {
    if (isMapLoaded && mapInstanceRef.current && selectedSite) {
      mapInstanceRef.current.panTo(selectedSite.coordinates);
      // If user zooms to specific site, set comfortable zoom
      if (selectedSite.state === 'Maharashtra') {
        mapInstanceRef.current.setZoom(10);
      }
    }
  }, [selectedSiteId, isMapLoaded]);

  // 4. Live GPS Geolocation Trigger
  const handleAcquireGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy);

        // Find nearest mangrove site in registry
        let minDistance = Infinity;
        let closestSiteName = '';

        sites.forEach(site => {
          const dist = calculateDistanceKm(userLat, userLng, site.coordinates.lat, site.coordinates.lng);
          if (dist < minDistance) {
            minDistance = dist;
            closestSiteName = site.name;
          }
        });

        const gpsData: UserGPSLocation = {
          lat: userLat,
          lng: userLng,
          accuracyMeters: accuracy,
          timestamp: new Date().toLocaleTimeString(),
          nearestSiteName: closestSiteName,
          nearestSiteDistanceKm: minDistance
        };

        setGpsLocation(gpsData);
        setIsLocating(false);

        // If Google Map is loaded, place/update user GPS marker & pan
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo({ lat: userLat, lng: userLng });
          mapInstanceRef.current.setZoom(11);

          if (userGpsMarkerRef.current) {
            userGpsMarkerRef.current.setPosition({ lat: userLat, lng: userLng });
          } else {
            userGpsMarkerRef.current = new google.maps.Marker({
              position: { lat: userLat, lng: userLng },
              map: mapInstanceRef.current,
              title: 'Your Live GPS Location',
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: '#00D1FF',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 3
              }
            });
          }
        }
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError('GPS permission was denied in browser. Please allow location access.');
        } else {
          setGpsError('Unable to retrieve GPS fix: ' + error.message);
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Region preset zoom buttons
  const handleSelectRegionPreset = (regionKey: string) => {
    setActiveRegion(regionKey);
    if (!mapInstanceRef.current) return;

    switch (regionKey) {
      case 'MAHARASHTRA':
        mapInstanceRef.current.panTo({ lat: 18.8500, lng: 73.1500 });
        mapInstanceRef.current.setZoom(8);
        break;
      case 'THANE_MUMBAI':
        mapInstanceRef.current.panTo({ lat: 19.1238, lng: 72.9812 });
        mapInstanceRef.current.setZoom(12);
        break;
      case 'SINDHUDURG':
        mapInstanceRef.current.panTo({ lat: 16.0592, lng: 73.4682 });
        mapInstanceRef.current.setZoom(11);
        break;
      case 'ALL_INDIA':
        mapInstanceRef.current.panTo({ lat: 20.5937, lng: 78.9629 });
        mapInstanceRef.current.setZoom(5);
        break;
    }
  };

  const handleSaveApiKey = () => {
    const clean = inputKey.trim();
    setApiKey(clean);
    localStorage.setItem('GOOGLE_MAPS_API_KEY', clean);
    setShowKeyModal(false);
  };

  return (
    <div className="bg-[#080D11] border border-[#1E293B] rounded-lg p-5 mb-8 font-mono">
      
      {/* Top Header: Title, Controls, GPS Trigger */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 pb-3 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#00FF9C] uppercase tracking-[0.2em] mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>National Mangrove Spatial Radar • Maharashtra Priority Fleet</span>
          </div>
          <h2 className="text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <span>Google Maps GPS Geodetic Monitoring Deck</span>
          </h2>
        </div>

        {/* Action Controls & GPS Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Live GPS Locate Button */}
          <button
            onClick={handleAcquireGPS}
            disabled={isLocating}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#00D1FF]/20 hover:bg-[#00D1FF]/30 text-[#00D1FF] border border-[#00D1FF]/50 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,209,255,0.2)] disabled:opacity-50"
          >
            <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'FIXING GPS...' : 'LOCATE LIVE GPS'}</span>
          </button>

          {/* Map Layer Switcher */}
          <div className="flex items-center bg-[#05080A] rounded border border-[#1E293B] p-0.5 text-xs">
            <button
              onClick={() => setMapType('roadmap')}
              className={`px-2.5 py-1 rounded uppercase tracking-wider transition-colors ${
                mapType === 'roadmap' ? 'bg-[#161F27] text-[#00FF9C] font-bold' : 'text-[#64748B] hover:text-white'
              }`}
            >
              Dark Map
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 rounded uppercase tracking-wider transition-colors ${
                mapType === 'satellite' ? 'bg-[#161F27] text-[#00D1FF] font-bold' : 'text-[#64748B] hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapType('hybrid')}
              className={`px-2.5 py-1 rounded uppercase tracking-wider transition-colors ${
                mapType === 'hybrid' ? 'bg-[#161F27] text-[#FF8A00] font-bold' : 'text-[#64748B] hover:text-white'
              }`}
            >
              Hybrid
            </button>
          </div>

          {/* API Key Modal Button */}
          <button
            onClick={() => setShowKeyModal(true)}
            title="Configure Google Maps API Key"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs uppercase tracking-wider bg-[#0F171C] hover:bg-[#161F27] text-[#E0E7EB] border border-[#1E293B] transition-colors cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-[#00FF9C]" />
            <span>{apiKey ? 'API KEY CONFIGURED' : 'CONNECT MAPS API KEY'}</span>
          </button>

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

      {/* Live GPS Telemetry Overlay Bar (if acquired) */}
      {gpsLocation && (
        <div className="mb-4 p-3 rounded bg-[#00D1FF]/10 border border-[#00D1FF]/40 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#00D1FF] shadow-[0_0_8px_#00D1FF] animate-ping"></span>
            <div>
              <span className="font-bold text-white uppercase tracking-wider">LIVE GPS FIX ACQUIRED:</span>{' '}
              <span className="text-[#00D1FF] font-mono">
                {gpsLocation.lat.toFixed(4)}°N, {gpsLocation.lng.toFixed(4)}°E (±{gpsLocation.accuracyMeters}m)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[#E0E7EB] text-[11px]">
            <span>
              Nearest Mangrove Sector: <strong className="text-[#00FF9C]">{gpsLocation.nearestSiteName}</strong> ({gpsLocation.nearestSiteDistanceKm} km)
            </span>
          </div>
        </div>
      )}

      {gpsError && (
        <div className="mb-4 p-2.5 rounded bg-[#FF4444]/15 border border-[#FF4444] text-xs text-[#FF4444] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Main Grid: Google Map Container + Selected Sector Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Google Map Viewport */}
        <div className="lg:col-span-7 bg-[#05080A] border border-[#1E293B] rounded-lg overflow-hidden relative min-h-[380px] flex flex-col">
          
          {/* Map canvas */}
          <div 
            ref={mapContainerRef} 
            className="w-full h-[380px] bg-[#05080A]"
          />

          {/* Fallback & API Key Guidance Overlay if Map is not loaded */}
          {(!apiKey || mapError) && (
            <div className="absolute inset-0 bg-[#05080A]/95 p-6 flex flex-col items-center justify-center text-center z-20">
              <div className="w-12 h-12 rounded bg-[#00FF9C]/15 border border-[#00FF9C]/40 flex items-center justify-center text-[#00FF9C] mb-3 shadow-[0_0_15px_rgba(0,255,156,0.3)]">
                <Satellite className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                Google Maps Dynamic Satellite & GPS Deck
              </h3>
              <p className="text-xs text-[#94A3B8] max-w-md mb-4 font-sans leading-relaxed">
                Connect your Google Maps API key to activate high-resolution Sentinel satellite overlays, live GPS device radar tracking, and real-time geocoding for Maharashtra coastal estuaries.
              </p>
              
              <div className="flex items-center gap-2 w-full max-w-sm">
                <input
                  type="text"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Paste Google Maps API Key here..."
                  className="w-full bg-[#080D11] border border-[#1E293B] rounded px-3 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#00FF9C]"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-4 py-2 rounded bg-[#00FF9C] hover:bg-[#00D1FF] text-[#05080A] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                >
                  ACTIVATE
                </button>
              </div>

              <span className="text-[10px] text-[#64748B] mt-2">
                Tip: Get a key at <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noreferrer" className="text-[#00D1FF] underline">Google Cloud Console</a> or use your existing Google Maps Key.
              </span>
            </div>
          )}

          {/* Bottom Coordinate Reference */}
          <div className="bg-[#05080A] border-t border-[#1E293B] px-3 py-1.5 flex items-center justify-between text-[10px] text-[#64748B]">
            <span>GEODETIC DATUM: WGS-84 / EPSG:4326</span>
            <span className="text-[#00FF9C]">MAHARASHTRA KONKAN MONITORING ACTIVE</span>
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

      {/* API Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05080A]/85 backdrop-blur-md">
          <div className="bg-[#080D11] border border-[#1E293B] rounded-lg w-full max-w-md p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#00FF9C] uppercase tracking-wider">
                <Key className="w-4 h-4" />
                <span>Google Maps API Key Setup</span>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-[#64748B] hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#94A3B8] font-sans mb-4 leading-relaxed">
              Enter your Google Maps Platform API key to enable live interactive vector maps, satellite imagery, and geodetic triangulation across Maharashtra and Indian coastal wetlands.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1">
                  Google Maps API Key
                </label>
                <input
                  type="text"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#05080A] border border-[#1E293B] rounded px-3.5 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#00FF9C]"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded text-xs uppercase text-[#64748B] hover:text-white border border-[#1E293B]"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  className="px-5 py-2 rounded text-xs font-bold uppercase tracking-wider bg-[#00FF9C] hover:bg-[#00D1FF] text-[#05080A]"
                >
                  SAVE & ACTIVATE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
