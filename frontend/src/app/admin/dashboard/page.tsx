
"use client";

import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock3,
  ArrowUpRight,
  MapPin,
  MoreHorizontal,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import DashboardLayout from "@/components/layout/DashboardLayout";

const statistics = [
  {
    title: "Total Complaints",
    value: "1,284",
    change: "+12.5%",
    description: "Compared to last month",
    icon: AlertCircle,
    color: "text-sky-400",
    bg: "bg-sky-400/10",
  },
  {
    title: "Pending Complaints",
    value: "186",
    change: "-8.2%",
    description: "Compared to last month",
    icon: Clock3,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    title: "Resolved Complaints",
    value: "1,098",
    change: "+18.4%",
    description: "Compared to last month",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    title: "Registered Assets",
    value: "3,642",
    change: "+5.6%",
    description: "Compared to last month",
    icon: Building2,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
  },
];

const complaintTrend = [
  { month: "May", complaints: 85, resolved: 62 },
  { month: "Jun", complaints: 110, resolved: 88 },
  { month: "Jul", complaints: 95, resolved: 82 },
  { month: "Aug", complaints: 145, resolved: 115 },
  { month: "Sep", complaints: 125, resolved: 108 },
  { month: "Oct", complaints: 170, resolved: 142 },
  { month: "Nov", complaints: 155, resolved: 138 },
];

const recentComplaints = [
  {
    id: "CMP-1024",
    subject: "Streetlight not working",
    location: "Koramangala, Ward 15",
    department: "Electrical",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "CMP-1023",
    subject: "Garbage accumulation",
    location: "Indiranagar, Ward 12",
    department: "Sanitation",
    status: "Pending",
    priority: "Medium",
  },
  {
    id: "CMP-1022",
    subject: "Damaged road surface",
    location: "Jayanagar, Ward 8",
    department: "Roads",
    status: "Resolved",
    priority: "High",
  },
  {
    id: "CMP-1021",
    subject: "Water leakage",
    location: "BTM Layout, Ward 19",
    department: "Water Supply",
    status: "In Progress",
    priority: "Medium",
  },
  {
    id: "CMP-1020",
    subject: "Broken drainage cover",
    location: "HSR Layout, Ward 7",
    department: "Drainage",
    status: "Pending",
    priority: "Low",
  },
];

const departments = [
  { name: "Sanitation", assigned: 42, resolved: 31 },
  { name: "Electrical", assigned: 35, resolved: 28 },
  { name: "Roads", assigned: 28, resolved: 22 },
  { name: "Water Supply", assigned: 24, resolved: 17 },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "In Progress": "bg-sky-400/10 text-sky-400",
    Pending: "bg-amber-400/10 text-amber-400",
    Resolved: "bg-emerald-400/10 text-emerald-400",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] ?? "bg-gray-400/10 text-gray-400"
      }`}
    >
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  return (
    <DashboardLayout
      title="Dashboard"
      description="Here's what's happening across your city."
    >
      <div className="space-y-7">

        {/* Welcome section */}
        <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
              City Overview
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Monitor urban assets and citizen complaints.
            </p>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs text-[var(--text-secondary)]">
            <span className="text-[var(--accent)]">●</span> System overview
          </div>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="panel panel-hover p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {stat.title}
                    </p>
                    <h3 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                      {stat.value}
                    </h3>
                  </div>

                  <div className={`rounded-xl p-3 ${stat.bg} ${stat.color}`}>
                    <Icon size={21} />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 font-medium text-emerald-400">
                    <ArrowUpRight size={14} />
                    {stat.change}
                  </span>
                  <span className="text-[var(--text-muted)]">
                    {stat.description}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Analytics chart */}
        <section className="panel p-5 sm:p-6">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">
                Complaint Analytics
              </h3>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Monthly complaints received and resolved
              </p>
            </div>

            <span className="w-fit rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-secondary)]">
              Last 7 months
            </span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complaintTrend}>
                <defs>
                  <linearGradient id="complaintGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  stroke="var(--text-muted)"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />

                <YAxis
                  stroke="var(--text-muted)"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#19221E",
                    border: "1px solid #29352F",
                    borderRadius: "12px",
                    color: "#F1F5F3",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="complaints"
                  stroke="#22C55E"
                  strokeWidth={2}
                  fill="url(#complaintGradient)"
                />

                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="#38BDF8"
                  strokeWidth={2}
                  fill="url(#resolvedGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex flex-wrap gap-5 text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Complaints received
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              Complaints resolved
            </span>
          </div>
        </section>

        {/* Recent complaints */}
        <section className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">
                Recent Complaints
              </h3>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Latest citizen-reported issues
              </p>
            </div>

            <button className="text-xs font-medium text-[var(--accent)] hover:underline">
              View all
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[var(--surface-hover)] text-xs text-[var(--text-muted)]">
                <tr>
                  <th className="px-5 py-3 font-medium">Complaint</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="px-5 py-3 font-medium">Department</th>
                  <th className="px-5 py-3 font-medium">Priority</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>

              <tbody>
                {recentComplaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="border-t border-[var(--border)] transition-colors hover:bg-[var(--surface-hover)]"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-[var(--text-primary)]">
                        {complaint.subject}
                      </p>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        {complaint.id}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-xs text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} />
                        {complaint.location}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-[var(--text-secondary)]">
                      {complaint.department}
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-xs text-[var(--text-secondary)]">
                        {complaint.priority}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={complaint.status} />
                    </td>

                    <td className="px-5 py-4 text-[var(--text-muted)]">
                      <button aria-label={`More options for ${complaint.id}`}>
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Department performance */}
        <section className="panel p-5 sm:p-6">
          <div className="mb-5">
            <h3 className="font-semibold text-[var(--text-primary)]">
              Department Performance
            </h3>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Assigned versus resolved complaints
            </p>
          </div>

          <div className="space-y-5">
            {departments.map((department) => {
              const percentage = Math.round(
                (department.resolved / department.assigned) * 100
              );

              return (
                <div key={department.name}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm text-[var(--text-primary)]">
                      {department.name}
                    </span>

                    <span className="text-xs text-[var(--text-muted)]">
                      {department.resolved}/{department.assigned} resolved
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-hover)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent)]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}
