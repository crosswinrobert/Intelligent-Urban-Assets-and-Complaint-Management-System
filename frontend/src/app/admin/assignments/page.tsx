"use client";
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const initial = [
 { complaint: 401, worker: 303, date: "2026-09-01" },
 { complaint: 402, worker: 301, date: "2026-09-02" },
 { complaint: 403, worker: 305, date: "2026-09-03" },
 { complaint: 404, worker: 309, date: "2026-09-04" },
 { complaint: 405, worker: 307, date: "2026-09-05" },
];

export default function AssignmentsPage() {
 const [rows,setRows] = useState(initial);
 const [complaint,setComplaint] = useState("");
 const [worker,setWorker] = useState("");
 const [date,setDate] = useState("");
 const [error,setError] = useState("");
 function add(e:React.FormEvent<HTMLFormElement>) {
  e.preventDefault(); setError("");
  if(rows.some(x=>x.complaint===Number(complaint))) {setError("This complaint already has an assignment in this sample list.");return;}
  setRows([...rows,{complaint:Number(complaint),worker:Number(worker),date}]);
  setComplaint("");setWorker("");setDate("");
 }
 return <DashboardLayout title="Assignments"><div className="space-y-6">
  <div><h1 className="text-2xl font-semibold">Assignments</h1><p className="mt-1 text-sm text-[var(--text-secondary)]">Assign workers to complaints.</p></div>
  <form onSubmit={add} className="panel p-4 grid gap-3 md:grid-cols-4">
   <input required type="number" min="1" placeholder="Complaint ID" className="form-control" value={complaint} onChange={e=>setComplaint(e.target.value)}/>
   <input required type="number" min="1" placeholder="Worker ID" className="form-control" value={worker} onChange={e=>setWorker(e.target.value)}/>
   <input required type="date" className="form-control" value={date} onChange={e=>setDate(e.target.value)}/>
   <button className="btn-primary">Add Assignment</button>
   {error&&<p className="text-sm text-red-400 md:col-span-4">{error}</p>}
  </form>
  <div className="panel overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr>{["Complaint ID","Worker ID","Assigned Date"].map(x=><th className="p-4" key={x}>{x}</th>)}</tr></thead><tbody>{rows.map((x,i)=><tr key={i} className="border-t border-[var(--border)]"><td className="p-4">{x.complaint}</td><td className="p-4">{x.worker}</td><td className="p-4">{x.date}</td></tr>)}</tbody></table></div>
  <p className="text-xs text-[var(--text-muted)]">Sample assignment data based on complaint_worker. Changes are local only.</p>
 </div></DashboardLayout>;
}
