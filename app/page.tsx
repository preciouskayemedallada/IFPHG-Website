import Link from "next/link";
import {
  Plane,
  Users,
  Cloud,
  Clock,
  ArrowRight,
} from "lucide-react";
import AircraftCard from "@/components/AircraftCard";

const stats = [
  {
    label: "Aircraft",
    value: "24",
    icon: Plane,
  },
  {
    label: "Active Pilots",
    value: "87",
    icon: Users,
  },
  {
    label: "Total Flights",
    value: "2,134",
    icon: Cloud,
  },
  {
    label: "Flight Hours",
    value: "8,920",
    icon: Clock,
  },
];

const featuredFleet = [
  {
    registration: "RP-C001",
    aircraftType: "Airbus A320-232",
    status: "Available" as const,
    callsign: "IFPHG-001",
  },
  {
    registration: "RP-C002",
    aircraftType: "Boeing 737-800",
    status: "In Flight" as const,
    callsign: "IFPHG-002",
  },
  {
    registration: "RP-C003",
    aircraftType: "Airbus A321neo",
    status: "Available" as const,
    callsign: "IFPHG-003",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/30 via-navy-900/80 to-navy-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent-900/10 via-transparent to-transparent" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-500/20 to-transparent" />
        </div>

        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-300">
            <span className="text-base">🇵🇭</span>
            <span>Philippine Virtual Aviation</span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            <span className="block">IFPHG</span>
            <span className="block bg-gradient-to-r from-primary-400 via-primary-300 to-accent-400 bg-clip-text text-transparent">
              Fly with Purpose
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
            The premier virtual aviation organization representing the Philippines
            in the global flight simulation community. Fly with professional-grade
            standards and a welcoming community of aviators.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/join"
              className="group inline-flex items-center justify-center rounded-xl bg-primary-500 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-primary-500/25 transition-all duration-300 hover:bg-primary-600 hover:shadow-primary-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500/60"
            >
              Join Us Today
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/fleet"
              className="inline-flex items-center justify-center rounded-xl border border-navy-600/80 bg-navy-800/40 px-8 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-sm transition-all duration-300 hover:border-navy-500 hover:bg-navy-800/60 hover:text-white hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500/60"
            >
              View Our Fleet
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy-700/60 to-transparent" />
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              By the Numbers
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              Join our growing community of dedicated virtual aviators.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="group relative flex flex-col items-center gap-4 rounded-2xl border border-navy-700/60 bg-navy-800/40 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] hover:border-navy-600/80 hover:bg-navy-800/60 hover:shadow-xl hover:shadow-navy-900/20"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/10 ring-1 ring-primary-500/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary-500/15">
                    <Icon className="h-5 w-5 text-primary-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Fleet Section */}
      <section className="relative py-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy-700/60 to-transparent" />
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Featured Fleet
              </h2>
              <p className="mt-2 max-w-xl text-slate-400">
                A glimpse into our modern and diverse fleet of aircraft.
              </p>
            </div>
            <Link
              href="/fleet"
              className="group hidden items-center gap-1.5 text-sm font-medium text-primary-400 transition-colors hover:text-primary-300 sm:flex"
            >
              View all aircraft
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredFleet.map((aircraft) => (
              <AircraftCard key={aircraft.registration} {...aircraft} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/fleet"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-400 transition-colors hover:text-primary-300"
            >
              View all aircraft
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="relative py-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy-700/60 to-transparent" />
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                About IFPHG
              </h2>
              <p className="mt-6 leading-relaxed text-slate-300">
                Founded in 2020, IF Philippines Group is committed to delivering
                realistic virtual aviation experiences for flight simulator
                enthusiasts across the Philippines and beyond. We operate a
                diverse fleet of modern aircraft and maintain strict standards
                for professionalism and safety.
              </p>
              <p className="mt-4 leading-relaxed text-slate-300">
                Whether you are a seasoned aviator or a new cadet, our community
                welcomes you to explore the skies with us.
              </p>

              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary-400 transition-colors hover:text-primary-300"
              >
                Learn more about us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative rounded-2xl border border-navy-700/60 bg-navy-800/40 p-8 backdrop-blur-sm">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5" />
              <div className="relative space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary-500/10 ring-1 ring-primary-500/20">
                    <Plane className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Realistic Operations</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Following real-world procedures and standards.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary-500/10 ring-1 ring-primary-500/20">
                    <Users className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Supportive Community</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Friendly pilots and controllers always ready to help.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary-500/10 ring-1 ring-primary-500/20">
                    <Cloud className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Active Skies</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Regular events and group flights throughout the year.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="relative py-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy-700/60 to-transparent" />
        <div className="container mx-auto px-4 text-center md:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-sm font-medium text-accent-300">
              <span className="text-base">✈️</span>
              <span>Start Your Journey</span>
            </div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Ready to Join the Skies?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Become part of the IF Philippines Group family and start your virtual
              aviation journey today.
            </p>
            <div className="mt-10">
              <Link
                href="/join"
                className="group inline-flex items-center justify-center rounded-xl bg-accent-500 px-10 py-4 text-sm font-bold text-navy-900 shadow-xl shadow-accent-500/25 transition-all duration-300 hover:bg-accent-400 hover:shadow-accent-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-accent-500/60"
              >
                Join IFPHG Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
