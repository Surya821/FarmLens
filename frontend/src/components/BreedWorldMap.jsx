import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Fix default marker icons (Leaflet bug in React)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// breeds with coordinates
const breeds = [
  // FOREIGN BREEDS
  { name: "Ayrshire", origin: "Scotland, United Kingdom", lat: 56.4907, lng: -4.2026 },
  { name: "Brown Swiss", origin: "Switzerland", lat: 46.8182, lng: 8.2275 },
  { name: "Holstein Friesian", origin: "Netherlands and Germany", lat: 52.3, lng: 7.0 },
  { name: "Jersey", origin: "Jersey, Channel Islands", lat: 49.2135, lng: -2.1312 },
  { name: "Red Dane", origin: "Denmark", lat: 56.2639, lng: 9.5018 },

  // INDIAN BREEDS
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

export default function WorldBreedMap() {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      style={{ height: "50vh", width: "100%" }}
      worldCopyJump={true}
    >
      {/* High-quality map (no API key needed) */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Breed markers */}
      {breeds.map((b, i) => (
        <Marker key={b.name} position={[b.lat, b.lng]}>
        <Popup>
          <h2 className="font-bold text-lg">{b.name}</h2>
          <p className="text-sm text-gray-700">{b.origin}</p>
        </Popup>
      </Marker>
      ))}
    </MapContainer>
  );
}
