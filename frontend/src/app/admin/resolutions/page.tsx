"use client";
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const initial = [
 { id:501,date:"2026-09-04",notes:"Pipeline leakage repaired successfully",sla:"Within SLA",complaint:403 },
 { id:502,date:"2026-09-08",notes:"Park lighting repaired",sla:"Within SLA",complaint:406 },
 { id:503,date:"2026-09-11",notes:"Water pressure restored",sla:"Within SLA",complaint:409 },
 { id:504,date:"2026-09-13",notes:"Drain blockage cleared",sla:"Within SLA",complaint:411 },
 { id:505,date:"2026-09-15",notes:"Park maintenance completed",sla:"Within SLA",complaint:412 },
];

export default function ResolutionsPage() {
 const [rows,setRows]=useState(initial);
 const [form,setForm]=useState({id:"",date:"",notes:"",sla:"Pending",complaint:""});
 const [error,setError]=useState("");
 function add(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();setError("");
  if(rows.some(x=>x.id===Number(form.id))){setError("Resolution ID already exists.");return;}
  if(rows.some(x=>x.complaint===Number(form.complaint))){setError("A resolution already exists for this complaint in this sample list.");return;}
  setRows([...rows,{...form,id:Number(form.id),complaint:Number(form.complaint)}]);
  setForm({id:"",date:"",notes:"",sla:"Pending",complaint:""});
 }
 return <DashboardLayout title="Resolutions"><div className="space-y-6">
  <div><h1 className="text-2xl font-semibold">Resolutions</h1><p className="mt-1 text-sm text-[var(--text-secondary)]">Track complaint resolutions and SLA status.</p></div>
  <form onSubmit={add} className="panel grid gap-3 p-4 md:grid-cols-2">
   <input required type="number" min="1" placeholder="Resolution ID" className="form-control" value={form.id} onChange={e=>setForm({...form,id:e.target.value})}/>
   <input required type="number" min="1" placeholder="Complaint ID" className="form-control" value={form.complaint} onChange={e=>setForm({...form,complaint:e.target.value})}/>
   <input required type="date" className="form-control" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
   <select className="form-control" value={form.sla} onChange={e=>setForm({...form,sla:e.target.value})}><option>Pending</option><option>Within SLA</option><option>Breached SLA</option></select>
   <textarea required maxLength={500} placeholder="Resolution notes" className="form-control md:col-span-2" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/>
   {error&&<p className="text-sm text-red-400 md:col-span-2">{error}</p>}
   <button className="btn-primary md:col-span-2">Add Resolution</button>
  </form>
  <div className="panel overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{["Resolution ID","Complaint ID","Date","Notes","SLA Status"].map(x=><th className="p-4" key={x}>{x}</th>)}</tr></thead><tbody>{rows.map(x=><tr key={x.id} className="border-t border-[var(--border)]"><td className="p-4">{x.id}</td><td className="p-4">{x.complaint}</td><td className="p-4">{x.date}</td><td className="p-4">{x.notes}</td><td className="p-4">{x.sla}</td></tr>)}</tbody></table></div>
  <p className="text-xs text-[var(--text-muted)]">Illustrative records. Database constraints and API integration pending.</p>
 </div></DashboardLayout>;
}
