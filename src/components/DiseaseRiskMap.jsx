import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Filter, Info, Maximize2, Minimize2, Navigation, ShieldAlert } from 'lucide-react';
import Badge from './ui/Badge';
import Card, { CardHeader, CardTitle, CardDescription } from './ui/Card';
import Button from './ui/Button';

/**
 * Calculates geographic distance in kilometers between two lat/lng pairs
 * using the Haversine formula.
 */
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const DEFAULT_ZONES = [
  {
    id: 'RZ-01',
    alertId: 'ALT-101',
    disease: 'Foot and Mouth Disease (FMD)',
    village: 'Udaipur Cluster',
    latitude: 24.5854,
    longitude: 73.7125,
    riskLevel: 'HIGH',
    casesCount: 8,
    radiusKm: 5,
    updatedAt: '2 hours ago',
    advisory: 'Isolate symptomatic livestock, enforce ring vaccination, avoid shared water points.',
  },
  {
    id: 'RZ-02',
    alertId: 'ALT-102',
    disease: 'Mastitis Surveillance Zone',
    village: 'Bharampur Region',
    latitude: 24.6200,
    longitude: 73.7500,
    riskLevel: 'MEDIUM',
    casesCount: 3,
    radiusKm: 3,
    updatedAt: '6 hours ago',
    advisory: 'Maintain strict teat dipping and hygiene during milking.',
  },
  {
    id: 'RZ-03',
    alertId: 'ALT-103',
    disease: 'Avian Influenza Monitoring',
    village: 'Nawada Sector',
    latitude: 24.5500,
    longitude: 73.6800,
    riskLevel: 'HIGH',
    casesCount: 12,
    radiusKm: 8,
    updatedAt: '1 hour ago',
    advisory: 'Restrict poultry movement, report sudden flock mortality immediately.',
  },
  {
    id: 'RZ-04',
    alertId: 'ALT-104',
    disease: 'Blackquarter (BQ) Watch',
    village: 'Kalka Mata Area',
    latitude: 24.6000,
    longitude: 73.6900,
    riskLevel: 'LOW',
    casesCount: 1,
    radiusKm: 4,
    updatedAt: '12 hours ago',
    advisory: 'Ensure annual BQ vaccination before monsoon.',
  },
];

const RISK_COLOR = {
  HIGH: { fill: '#ef4444', stroke: '#dc2626', center: '#b91c1c' },
  CRITICAL: { fill: '#dc2626', stroke: '#991b1b', center: '#7f1d1d' },
  MEDIUM: { fill: '#f59e0b', stroke: '#d97706', center: '#b45309' },
  LOW: { fill: '#22c55e', stroke: '#16a34a', center: '#15803d' },
};

const getRiskColor = (level) => RISK_COLOR[level] || RISK_COLOR.LOW;
const getBadgeVariant = (level) => {
  if (level === 'HIGH' || level === 'CRITICAL') return 'danger';
  if (level === 'MEDIUM') return 'warning';
  return 'info';
};

