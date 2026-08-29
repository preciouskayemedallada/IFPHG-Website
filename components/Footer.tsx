import Link from "next/link";
import { Plane } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-navy-700/60 bg-navy-900/80 backdrop-blur-sm">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
      <div className="container mx-auto px-4 py-10 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-xl font-bold text-white transition-opacity hover:opacity-80"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/10 ring-1 ring-primary-500/30">
                <Plane className="h-4.5 w-4.5 text-primary-400" />
              </div>
              <span className="tracking-tight">
                IFPHG{" "}
                <span className="text-accent-400">🇵🇭</span>
              </span>
            </Link>
            <p className="max-w-xs text-center text-sm text-slate-400 md:text-left">
              Philippine Virtual Aviation Organization. Professional flight simulation since 2020.
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-300">
            <Link
              href="/"
              className="relative rounded-md px-2 py-1 transition-colors hover:text-primary-400"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="relative rounded-md px-2 py-1 transition-colors hover:text-primary-400"
            >
              About
            </Link>
            <Link
              href="/fleet"
              className="relative rounded-md px-2 py-1 transition-colors hover:text-primary-400"
            >
              Fleet
            </Link>
            <Link
              href="/pilots"
              className="relative rounded-md px-2 py-1 transition-colors hover:text-primary-400"
            >
              Pilots
            </Link>
            <Link
              href="/join"
              className="relative rounded-md px-2 py-1 transition-colors hover:text-primary-400"
            >
              Join
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-navy-700/40 pt-6 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} IF Philippines Group (IFPHG). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
