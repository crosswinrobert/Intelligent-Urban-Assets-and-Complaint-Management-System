"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import CitizenLayout from "@/components/layout/CitizenLayout";

type Citizen = {
  user_id: number;
  Fname: string;
  Lname: string;
  Email: string;
  Role: string;
};

type Complaint = {
  complaint_id: number;
  Category: string;
  RawDescription: string;
  SubmittedAt: string;
  UrgencyScore: number;
  current_status: string;
};

function statusStyle(status: string) {
  switch (status) {
    case "Resolved":
      return "bg-emerald-500/10 text-emerald-400";
    case "In Progress":
      return "bg-amber-500/10 text-amber-400";
    case "Rejected":
      return "bg-red-500/10 text-red-400";
    default:
      return "bg-slate-500/10 text-slate-300";
  }
}

export default function CitizenDashboard() {
  const [user, setUser] = useState<Citizen | null>(null);
  const [rows, setRows] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const meResponse = await fetch("/api/auth/me", {
        cache: "no-store",
      });

      const me = await meResponse.json();

      if (!meResponse.ok || !me.success || !me.user) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      if (me.user.Role !== "Citizen") {
        throw new Error("This dashboard is available to citizen accounts only.");
      }

      setUser(me.user);

      const complaintsResponse = await fetch("/api/complaints", {
        cache: "no-store",
      });

      const data = await complaintsResponse.json();

      if (!complaintsResponse.ok || !data.success) {
        throw new Error(data.error || "Unable to load your complaints.");
      }

      setRows(data.complaints || []);
    } catch (err) {
      setRows([]);
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const total = rows.length;
  const inProgress = rows.filter(
    (c) => c.current_status === "In Progress"
  ).length;
  const resolved = rows.filter(
    (c) => c.current_status === "Resolved"
  ).length;

  const stats = [
    {
      label: "Total Complaints",
      value: total,
      description: "All submitted complaints",
    },
    {
      label: "In Progress",
      value: inProgress,
      description: "Currently being addressed",
    },
    {
      label: "Resolved",
      value: resolved,
      description: "Successfully completed",
    },
  ];

  return (
    <CitizenLayout title="Citizen Dashboard">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome{user ? `, ${user.Fname}` : ""}
          </h1>
          <p className="mt-2 text-sm text-[#A3B1A9]">
            Here's an overview of your submitted complaints.
          </p>
          {user && (
            <p className="mt-1 text-xs text-[#78877F]">
              Signed in as {user.Email}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => void loadDashboard()}
          disabled={loading}
          className="rounded-lg border border-[#405148] px-4 py-2.5 text-sm font-medium transition hover:bg-[#19221E] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{error}</p>
          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="mt-3 text-sm font-medium text-red-300 underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="mb-7 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[#29352F] bg-[#19221E] p-5"
          >
            <p className="text-sm text-[#A3B1A9]">{stat.label}</p>
            <p className="mt-3 text-3xl font-bold tabular-nums">
              {loading ? "—" : stat.value}
            </p>
            <p className="mt-2 text-xs text-[#78877F]">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-xl border border-[#29352F] bg-[#19221E]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#29352F] p-5">
          <div>
            <h2 className="font-semibold">Recent complaints</h2>
            <p className="mt-1 text-xs text-[#78877F]">
              Your five most recently submitted complaints
            </p>
          </div>

          <Link
            href="/citizen/complaints"
            className="text-sm font-medium text-[#A3BDA5] hover:text-white"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-[#A3B1A9]">
            Loading your complaints...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-sm text-[#A3B1A9]">
            Your complaints could not be displayed.
          </div>
        ) : rows.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#26352D] text-xl text-[#A3BDA5]">
              +
            </div>
            <h3 className="font-semibold">No complaints yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[#A3B1A9]">
              You haven't submitted any complaints. Report an issue in your
              neighbourhood to get started.
            </p>
            <Link
              href="/citizen/submit"
              className="mt-5 inline-flex rounded-lg bg-[#9BB69F] px-5 py-2.5 text-sm font-semibold text-[#101713] transition hover:bg-[#B0C8B3]"
            >
              Submit a complaint
            </Link>
          </div>
        ) : (
          <div>
            {rows.slice(0, 5).map((complaint, index) => (
              <div
                key={complaint.complaint_id}
                className={`p-5 ${
                  index !== Math.min(rows.length, 5) - 1
                    ? "border-b border-[#29352F]"
                    : ""
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#78877F]">
                      Complaint #{complaint.complaint_id}
                    </p>
                    <h3 className="mt-1 font-medium">
                      {complaint.Category}
                    </h3>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(
                      complaint.current_status
                    )}`}
                  >
                    {complaint.current_status}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-[#A3B1A9] line-clamp-2">
                  {complaint.RawDescription}
                </p>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#78877F]">
                  <span>
                    Submitted:{" "}
                    {complaint.SubmittedAt
                      ? new Date(complaint.SubmittedAt).toLocaleDateString()
                      : "Date unavailable"}
                  </span>
                  <span>Urgency: {complaint.UrgencyScore}/5</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </CitizenLayout>
  );
}