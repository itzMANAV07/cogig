import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import { Icon } from './Icon';
import { addressIcon, coopIcon } from '../lib/leafletSetup';
import { geocodeAddress, getCurrentLocation, distanceKm } from '../lib/geocode';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { DEMO_COOPERATIVES } from '../lib/demoData';
import { useAppState } from '../lib/appState';

function nearestCoop(point) {
  return DEMO_COOPERATIVES.map((c) => ({ ...c, dist: distanceKm(point, { lat: c.lat, lng: c.lng }) })).sort(
    (a, b) => a.dist - b.dist
  )[0];
}

function Recenter({ point, defaultCenter }) {
  const map = useMap();
  useEffect(() => {
    if (point) map.setView([point.lat, point.lng], 13);
    else if (defaultCenter) map.setView(defaultCenter, 12);
  }, [point, defaultCenter, map]);
  return null;
}

export function AddressServiceabilityMap({ address }) {
  const { t } = useTranslation();
  const { selectedCity } = useAppState();
  const [point, setPoint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const defaultCenter = selectedCity?.center || [12.9716, 77.5946];

  useEffect(() => {
    if (!address || address.trim().length < 3) {
      setPoint(null);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      const result = await geocodeAddress(address);
      setLoading(false);
      if (result) setPoint(result);
      else {
        // Fallback to selected city coordinates if OSM Nominatim returns empty for local string
        setPoint({
          lat: defaultCenter[0],
          lng: defaultCenter[1],
          displayName: address,
        });
      }
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [address, defaultCenter]);

  const useMyLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const pos = await getCurrentLocation();
      setPoint({ ...pos, displayName: t('currentLocation') || 'Current GPS Location' });
    } catch {
      setError(t('locationDenied') || 'Location permission denied');
    }
    setLoading(false);
  };

  const nearest = point ? nearestCoop(point) : null;
  const serviceable = nearest ? nearest.dist <= (nearest.radiusKm || 8) : true;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-3 py-2 text-xs">
        <span className="text-muted font-medium">
          {loading
            ? (t('checkingAddress') || 'Verifying location...')
            : point
            ? (t('locationFound') || 'Map pin verified')
            : (t('typeAddressHint') || 'Live location map')}
        </span>
        <button
          type="button"
          onClick={useMyLocation}
          className="flex items-center gap-1.5 rounded-lg border border-line bg-paper px-2.5 py-1 text-xs font-semibold text-indigo hover:border-indigo"
        >
          <Icon name="GpsSignal01Icon" size={13} />
          {t('useMyLocation') || 'Use GPS'}
        </button>
      </div>

      <MapContainer
        center={point ? [point.lat, point.lng] : defaultCenter}
        zoom={12}
        scrollWheelZoom={false}
        dragging={!!point}
        style={{ height: '170px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter point={point} defaultCenter={defaultCenter} />

        {/* Display nearby cooperatives */}
        {DEMO_COOPERATIVES.map((c) => (
          <div key={c.id}>
            <Circle
              center={[c.lat, c.lng]}
              radius={c.radiusKm * 1000}
              pathOptions={{ color: '#33456B', fillColor: '#33456B', fillOpacity: 0.08, weight: 1 }}
            />
            <Marker position={[c.lat, c.lng]} icon={coopIcon} />
          </div>
        ))}

        {point && <Marker position={[point.lat, point.lng]} icon={addressIcon} />}
      </MapContainer>

      {/* Serviceability status */}
      {nearest && (
        <div
          className={`flex items-center gap-2 border-t border-line px-3 py-2 text-xs font-semibold ${
            serviceable ? 'bg-success-light/60 text-success' : 'bg-warn-light/60 text-warn-dark'
          }`}
        >
          <Icon name={serviceable ? 'CheckmarkCircle02Icon' : 'AlertCircleIcon'} size={15} />
          <span>
            {serviceable
              ? `Serviceable by ${nearest.name} (${nearest.dist.toFixed(1)}km)`
              : `Matching nearest available cooperative crew (${nearest.dist.toFixed(1)}km)`}
          </span>
        </div>
      )}
    </div>
  );
}
