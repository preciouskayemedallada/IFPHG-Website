"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Plane, Crosshair, Navigation } from "lucide-react";

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
  altitude?: number | null;
  groundSpeed?: number | null;
}

const statusColors: Record<string, string> = {
  "In Flight": "#10B981",
  "On Ground": "#3B82F6",
  Stopped: "#8B5CF6",
  "Virtual Hangar": "#64748B",
  Maintenance: "#F97316",
  Available: "#10B981",
};

function createPlaneIcon(color: string, selected = false): L.Icon {
  const size = selected ? 36 : 28;
  const anchor = selected ? 18 : 14;
  const svg = selected
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color.replace('#', '%23')}" stroke="white" stroke-width="1.5"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.4-.1.9.3 1.1L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.9.5 1.4.3l.5-.2c.4-.3.6-.8.4-1.3z"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color.replace('#', '%23')}" stroke="white" stroke-width="1.5"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.4-.1.9.3 1.1L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.9.5 1.4.3l.5-.2c.4-.3.6-.8.4-1.3z"/></svg>`;

  return new L.Icon({
    iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    iconSize: [size, size],
    iconAnchor: [anchor, anchor],
    popupAnchor: [0, -anchor],
    className: selected ? "selected-marker" : "",
  });
}

function FitBounds({ aircraft }: { aircraft: FleetAircraft[] }) {
  const map = useMap();
  const hasFitted = useRef(false);

  const positions = useMemo(() => {
    const bounds: L.LatLngExpression[] = [];
    for (const ac of aircraft) {
      if (ac.location && ac.location.lat != null && ac.location.lon != null) {
        bounds.push([ac.location.lat, ac.location.lon]);
      }
      if (ac.flightPlanWaypoints.length > 0) {
        for (const wp of ac.flightPlanWaypoints) {
          bounds.push([wp.lat, wp.lon]);
        }
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

function FlightPlanLines({
  aircraft,
  selectedId,
}: {
  aircraft: FleetAircraft[];
  selectedId: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const layers: L.Layer[] = [];

    aircraft.forEach((ac) => {
      const waypoints = ac.flightPlanWaypoints;
      if (!waypoints || waypoints.length < 2) return;

      const color = statusColors[ac.aircraftState] || "#3B82F6";
      const isSelected = ac.id === selectedId;
      const sampled =
        waypoints.length > 100
          ? waypoints.filter((_, idx) => idx % Math.ceil(waypoints.length / 100) === 0 || idx === waypoints.length - 1)
          : waypoints;

      const latLngs = sampled.map((w) => [w.lat, w.lon] as L.LatLngExpression);

      const polyline = L.polyline(latLngs, {
        color: isSelected ? color : "#475569",
        weight: isSelected ? 4 : 2,
        opacity: isSelected ? 0.9 : 0.4,
        dashArray: "10, 8",
        lineCap: "round",
        lineJoin: "round",
        interactive: false,
      });

      polyline.addTo(map);
      layers.push(polyline);
    });

    return () => {
      layers.forEach((layer) => {
        map.removeLayer(layer);
      });
    };
  }, [map, aircraft, selectedId]);

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

export default function FleetMap({ aircraft }: { aircraft: FleetAircraft[] }) {
  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const hasPositions = useMemo(
    () => aircraft.some((ac) => ac.location && ac.location.lat != null && ac.location.lon != null),
    [aircraft]
  );

  const hasRoutes = useMemo(
    () => aircraft.some((ac) => ac.flightPlanWaypoints.length >= 2),
    [aircraft]
  );

  const stats = useMemo(() => {
    const total = aircraft.length;
    const withPos = aircraft.filter((ac) => ac.location && ac.location.lat != null && ac.location.lon != null).length;
    const inFlight = aircraft.filter((ac) => ac.aircraftState === "In Flight").length;
    const onGround = aircraft.filter((ac) => ac.aircraftState === "On Ground").length;
    return { total, withPos, withoutPos: total - withPos, inFlight, onGround };
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

  if (!hasPositions && !hasRoutes) {
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

  const handleMarkerClick = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleMapClick = () => {
    setSelectedId(null);
  };

  const selectedAircraft = aircraft.find((ac) => ac.id === selectedId);

  return (
    <div>
      <div className="mb-3 flex flex-col gap-1 rounded-xl border border-navy-700/60 bg-navy-800/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
          <span className="font-semibold text-white">{stats.total} Total</span>
          <span className="text-navy-600">·</span>
          <span className="text-emerald-400">{stats.inFlight} In Flight</span>
          <span className="text-navy-600">·</span>
          <span className="text-primary-400">{stats.onGround} On Ground</span>
          <span className="text-navy-600">·</span>
          <span className="text-slate-500">{stats.withoutPos} No Position</span>
        </div>
        <p className="text-xs text-slate-500">
          Click an aircraft to view flight plan
        </p>
      </div>

      <div className="h-[350px] w-full overflow-hidden rounded-2xl border border-navy-700/60 sm:h-[450px] md:h-[500px]">
        <style jsx global>{`
          .leaflet-container {
            background: #0f172a;
            font-family: inherit;
          }
          .fleet-map-popup .leaflet-popup-content-wrapper {
            background: rgba(15, 23, 42, 0.95);
            color: #e2e8f0;
            border: 1px solid #334155;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(12px);
          }
          .fleet-map-popup .leaflet-popup-tip {
            background: rgba(15, 23, 42, 0.95);
            border: 1px solid #334155;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
          }
          .fleet-map-popup .leaflet-popup-close-button {
            color: #94a3b8;
            font-size: 18px;
            padding: 6px 8px;
          }
          .fleet-map-popup .leaflet-popup-close-button:hover {
            color: #e2e8f0;
          }
          .fleet-map-popup .leaflet-popup-content {
            margin: 12px 16px;
            line-height: 1.5;
          }
          .selected-marker {
            filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
            z-index: 1000 !important;
          }
          .leaflet-control-zoom {
            border: 1px solid #334155 !important;
            border-radius: 8px !important;
            overflow: hidden;
          }
          .leaflet-control-zoom a {
            background: #0f172a !important;
            color: #e2e8f0 !important;
            border-bottom: 1px solid #334155 !important;
          }
          .leaflet-control-zoom a:hover {
            background: #1e293b !important;
            color: #60a5fa !important;
          }
          .leaflet-control-attribution {
            background: rgba(15, 23, 42, 0.8) !important;
            color: #64748b !important;
            font-size: 10px;
          }
          .leaflet-control-attribution a {
            color: #94a3b8 !important;
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
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            subdomains={["a", "b", "c"]}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
          />
          <FitBounds aircraft={aircraft} />
          <FlightPlanLines aircraft={aircraft} selectedId={selectedId} />
          <CenterButton aircraft={aircraft} onSelect={handleMapClick} />
          <MapClickHandler onSelect={handleMapClick} />
          {aircraft
            .filter((ac): ac is FleetAircraft & { location: { lat: number; lon: number } } => !!ac.location && ac.location.lat != null && ac.location.lon != null)
            .map((ac) => {
              const color = statusColors[ac.aircraftState] || "#3B82F6";
              const isSelected = ac.id === selectedId;
              const customIcon = createPlaneIcon(color, isSelected);

              return (
                <Marker
                  key={ac.id}
                  position={[ac.location.lat, ac.location.lon]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => handleMarkerClick(ac.id),
                  }}
                  zIndexOffset={isSelected ? 1000 : 0}
                >
                  <Popup className="fleet-map-popup" maxWidth={320}>
                    <div className="min-w-[240px]">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                          />
                          <span className="text-sm font-bold text-white">{ac.registration}</span>
                        </div>
                        {ac.callsign && (
                          <span className="text-xs text-slate-400">{ac.callsign}</span>
                        )}
                      </div>

                      <p className="mb-3 text-xs text-slate-300">{ac.aircraftType}</p>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between rounded-lg bg-navy-800/60 px-2.5 py-1.5">
                          <span className="text-slate-400">State</span>
                          <span className="font-medium" style={{ color }}>
                            {ac.aircraftState}
                          </span>
                        </div>

                        <div className="flex items-center justify-between rounded-lg bg-navy-800/60 px-2.5 py-1.5">
                          <span className="text-slate-400">Fleet Status</span>
                          <span className={`font-medium ${ac.fleetStatus === "Active" ? "text-emerald-400" : "text-slate-400"}`}>
                            {ac.fleetStatus}
                          </span>
                        </div>

                        {ac.currentPilot && (
                          <div className="flex items-center justify-between rounded-lg bg-navy-800/60 px-2.5 py-1.5">
                            <span className="text-slate-400">Pilot</span>
                            <span className="font-medium text-primary-300">{ac.currentPilot}</span>
                          </div>
                        )}

                        {(ac.altitude != null || ac.groundSpeed != null) && (
                          <div className="flex items-center gap-2 rounded-lg bg-navy-800/60 px-2.5 py-1.5">
                            <Navigation className="h-3 w-3 text-slate-500" />
                            <span className="text-slate-400">
                              {ac.altitude != null && `${ac.altitude.toLocaleString()} ft`}
                              {ac.altitude != null && ac.groundSpeed != null && " · "}
                              {ac.groundSpeed != null && `${ac.groundSpeed} kts`}
                            </span>
                          </div>
                        )}

                        {ac.flightPlan && (ac.flightPlan.from || ac.flightPlan.to) && (
                          <div className="flex items-center justify-between rounded-lg bg-navy-800/60 px-2.5 py-1.5">
                            <span className="text-slate-400">Route</span>
                            <span className="font-medium text-slate-200">
                              {ac.flightPlan.from || "???"} <span className="text-slate-500">→</span> {ac.flightPlan.to || "???"}
                            </span>
                          </div>
                        )}

                        {ac.lastUpdate && (
                          <div className="pt-1 text-right text-slate-500">
                            {new Date(ac.lastUpdate).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
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
