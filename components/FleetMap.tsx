"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
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

const statusColors: Record<string, string> = {
  "In Flight": "#10B981",
  "On Ground": "#3B82F6",
  Stopped: "#8B5CF6",
  "Virtual Hangar": "#64748B",
  Maintenance: "#F97316",
  Available: "#10B981",
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

function CenterButton({ aircraft }: { aircraft: FleetAircraft[] }) {
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

export default function FleetMap({ aircraft }: { aircraft: FleetAircraft[] }) {
  const [mounted, setMounted] = useState(false);
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
          .fleet-map-popup .leaflet-popup-content-wrapper {
            background: #0f172a;
            color: #e2e8f0;
            border: 1px solid #334155;
            border-radius: 8px;
          }
          .fleet-map-popup .leaflet-popup-tip {
            background: #0f172a;
            border: 1px solid #334155;
          }
          .fleet-map-popup .leaflet-popup-close-button {
            color: #94a3b8;
          }
        `}</style>
        <MapContainer
          center={[14.5995, 120.9842]}
          zoom={6}
          className="h-full w-full"
          zoomControl={true}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            subdomains={["a", "b", "c"]}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <FitBounds aircraft={aircraft} />
          <CenterButton aircraft={aircraft} />
          {aircraft
            .filter((ac): ac is FleetAircraft & { location: { lat: number; lon: number } } => !!ac.location && ac.location.lat != null && ac.location.lon != null)
            .map((ac) => {
              const color = statusColors[ac.aircraftState] || "#3B82F6";
              const customIcon = new L.Icon({
                iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color.replace('#', '%23')}" stroke="white" stroke-width="1.5"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.4-.1.9.3 1.1L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.9.5 1.4.3l.5-.2c.4-.3.6-.8.4-1.3z"/></svg>`)}`,
                iconSize: [28, 28],
                iconAnchor: [14, 14],
                popupAnchor: [0, -14],
              });
              return (
                <Marker key={ac.id} position={[ac.location.lat, ac.location.lon]} icon={customIcon}>
                  <Popup>
                    <div className="max-w-[260px] rounded-lg bg-navy-900 p-3 text-slate-200">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-white">{ac.registration}</span>
                        <span className="text-xs text-slate-400">{ac.callsign}</span>
                      </div>
                      <p className="mb-2 text-xs text-slate-300">{ac.aircraftType}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">State</span>
                          <span className="font-medium">{ac.aircraftState}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Fleet</span>
                          <span className="font-medium">{ac.fleetStatus}</span>
                        </div>
                        {ac.currentPilot && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Pilot</span>
                            <span className="font-medium">{ac.currentPilot}</span>
                          </div>
                        )}
                        {ac.lastUpdate && (
                          <div className="pt-1 text-slate-500">
                            Updated: {new Date(ac.lastUpdate).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>
    </div>
  );
}
