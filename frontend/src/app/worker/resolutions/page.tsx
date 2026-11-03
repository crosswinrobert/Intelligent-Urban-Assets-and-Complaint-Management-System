import WorkerLayout from "@/components/layout/WorkerLayout";

const resolutions = [
 { id: "RES-501", complaint: "CMP-0998", description: "Water leakage repaired", date: "02 Nov 2026", status: "Submitted" },
 { id: "RES-497", complaint: "CMP-0982", description: "Streetlight bulb replaced", date: "31 Oct 2026", status: "Approved" },
];

export default function ResolutionsPage() {
 return <WorkerLayout title="Resolutions">
  <div className="mb-7"><h1 className="text-2xl font-bold">Resolutions</h1><p className="mt-1 text-sm text-[#A3B1A9]">Review the resolutions you've submitted.</p></div>
  <div className="mb-5 rounded-xl border border-[#29352F] bg-[#19221E] p-5"><h2 className="mb-2 font-semibold">Submit a resolution</h2><p className="mb-4 text-sm text-[#A3B1A9]">Record the work completed for an assigned complaint. This demo form is not yet connected to the backend.</p><form className="grid gap-4 md:grid-cols-2"><label className="text-sm text-[#A3B1A9]">Complaint ID<input placeholder="e.g. CMP-1024" className="form-control mt-2 w-full"/></label><label className="text-sm text-[#A3B1A9]">Resolution date<input type="date" className="form-control mt-2 w-full"/></label><label className="text-sm text-[#A3B1A9] md:col-span-2">Work completed<textarea rows={3} placeholder="Describe the work completed..." className="form-control mt-2 w-full"/></label><div><button type="button" className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black">Submit resolution</button></div></form></div>
  <div className="rounded-xl border border-[#29352F] bg-[#19221E] p-5"><h2 className="mb-4 font-semibold">Previous submissions</h2><div className="space-y-3">{resolutions.map(r=><div key={r.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-[#29352F] pb-3"><div><p className="font-medium">{r.description}</p><p className="mt-1 text-xs text-[#78877F]">{r.id} ? {r.complaint} ? {r.date}</p></div><span className="rounded-full bg-[#29352F] px-3 py-1 text-xs">{r.status}</span></div>)}</div></div>
 </WorkerLayout>;
}
