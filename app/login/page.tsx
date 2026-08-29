"use client";

import { signIn } from "next-auth/react";
import { Plane } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-navy-700/60 bg-navy-800/40 p-8 text-center backdrop-blur-sm">
        <Plane className="mx-auto h-12 w-12 text-primary-400" />
        <h1 className="mt-6 text-2xl font-bold text-white">
          Sign in to IFPHG
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Login with your Infinite Flight Community account to access the pilot
          roster and flight data.
        </p>
        <button
          type="button"
          onClick={() => signIn("infiniteflight", { callbackUrl: "/pilots" })}
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-primary-500 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-primary-500/25 transition-all duration-300 hover:bg-primary-600 hover:shadow-primary-500/40 focus:outline-none focus:ring-2 focus:ring-primary-500/60"
        >
          Login with Infinite Flight
        </button>
      </div>
    </div>
  );
}
