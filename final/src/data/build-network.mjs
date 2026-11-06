// Usage: node scripts/build-network.mjs metro=./gtfs/dmrc bus=./gtfs/dtc
// Put "metro" first so interchange stations keep their metro names.
import fs from "fs";
import path from "path";
import readline from "readline";

const FARE_PER_KM = { metro: 1.8, bus: 1.2 };            // ESTIMATE, see notes
const RELIABILITY = { metro: 0.97, bus: 0.8, walk: 0.99 }; // assumption, no live data
const TRANSFER_WALK_M = 250;

const args = Object.fromEntries(process.argv.slice(2).map((a) => a.split("=")));

function parseLine(line) {
  const out = []; let cur = ""; let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; }
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ",") { out.push(cur); cur = ""; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

async function* rows(file) {
  const rl = readline.createInterface({
    input: fs.createReadStream(file, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });
  let head = null;
  for await (const raw of rl) {
    if (!raw.trim()) continue;
    const cells = parseLine(raw.replace(/^\uFEFF/, ""));
    if (!head) { head = cells.map((h) => h.trim()); continue; }
    const o = {};
    head.forEach((h, i) => (o[h] = cells[i]));
    yield o;
  }
}

const clean = (n) => n.replace(/\(.*?\)/g, "").trim();
const slug = (n) => clean(n).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
const title = (n) => clean(n).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const toMin = (t) => { const [h, m, s] = (t || "0:0:0").split(":").map(Number); return h * 60 + m + (s || 0) / 60; };

function km(a, b) {
  const R = 6371, rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

const stations = {};
const edgeMap = new Map();

async function loadMode(mode, dir) {
  const stops = {}, routes = {}, tripRoute = {};
  for await (const r of rows(path.join(dir, "stops.txt"))) stops[r.stop_id] = r;
  for await (const r of rows(path.join(dir, "routes.txt")))
    routes[r.route_id] = r.route_long_name || r.route_short_name || r.route_id;
  for await (const r of rows(path.join(dir, "trips.txt"))) tripRoute[r.trip_id] = r.route_id;

  const nodeId = (s) => (mode === "metro" ? slug(s.stop_name) : `${mode}_${s.stop_id}`);
  const seen = new Set();
  let cur = null, list = [];

  const flush = () => {
    if (cur && list.length > 1) {
      list.sort((a, b) => a.seq - b.seq);
      const line = routes[tripRoute[cur]] || "Line";
      const sig = line + "|" + list.map((s) => s.id).join(">");
      if (!seen.has(sig)) {
        seen.add(sig);
        for (let i = 0; i < list.length - 1; i++) {
          const a = list[i], b = list[i + 1];
          if (a.id === b.id) continue;
          const key = `${mode}|${line}|${a.id}|${b.id}`;
          const time = Math.max(1, Math.round(b.arr - a.dep));
          const prev = edgeMap.get(key);
          if (!prev || time < prev.time) edgeMap.set(key, { from: a.id, to: b.id, mode, line, time });
        }
      }
    }
    list = [];
  };

  for await (const r of rows(path.join(dir, "stop_times.txt"))) {
    if (r.trip_id !== cur) { flush(); cur = r.trip_id; }
    const stop = stops[r.stop_id];
    if (!stop) continue;
    const id = nodeId(stop);
    stations[id] ??= { name: title(stop.stop_name), lat: +stop.stop_lat, lng: +stop.stop_lon, mode };
    list.push({ id, seq: +r.stop_sequence, arr: toMin(r.arrival_time), dep: toMin(r.departure_time) });
  }
  flush();
  console.log(`${mode}: done`);
}

for (const [mode, dir] of Object.entries(args)) await loadMode(mode, dir);

const edges = [...edgeMap.values()].map((e) => {
  const d = km(stations[e.from], stations[e.to]);
  return { ...e, fare: Math.round(d * FARE_PER_KM[e.mode] * 10) / 10, walk: 0, reliability: RELIABILITY[e.mode] };
});

// walking transfers between different modes (e.g. metro station <-> nearby bus stop)
const ids = Object.keys(stations);
for (let i = 0; i < ids.length; i++) {
  for (let j = i + 1; j < ids.length; j++) {
    const A = stations[ids[i]], B = stations[ids[j]];
    if (A.mode === B.mode || Math.abs(A.lat - B.lat) > 0.003) continue;
    const m = km(A, B) * 1000;
    if (m > TRANSFER_WALK_M) continue;
    const w = (from, to) => ({
      from, to, mode: "walk", line: "Walk",
      time: Math.max(1, Math.round(m / 80)), fare: 0, walk: Math.round(m), reliability: RELIABILITY.walk,
    });
    edges.push(w(ids[i], ids[j]), w(ids[j], ids[i]));
  }
}

fs.mkdirSync("public", { recursive: true });
fs.writeFileSync("public/network.json", JSON.stringify({ stations, edges, builtAt: new Date().toISOString() }));
console.log(`Wrote public/network.json: ${ids.length} stations, ${edges.length} edges`);