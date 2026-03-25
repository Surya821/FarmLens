import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { translations } from "../data/translations";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom blue icon for cloud-added breeds
const cloudIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Hardcoded breeds with coordinates
const staticBreeds = [
  { name: "Ayrshire", origin: "Scotland, United Kingdom", lat: 56.4907, lng: -4.2026 },
  { name: "Brown Swiss", origin: "Switzerland", lat: 46.8182, lng: 8.2275 },
  { name: "Holstein Friesian", origin: "Netherlands and Germany", lat: 52.3, lng: 7.0 },
  { name: "Jersey", origin: "Jersey, Channel Islands", lat: 49.2135, lng: -2.1312 },
  { name: "Red Dane", origin: "Denmark", lat: 56.2639, lng: 9.5018 },
  { name: "Amritmahal", origin: "Karnataka, India", lat: 15.3173, lng: 75.7139 },
  { name: "Bachaur", origin: "Bihar, India", lat: 25.0961, lng: 85.3131 },
  { name: "Bargur", origin: "Tamil Nadu, India", lat: 11.3167, lng: 77.3333 },
  { name: "Binjharpuri", origin: "Odisha, India", lat: 20.9517, lng: 85.0985 },
  { name: "Brahman", origin: "Maintained on organized farms", lat: 21.0, lng: 77.0 },
  { name: "Deoni", origin: "Maharashtra and Karnataka, India", lat: 17.0, lng: 76.0 },
  { name: "Dangi", origin: "Maharashtra, India", lat: 19.7515, lng: 75.7139 },
  { name: "Gaolao", origin: "Maharashtra and Madhya Pradesh, India", lat: 21.0, lng: 78.0 },
  { name: "Gangatiri", origin: "Uttar Pradesh and Bihar, India", lat: 25.5, lng: 83.5 },
  { name: "Garole", origin: "West Bengal, India", lat: 22.9868, lng: 87.8550 },
  { name: "Gir", origin: "Gujarat, India", lat: 22.2587, lng: 71.1924 },
  { name: "Ghumusari", origin: "Odisha, India", lat: 20.9517, lng: 85.0985 },
  { name: "Hallikar", origin: "Karnataka, India", lat: 15.3173, lng: 75.7139 },
  { name: "Hariana", origin: "Haryana, Uttar Pradesh, and Rajasthan, India", lat: 27.5, lng: 76.5 },
  { name: "Himachali Pahari", origin: "Himachal Pradesh, India", lat: 31.1048, lng: 77.1734 },
  { name: "Jaffarabadi", origin: "Gujarat, India", lat: 22.2587, lng: 71.1924 },
  { name: "Kangayam", origin: "Tamil Nadu, India", lat: 10.9940, lng: 77.2780 },
  { name: "Kenkatha", origin: "Uttar Pradesh and Madhya Pradesh, India", lat: 25.0, lng: 80.0 },
  { name: "Kherigarh", origin: "Uttar Pradesh, India", lat: 27.0, lng: 81.0 },
  { name: "Khariar", origin: "Odisha, India", lat: 20.0, lng: 82.5 },
  { name: "Kosali", origin: "Chhattisgarh, India", lat: 21.2787, lng: 81.8661 },
  { name: "Malnad Gidda", origin: "Karnataka, India", lat: 14.0, lng: 75.0 },
  { name: "Mewati", origin: "Haryana and Rajasthan, India", lat: 28.0, lng: 76.0 },
  { name: "Nagori", origin: "Rajasthan, India", lat: 27.0238, lng: 74.2179 },
  { name: "Ongole", origin: "Andhra Pradesh, India", lat: 15.5057, lng: 80.0499 },
  { name: "Ponwar", origin: "Uttar Pradesh, India", lat: 27.0, lng: 82.0 },
  { name: "Pulikulam", origin: "Tamil Nadu, India", lat: 10.0, lng: 77.0 },
  { name: "Red Kandhari", origin: "Maharashtra, India", lat: 19.5, lng: 76.5 },
  { name: "Sahiwal", origin: "Punjab Region, India", lat: 30.0, lng: 72.0 },
  { name: "Siri", origin: "Nagaland, India", lat: 26.1584, lng: 94.5624 },
  { name: "Tharparkar", origin: "Rajasthan, India", lat: 25.8, lng: 70.2 },
  { name: "Uchal", origin: "Maharashtra, India", lat: 19.0, lng: 75.0 },
  { name: "Umblachery", origin: "Tamil Nadu, India", lat: 10.4, lng: 79.4 },
  { name: "Vechur", origin: "Kerala, India", lat: 9.5, lng: 76.3 },
  { name: "Shweta Kapila", origin: "Goa, India", lat: 15.2993, lng: 74.1240 }
];

export default function WorldBreedMap({ isDark, language }) {
  const t = translations[language];
  const [cloudBreeds, setCloudBreeds] = useState([]);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    fetch(`${API_BASE}/api/breeds`)
      .then(res => res.json())
      .then(data => {
        // Only keep DB breeds that have valid coordinates
        const withCoords = data.filter(b => b.lat != null && b.lng != null);
        setCloudBreeds(withCoords);
      })
      .catch(err => console.error('Failed to load cloud breeds for map:', err));
  }, []);

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      style={{ height: "50vh", width: "100%" }}
      worldCopyJump={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Hardcoded breed markers */}
      {staticBreeds.map((b) => (
        <Marker key={`static-${b.name}`} position={[b.lat, b.lng]}>
          <Popup>
            <h2 className="font-bold text-lg text-gray-900">{b.name}</h2>
            <p className="text-sm text-gray-700">
              <strong>{t.origin}:</strong> {b.origin}
            </p>
          </Popup>
        </Marker>
      ))}

      {/* Cloud (DB) breed markers in blue */}
      {cloudBreeds.map((b) => (
        <Marker key={`cloud-${b._id}`} position={[b.lat, b.lng]} icon={cloudIcon}>
          <Popup>
            <div className="min-w-[160px]">
              {b.image && <img src={b.image} alt={b.name} className="w-full h-24 object-cover rounded-lg mb-2" />}
              <h2 className="font-bold text-base text-gray-900">{b.name}</h2>
              <p className="text-xs text-gray-700 mb-1">
                <strong>{t.origin}:</strong> {b.origin?.en || ''}
              </p>
              {/* <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded-full tracking-widest">Cloud Added</span> */}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

