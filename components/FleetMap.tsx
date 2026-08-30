"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { Plane, Crosshair } from "lucide-react";

export interface FleetAircraft {
  id: string;
  registration: string;
  aircraftType: string;
  aircraftState: string;
  fleetStatus: string;
  currentPilot: string | null;
  lastUpdate: string | null;
  location: { lat: number | null; lon: number | null } | null;
  flightPlan: { from: string | null; to: string | null } | null;
  callsign: string | null;
  flightPlanWaypoints: { lat: number; lon: number }[];
}

const STATE_COLORS: Record<string, string> = {
  "In Flight": "#10B981",
  "On Ground": "#3B82F6",
  Stopped: "#8B5CF6",
};

function FitBounds({ aircraft }: { aircraft: FleetAircraft[] }) {
  const map = useMap();
  const hasFitted = useRef(false);

  const positions = useMemo(() => {
    const bounds: L.LatLngExpression[] = [];
    for (const ac of aircraft) {
      if (ac.location && ac.location.lat != null && ac.location.lon != null) {
        bounds.push([ac.location.lat, ac.location.lon]);
      }
    }
    return bounds;
  }, [aircraft]);

  useEffect(() => {
    if (positions.length > 0 && !hasFitted.current) {
      setTimeout(() => {
        hasFitted.current = true;
        map.fitBounds(L.latLngBounds(positions), { padding: [40, 40], maxZoom: 12 });
      }, 100);
    }
  }, [map, positions]);

  return null;
}

function FlightPlanLine({ waypoints, color }: { waypoints: { lat: number; lon: number }[]; color: string }) {
  const map = useMap();

  useEffect(() => {
    if (!map || waypoints.length < 2) return;

    const maxPoints = 60;
    const step = Math.max(1, Math.floor(waypoints.length / maxPoints));
    const sampled = waypoints.filter((_, idx) => idx % step === 0 || idx === waypoints.length - 1);
    const latLngs = sampled.map((w) => [w.lat, w.lon] as L.LatLngExpression);

    const polyline = L.polyline(latLngs, {
      color: color || "#3B82F6",
      weight: 2,
      opacity: 0.35,
      dashArray: "8, 10",
      lineCap: "round",
      lineJoin: "round",
    });

    polyline.addTo(map);

    return () => {
      map.removeLayer(polyline);
    };
  }, [map, waypoints, color]);

  return null;
}

function CenterButton({ aircraft, onSelect }: { aircraft: FleetAircraft[]; onSelect: (id: string | null) => void }) {
  const map = useMap();

  const handleClick = () => {
    const positions: L.LatLngExpression[] = [];
    for (const ac of aircraft) {
      if (ac.location && ac.location.lat != null && ac.location.lon != null) {
        positions.push([ac.location.lat, ac.location.lon]);
      }
    }
    if (positions.length > 0) {
      map.fitBounds(L.latLngBounds(positions), { padding: [40, 40], maxZoom: 12 });
    }
    onSelect(null);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="absolute top-3 right-3 z-[1000] flex h-9 w-9 items-center justify-center rounded-lg border border-navy-600 bg-navy-800/90 text-slate-200 backdrop-blur-sm transition-colors hover:bg-navy-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/60 sm:h-10 sm:w-10"
      aria-label="Center map on aircraft"
    >
      <Crosshair className="h-4 w-4 sm:h-5 sm:w-5" />
    </button>
  );
}

function MapClickHandler({ onSelect }: { onSelect: (id: string | null) => void }) {
  const map = useMap();

  useEffect(() => {
    const handler = () => onSelect(null);
    map.on("click", handler);
    return () => {
      map.off("click", handler);
    };
  }, [map, onSelect]);

  return null;
}

