import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { stations, coords } from "../data/network";
import { MODE_LABEL } from "../data/fare";

const MODE_COLOR = {
  metro: "#2563eb", bus: "#16a34a", train: "#0891b2",
  car: "#f59e0b", plane: "#db2777", walk: "#7c3aed",
};

export default function RouteMap({ route }) {
  const firstLeg = route.legs[0];
  const lastLeg = route.legs[route.legs.length - 1];
  const startId = firstLeg.stops[0];
  const endId = lastLeg.stops[lastLeg.stops.length - 1];

  const stopIds = [...new Set(route.legs.flatMap((l) => l.stops))];
  const bounds = stopIds.map((id) => coords[id]);

  return (
    <div className="card map-card">
      <MapContainer
        key={route.id}          
        bounds={bounds}
        boundsOptions={{ padding: [30, 30] }}
        scrollWheelZoom={false}
        className="route-map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {route.legs.map((leg, i) => (
          <Polyline
            key={i}
            positions={leg.stops.map((id) => coords[id])}
            pathOptions={{
              color: MODE_COLOR[leg.mode],
              weight: 5,
              dashArray: leg.mode === "walk" ? "6 8" : undefined,
            }}
          />
        ))}

        {stopIds.map((id) => {
          const isEnd = id === startId || id === endId;
          return (
            <CircleMarker
              key={id}
              center={coords[id]}
              radius={isEnd ? 9 : 5}
              pathOptions={{
                color: "#fff", weight: 2, fillOpacity: 1,
                fillColor: id === startId ? "#16a34a" : id === endId ? "#e11d48" : "#2563eb",
              }}
            >
              <Tooltip permanent={isEnd} direction="top">{stations[id]}</Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <div className="legend">
        {[...new Set(route.legs.map((l) => l.mode))].map((m) => (
          <span key={m}><i style={{ background: MODE_COLOR[m] }} /> {MODE_LABEL[m]}</span>
        ))}
      </div>
    </div>
  );
}