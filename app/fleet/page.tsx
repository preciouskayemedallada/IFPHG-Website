"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import AircraftCard from "@/components/AircraftCard";
import { Plane, AlertCircle, Loader2, RefreshCw } from "lucide-react";

const FleetMap = dynamic(() => import("@/components/FleetMap"), { ssr: false });

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

const REFRESH_INTERVAL_MS = 60 * 1000;

export default function FleetPage() {
  const [aircraft, setAircraft] = useState<FleetAircraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function loadFleet(isRefresh = false) {
    if (isRefresh) {
      setRefreshing(true);
    }
    try {
      const res = await fetch("/api/fleet");
      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setAircraft(list);
      setLastUpdated(new Date());
      setLoading(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load fleet");
      setLoading(false);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  }

  useEffect(() => {
    loadFleet();

    const interval = setInterval(() => {
      loadFleet(true);
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const displayAircraft = useMemo(
    () => aircraft.filter((ac) => ac.aircraftState !== "Virtual Hangar"),
    [aircraft]
  );

  const formattedTime = useMemo(() => {
    if (!lastUpdated) return null;
    return lastUpdated.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, [lastUpdated]);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-300">
            <span className="text-base">✈️</span>
            <span>Live Fleet Data</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Our Fleet
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Real-time fleet status from Infinite Flight. Aircraft state and
            fleet status are tracked independently.
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary-400" />
            <p className="mt-4 text-sm text-slate-400">Loading fleet data...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 py-16 text-center">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <h2 className="mt-4 text-xl font-bold text-white">
              Unable to Load Fleet
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-300">{error}</p>
            <button
              type="button"
              onClick={() => loadFleet(false)}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && aircraft.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-navy-700/60 bg-navy-800/40 py-16 text-center">
            <Plane className="h-10 w-10 text-navy-500" />
            <h2 className="mt-4 text-xl font-bold text-white">
              No Aircraft Found
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-400">
              The organization fleet appears to be empty or the API returned no
              data.
            </p>
          </div>
        )}

        {!loading && !error && aircraft.length > 0 && (
          <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-white">Live Map</h2>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                {refreshing && (
                  <span className="flex items-center gap-1.5 text-primary-300">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Updating...
                  </span>
                )}
                {formattedTime && (
                  <span>
                    Last updated: {formattedTime}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-10">
              <FleetMap aircraft={aircraft} />
            </div>

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                All Aircraft ({aircraft.length})
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                {refreshing && (
                  <span className="flex items-center gap-1.5 text-primary-300">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Updating...
                  </span>
                )}
                {formattedTime && (
                  <span>
                    Last updated: {formattedTime}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {aircraft.map((ac) => (
                <AircraftCard
                  key={ac.id}
                  registration={ac.registration}
                  aircraftType={ac.aircraftType}
                  status={ac.aircraftState as "In Flight" | "On Ground" | "Stopped" | "Virtual Hangar" | "Maintenance" | "Available"}
                  callsign={ac.callsign || ac.registration}
                  fleetStatus={ac.fleetStatus}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
