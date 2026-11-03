"use client";
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search } from "lucide-react";

const data = [
  { id: 201, type: "Streetlight", date: "2022-01-15", location: "Indiranagar 12th Main", status: "Operational" },
  { id: 202, type: "Road", date: "2020-06-10", location: "Koramangala 5th Block", status: "Damaged" },
  { id: 203, type: "Water Pipeline", date: "2019-03-20", location: "Whitefield Main Road", status: "Operational" },
  { id: 204, type: "Traffic Signal", date: "2021-08-12", location: "Silk Board Junction", status: "Operational" },
  { id: 205, type: "Drainage System", date: "2018-11-05", location: "HSR Layout Sector 2", status: "Under Maintenance" },
  { id: 206, type: "Public Park", date: "2020-02-18", location: "Jayanagar 4th Block", status: "Operational" },
];

export default function AssetsPage() {
  const [search, setSearch] = useState("");
  const rows = data.filter(x => Object.values(x).join(" ").toLowerCase().includes(search.toLowerCase()));
  return <DashboardLayout title="Assets"><div className="space-y-6">
    <div><h1 className="text-2xl font-semibold">Assets</h1><p className="text-sm text-[var(--text-secondary)] mt-1">Urban infrastructure asset records.</p></div>
    <div className="panel p-4 relative"><Search className="absolute left-7 top-7 text-[var(--text-muted)]" size={17}/><input className="form-control w-full pl-10" placeholder="Search assets..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
    <div className="panel overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr>{["Asset ID","Type","Install Date","Location","Operational Status"].map(x=><th className="p-4" key={x}>{x}</th>)}</tr></thead><tbody>{rows.map(x=><tr className="border-t border-[var(--border)]" key={x.id}><td className="p-4">{x.id}</td><td className="p-4">{x.type}</td><td className="p-4">{x.date}</td><td className="p-4">{x.location}</td><td className="p-4">{x.status}</td></tr>)}</tbody></table></div>
    <p className="text-xs text-[var(--text-muted)]">Illustrative records. MySQL integration pending.</p>
  </div></DashboardLayout>;
}
