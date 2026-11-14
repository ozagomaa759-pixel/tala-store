
"use client";

import { useState } from "react";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

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
        setError(message || "Incorrect password.");
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
    <main className="min-h-screen bg-[#F8F5F0] px-6 flex items-center justify-center text-[#332A23]">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light tracking-[0.25em]">
            TALA
          </h1>

          <p className="mt-3 text-[10px] uppercase tracking-[0.45em] text-[#A28A72]">
            Administration
          </p>
        </div>

        <div className="border border-[#E5DACE] bg-white/70 p-8 sm:p-10 shadow-sm">
          <div className="text-center mb-9">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#E5DACE]">
              <LockKeyhole size={22} strokeWidth={1.2} />
            </div>

            <h2 className="mt-6 text-3xl font-light">
              Welcome Back
            </h2>

            <p className="mt-3 text-sm text-[#8A7969]">
              Enter your password to continue
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <label
              htmlFor="password"
              className="mb-3 block text-[10px] uppercase tracking-[0.25em] text-[#8A7969]"
            >
              Password
            </label>

            <div className="flex items-center border border-[#E5DACE] bg-[#FCFAF7] px-4">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-[#B8AA9D]"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="text-[#8A7969]"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="mt-7 flex h-14 w-full items-center justify-center gap-3 bg-[#332A23] text-xs uppercase tracking-[0.2em] text-white transition hover:bg-[#514337] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Please wait..." : "Enter Dashboard"}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] tracking-[0.2em] text-[#A28A72]">
            TALA — YOUR STORE, YOUR VISION.
          </p>
        </div>

        <p className="mt-7 text-center text-[10px] tracking-widest text-[#A28A72]">
          PRIVATE ADMINISTRATION ACCESS
        </p>
      </div>
    </main>
  );
}