function MarkerClusterLayer({ aircraft, onSelect }: { aircraft: FleetAircraft[]; onSelect: (id: string | null) => void }) {
  const map = useMap();
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!map) return;

    const cluster = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 40,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster: L.MarkerCluster) => {
        const count = cluster.getChildCount();
        let size = "small";
        let dim = 36;
        if (count > 10) {
          size = "large";
          dim = 48;
        } else if (count > 3) {
          size = "medium";
          dim = 42;
        }
        return L.divIcon({
          html: `<div style="
            width:${dim}px;
            height:${dim}px;
            border-radius:50%;
            background:#0f172a;
            color:#e2e8f0;
            border:2px solid #3B82F6;
            display:flex;
            align-items:center;
            justify-content:center;
            font-weight:700;
            font-size:${size === 'large' ? '16px' : size === 'medium' ? '14px' : '12px'};
            box-shadow:0 0 0 4px rgba(59,130,246,0.25);
          ">${count}</div>`,
          className: "marker-cluster-custom",
          iconSize: L.point(dim, dim),
        });
      },
    });

    clusterRef.current = cluster;
    map.addLayer(cluster);

    return () => {
      map.removeLayer(cluster);
      clusterRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;

    cluster.clearLayers();

    for (const ac of aircraft) {
      if (!ac.location || ac.location.lat == null || ac.location.lon == null) continue;

      const color = STATE_COLORS[ac.aircraftState] || "#3B82F6";
      const label = ac.registration || ac.callsign || "";

      const iconHtml = `
        <div style="
          width:28px;
          height:28px;
          border-radius:50%;
          background:${color};
          border:2px solid rgba(255,255,255,0.9);
          box-shadow:0 0 0 2px rgba(15,23,42,0.9), 0 0 8px ${color}66;
          display:flex;
          align-items:center;
          justify-content:center;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" style="width:14px;height:14px;">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.4-.1.9.3 1.1L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.9.5 1.4.3l.5-.2c.4-.3.6-.8.4-1.3z"/>
          </svg>
        </div>
        ${label ? `<div style="
          position:absolute;
          top:-22px;
          left:50%;
          transform:translateX(-50%);
          background:rgba(15,23,42,0.9);
          color:#e2e8f0;
          padding:2px 6px;
          border-radius:4px;
          font-size:10px;
          font-weight:600;
          white-space:nowrap;
          border:1px solid #334155;
          box-shadow:0 2px 4px rgba(0,0,0,0.3);
        ">${label}</div>` : ""}
      `;

      const icon = L.divIcon({
        html: iconHtml,
        className: "custom-fleet-marker",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16],
      });

      const marker = L.marker([ac.location.lat, ac.location.lon], { icon });

      marker.bindPopup(
        `<div style="
          background:#0f172a;
          color:#e2e8f0;
          border:1px solid #334155;
          border-radius:8px;
          padding:12px;
          min-width:220px;
          font-family:Inter,sans-serif;
        ">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;">
            <span style="font-weight:700;color:#ffffff;font-size:14px;">${ac.registration}</span>
            <span style="font-size:11px;color:#94a3b8;background:#1e293b;padding:2px 6px;border-radius:4px;">${ac.callsign || ""}</span>
          </div>
          <div style="font-size:12px;color:#cbd5e1;margin-bottom:10px;">${ac.aircraftType}</div>
          <div style="display:flex;flex-direction:column;gap:6px;font-size:12px;">
            <div style="display:flex;justify-content:space-between;">
              <span style="color:#94a3b8;">State</span>
              <span style="font-weight:600;color:${STATE_COLORS[ac.aircraftState] || "#cbd5e1"};">${ac.aircraftState}</span>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span style="color:#94a3b8;">Fleet Status</span>
              <span style="font-weight:600;color:${ac.fleetStatus === "Active" ? "#10B981" : "#F59E0B"};">${ac.fleetStatus}</span>
            </div>
            ${ac.currentPilot ? `
            <div style="display:flex;justify-content:space-between;">
              <span style="color:#94a3b8;">Pilot</span>
              <span style="font-weight:600;color:#e2e8f0;">${ac.currentPilot}</span>
            </div>` : ""}
            ${ac.flightPlan && (ac.flightPlan.from || ac.flightPlan.to) ? `
            <div style="display:flex;justify-content:space-between;">
              <span style="color:#94a3b8;">Route</span>
              <span style="font-weight:600;color:#e2e8f0;">${ac.flightPlan.from || "???"} → ${ac.flightPlan.to || "???"}</span>
            </div>` : ""}
            ${ac.lastUpdate ? `
            <div style="margin-top:6px;color:#64748b;font-size:11px;">
              Updated: ${new Date(ac.lastUpdate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>` : ""}
          </div>
        </div>
      `);

      marker.on("click", () => {
        onSelect(ac.id);
      });

      cluster.addLayer(marker);
    }

    return () => {
      cluster.clearLayers();
    };
  }, [aircraft, onSelect]);

  return null;
}

export default function FleetMap({ aircraft }: { aircraft: FleetAircraft[] }) {
  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const hasPositions = useMemo(
    () => aircraft.some((ac) => ac.location && ac.location.lat != null && ac.location.lon != null),
    [aircraft]
  );

  const stats = useMemo(() => {
    const total = aircraft.length;
    const withPos = aircraft.filter((ac) => ac.location && ac.location.lat != null && ac.location.lon != null).length;
    return { total, withPos, withoutPos: total - withPos };
  }, [aircraft]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-2xl border border-navy-700/60 bg-navy-800/40">
        <p className="text-sm text-slate-400">Loading map...</p>
      </div>
    );
  }

  if (!hasPositions) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-2xl border border-navy-700/60 bg-navy-800/40">
        <Plane className="h-10 w-10 text-navy-500" />
        <h3 className="mt-4 text-lg font-bold text-white">No Live Positions</h3>
        <p className="mt-2 max-w-md text-center text-sm text-slate-400">
          No aircraft currently have valid coordinates. Positions will appear here when available.
        </p>
      </div>
    );
  }

  const selectedAircraft = aircraft.find((ac) => ac.id === selectedId);

  return (
    <div>
      <div className="mb-3 flex flex-col gap-1 rounded-xl border border-navy-700/60 bg-navy-800/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-slate-300">
          <span className="font-semibold text-white">{stats.total} Total Aircraft</span>
          <span className="mx-2 text-navy-600">·</span>
          <span className="text-emerald-400">{stats.withPos} With Live Position</span>
          <span className="mx-2 text-navy-600">·</span>
          <span className="text-slate-500">{stats.withoutPos} Without Live Position</span>
        </div>
        <p className="text-xs text-slate-500">
          Only aircraft with valid coordinates from Infinite Flight are displayed on the map.
        </p>
      </div>
      <div className="h-[350px] w-full overflow-hidden rounded-2xl border border-navy-700/60 sm:h-[450px] md:h-[500px]">
        <style jsx global>{`
          .leaflet-tile {
            filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
          }
          .leaflet-container {
            background: #0f172a;
          }
          .marker-cluster-custom {
            background: transparent;
            border: none;
          }
          .custom-fleet-marker {
            background: transparent;
            border: none;
          }
          .leaflet-popup-content-wrapper {
            background: #0f172a;
            color: #e2e8f0;
            border: 1px solid #334155;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5);
          }
          .leaflet-popup-tip {
            background: #0f172a;
            border: 1px solid #334155;
          }
          .leaflet-popup-close-button {
            color: #94a3b8;
          }
          .leaflet-control-attribution {
            background: rgba(15,23,42,0.8) !important;
            color: #94a3b8 !important;
            font-size: 10px;
          }
          .leaflet-control-attribution a {
            color: #3B82F6 !important;
          }
        `}</style>
        <MapContainer
          center={[14.5995, 120.9842]}
          zoom={6}
          className="h-full w-full"
          zoomControl={true}
          attributionControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains={["a", "b", "c", "d"]}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <FitBounds aircraft={aircraft} />
          <CenterButton aircraft={aircraft} onSelect={setSelectedId} />
          <MapClickHandler onSelect={setSelectedId} />
          <MarkerClusterLayer aircraft={aircraft} onSelect={setSelectedId} />
          {aircraft
            .filter((ac) => ac.id === selectedId)
            .map((ac) => {
              if (!ac.location || ac.location.lat == null || ac.location.lon == null) return null;
              const color = STATE_COLORS[ac.aircraftState] || "#3B82F6";
              if (ac.flightPlanWaypoints.length >= 2) {
                return (
                  <FlightPlanLine
                    key={`route-${ac.id}`}
                    waypoints={ac.flightPlanWaypoints}
                    color={color}
                  />
                );
              }
              return null;
            })}
        </MapContainer>
      </div>
    </div>
  );
}
