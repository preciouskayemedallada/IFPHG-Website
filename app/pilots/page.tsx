"use client";

import { useSession, signIn } from "next-auth/react";
import { Plane, Users, FileText } from "lucide-react";

interface Pilot {
  id: string;
  name: string;
  callsign: string;
  rank: string;
  flightHours: number;
  flights: number;
}

interface Pirep {
  id: string;
  pilot: string;
  callsign: string;
  route: string;
  aircraft: string;
  duration: string;
  date: string;
}

const pilots: Pilot[] = [];
const pireps: Pirep[] = [];

export default function PilotsPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    );
  }

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

        {!session && (
          <div className="mb-10 rounded-2xl border border-navy-700/60 bg-navy-800/40 p-8 text-center backdrop-blur-sm md:p-12">
            <Plane className="mx-auto h-12 w-12 text-primary-400" />
            <h2 className="mt-4 text-2xl font-bold text-white">
              Login to View Pilot Roster
            </h2>
            <p className="mt-2 max-w-lg text-sm text-slate-400">
              Please log in with your Infinite Flight Community account to view
              the pilot roster and flight data.
            </p>
            <button
              type="button"
              onClick={() => signIn("infiniteflight")}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary-500 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-primary-500/25 transition-all duration-300 hover:bg-primary-600 hover:shadow-primary-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500/60"
            >
              Login with Infinite Flight
            </button>
          </div>
        )}

        {session && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Welcome, <span className="font-semibold text-white">{session.user?.name}</span>
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
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pilots.map((pilot) => (
                <div
                  key={pilot.id}
                  className="flex flex-col items-center rounded-2xl border border-navy-700/60 bg-navy-800/40 p-6 text-center backdrop-blur-sm"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-navy-600 bg-navy-700/40 text-lg font-bold text-primary-400 ring-4 ring-navy-800/60">
                    {pilot.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <h3 className="text-lg font-bold text-white">{pilot.name}</h3>
                  <p className="font-mono text-sm font-semibold text-primary-400">
                    {pilot.callsign}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    {pilot.rank}
                  </p>
                  <div className="mt-4 grid w-full grid-cols-2 gap-3 border-t border-navy-700/60 pt-4">
                    <div className="rounded-xl bg-navy-700/30 p-3">
                      <p className="text-lg font-bold text-white">
                        {pilot.flightHours.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-400">Hours</p>
                    </div>
                    <div className="rounded-xl bg-navy-700/30 p-3">
                      <p className="text-lg font-bold text-white">
                        {pilot.flights.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-400">Flights</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pilots.length === 0 && (
              <div className="mt-10 text-center text-sm text-slate-500">
                No pilots found. Data will appear here after IFC login is fully
                configured.
              </div>
            )}

            {/* PIREP Section */}
            <section className="mt-20">
              <div className="mb-8 flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary-400" />
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Pilot Reports (PIREP)
                </h2>
              </div>
              <p className="mb-6 max-w-2xl text-sm text-slate-400">
                Recent pilot reports submitted by IFPHG members. PIREPs include
                flight details, aircraft used, and duration.
              </p>

              {pireps.length === 0 ? (
                <div className="rounded-2xl border border-navy-700/60 bg-navy-800/40 p-8 text-center backdrop-blur-sm">
                  <FileText className="mx-auto h-10 w-10 text-navy-500" />
                  <h3 className="mt-4 text-lg font-bold text-white">
                    No PIREPs Yet
                  </h3>
                  <p className="mt-2 max-w-md text-center text-sm text-slate-400">
                    Pilot reports will appear here once submitted through the
                    IFC-integrated system.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pireps.map((pirep) => (
                    <div
                      key={pirep.id}
                      className="rounded-2xl border border-navy-700/60 bg-navy-800/40 p-5 backdrop-blur-sm"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {pirep.pilot}{" "}
                            {pirep.callsign && (
                              <span className="text-primary-400">
                                {pirep.callsign}
                              </span>
                            )}
                          </p>
                          <p className="mt-1 text-sm text-slate-300">
                            {pirep.route} · {pirep.aircraft}
                          </p>
                        </div>
                        <div className="text-right text-xs text-slate-400">
                          <p>{pirep.duration}</p>
                          <p>{pirep.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
