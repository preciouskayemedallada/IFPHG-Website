import { Plane } from "lucide-react";

export type AircraftStatus = "In Flight" | "On Ground" | "Stopped" | "Virtual Hangar" | "Maintenance" | "Available";

export interface AircraftCardProps {
  registration: string;
  aircraftType: string;
  status: AircraftStatus;
  callsign: string;
  fleetStatus?: string;
}

const statusConfig: Record<string, { bg: string; text: string; ring: string; dot: string; glow: string }> = {
  "In Flight": {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    ring: "ring-emerald-500/20",
    dot: "bg-emerald-400",
    glow: "shadow-emerald-500/10",
  },
  "On Ground": {
    bg: "bg-primary-500/10",
    text: "text-primary-400",
    ring: "ring-primary-500/20",
    dot: "bg-primary-400",
    glow: "shadow-primary-500/10",
  },
  Stopped: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    ring: "ring-purple-500/20",
    dot: "bg-purple-400",
    glow: "shadow-purple-500/10",
  },
  "Virtual Hangar": {
    bg: "bg-navy-500/10",
    text: "text-navy-300",
    ring: "ring-navy-500/20",
    dot: "bg-navy-400",
    glow: "shadow-navy-500/10",
  },
  Maintenance: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    ring: "ring-orange-500/20",
    dot: "bg-orange-400",
    glow: "shadow-orange-500/10",
  },
  Available: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    ring: "ring-emerald-500/20",
    dot: "bg-emerald-400",
    glow: "shadow-emerald-500/10",
  },
};

export default function AircraftCard({
  registration,
  aircraftType,
  status,
  callsign,
  fleetStatus,
}: AircraftCardProps) {
  const config = statusConfig[status] || statusConfig["Virtual Hangar"];
  const isStorage = fleetStatus === "Storage";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy-700/60 bg-navy-800/40 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-navy-600/80 hover:bg-navy-800/60 hover:shadow-xl hover:shadow-navy-900/30">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy-600/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex h-40 w-full items-center justify-center bg-navy-700/30">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-700/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-700/60 ring-1 ring-navy-600/60 transition-all duration-300 group-hover:scale-110 group-hover:bg-navy-700/80 ${config.glow}`}
        >
          <Plane className={`h-7 w-7 ${config.text}`} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-white">{registration}</h3>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${config.bg} ${config.text} ${config.ring}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {status}
          </span>
        </div>

        <p className="text-sm text-slate-300">{aircraftType}</p>

        {isStorage && (
          <p className="text-xs font-medium text-slate-500">Storage</p>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-navy-700/60 pt-3">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Callsign
          </span>
          <span className="font-mono text-sm font-semibold text-primary-400">
            {callsign}
          </span>
        </div>
      </div>
    </div>
  );
}
