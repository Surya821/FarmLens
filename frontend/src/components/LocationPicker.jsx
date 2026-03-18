import { useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Loader2 } from 'lucide-react';

// Custom red pin icon
delete L.Icon.Default.prototype._getIconUrl;
const pinIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Listens for map clicks and reports coordinates
function ClickHandler({ onPlace }) {
  useMapEvents({
    click(e) {
      onPlace(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

// Flies the map to a given position (used imperatively via ref)
function FlyController({ flyRef }) {
  const map = useMap();
  flyRef.current = (lat, lng, zoom = 8) => {
    map.flyTo([lat, lng], zoom, { animate: true, duration: 1.2 });
  };
  return null;
}

export default function LocationPicker({ lat, lng, onChange }) {
  const [position, setPosition] = useState(
    lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null
  );
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const flyRef = useRef(null);

  const handlePlace = useCallback((newLat, newLng) => {
    const rounded = { lat: parseFloat(newLat.toFixed(6)), lng: parseFloat(newLng.toFixed(6)) };
    setPosition(rounded);
    onChange(rounded.lat, rounded.lng);
  }, [onChange]);

  const searchPlace = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setResults([]);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      setResults(data);
      setShowResults(true);
    } catch (err) {
      console.error('Geocoding failed:', err);
    } finally {
      setSearching(false);
    }
  };

  const selectResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    handlePlace(lat, lng);
    setShowResults(false);
    setQuery(result.display_name.split(',').slice(0, 2).join(','));
    if (flyRef.current) flyRef.current(lat, lng, 8);
  };

  return (
    <div className="space-y-4">
      {/* Search Box */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-4 flex items-center text-[var(--muted)] pointer-events-none">
              {searching ? <Loader2 size={18} className="animate-spin text-green-500" /> : <Search size={18} />}
            </div>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchPlace()}
              placeholder="Search for a place (e.g. Gujarat India)..."
              className="w-full pl-11 pr-4 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold text-sm"
            />
          </div>
          <button
            type="button"
            onClick={searchPlace}
            disabled={searching}
            className="px-5 py-4 bg-green-500 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 text-sm flex-shrink-0"
          >
            Search
          </button>
        </div>

        {/* Dropdown Results */}
        {showResults && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 z-[500] bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
            {results.map((result, i) => (
              <button
                key={i}
                type="button"
                onClick={() => selectResult(result)}
                className="w-full text-left px-5 py-3 text-sm font-medium hover:bg-green-500/10 hover:text-green-500 transition-colors border-b border-[var(--border)] last:border-0"
              >
                <span className="font-black text-[var(--text)]">{result.display_name.split(',')[0]}</span>
                <span className="text-[var(--muted)] ml-2 text-xs">{result.display_name.split(',').slice(1, 3).join(',')}</span>
              </button>
            ))}
          </div>
        )}

        {showResults && results.length === 0 && !searching && (
          <div className="absolute top-full left-0 right-0 mt-2 z-[500] bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl px-5 py-4 text-sm font-medium text-[var(--muted)]">
            No places found for "<span className="font-black text-[var(--text)]">{query}</span>"
          </div>
        )}
      </div>

      {/* Hint */}
      <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
        <div className="text-blue-500 text-lg mt-0.5">📍</div>
        <p className="text-sm font-medium text-[var(--muted)]">
          <span className="font-black text-blue-500">Search</span> a place above to fly there, then{' '}
          <span className="font-black text-blue-500">click</span> to drop a pin or{' '}
          <span className="font-black text-blue-500">drag</span> to fine-tune. Lat/Lng update automatically.
        </p>
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border-2 border-[var(--border)] shadow-lg relative z-0" style={{ height: '320px' }}>
        <MapContainer
          center={position ? [position.lat, position.lng] : [20, 0]}
          zoom={position ? 5 : 2}
          style={{ height: '100%', width: '100%' }}
          worldCopyJump
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <ClickHandler onPlace={handlePlace} />
          <FlyController flyRef={flyRef} />
          {position && (
            <Marker
              position={[position.lat, position.lng]}
              icon={pinIcon}
              draggable={true}
              eventHandlers={{
                dragend(e) {
                  const { lat, lng } = e.target.getLatLng();
                  handlePlace(lat, lng);
                }
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* Coordinate readout */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-5 py-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-1">Latitude</div>
          <div className="font-black text-lg text-green-500 tabular-nums">
            {position ? position.lat : <span className="text-[var(--muted)] text-sm font-medium">Not set</span>}
          </div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-5 py-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-1">Longitude</div>
          <div className="font-black text-lg text-green-500 tabular-nums">
            {position ? position.lng : <span className="text-[var(--muted)] text-sm font-medium">Not set</span>}
          </div>
        </div>
      </div>

      {position && (
        <button
          type="button"
          onClick={() => { setPosition(null); onChange(null, null); }}
          className="text-xs font-black text-red-500 hover:underline"
        >
          ✕ Clear pin
        </button>
      )}
    </div>
  );
}

