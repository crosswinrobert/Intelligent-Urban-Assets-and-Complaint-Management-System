"use client";
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search } from "lucide-react";

export default function SmartSearchPage(){
 const [query,setQuery]=useState("");
 return <DashboardLayout title="Smart Search"><div className="space-y-6">
  <div><h1 className="text-2xl font-semibold">Smart Search</h1><p className="mt-1 text-sm text-[var(--text-secondary)]">Semantic search across citizen complaints.</p></div>
  <div className="panel p-5 space-y-3">
   <label className="text-sm">Describe the issue you are looking for</label>
   <div className="flex flex-wrap gap-3"><input className="form-control min-w-[220px] flex-1" placeholder="e.g. water leaking near a road..." value={query} onChange={e=>setQuery(e.target.value)}/><button disabled={!query.trim()} className="btn-primary flex items-center gap-2" onClick={()=>alert("ChromaDB semantic search will be connected through the backend API.")}><Search size={16}/> Search</button></div>
   <p className="text-xs text-[var(--text-muted)]">ChromaDB integration pending. Search is not yet connected.</p>
  </div>
 </div></DashboardLayout>;
}
