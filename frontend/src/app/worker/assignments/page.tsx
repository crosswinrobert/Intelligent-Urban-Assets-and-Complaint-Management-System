import WorkerLayout from "@/components/layout/WorkerLayout";

const assignments = [
  { id: "CMP-1024", task: "Streetlight malfunction", location: "Jayanagar", date: "03 Nov 2026", priority: "High", status: "In Progress" },
  { id: "CMP-1028", task: "Garbage accumulation", location: "BTM Layout", date: "02 Nov 2026", priority: "Medium", status: "Pending" },
  { id: "CMP-1031", task: "Damaged road surface", location: "JP Nagar", date: "02 Nov 2026", priority: "High", status: "Pending" },
  { id: "CMP-0998", task: "Water leakage", location: "Banashankari", date: "01 Nov 2026", priority: "Low", status: "Completed" },
];

export default function AssignmentsPage() {
 return <WorkerLayout title="My Assignments">
  <div className="mb-7"><h1 className="text-2xl font-bold">My Assignments</h1><p className="mt-1 text-sm text-[#A3B1A9]">View and manage complaints assigned to you.</p></div>
  <div className="mb-5 grid gap-3 sm:grid-cols-3">{[["All Assignments","12"],["Pending","04"],["Completed","08"]].map(x=><div key={x[0]} className="rounded-xl border border-[#29352F] bg-[#19221E] p-4"><p className="text-sm text-[#A3B1A9]">{x[0]}</p><p className="mt-2 text-2xl font-bold">{x[1]}</p></div>)}</div>
  <div className="overflow-x-auto rounded-xl border border-[#29352F] bg-[#19221E] p-5"><table className="w-full min-w-[700px] text-left text-sm"><thead className="text-[#78877F]"><tr><th className="pb-4">Complaint</th><th>Location</th><th>Assigned Date</th><th>Priority</th><th>Status</th></tr></thead><tbody>{assignments.map(a=><tr key={a.id} className="border-t border-[#29352F]"><td className="py-4"><p className="font-medium">{a.task}</p><p className="text-xs text-[#78877F]">{a.id}</p></td><td>{a.location}</td><td>{a.date}</td><td className={a.priority==="High"?"text-red-400":a.priority==="Medium"?"text-amber-400":"text-emerald-400"}>{a.priority}</td><td><span className="rounded-full bg-[#29352F] px-3 py-1 text-xs">{a.status}</span></td></tr>)}</tbody></table></div>
 </WorkerLayout>;
}
