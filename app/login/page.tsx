"use client";

import { useEffect, useState, type ElementType } from "react";
import { useRouter } from "next/navigation";
import { Plane, Loader2, AlertCircle } from "lucide-react";

type AuthState = "idle" | "connecting" | "success";

export default function LoginPage() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>("idle");
  const [error, setError] = useState<"cancelled" | "failed" | null>(null);

  // Read the result of the OAuth redirect from the URL.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const err = params.get("error");
    if (status === "success") {
      setState("success");
    }
    if (err === "cancelled") {
      setError("cancelled");
    } else if (err === "failed") {
      setError("failed");
    }
  }, []);

  // After showing the success state briefly, forward to the authenticated page.
  useEffect(() => {
    if (state === "success") {
      const params = new URLSearchParams(window.location.search);
      const target = params.get("callbackUrl") || "/pilots";
      const to = target.startsWith("/") ? target : "/pilots";
      const t = setTimeout(() => router.replace(to), 1500);
      return () => clearTimeout(t);
    }
  }, [state, router]);

  const handleLogin = async () => {
    setState("connecting");
    try {
      const res = await fetch("/api/auth/ifc-login", {
        headers: { Accept: "application/json" },
      });
      const data: { authorizeUrl?: string } = await res.json();
      if (data?.authorizeUrl) {
        // Navigating away; the PKCE cookies were set on the response above.
        window.location.assign(data.authorizeUrl);
      } else {
        setState("idle");
        setError("failed");
      }
    } catch {
      setState("idle");
      setError("failed");
    }
  };

  if (state === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-navy-700/60 bg-navy-800/40 p-8 text-center backdrop-blur-sm">
          <Plane className="mx-auto h-12 w-12 text-accent-400" />
          <h1 className="mt-6 text-2xl font-bold text-white">Login successful</h1>
          <p className="mt-2 text-sm text-slate-400">
            Welcome to IFPHG. You are being redirected to your dashboard…
          </p>
        </div>
      </div>
    );
  }

  let title = "Sign in to IFPHG";
  let message =
    "Login with your Infinite Flight Community account to access the pilot roster and flight data.";
  let Icon: ElementType = Plane;
  let iconClass = "mx-auto h-12 w-12 text-primary-400";

  if (state === "connecting") {
    title = "Connecting to Infinite Flight…";
    message = "Redirecting you to Infinite Flight to authorize your account. Please wait…";
    Icon = Loader2;
    iconClass = "mx-auto h-12 w-12 animate-spin text-primary-400";
  } else if (error === "cancelled") {
    title = "Authorization cancelled";
    message = "You cancelled the Infinite Flight sign-in. You can try again below.";
    Icon = Plane;
    iconClass = "mx-auto h-12 w-12 text-navy-500";
  } else if (error === "failed") {
    title = "Authorization failed";
    message = "Something went wrong while signing in with Infinite Flight. Please try again.";
    Icon = AlertCircle;
    iconClass = "mx-auto h-12 w-12 text-red-400";
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-navy-700/60 bg-navy-800/40 p-8 text-center backdrop-blur-sm">
        <Icon className={iconClass} />
        <h1 className="mt-6 text-2xl font-bold text-white">{title}</h1>
        <p className="mt-2 text-sm text-slate-400">{message}</p>
        {state !== "connecting" && (
          <button
            type="button"
            onClick={handleLogin}
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-primary-500 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-primary-500/25 transition-all duration-300 hover:bg-primary-600 hover:shadow-primary-500/40 focus:outline-none focus:ring-2 focus:ring-primary-500/60"
          >
            Login with Infinite Flight
          </button>
        )}
      </div>
    </div>
  );
}
