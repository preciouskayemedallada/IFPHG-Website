import { User } from "lucide-react";

export interface PilotCardProps {
  name: string;
  callsign: string;
  rank: string;
  flightHours: number;
  flights: number;
}

export default function PilotCard({
  name,
  callsign,
  rank,
  flightHours,
  flights,
}: PilotCardProps) {
  return (
    <div className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-navy-700/60 bg-navy-800/40 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-navy-600/80 hover:bg-navy-800/60 hover:shadow-xl hover:shadow-navy-900/30">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy-600/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-navy-600 bg-navy-700/40 ring-4 ring-navy-800/60 transition-all duration-300 group-hover:border-navy-500 group-hover:ring-navy-700/80">
        <User className="h-8 w-8 text-navy-400" />
      </div>

      <div className="flex flex-1 flex-col items-center gap-1.5">
        <h3 className="text-lg font-bold text-white">{name}</h3>
        <p className="font-mono text-sm font-semibold text-primary-400">
          {callsign}
        </p>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {rank}
        </p>
      </div>

      <div className="mt-5 grid w-full grid-cols-2 gap-3 border-t border-navy-700/60 pt-4">
        <div className="rounded-xl bg-navy-700/30 p-3">
          <p className="text-lg font-bold text-white">{flightHours.toLocaleString()}</p>
          <p className="text-xs text-slate-400">Hours</p>
        </div>
        <div className="rounded-xl bg-navy-700/30 p-3">
          <p className="text-lg font-bold text-white">{flights.toLocaleString()}</p>
          <p className="text-xs text-slate-400">Flights</p>
        </div>
      </div>
    </div>
  );
}
