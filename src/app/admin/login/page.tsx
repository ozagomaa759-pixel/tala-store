
"use client";

import { useState, type FormEvent } from "react";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading || !password) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({ password }),
      });

      const data: unknown = await response.json().catch(() => null);

      const success =
        typeof data === "object" &&
        data !== null &&
        "success" in data &&
        data.success === true;

      const message =
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string"
          ? data.message
          : "";

      if (!response.ok || !success) {
        setError(message || "Incorrect password. Please try again.");
        return;
      }

      window.location.replace("/admin");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F5F1EB] px-5 py-10 text-[#292720]">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full border border-[#DCD5C9]" />
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full border border-[#DCD5C9]" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[480px] w-[480px] rounded-full border border-[#DCD5C9]" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full border border-[#DCD5C9]" />

      <div className="relative z-10 w-full max-w-[1050px] overflow-hidden rounded-[30px] border border-[#E7E0D5] bg-white shadow-[0_30px_100px_rgba(41,39,32,0.08)]">
        <div className="grid min-h-[620px] md:grid-cols-[1.05fr_0.95fr]">
          <section className="relative flex flex-col justify-between overflow-hidden bg-[#292720] p-8 text-white sm:p-12 md:p-14">
            <div className="pointer-events-none absolute -right-28 top-20 h-80 w-80 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-16 top-32 h-56 w-56 rounded-full border border-white/10" />

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D8ED83] text-[#292720]">
                  <Sparkles size={19} />
                </span>

                <div>
                  <p className="text-lg font-semibold tracking-[0.25em]">
                    TALA
                  </p>
                  <p className="text-[8px] uppercase tracking-[0.25em] text-white/45">
                    Luxury Fashion
                  </p>
                </div>
              </div>

              <div className="mt-24 max-w-md">
                <p className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#D8ED83]">
                  <span className="h-px w-7 bg-[#D8ED83]" />
                  The backstage
                </p>

                <h1 className="mt-7 font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl">
                  Your store.
                  <br />
                  <span className="italic text-[#D8ED83]">
                    Your vision.
                  </span>
                </h1>

                <p className="mt-7 max-w-sm text-sm leading-7 text-white/55">
                  Every collection, every detail, every order. Everything
                  behind the TALA experience starts here.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-20 flex items-center justify-between border-t border-white/15 pt-6">
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">
                Playful Luxury
              </p>
              <span className="text-[9px] tracking-[0.2em] text-[#D8ED83]">
                EST. TALA
              </span>
            </div>
          </section>

          <section className="flex flex-col justify-center px-6 py-12 sm:px-12 md:px-14">
            <div className="mx-auto w-full max-w-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0F2E8] text-[#75845D]">
                <LockKeyhole size={23} strokeWidth={1.5} />
              </div>

              <p className="mt-9 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#87936B]">
                Private access
              </p>

              <h2 className="mt-3 font-serif text-4xl tracking-tight">
                Welcome back.
              </h2>

              <p className="mt-3 text-xs leading-6 text-[#8C8579]">
                Sign in to access your TALA administration workspace.
              </p>

              <form onSubmit={handleLogin} className="mt-10">
                <label
                  htmlFor="admin-password"
                  className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#81796D]"
                >
                  Admin password
                </label>

                <div className="mt-3 flex items-center rounded-xl border border-[#E6E0D6] bg-[#FBFAF7] px-4 transition focus-within:border-[#87936B] focus-within:ring-2 focus-within:ring-[#87936B]/10">
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-[#B7AFA3]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#8C8579] transition hover:bg-[#F0EDE6]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="mt-4 rounded-xl border border-[#E8CFC7] bg-[#FBF1ED] px-4 py-3 text-xs leading-5 text-[#984E3E]"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !password}
                  className="mt-7 flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#292720] text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#454338] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Enter workspace
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-10 flex items-center gap-3 border-t border-[#EEE9E0] pt-6">
                <ShieldCheck size={16} className="shrink-0 text-[#87936B]" />
                <p className="text-[9px] leading-5 text-[#999184]">
                  This area is restricted to authorized TALA administrators.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <p className="absolute bottom-4 left-0 right-0 text-center text-[8px] font-medium uppercase tracking-[0.22em] text-[#A49B8E]">
        TALA / Luxury Fashion
      </p>
    </main>
  );
}
