"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="up-login">
      <div className="up-login-grid" aria-hidden="true" />

      <div className="up-login-layout">
        <section className="up-brand">

          <h1 className="up-project-title">Intelligent Urban Assets <span>& Complaint Management System</span></h1>

          <div className="up-brand-rule" />

          <p className="up-description">
            A unified platform for managing urban assets, tracking civic
            complaints, and improving the services that keep our communities running.
          </p>
        </section>

        <section className="up-login-panel">
          <div className="up-form-heading">
            <p className="up-eyebrow">WELCOME BACK</p>
            <h2>Sign in</h2>
            <p>Enter your account details to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="up-form">
            <div className="up-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
              />
            </div>

            <div className="up-field">
              <div className="up-password-label">
                <label htmlFor="password">Password</label>
              </div>

              <div className="up-password-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="up-show-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="up-error">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="up-submit"
            >
              {loading ? "Signing in..." : "Continue"}
              {!loading && <span aria-hidden="true">→</span>}
            </button>
          </form>
        </section>
      </div>

      <footer className="up-footer">
        
        <a
          href="https://github.com/crosswinrobert/Intelligent-Urban-Assets-and-Complaint-Management-System"
          target="_blank"
          rel="noopener noreferrer"
        >
          View project on GitHub ↗
        </a>
      </footer>
    </main>
  );
}




