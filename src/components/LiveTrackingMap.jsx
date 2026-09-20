import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { jobIcon, workerLiveIcon } from '../lib/leafletSetup';
import { useTranslation } from '../lib/i18n/LanguageContext';

// Demo positions near the job site — a real version would poll the worker's
// live GPS coordinate from the WhatsApp bot or a driver app. Here the worker
// marker animates part-way along the route on mount to suggest "en route"
// motion without needing a real location feed.
const JOB_SITE = { lat: 25.5941, lng: 85.1376 };
const WORKER_START = { lat: 25.612, lng: 85.098 };

export function LiveTrackingMap({ etaMinutes = 20 }) {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0.15);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => Math.min(p + 0.08, 0.85));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const workerPos = {
    lat: WORKER_START.lat + (JOB_SITE.lat - WORKER_START.lat) * progress,
    lng: WORKER_START.lng + (JOB_SITE.lng - WORKER_START.lng) * progress,
  };

  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <MapContainer
        center={[
          (JOB_SITE.lat + WORKER_START.lat) / 2,
          (JOB_SITE.lng + WORKER_START.lng) / 2,
        ]}
        zoom={12}
        scrollWheelZoom={false}
        dragging={false}
        style={{ height: '180px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline
          positions={[
            [WORKER_START.lat, WORKER_START.lng],
            [JOB_SITE.lat, JOB_SITE.lng],
          ]}
          pathOptions={{ color: '#B4483A', weight: 2, dashArray: '6 6' }}
        />
        <Marker position={[JOB_SITE.lat, JOB_SITE.lng]} icon={jobIcon} />
        <Marker position={[workerPos.lat, workerPos.lng]} icon={workerLiveIcon} />
      </MapContainer>
      <div className="flex items-center justify-between border-t border-line bg-surface px-4 py-2 text-xs text-muted">
        <span>{t('workerEnRoute')}</span>
        <span className="tabular font-medium text-ink">
          {Math.max(2, Math.round(etaMinutes * (1 - progress)))} min
        </span>
      </div>
    </div>
  );
}
