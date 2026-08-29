import Link from "next/link";
import {
  CheckCircle,
  Plane,
  Users,
  FileBadge,
  MessageCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

const faqs = [
  {
    question: "What simulator platforms does IFPHG support?",
    answer:
      "We currently support Microsoft Flight Simulator 2020 and Prepar3D v4/v5. Future support for MSFS 2024 is planned.",
  },
  {
    question: "Do I need to be an expert to join?",
    answer:
      "No. We welcome pilots of all skill levels. Our training department provides structured courses to help you get up to speed.",
  },
  {
    question: "Is there a membership fee?",
    answer:
      "No, membership at IFPHG is completely free. We are a volunteer-run organization.",
  },
  {
    question: "How do I advance my rank?",
    answer:
      "Ranks are awarded based on completed training modules, accumulated flight hours, and demonstrated proficiency in our operations.",
  },
];

export default function JoinPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-navy-700/60 bg-navy-800/40 px-6 py-16 text-center backdrop-blur-sm md:px-12 md:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/20 via-transparent to-transparent" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />

          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-300">
              <span className="text-base">✈️</span>
              <span>Become a Member</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              Join IFPHG
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Ready to take to the skies with us? Here&apos;s everything you need to
              know to become a member of the IF Philippines Group.
            </p>
          </div>
        </section>

        {/* Requirements */}
        <section className="mt-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Requirements</h2>
            <p className="mt-2 text-slate-400">What you need to get started.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Minimum age of 13 years old",
              "A working copy of MSFS 2020 or Prepar3D v4/v5",
              "A Discord account for community communication",
              "Willingness to follow our Standard Operating Procedures (SOPs)",
            ].map((req, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-navy-700/60 bg-navy-800/40 p-4 backdrop-blur-sm"
              >
                <CheckCircle className="mt-0.5 h-5 w-5 flex-none text-emerald-400" />
                <span className="text-slate-300">{req}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section className="mt-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Steps to Join</h2>
            <p className="mt-2 text-slate-400">Your path to becoming an IFPHG pilot.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                num: "1",
                title: "Join Our Discord",
                desc: "Connect with our community and staff on our Discord server.",
              },
              {
                num: "2",
                title: "Submit Application",
                desc: "Fill out the application form and provide the required information about your simulator experience.",
              },
              {
                num: "3",
                title: "Review & Approval",
                desc: "Our recruitment team reviews your application. Expect a response within 48 hours.",
              },
              {
                num: "4",
                title: "Training & Induction",
                desc: "Complete your assigned training modules and induction flights to become a full member.",
              },
            ].map((step) => (
              <div key={step.num} className="flex gap-4">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary-500/10 text-sm font-bold text-primary-400 ring-2 ring-primary-500/20">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Discord Invite */}
        <section className="mt-20">
          <div className="relative overflow-hidden rounded-2xl border border-navy-700/60 bg-navy-800/40 p-8 text-center backdrop-blur-sm md:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/10 via-transparent to-transparent" />
            <div className="relative">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/10 ring-1 ring-primary-500/20">
                <MessageCircle className="h-6 w-6 text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Join Our Discord Server
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-slate-300">
                Connect with our community and staff on Discord for real-time
                support and updates.
              </p>
              <Link
                href="https://discord.gg/wFzdaNRRyw"
                className="mt-8 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-600/25 transition-all duration-300 hover:bg-indigo-700 hover:shadow-indigo-600/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
              >
                Join Discord
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-slate-400">Quick answers to common questions.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="flex gap-4 rounded-xl border border-navy-700/60 bg-navy-800/40 p-6 backdrop-blur-sm"
              >
                <HelpCircle className="mt-0.5 h-5 w-5 flex-none text-primary-400" />
                <div>
                  <h3 className="font-semibold text-white">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-20">
          <div className="relative overflow-hidden rounded-3xl border border-navy-700/60 bg-navy-800/40 px-6 py-16 text-center backdrop-blur-sm md:px-12 md:py-20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent-900/10 via-transparent to-transparent" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-500/30 to-transparent" />

            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                Ready to Get Started?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
                Join IFPHG today and start your journey as a virtual aviator with
                one of the Philippines&apos; premier flight simulation organizations.
              </p>
              <div className="mt-8">
                <Link
                  href="https://discord.gg/wFzdaNRRyw"
                  className="group inline-flex items-center justify-center rounded-xl bg-accent-500 px-10 py-4 text-sm font-bold text-navy-900 shadow-xl shadow-accent-500/25 transition-all duration-300 hover:bg-accent-400 hover:shadow-accent-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-accent-500/60"
                >
                  Begin Your Application
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
