import WorkerLayout from "@/components/layout/WorkerLayout";
import { ClipboardList, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const stats = [
  { label: "Total Assignments", value: "12", icon: ClipboardList, color: "text-sky-400" },
  { label: "Pending Tasks", value: "04", icon: Clock, color: "text-amber-400" },
  { label: "Completed", value: "08", icon: CheckCircle2, color: "text-emerald-400" },
  { label: "High Priority", value: "02", icon: AlertCircle, color: "text-red-400" },
];

const tasks = [
  { id: "CMP-1024", title: "Streetlight malfunction", location: "Jayanagar, Bengaluru", priority: "High", status: "In Progress" },
  { id: "CMP-1028", title: "Garbage accumulation", location: "BTM Layout, Bengaluru", priority: "Medium", status: "Pending" },
  { id: "CMP-1031", title: "Damaged road surface", location: "JP Nagar, Bengaluru", priority: "High", status: "Pending" },
];

export default function WorkerDashboard() {
  return <WorkerLayout title="Dashboard">
    <div className="mb-7"><h1 className="text-2xl font-bold">Good day, Worker!</h1><p className="mt-1 text-sm text-[#A3B1A9]">Here's an overview of your field activities.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(s => { const Icon = s.icon; return <div key={s.label} className="rounded-xl border border-[#29352F] bg-[#19221E] p-5"><div className="flex justify-between"><p className="text-sm text-[#A3B1A9]">{s.label}</p><Icon className={s.color}/></div><p className="mt-4 text-3xl font-bold">{s.value}</p></div>; })}
    </div>
    <section className="mt-8 rounded-xl border border-[#29352F] bg-[#19221E] p-5">
      <h2 className="mb-5 text-lg font-semibold">Recent Assignments</h2>
      <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="text-[#78877F]"><tr><th className="pb-3">Complaint</th><th>Location</th><th>Priority</th><th>Status</th></tr></thead><tbody>{tasks.map(t => <tr key={t.id} className="border-t border-[#29352F]"><td className="py-4"><p className="font-medium">{t.title}</p><p className="text-xs text-[#78877F]">{t.id}</p></td><td className="text-[#A3B1A9]">{t.location}</td><td><span className={t.priority === "High" ? "text-red-400" : "text-amber-400"}>{t.priority}</span></td><td><span className="rounded-full bg-[#29352F] px-3 py-1 text-xs">{t.status}</span></td></tr>)}</tbody></table></div>
    </section>
  </WorkerLayout>;
}
