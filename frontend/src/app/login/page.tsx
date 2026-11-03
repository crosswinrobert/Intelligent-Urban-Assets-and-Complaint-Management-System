"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.error || "Login failed.");
        return;
      }

      const requested = new URLSearchParams(window.location.search).get("next");
      const allowed =
        requested &&
        (requested.startsWith("/admin/") ||
          requested.startsWith("/worker/") ||
          requested.startsWith("/citizen/"));

      router.replace(allowed ? requested : result.redirectTo);
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-5 py-10">
      <section className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-xl font-bold text-black">U</div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Urban Pulse</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-[var(--text-secondary)]">Email address</label>
            <input id="email" type="email" required autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} className="form-control w-full" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-[var(--text-secondary)]">Password</label>
            <input id="password" type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="form-control w-full" placeholder="Enter your password" />
          </div>

          {error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}

          <button disabled={loading} type="submit" className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
          Secure access to the Urban Pulse management system
        </p>
        <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
          <Link href="/" className="hover:text-emerald-400">Back to home</Link>
        </p>
      </section>
    </main>
  );
}

