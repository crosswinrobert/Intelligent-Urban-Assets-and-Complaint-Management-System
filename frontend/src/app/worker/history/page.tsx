import WorkerLayout from "@/components/layout/WorkerLayout";

const history = [
 { id: "CMP-0998", task: "Water leakage", location: "Banashankari", completed: "02 Nov 2026", result: "Resolved" },
 { id: "CMP-0982", task: "Streetlight repair", location: "Vijayanagar", completed: "31 Oct 2026", result: "Resolved" },
 { id: "CMP-0964", task: "Waste collection", location: "Jayanagar", completed: "29 Oct 2026", result: "Resolved" },
];

export default function HistoryPage() {
 return <WorkerLayout title="Work History">
  <div className="mb-7"><h1 className="text-2xl font-bold">Work History</h1><p className="mt-1 text-sm text-[#A3B1A9]">A record of your previously completed assignments.</p></div>
  <div className="rounded-xl border border-[#29352F] bg-[#19221E] p-5"><div className="mb-5 flex items-center justify-between"><h2 className="font-semibold">Completed assignments</h2><span className="text-sm text-[#A3B1A9]">3 records</span></div><div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead className="text-[#78877F]"><tr><th className="pb-4">Complaint</th><th>Location</th><th>Completed</th><th>Result</th></tr></thead><tbody>{history.map(h=><tr key={h.id} className="border-t border-[#29352F]"><td className="py-4"><p className="font-medium">{h.task}</p><p className="text-xs text-[#78877F]">{h.id}</p></td><td>{h.location}</td><td>{h.completed}</td><td className="text-emerald-400">{h.result}</td></tr>)}</tbody></table></div></div>
 </WorkerLayout>;
}