export default function DiseaseRiskMap({ alerts = [], riskZones = [] }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const userMarkerRef = useRef(null);

  const [filterLevel, setFilterLevel] = useState('ALL'); // 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'
  const [selectedZone, setSelectedZone] = useState(DEFAULT_ZONES[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Farmer browser location state
  const [farmerLoc, setFarmerLoc] = useState({
    latitude: null,
    longitude: null,
    status: 'idle', // 'idle' | 'fetching' | 'success' | 'denied' | 'unavailable'
    error: '',
  });

  // Combine dynamic context riskZones with default mock zones
  const displayZones = React.useMemo(() => {
    const combined = [...riskZones, ...DEFAULT_ZONES];
    // Deduplicate by ID
    const seen = new Set();
    const unique = [];
    combined.forEach((z) => {
      const zId = z.id || z.alertId;
      if (zId && !seen.has(zId)) {
        seen.add(zId);
        unique.push({
          id: zId,
          alertId: z.alertId || zId,
          disease: z.disease || 'Livestock Biosecurity Alert',
          village: z.village || z.location?.village || 'Local Area',
          latitude: Number(z.latitude || z.lat || 24.5854),
          longitude: Number(z.longitude || z.lng || 73.7125),
          riskLevel: (z.riskLevel || z.severity || 'MEDIUM').toUpperCase(),
          casesCount: z.casesCount || 5,
          radiusKm: Number(z.radiusKm || z.radius || 5),
          updatedAt: z.updatedAt || 'Recently',
          advisory: z.advisory || 'Follow standard biosecurity protocols and report new symptoms.',
        });
      }
    });
    return unique;
  }, [riskZones, alerts]);

  // Filtered zones based on filter bar selection
  const filteredZones = React.useMemo(() => {
    if (filterLevel === 'ALL') return displayZones;
    if (filterLevel === 'HIGH') {
      return displayZones.filter((z) => z.riskLevel === 'HIGH' || z.riskLevel === 'CRITICAL');
    }
    return displayZones.filter((z) => z.riskLevel === filterLevel);
  }, [displayZones, filterLevel]);

  // Helper to ensure Leaflet is loaded (from index.html or dynamic CDN load)
  const ensureLeaflet = async () => {
    if (window.L) return window.L;
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (window.L) {
          clearInterval(check);
          resolve(window.L);
        }
      }, 100);
      setTimeout(() => {
        clearInterval(check);
        resolve(window.L || null);
      }, 5000);
    });
  };

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      const L = await ensureLeaflet();
      if (!L || !mapContainerRef.current || mapInstanceRef.current || !isMounted) return;

      const defaultLat = 24.5854;
      const defaultLng = 73.7125;

      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLng],
        zoom: 12,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layerGroupRef.current = null;
      }
    };
  }, []);

  // Update Leaflet geographic circle layers whenever filteredZones change
  useEffect(() => {
    const L = window.L;
    if (!L || !mapInstanceRef.current || !layerGroupRef.current) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    filteredZones.forEach((zone) => {
      const col = getRiskColor(zone.riskLevel);
      const radiusMeters = zone.radiusKm * 1000;

      // Outer gradient circle (low opacity)
      const outerCircle = L.circle([zone.latitude, zone.longitude], {
        radius: radiusMeters,
        color: col.stroke,
        weight: 1,
        fillColor: col.fill,
        fillOpacity: 0.16,
      });

      // Middle circle (medium opacity)
      const midCircle = L.circle([zone.latitude, zone.longitude], {
        radius: radiusMeters * 0.6,
        color: col.stroke,
        weight: 1,
        fillColor: col.fill,
        fillOpacity: 0.32,
      });

      // Inner circle (high opacity)
      const innerCircle = L.circle([zone.latitude, zone.longitude], {
        radius: radiusMeters * 0.3,
        color: col.stroke,
        weight: 2,
        fillColor: col.fill,
        fillOpacity: 0.55,
      });

      // Center dot marker
      const centerMarker = L.circleMarker([zone.latitude, zone.longitude], {
        radius: 6,
        color: col.stroke,
        fillColor: col.center,
        fillOpacity: 0.95,
        weight: 2,
      });

      // Bind click handler to all circle elements
      const popupText = `
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
          <strong style="color: ${col.center}; font-size: 13px;">${zone.disease}</strong><br/>
          <b>ID:</b> ${zone.alertId}<br/>
          <b>Location:</b> ${zone.village}<br/>
          <b>Severity:</b> <span style="color:${col.center}; font-weight:bold;">${zone.riskLevel}</span><br/>
          <b>Radius:</b> ${zone.radiusKm} km | <b>Cases:</b> ${zone.casesCount}
        </div>
      `;

      [outerCircle, midCircle, innerCircle, centerMarker].forEach((layer) => {
        layer.bindPopup(popupText);
        layer.on('click', () => {
          setSelectedZone(zone);
        });
        layerGroup.addLayer(layer);
      });
    });
  }, [filteredZones]);

  // Handle map invalidateSize when toggling fullscreen
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 150);
    }
  }, [isFullscreen]);

  // Request Farmer Browser Geolocation for "My Location" & Inside/Outside calculation
  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      setFarmerLoc({ latitude: null, longitude: null, status: 'unavailable', error: 'Geolocation not supported by browser.' });
      return;
    }

    setFarmerLoc((prev) => ({ ...prev, status: 'fetching', error: '' }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setFarmerLoc({ latitude: lat, longitude: lng, status: 'success', error: '' });

        // Center Leaflet map and add user location marker
        const L = window.L;
        if (mapInstanceRef.current && L) {
          mapInstanceRef.current.flyTo([lat, lng], 13);

          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([lat, lng]);
          } else {
            const userIcon = L.divIcon({
              className: 'custom-user-pin',
              html: `<div style="background:#2563eb; width:16px; height:16px; border-radius:50%; border:3px solid white; box-shadow:0 0 8px rgba(37,99,235,0.8);"></div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            });
            userMarkerRef.current = L.marker([lat, lng], { icon: userIcon, title: 'Your Location' })
              .bindPopup('<b>Your Current Location</b>')
              .addTo(mapInstanceRef.current);
          }
        }
      },
      (err) => {
        setFarmerLoc({ latitude: null, longitude: null, status: 'denied', error: 'Location permission denied by user.' });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Calculate if farmer location is inside selected zone
  const zoneStatus = React.useMemo(() => {
    if (farmerLoc.status !== 'success' || !farmerLoc.latitude || !selectedZone) {
      return { status: farmerLoc.status, text: farmerLoc.status === 'denied' ? 'Location permission denied' : 'Location unavailable' };
    }
    const dist = getDistanceKm(farmerLoc.latitude, farmerLoc.longitude, selectedZone.latitude, selectedZone.longitude);
    const inside = dist <= selectedZone.radiusKm;
    return {
      inside,
      distanceKm: dist,
      text: inside
        ? `INSIDE this alert zone (${dist.toFixed(2)} km from outbreak center)`
        : `OUTSIDE this alert zone (${dist.toFixed(1)} km away from center)`,
    };
  }, [farmerLoc, selectedZone]);

  return (
    <Card className={`border-slate-200 bg-white shadow-sm overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none m-0 p-4 h-screen w-screen flex flex-col' : ''}`}>
      <CardHeader className="border-b border-slate-100 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-600" />
              <CardTitle>Community Disease Risk Map</CardTitle>
            </div>
            <CardDescription>
              Geographically anchored biosecurity heat map (Leaflet GIS). Area-level risk data only.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleGetMyLocation}
              variant="outline"
              size="sm"
              icon={Navigation}
            >
              {farmerLoc.status === 'fetching' ? 'Locating…' : 'My Location'}
            </Button>

            <Button
              onClick={() => setIsFullscreen(!isFullscreen)}
              variant="outline"
              size="sm"
              icon={isFullscreen ? Minimize2 : Maximize2}
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs">
          <span className="flex items-center gap-1 font-semibold text-slate-600 mr-1">
            <Filter className="h-3.5 w-3.5 text-slate-500" /> Filter Risk:
          </span>
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((level) => (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className={`rounded-full px-3 py-1 font-bold transition-all ${
                filterLevel === level
                  ? level === 'HIGH'
                    ? 'bg-red-600 text-white shadow-sm'
                    : level === 'MEDIUM'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : level === 'LOW'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {level === 'HIGH' ? 'HIGH / CRITICAL' : level}
            </button>
          ))}
        </div>
      </CardHeader>

      <div className={`grid gap-4 p-4 ${isFullscreen ? 'flex-1 grid-cols-1 lg:grid-cols-[2fr_1fr]' : 'lg:grid-cols-[1.8fr_1fr]'}`}>

        {/* ── MAP CONTAINER ── */}
        <div className="relative rounded-2xl border border-slate-200 overflow-hidden min-h-[360px] shadow-inner bg-slate-100">
          <div ref={mapContainerRef} className="h-full w-full min-h-[360px]" style={{ zIndex: 1 }} />

          {/* Map legend overlay */}
          <div className="absolute bottom-4 left-4 z-[400] flex flex-col gap-1 rounded-xl bg-white/95 px-3 py-2 text-[10px] shadow-lg backdrop-blur-sm border border-slate-200">
            <span className="font-bold text-slate-800 mb-0.5">Geographic Risk Heat Layer</span>
            {[
              { label: 'High / Critical Outbreak', color: '#ef4444' },
              { label: 'Medium Risk Zone', color: '#f59e0b' },
              { label: 'Low / Surveillance Area', color: '#22c55e' },
            ].map(({ label, color }) => (
              <span key={label} className="flex items-center gap-1.5 text-slate-700 font-medium">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── ZONE DETAILS & FARMER LOCATION STATUS ── */}
        <div className="flex flex-col justify-between space-y-4 overflow-y-auto max-h-[500px] pr-1">
          {selectedZone ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Selected Zone Details</p>
                  <h4 className="text-base font-bold text-slate-900 mt-0.5">{selectedZone.disease}</h4>
                  <p className="text-xs text-slate-500">ID: {selectedZone.alertId}</p>
                </div>
                <Badge variant={getBadgeVariant(selectedZone.riskLevel)}>
                  {selectedZone.riskLevel} SEVERITY
                </Badge>
              </div>

              {/* Farmer Location Check result */}
              <div
                className={`rounded-xl p-3 text-xs border font-semibold flex items-start gap-2 ${
                  farmerLoc.status === 'success'
                    ? zoneStatus.inside
                      ? 'bg-red-50 text-red-900 border-red-200'
                      : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : 'bg-amber-50 text-amber-900 border-amber-200'
                }`}
              >
                <Navigation className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold uppercase tracking-wider text-[10px] opacity-75">Farmer Location Assessment</p>
                  <p className="mt-0.5">{zoneStatus.text}</p>
                </div>
              </div>

              {/* Key Metadata grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  ['Affected Village/Sector', selectedZone.village],
                  ['Risk Radius', `${selectedZone.radiusKm} km`],
                  ['Active Outbreak Cases', `${selectedZone.casesCount} reported`],
                  ['Last Updated', selectedZone.updatedAt],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-white p-2.5 border border-slate-200">
                    <span className="text-slate-500 text-[10px] uppercase font-medium">{label}</span>
                    <p className={`font-bold mt-0.5 ${label === 'Active Outbreak Cases' ? 'text-red-700' : 'text-slate-800'}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Advisory note */}
              <div className="rounded-xl bg-white p-3 border border-slate-200 text-xs">
                <p className="font-bold text-slate-800 mb-1">Preventive Biosecurity Advisory:</p>
                <p className="text-slate-600 text-xs leading-relaxed">{selectedZone.advisory}</p>
              </div>

              {/* Active zones selector list */}
              <div className="space-y-1 pt-2 border-t border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">All Active Risk Zones ({filteredZones.length})</p>
                <div className="max-h-36 overflow-y-auto space-y-1">
                  {filteredZones.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => {
                        setSelectedZone(zone);
                        if (mapInstanceRef.current) {
                          mapInstanceRef.current.flyTo([zone.latitude, zone.longitude], 13);
                        }
                      }}
                      className={`w-full text-left rounded-lg px-2.5 py-1.5 text-xs transition-colors flex items-center justify-between ${
                        selectedZone?.id === zone.id ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">
                        <span
                          className="inline-block h-2 w-2 rounded-full mr-2 align-middle"
                          style={{ background: getRiskColor(zone.riskLevel).center }}
                        />
                        {zone.disease} ({zone.village})
                      </span>
                      <span className="text-[10px] text-slate-400 flex-shrink-0 ml-1">{zone.riskLevel}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              Click a risk zone on the map to inspect biosecurity details.
            </div>
          )}

          {/* Biosecurity Privacy Note */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-900 flex items-start gap-2">
            <Info className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Privacy Protection:</strong> Disease alerts are aggregated at the village/cluster level. Farmer personal identities and exact farm coordinates are confidential.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
