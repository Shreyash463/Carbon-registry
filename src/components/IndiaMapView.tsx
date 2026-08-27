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
  Waves,
  Map as MapIcon,
  X
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

// Relative SVG pin coordinates mapped across Maharashtra & Indian coastline
const SITE_COORDINATES_MAP: Record<string, { x: number; y: number; isMH?: boolean }> = {
  // Maharashtra Prioritized Sectors
  'thane-creek-mh-01': { x: 38, y: 48, isMH: true }, // Mumbai / Thane Creek
  'vikhroli-mahim-mh-02': { x: 36, y: 50, isMH: true }, // Vikhroli & Mahim Mumbai
  'ratnagiri-bhatye-mh-04': { x: 39, y: 57, isMH: true }, // Ratnagiri Bhatye
  'malvan-sindhudurg-mh-03': { x: 41, y: 63, isMH: true }, // Sindhudurg Malvan
  // National Sectors
  'kutch-06': { x: 26, y: 38 }, // Gujarat
  'sundarbans-01': { x: 74, y: 42 }, // West Bengal
  'bhitarkanika-03': { x: 71, y: 48 }, // Odisha
  'coringa-04': { x: 64, y: 62 }, // Andhra Pradesh
  'pichavaram-02': { x: 58, y: 77 }, // Tamil Nadu
  'andaman-05': { x: 88, y: 72 } // Andaman & Nicobar
};

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
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#161F27" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#04090E" }]
  }
];

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
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
  const [isGoogleMapActive, setIsGoogleMapActive] = useState<boolean>(Boolean(apiKey));
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');

  // GPS State
  const [gpsLocation, setGpsLocation] = useState<UserGPSLocation | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Active Region Focus
  const [activeRegion, setActiveRegion] = useState<string>('MAHARASHTRA');

  const selectedSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  // 1. Initialize Google Maps if API key is provided and user switched to Google Maps mode
  useEffect(() => {
    if (!apiKey || !isGoogleMapActive || !mapContainerRef.current) return;

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

        const defaultCenter = { lat: 18.8500, lng: 73.1500 }; // Maharashtra

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
      } catch (err: any) {
        console.warn('Google Maps load error:', err);
        setIsGoogleMapActive(false);
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [apiKey, isGoogleMapActive]);

  // 2. Render Google Map Markers
  useEffect(() => {
    if (!isGoogleMapActive || !mapInstanceRef.current) return;

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

      marker.addListener('click', () => {
        onSelectSite(site);
      });

      markersRef.current.push(marker);
    });
  }, [isGoogleMapActive, sites, selectedSiteId, onSelectSite]);

  // 3. Pan to selected site
  useEffect(() => {
    if (isGoogleMapActive && mapInstanceRef.current && selectedSite) {
      mapInstanceRef.current.panTo(selectedSite.coordinates);
    }
  }, [selectedSiteId, isGoogleMapActive]);

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

        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo({ lat: userLat, lng: userLng });
          mapInstanceRef.current.setZoom(11);
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError('Location permission was denied in your browser. Click the lock/tune icon on your browser address bar to allow location.');
        } else {
          setGpsError('GPS fix unavailable: ' + error.message);
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSelectRegionPreset = (regionKey: string) => {
    setActiveRegion(regionKey);

    if (regionKey === 'MAHARASHTRA') {
      const mhSite = sites.find(s => s.state === 'Maharashtra');
      if (mhSite) onSelectSite(mhSite);
    } else if (regionKey === 'THANE_MUMBAI') {
      const tc = sites.find(s => s.id === 'thane-creek-mh-01');
      if (tc) onSelectSite(tc);
    } else if (regionKey === 'SINDHUDURG') {
      const mal = sites.find(s => s.id === 'malvan-sindhudurg-mh-03');
      if (mal) onSelectSite(mal);
    } else if (regionKey === 'ALL_INDIA') {
      const sun = sites.find(s => s.id === 'sundarbans-01');
      if (sun) onSelectSite(sun);
    }

    if (mapInstanceRef.current) {
      if (regionKey === 'MAHARASHTRA') {
        mapInstanceRef.current.panTo({ lat: 18.8500, lng: 73.1500 });
        mapInstanceRef.current.setZoom(8);
      } else if (regionKey === 'THANE_MUMBAI') {
        mapInstanceRef.current.panTo({ lat: 19.1238, lng: 72.9812 });
        mapInstanceRef.current.setZoom(12);
      } else if (regionKey === 'SINDHUDURG') {
        mapInstanceRef.current.panTo({ lat: 16.0592, lng: 73.4682 });
        mapInstanceRef.current.setZoom(11);
      } else {
        mapInstanceRef.current.panTo({ lat: 20.5937, lng: 78.9629 });
        mapInstanceRef.current.setZoom(5);
      }
    }
  };

  const handleSaveApiKey = () => {
    const clean = inputKey.trim();
    setApiKey(clean);
    localStorage.setItem('GOOGLE_MAPS_API_KEY', clean);
    setIsGoogleMapActive(true);
    setShowKeyModal(false);
  };

  return (
    <div className="bg-[#080D11] border border-[#1E293B] rounded-lg p-5 mb-8 font-mono">
      
      {/* Top Header: Title, Controls, GPS Trigger */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 pb-3 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#00FF9C] uppercase tracking-[0.2em] mb-1 font-bold">
            <Radio className="w-4 h-4 text-[#00FF9C] animate-pulse" />
            <span>National Mangrove Spatial Radar • Maharashtra Priority Fleet</span>
          </div>
          <h2 className="text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <span>Spatial Geodetic Monitoring & GPS Deck</span>
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

          {/* Map Mode Switcher */}
          <button
            onClick={() => {
              if (!apiKey) {
                setShowKeyModal(true);
              } else {
                setIsGoogleMapActive(!isGoogleMapActive);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs uppercase tracking-wider transition-colors cursor-pointer border ${
              isGoogleMapActive
                ? 'bg-[#00FF9C]/15 text-[#00FF9C] border-[#00FF9C]/40 shadow-[0_0_10px_rgba(0,255,156,0.2)]'
                : 'bg-[#0F171C] text-[#94A3B8] border-[#1E293B] hover:text-white hover:border-[#00FF9C]/40'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>{isGoogleMapActive ? 'GOOGLE SATELLITE: ON' : 'CONNECT GOOGLE MAPS'}</span>
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
        <div className="mb-4 p-3 rounded bg-[#FF8A00]/15 border border-[#FF8A00] text-xs text-[#FF8A00] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#FF8A00]" />
            <span>{gpsError}</span>
          </div>
          <button 
            onClick={() => setGpsError(null)}
            className="text-xs uppercase font-bold text-[#FF8A00] hover:underline cursor-pointer"
          >
            [DISMISS]
          </button>
        </div>
      )}

      {/* Main Grid: Tactical Map Viewport + Selected Sector Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Spatial Radar & Map Viewport */}
        <div className="lg:col-span-7 bg-[#05080A] border border-[#1E293B] rounded-lg overflow-hidden relative min-h-[380px] flex flex-col justify-between">
          
          {isGoogleMapActive && apiKey ? (
            <div 
              ref={mapContainerRef} 
              className="w-full h-[380px] bg-[#05080A]"
            />
          ) : (
            <div className="relative w-full h-[380px] bg-[#05080A] p-4 flex items-center justify-center overflow-hidden">
              
              {/* Radar Grid Pattern */}
              <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>

              {/* Concentric Radar Sweeps */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-64 h-64 rounded-full border border-[#00FF9C] animate-pulse"></div>
                <div className="w-96 h-96 rounded-full border border-[#00D1FF] absolute"></div>
              </div>

              {/* India Coastal Silhouette Background */}
              <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#00FF9C] fill-current">
                  <path d="M 30,20 L 45,15 L 60,18 L 70,28 L 76,40 L 73,48 L 65,60 L 58,75 L 53,88 L 48,78 L 40,65 L 32,50 L 22,44 L 25,35 Z" />
                </svg>
              </div>

              {/* Interactive Mangrove Sector Pins */}
              <div className="relative w-full h-80 max-w-lg mx-auto">
                {sites.map((site) => {
                  const coords = SITE_COORDINATES_MAP[site.id] || { x: 50, y: 50 };
                  const isSelected = selectedSite?.id === site.id;
                  const isMH = site.state === 'Maharashtra';
                  const isDegraded = site.verificationStatus === 'DEGRADED_ALERT';
                  const isPending = site.verificationStatus === 'PENDING_MRV';

                  return (
                    <button
                      key={site.id}
                      onClick={() => onSelectSite(site)}
                      style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform duration-200 z-10 ${
                        isSelected ? 'scale-125 z-20' : 'hover:scale-110'
                      }`}
                    >
                      <div className="relative flex items-center justify-center">
                        {/* Ripple ring */}
                        <span className={`absolute -inset-2 rounded-full opacity-60 animate-ping ${
                          isDegraded ? 'bg-[#FF4444]' : (isPending ? 'bg-[#00D1FF]' : 'bg-[#00FF9C]')
                        }`}></span>
                        
                        {/* Pin Marker */}
                        <div className={`px-2 py-1 rounded border flex items-center gap-1.5 transition-all text-[10px] font-bold shadow-lg ${
                          isSelected
                            ? 'bg-[#00FF9C] text-[#05080A] border-white shadow-[0_0_15px_#00FF9C]'
                            : isMH
                              ? 'bg-[#080D11] border-[#00FF9C] text-[#00FF9C]'
                              : isDegraded
                                ? 'bg-[#080D11] border-[#FF4444] text-[#FF4444]'
                                : isPending
                                  ? 'bg-[#080D11] border-[#00D1FF] text-[#00D1FF]'
                                  : 'bg-[#080D11] border-[#1E293B] text-[#E0E7EB]'
                        }`}>
                          <MapPin className="w-3 h-3 fill-current" />
                          <span>{site.name.split(' ')[0]}</span>
                        </div>

                        {/* Hover Tooltip */}
                        <div className={`absolute top-full mt-1.5 whitespace-nowrap px-2.5 py-1 rounded text-[10px] uppercase tracking-wider border pointer-events-none transition-opacity z-30 ${
                          isSelected 
                            ? 'opacity-100 bg-[#0F171C] text-[#00FF9C] border-[#00FF9C] shadow-lg' 
                            : 'opacity-0 group-hover:opacity-100 bg-[#080D11] text-[#E0E7EB] border-[#1E293B]'
                        }`}>
                          {isMH && <span className="text-[#00FF9C] font-bold mr-1">⭐ MH:</span>}
                          {site.name} ({site.state}) • {site.totalAreaHa.toLocaleString()} Ha
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Quick Switch Prompt */}
              <div className="absolute bottom-3 right-3 z-20">
                <button
                  onClick={() => setShowKeyModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#080D11]/90 border border-[#1E293B] hover:border-[#00FF9C] text-[10px] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                >
                  <Key className="w-3 h-3 text-[#00FF9C]" />
                  <span>Google Maps Key</span>
                </button>
              </div>

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
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#94A3B8] font-sans mb-4 leading-relaxed">
              Enter your Google Maps Platform API key to enable live Google Satellite layers and real-time aerial street view across Maharashtra and Indian coastal wetlands.
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
