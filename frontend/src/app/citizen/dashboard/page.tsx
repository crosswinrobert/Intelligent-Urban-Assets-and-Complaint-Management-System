import Link from "next/link";
import CitizenLayout from "@/components/layout/CitizenLayout";
import { FileText, Clock, CheckCircle2, PlusCircle } from "lucide-react";

const stats = [
  { label: "Total Complaints", value: "05", icon: FileText, color: "text-sky-400" },
  { label: "Under Review", value: "02", icon: Clock, color: "text-amber-400" },
  { label: "Resolved", value: "03", icon: CheckCircle2, color: "text-emerald-400" },
];

export default function CitizenDashboard() {
  return <CitizenLayout title="Dashboard">
    <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-2xl font-bold">Welcome back!</h1><p className="mt-1 text-sm text-[#A3B1A9]">Report issues and track the progress of your complaints.</p></div>
      <Link href="/citizen/submit" className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-black"><PlusCircle size={17}/> Submit Complaint</Link>
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map(s=>{const Icon=s.icon;return <div key={s.label} className="rounded-xl border border-[#29352F] bg-[#19221E] p-5"><div className="flex justify-between"><p className="text-sm text-[#A3B1A9]">{s.label}</p><Icon className={s.color}/></div><p className="mt-4 text-3xl font-bold">{s.value}</p></div>;})}
    </div>
    <section className="mt-8 rounded-xl border border-[#29352F] bg-[#19221E] p-5">
      <div className="mb-5 flex items-center justify-between"><h2 className="font-semibold">Recent Complaints</h2><Link href="/citizen/complaints" className="text-sm text-emerald-400">View all</Link></div>
      <div className="space-y-4">
        {[["CMP-1024","Streetlight not working","Jayanagar","In Progress"],["CMP-1028","Garbage not collected","BTM Layout","Pending"],["CMP-0982","Water leakage","Banashankari","Resolved"]].map(c=><div key={c[0]} className="flex flex-wrap items-center justify-between gap-3 border-b border-[#29352F] pb-4 last:border-0"><div><p className="font-medium">{c[1]}</p><p className="mt-1 text-xs text-[#78877F]">{c[0]} ? {c[2]}</p></div><span className="rounded-full bg-[#29352F] px-3 py-1 text-xs">{c[3]}</span></div>)}
      </div>
    </section>
    <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5"><h2 className="font-semibold text-emerald-400">Help improve your neighbourhood</h2><p className="mt-2 text-sm text-[#A3B1A9]">Report damaged roads, waste accumulation, broken streetlights and other civic issues.</p></div>
  </CitizenLayout>;
}
