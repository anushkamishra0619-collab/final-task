const DEMO_STATIONS = {
  vaishali: { name: "Vaishali", lat: 28.645, lng: 77.341 },
  kaushambi: { name: "Kaushambi", lat: 28.641, lng: 77.323 },
  indirapuram: { name: "Indirapuram", lat: 28.640, lng: 77.369 },
  anand_vihar: { name: "Anand Vihar", lat: 28.647, lng: 77.316 },
  mayur_vihar: { name: "Mayur Vihar", lat: 28.604, lng: 77.294 },
  akshardham: { name: "Akshardham", lat: 28.613, lng: 77.277 },
  rajiv_chowk: { name: "Rajiv Chowk", lat: 28.633, lng: 77.220 },
  new_delhi: { name: "New Delhi", lat: 28.643, lng: 77.220 },
  dwarka_mor: { name: "Dwarka Mor", lat: 28.619, lng: 77.033 },
  dwarka_sec21: { name: "Dwarka Sector 21", lat: 28.552, lng: 77.058 },
  delhi_airport: { name: "Delhi Airport (T3)", lat: 28.556, lng: 77.100 },
};

const demoEdges = [
  { from: "vaishali", to: "anand_vihar", mode: "metro", line: "Blue Line", time: 8, distance: 4, reliability: 0.95 },
  { from: "anand_vihar", to: "akshardham", mode: "metro", line: "Blue Line", time: 12, distance: 9, reliability: 0.95 },
  { from: "mayur_vihar", to: "akshardham", mode: "metro", line: "Blue Line", time: 6, distance: 4, reliability: 0.95 },
  { from: "akshardham", to: "rajiv_chowk", mode: "metro", line: "Blue Line", time: 14, distance: 13, reliability: 0.95 },
  { from: "rajiv_chowk", to: "dwarka_mor", mode: "metro", line: "Blue Line", time: 28, distance: 20, reliability: 0.95 },
  { from: "dwarka_mor", to: "dwarka_sec21", mode: "metro", line: "Blue Line", time: 10, distance: 6, reliability: 0.95 },
  { from: "rajiv_chowk", to: "new_delhi", mode: "metro", line: "Yellow Line", time: 4, distance: 1.5, reliability: 0.96 },
  { from: "new_delhi", to: "delhi_airport", mode: "metro", line: "Airport Express", time: 19, distance: 18, reliability: 0.97 },
  { from: "anand_vihar", to: "new_delhi", mode: "train", line: "Local Train", time: 20, distance: 7, reliability: 0.8 },
  { from: "indirapuram", to: "vaishali", mode: "bus", line: "Bus 55", time: 10, distance: 4, reliability: 0.75 },
  { from: "indirapuram", to: "anand_vihar", mode: "bus", line: "Bus 77", time: 18, distance: 9, reliability: 0.65 },
  { from: "kaushambi", to: "anand_vihar", mode: "bus", line: "Bus 101", time: 12, distance: 3, reliability: 0.7 },
  { from: "anand_vihar", to: "rajiv_chowk", mode: "bus", line: "Bus 440", time: 35, distance: 12, reliability: 0.6 },
  { from: "mayur_vihar", to: "anand_vihar", mode: "bus", line: "Bus 12", time: 22, distance: 8, reliability: 0.7 },
  { from: "dwarka_sec21", to: "delhi_airport", mode: "bus", line: "Bus 748", time: 30, distance: 10, reliability: 0.65 },
  { from: "vaishali", to: "kaushambi", mode: "walk", line: "Walk", time: 15, distance: 1.2, reliability: 1 },
  { from: "rajiv_chowk", to: "new_delhi", mode: "walk", line: "Walk", time: 12, distance: 0.9, reliability: 1 },
];

export const stations = Object.fromEntries(
  Object.entries(DEMO_STATIONS).map(([id, station]) => [id, station.name])
);
export const coords = Object.fromEntries(
  Object.entries(DEMO_STATIONS).map(([id, { lat, lng }]) => [id, { lat, lng }])
);
export const edges = [...demoEdges];

let loading;
export function loadNetwork() {
  if (!loading) {
    loading = (async () => {
      let response;
      try {
        response = await fetch("/network.json");
      } catch (error) {
        console.warn("Could not load network.json; using the bundled demo network.", error);
        return;
      }

      if (response.status === 404) return;
      if (!response.ok) throw new Error(`Could not load network.json (HTTP ${response.status}).`);
      if (response.headers.get("content-type")?.includes("text/html")) {
        console.warn("network.json is missing; using the bundled demo network.");
        return;
      }

      const data = await response.json();
      if (
        !data?.stations || typeof data.stations !== "object" ||
        !Array.isArray(data.edges) || !Object.keys(data.stations).length ||
        !data.edges.length
      ) {
        throw new Error("network.json must contain stations and edges.");
      }

      for (const id of Object.keys(stations)) delete stations[id];
      for (const id of Object.keys(coords)) delete coords[id];
      edges.length = 0;

      for (const [id, station] of Object.entries(data.stations)) {
        if (!Number.isFinite(station.lat) || !Number.isFinite(station.lng) || !station.name) {
          throw new Error(`network.json contains invalid station data for "${id}".`);
        }
        stations[id] = station.name;
        coords[id] = { lat: station.lat, lng: station.lng };
      }
      for (const edge of data.edges) edges.push(edge);
    })();
  }
  return loading;
}

export const findStationId = (text) =>
  Object.keys(stations).find((id) => stations[id].toLowerCase() === text.trim().toLowerCase()) || null;
