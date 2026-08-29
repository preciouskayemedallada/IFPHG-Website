import { Plane, Shield, Users, Award } from "lucide-react";

const leadership = [
  {
    position: "Chief Executive Officer",
    name: "Captain Miguel Santos",
    initials: "MS",
  },
  {
    position: "Chief Operations Officer",
    name: "First Officer Ana Reyes",
    initials: "AR",
  },
  {
    position: "Chief Training Officer",
    name: "Captain David Cruz",
    initials: "DC",
  },
  {
    position: "Community Director",
    name: "First Officer Maria Lim",
    initials: "ML",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/30 via-navy-900/80 to-navy-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent-900/10 via-transparent to-transparent" />
        </div>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-500/20 to-transparent" />

        <div className="container mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-300">
            <span className="text-base">🇵🇭</span>
            <span>Our Story</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            About IFPHG
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            The premier virtual aviation organization representing the Philippines
            in the global flight simulation community.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="relative py-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy-700/60 to-transparent" />
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative overflow-hidden rounded-2xl border border-navy-700/60 bg-navy-800/40 p-8 backdrop-blur-sm md:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Our Mission</h2>
              <p className="mt-4 leading-relaxed text-slate-300">
                IF Philippines Group (IFPHG) is dedicated to providing the highest
                quality virtual aviation experience for flight simulator enthusiasts.
                We strive to foster a professional, supportive, and inclusive
                community where pilots of all skill levels can develop their
                knowledge, refine their skills, and enjoy the art of flight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy-700/60 to-transparent" />
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Our Values</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              These core principles guide everything we do as an organization.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Professionalism",
                description:
                  "Upholding the highest standards of conduct, realism, and operational excellence in every aspect of our activities.",
              },
              {
                icon: Users,
                title: "Community",
                description:
                  "Building a supportive, welcoming, and inclusive environment where every member feels valued and encouraged to grow.",
              },
              {
                icon: Award,
                title: "Excellence",
                description:
                  "Continuously improving our standards, training programs, and fleet to deliver an exceptional virtual aviation experience.",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="group relative flex flex-col items-center rounded-2xl border border-navy-700/60 bg-navy-800/40 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-navy-600/80 hover:bg-navy-800/60 hover:shadow-xl hover:shadow-navy-900/30"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy-600/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/10 ring-1 ring-primary-500/20 transition-all duration-300 group-hover:scale-110">
                  <value.icon className="h-6 w-6 text-primary-400" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">{value.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="relative py-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy-700/60 to-transparent" />
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-10 text-3xl font-bold text-white sm:text-4xl">Our History</h2>
          <div className="relative border-l border-navy-700/60 pl-8 md:pl-10">
            {[
              {
                date: "August 2016",
                title: "Founding",
                description:
                  "IFPHG was founded by a group of passionate Filipino flight simulator enthusiasts with a shared vision of creating a professional virtual airline.",
              },
              {
                date: "March 2021",
                title: "First Fleet Expansion",
                description:
                  "Added our first Airbus A320 family aircraft and Boeing 737, establishing our core fleet for domestic and international routes.",
              },
              {
                date: "September 2022",
                title: "Training Program Launch",
                description:
                  "Launched our structured pilot training program, graduating over 100 cadets in the first year.",
              },
              {
                date: "January 2024",
                title: "International Recognition",
                description:
                  "Gained recognition from major virtual aviation networks and expanded our presence in the global community.",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative mb-10 md:mb-12 last:mb-0">
                <div className="absolute -left-[2.35rem] top-1 h-3 w-3 rounded-full bg-primary-500 ring-4 ring-navy-900" />
                <p className="text-sm font-semibold text-primary-400">{item.date}</p>
                <h3 className="mt-1 text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="relative py-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy-700/60 to-transparent" />
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Leadership</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              Our dedicated leadership team brings years of experience and passion to the organization.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((leader) => (
              <div
                key={leader.position}
                className="group relative flex flex-col items-center rounded-2xl border border-navy-700/60 bg-navy-800/40 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-navy-600/80 hover:bg-navy-800/60 hover:shadow-xl hover:shadow-navy-900/30"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy-600/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-navy-600 bg-navy-700/40 text-lg font-bold text-primary-400 ring-4 ring-navy-800/60 transition-all duration-300 group-hover:border-navy-500">
                  {leader.initials}
                </div>
                <p className="text-sm font-medium text-slate-400">{leader.position}</p>
                <p className="mt-1 font-bold text-white">{leader.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
