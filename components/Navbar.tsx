"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Plane } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/fleet", label: "Fleet" },
  { href: "/pilots", label: "Pilots" },
  { href: "/join", label: "Join" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy-700/60 bg-navy-900/90 backdrop-blur-md supports-[backdrop-filter]:bg-navy-900/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
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

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:text-white hover:bg-navy-800/60"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/join"
            className="ml-3 inline-flex items-center justify-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all duration-200 hover:bg-primary-600 hover:shadow-primary-500/30 focus:outline-none focus:ring-2 focus:ring-primary-500/60"
          >
            Join Now
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-navy-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/60"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-navy-700/60 bg-navy-900/95 backdrop-blur-md md:hidden">
          <div className="container mx-auto flex flex-col gap-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-navy-800 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/join"
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/20"
              onClick={() => setMobileOpen(false)}
            >
              Join Now
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
