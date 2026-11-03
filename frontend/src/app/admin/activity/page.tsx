"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";

const logs=[
 {id:1,complaint:401,old:"Resolved",next:"Closed",date:"2026-10-04 16:30:07"},
];

export default function ActivityPage(){
 return <DashboardLayout title="Activity Logs"><div className="space-y-6">
  <div><h1 className="text-2xl font-semibold">Activity Logs</h1><p className="mt-1 text-sm text-[var(--text-secondary)]">Complaint status change history.</p></div>
  <div className="panel overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr>{["Audit ID","Complaint ID","Old Status","New Status","Changed At"].map(x=><th className="p-4" key={x}>{x}</th>)}</tr></thead><tbody>{logs.map(x=><tr key={x.id} className="border-t border-[var(--border)]"><td className="p-4">{x.id}</td><td className="p-4">{x.complaint}</td><td className="p-4">{x.old}</td><td className="p-4">{x.next}</td><td className="p-4">{x.date}</td></tr>)}</tbody></table></div>
  <p className="text-xs text-[var(--text-muted)]">Based on complaint_status_audit. Live audit records will be loaded from MySQL.</p>
 </div></DashboardLayout>;
}
