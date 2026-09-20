import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import { coopIcon, jobIcon } from '../lib/leafletSetup';
import { useTranslation } from '../lib/i18n/LanguageContext';

export function CoverageMap({ cooperatives = [], jobs = [], center = [25.5941, 85.1376], zoom = 12 }) {
  const { t } = useTranslation();
  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '380px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {cooperatives.map((c) => (
          <div key={c.id}>
            <Circle
              center={[c.lat, c.lng]}
              radius={c.radiusKm * 1000}
              pathOptions={{ color: '#33456B', fillColor: '#33456B', fillOpacity: 0.07, weight: 1 }}
            />
            <Marker position={[c.lat, c.lng]} icon={coopIcon}>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-muted">{c.workers} workers · {c.radiusKm}km service radius</div>
                  <div className="text-muted">Rating {c.rating} ★</div>
                </div>
              </Popup>
            </Marker>
          </div>
        ))}

        {jobs.map((j) => (
          <Marker key={j.id} position={[j.lat, j.lng]} icon={jobIcon}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{j.client}</div>
                <div className="text-muted">{j.role} · {j.status}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="flex items-center gap-5 border-t border-line bg-surface px-4 py-2.5 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-full border border-white bg-indigo" /> {t('mapLegendCoop')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-sm border border-white bg-marigold" /> {t('mapLegendJob')}
        </span>
      </div>
    </div>
  );
}
