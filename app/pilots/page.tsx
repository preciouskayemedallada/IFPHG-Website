import { Search } from "lucide-react";
import PilotCard from "@/components/PilotCard";

interface Pilot {
  id: string;
  name: string;
  callsign: string;
  rank: string;
  flightHours: number;
  flights: number;
}

const pilots: Pilot[] = [
  {
    id: "1",
    name: "Captain Miguel Santos",
    callsign: "IFPHG-101",
    rank: "Captain",
    flightHours: 2450,
    flights: 1280,
  },
  {
    id: "2",
    name: "First Officer Ana Reyes",
    callsign: "IFPHG-102",
    rank: "First Officer",
    flightHours: 1875,
    flights: 950,
  },
  {
    id: "3",
    name: "Captain David Cruz",
    callsign: "IFPHG-103",
    rank: "Captain",
    flightHours: 3120,
    flights: 1620,
  },
  {
    id: "4",
    name: "First Officer Maria Lim",
    callsign: "IFPHG-104",
    rank: "First Officer",
    flightHours: 1560,
    flights: 830,
  },
  {
    id: "5",
    name: "Captain Roberto Tan",
    callsign: "IFPHG-105",
    rank: "Captain",
    flightHours: 4280,
    flights: 2100,
  },
  {
    id: "6",
    name: "Senior First Officer Jasmine Wu",
    callsign: "IFPHG-106",
    rank: "Senior First Officer",
    flightHours: 2100,
    flights: 1100,
  },
  {
    id: "7",
    name: "Captain Eduardo Diaz",
    callsign: "IFPHG-107",
    rank: "Captain",
    flightHours: 5640,
    flights: 2980,
  },
  {
    id: "8",
    name: "First Officer Liza Fernandez",
    callsign: "IFPHG-108",
    rank: "First Officer",
    flightHours: 980,
    flights: 540,
  },
];

export default function PilotsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-300">
            <span className="text-base">👨‍✈️</span>
            <span>Our Community</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Pilot Roster
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Our community of dedicated virtual aviators, from trainees to
            senior captains.
          </p>
        </div>

        {/* Search / Filter Bar (visual only) */}
        <div className="mb-10 relative">
          <input
            type="text"
            placeholder="Search by name or callsign..."
            className="w-full rounded-xl border border-navy-700/60 bg-navy-800/60 px-4 py-3 pl-11 text-sm text-slate-200 placeholder-slate-500 backdrop-blur-sm transition-all duration-200 focus:border-primary-500/60 focus:bg-navy-800/80 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            aria-label="Search pilots"
          />
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pilots.map((pilot) => (
            <PilotCard
              key={pilot.id}
              name={pilot.name}
              callsign={pilot.callsign}
              rank={pilot.rank}
              flightHours={pilot.flightHours}
              flights={pilot.flights}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
