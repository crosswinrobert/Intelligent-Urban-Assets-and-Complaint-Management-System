"use client";
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function SettingsPage(){
 const [name,setName]=useState("Urban Pulse");
 const [email,setEmail]=useState("admin@example.com");
 return <DashboardLayout title="Settings"><div className="space-y-6">
  <div><h1 className="text-2xl font-semibold">Settings</h1><p className="mt-1 text-sm text-[var(--text-secondary)]">Basic application preferences.</p></div>
  <form className="panel max-w-xl space-y-4 p-5" onSubmit={e=>{e.preventDefault();alert("These preferences are currently local to this page.");}}>
   <label className="block space-y-2 text-sm">Application Name<input className="form-control w-full" value={name} onChange={e=>setName(e.target.value)}/></label>
   <label className="block space-y-2 text-sm">Administrator Email<input type="email" className="form-control w-full" value={email} onChange={e=>setEmail(e.target.value)}/></label>
   <button className="btn-primary">Save Preferences</button>
   <p className="text-xs text-[var(--text-muted)]">Authentication and persistent settings will be connected through the backend.</p>
  </form>
 </div></DashboardLayout>;
}
