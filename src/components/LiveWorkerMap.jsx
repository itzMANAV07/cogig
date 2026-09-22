import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { L } from '../lib/leafletSetup';
import { useAppState } from '../lib/appState';
import { Icon } from './Icon';

// Custom worker map markers with distinct trade colors
const createWorkerPin = (color, initial) => {
  return new L.DivIcon({
    html: `
      <div style="position:relative;width:34px;height:34px;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;inset:0;background:${color}33;border-radius:50%;animation:ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position:relative;width:28px;height:28px;background:${color};border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.35);">
          ${initial}
        </div>
      </div>
    `,
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
};

const pinIcons = {
  plumber: createWorkerPin('#3b82f6', 'PL'),     // Blue
  electrician: createWorkerPin('#f59e0b', 'EL'), // Amber
  painter: createWorkerPin('#10b981', 'PT'),     // Emerald
  supervisor: createWorkerPin('#8b5cf6', 'SV'),  // Purple
  ac: createWorkerPin('#06b6d4', 'AC'),          // Cyan
};

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

export function LiveWorkerMap() {
  const { selectedCity, workersList } = useAppState();
  const center = selectedCity?.center || [12.9716, 77.5946];

  // Dynamic live workers on map anchored around active city center
  const mapWorkers = [
    {
      id: 1,
      name: 'Manjunath Gowda',
      trade: 'Plumber & AC Tech',
      type: 'plumber',
      lat: center[0] + 0.012,
      lng: center[1] + 0.008,
      status: 'Available · 1.2km away',
      rating: 4.9,
      phone: '98765 11223',
    },
    {
      id: 2,
      name: 'Ramesh Kumar',
      trade: 'Painter',
      type: 'painter',
      lat: center[0] - 0.009,
      lng: center[1] + 0.014,
      status: 'On Job · Society Block B',
      rating: 4.8,
      phone: '98765 43210',
    },
    {
      id: 3,
      name: 'Suresh Yadav',
      trade: 'Electrician',
      type: 'electrician',
      lat: center[0] + 0.018,
      lng: center[1] - 0.011,
      status: 'Available · 2.4km away',
      rating: 4.7,
      phone: '98765 12345',
    },
    {
      id: 4,
      name: 'Anita Devi',
      trade: 'Lead Supervisor',
      type: 'supervisor',
      lat: center[0] - 0.015,
      lng: center[1] - 0.007,
      status: 'Available · Hub Central',
      rating: 4.9,
      phone: '98765 67890',
    },
  ];

  return (
    <div className="relative rounded-2xl overflow-hidden border border-line bg-paper shadow-sm">
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-white shadow-md">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
        </span>
        <span className="text-xs font-bold">Live GPS Telemetry</span>
        <span className="text-[10px] text-slate-400 border-l border-slate-700 pl-2">
          {selectedCity?.name?.split(',')[0] || 'Bengaluru'} Hub
        </span>
      </div>

      {/* Trade Color Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[400] hidden sm:flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-white text-[11px] shadow-md">
        <span className="flex items-center gap-1">
          <span className="size-2.5 rounded-full bg-blue-500" /> Plumber
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2.5 rounded-full bg-amber-500" /> Electrician
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2.5 rounded-full bg-emerald-500" /> Painter
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2.5 rounded-full bg-purple-500" /> Supervisor
        </span>
      </div>

      {/* Leaflet Map */}
      <div className="h-80 w-full">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapRecenter center={center} />

          {mapWorkers.map((w) => (
            <Marker
              key={w.id}
              position={[w.lat, w.lng]}
              icon={pinIcons[w.type] || pinIcons.plumber}
            >
              <Popup className="custom-popup">
                <div className="p-1 space-y-1.5 text-xs min-w-[170px]">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <span className="font-extrabold text-slate-900 text-sm">{w.name}</span>
                    <span className="text-amber-500 font-bold">★ {w.rating}</span>
                  </div>
                  <div className="text-slate-600 font-medium">
                    <span className="text-[11px] block">{w.trade}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold block">{w.status}</span>
                  </div>
                  <div className="pt-1 text-[10px] text-slate-400">
                    Phone: <span className="font-mono text-slate-700">{w.phone}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
