"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setError(data.message || "Login failed.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-navy px-4 py-24">
      <div className="pointer-events-none absolute inset-0 grid-blueprint opacity-40" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_30%,rgba(24,59,86,0.05),transparent_70%)]" aria-hidden />

      <div className="relative w-full max-w-md border border-line bg-white p-8 shadow-[0_30px_80px_-60px_rgba(24,43,58,0.6)]">
        <Logo />
        <div className="mt-8 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-clear" />
          <p className="label text-tech">Control room access</p>
        </div>
        <h1 className="mt-4 font-display text-3xl uppercase leading-none tracking-[-0.03em] text-eng">
          Admin sign in
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Enquiries and the project register are managed here. Access is session-based and role-controlled.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="field-label mb-1 block">Email</span>
            <input
              className="field"
              name="email"
              type="email"
              required
              autoComplete="username"
              defaultValue=""
              placeholder="admin@sig-tel.com"
            />
          </label>
          <label className="block">
            <span className="field-label mb-1 block">Password</span>
            <input className="field" name="password" type="password" required autoComplete="current-password" />
          </label>

          {error ? (
            <p className="border-l-2 border-signal bg-signal/[0.06] px-3 py-2 text-sm text-signal">{error}</p>
          ) : null}

          <button type="submit" disabled={loading} className="btn btn-solid w-full disabled:opacity-60">
            <span>{loading ? "Verifying…" : "Sign in"}</span>
          </button>
        </form>

        <div className="mt-8 border-t border-line pt-5">
          <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-tech">
            Demo credentials are documented in README.md · Set ADMIN_EMAIL / ADMIN_PASSWORD to override.
          </p>
          <Link href="/" className="mt-3 inline-block text-sm text-muted hover:text-ink">
            ← Back to the website
          </Link>
        </div>
      </div>
    </div>
  );
}
