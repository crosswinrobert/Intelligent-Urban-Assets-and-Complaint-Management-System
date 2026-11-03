"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";

const stats=[
 ["Total Complaints","29"],
 ["Total Workers","15"],
 ["Total Assets","16"],
 ["Total Departments","8"],
 ["Resolutions","10"],
 ["Audit Entries","1"],
];

export default function AnalyticsPage(){
 return <DashboardLayout title="Analytics"><div className="space-y-6">
  <div><h1 className="text-2xl font-semibold">Analytics</h1><p className="mt-1 text-sm text-[var(--text-secondary)]">Database summary and operational metrics.</p></div>
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{stats.map(([label,value])=><div className="panel p-5" key={label}><p className="text-sm text-[var(--text-secondary)]">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>)}</div>
  <div className="panel p-5"><h2 className="font-medium">Database reporting</h2><p className="mt-2 text-sm text-[var(--text-secondary)]">These initial counts reflect the supplied sample dataset. We will replace them with SQL aggregate queries and grouped reports through the API.</p></div>
 </div></DashboardLayout>;
}
