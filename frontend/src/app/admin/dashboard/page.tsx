"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock3,
  ClipboardList,
  Users,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard")
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok || !j.success) throw Error(j.error || "Dashboard unavailable");
        setData(j);
      })
      .catch((e) => setError(e.message));
  }, []);

  const c = data?.counts || {};

  const stats = [
    { label: "Total Complaints", value: c.total_complaints, icon: ClipboardList, href: "/admin/complaints" },
    { label: "Open Complaints", value: c.open_complaints, icon: Clock3, href: "/admin/complaints" },
    { label: "Resolved Complaints", value: c.resolved_complaints, icon: CheckCircle2, href: "/admin/complaints" },
    { label: "Registered Assets", value: c.total_assets, icon: Building2, href: "/admin/assets" },
    { label: "Workers", value: c.total_workers, icon: Users, href: "/admin/workers" },
    { label: "Departments", value: c.total_departments, icon: AlertCircle, href: "/admin/departments" },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">City Overview</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Overview of urban complaints and assets.
          </p>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((s) => {
            const Icon = s.icon;

            return (
              <Link
                key={s.label}
                href={s.href}
                className="panel panel-hover block cursor-pointer p-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[var(--text-secondary)]">{s.label}</p>
                  <Icon size={19} className="text-emerald-400" strokeWidth={1.8} />
                </div>

                <p className="mt-4 text-3xl font-semibold">
                  {data ? (s.value ?? 0) : "—"}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="panel p-5">
          <h2 className="mb-4 font-semibold">Recent Complaints</h2>

          <div className="divide-y divide-[var(--border)]">
            {(data?.recent || []).map((x: any) => (
              <div
                key={x.complaint_id}
                className="flex flex-wrap justify-between gap-3 py-4 first:pt-1 last:pb-1"
              >
                <div className="min-w-0">
                  <p className="font-medium">
                    #{x.complaint_id} · {x.Category}
                  </p>
                  <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
                    {x.RawDescription}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {[x.Fname, x.Lname].filter(Boolean).join(" ")}
                  </p>
                </div>

                <span className="text-sm text-emerald-400">
                  {x.current_status}
                </span>
              </div>
            ))}

            {data && !data.recent?.length && (
              <p className="py-4 text-sm text-[var(--text-muted)]">
                No complaints recorded.
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
