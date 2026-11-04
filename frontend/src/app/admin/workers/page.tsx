"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search, Plus, RefreshCw, X } from "lucide-react";

type Worker = {
  staff_id: number;
  user_id: number;
  Fname: string;
  Lname: string;
  Email: string;
  Role: string;
  dept_id: number | null;
  Position: string | null;
  HireDate: string | null;
  Salary: string | number | null;
  dept_name: string | null;
  phone: string | null;
};

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [form, setForm] = useState({ Fname: "", Lname: "", Email: "", password: "", PhoneNumber: "", Position: "", dept_id: "", HireDate: "", Salary: "" });

  async function fetchWorkers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/workers");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to load workers.");
      }

      setWorkers(result.workers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWorkers();
    fetch("/api/departments").then(r => r.json()).then(j => { if (j.success) setDepartments(j.departments || []); }).catch(() => {});
  }, []);

  async function addWorker(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError("");
    try {
      const response = await fetch("/api/workers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Unable to create worker.");
      setShowForm(false);
      setForm({ Fname: "", Lname: "", Email: "", password: "", PhoneNumber: "", Position: "", dept_id: "", HireDate: "", Salary: "" });
      await fetchWorkers();
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to create worker."); }
  }

  const filtered = useMemo(() => {
    const term = search.toLowerCase();

    return workers.filter((worker) =>
      [
        String(worker.staff_id),
        worker.Fname,
        worker.Lname,
        worker.Email,
        worker.phone || "",
        worker.Position || "",
        worker.dept_name || "",
      ].some((value) => value.toLowerCase().includes(term))
    );
  }, [workers, search]);

  return (
    <DashboardLayout title="Workers">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Workers</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Manage municipal workers and department assignments.
          </p>
        </div>

        <div className="panel flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              size={17}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workers..."
              className="form-control w-full pl-10"
            />
          </div>

          <button
            onClick={fetchWorkers}
            disabled={loading}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button type="button" onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Worker
          </button>
        </div>

        <div className="panel overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border)] text-[var(--text-secondary)]">
              <tr>
                {[
                  "Worker ID",
                  "Name",
                  "Email",
                  "Phone",
                  "Position",
                  "Department",
                ].map((heading) => (
                  <th key={heading} className="p-4 font-medium">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-[var(--text-muted)]">
                    Loading workers...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-red-400">
                    {error}
                    <button
                      onClick={fetchWorkers}
                      className="ml-2 underline"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : (
                <>
                  {filtered.map((worker) => (
                    <tr
                      key={worker.staff_id}
                      className="border-b border-[var(--border)] last:border-0"
                    >
                      <td className="p-4">{worker.staff_id}</td>
                      <td className="p-4 font-medium">
                        {worker.Fname} {worker.Lname}
                      </td>
                      <td className="p-4">{worker.Email}</td>
                      <td className="p-4">{worker.phone || "—"}</td>
                      <td className="p-4">{worker.Position || "—"}</td>
                      <td className="p-4">{worker.dept_name || "Unassigned"}</td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-6 text-center text-[var(--text-muted)]"
                      >
                        No workers found.
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-[var(--text-muted)]">Showing {filtered.length} of {workers.length} workers. Data is retrieved directly from MySQL.</p>
        {showForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><div className="panel max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold">Add Worker</h2><button onClick={() => setShowForm(false)} aria-label="Close"><X size={20}/></button></div><form onSubmit={addWorker} className="grid gap-4 sm:grid-cols-2">{([ ["Fname","First name"],["Lname","Last name"],["Email","Email"],["password","Temporary password (min 10 characters)"],["PhoneNumber","Phone number"],["Position","Position"],["HireDate","Hire date"],["Salary","Salary"] ] as const).map(([key,label])=><label key={key} className="space-y-1 text-sm"><span>{label}</span><input required={!["PhoneNumber","HireDate","Salary","Position"].includes(key)} type={key==="Email"?"email":key==="HireDate"?"date":key==="Salary"?"number":key==="password"?"password":"text"} min={key==="Salary"?0:undefined} minLength={key==="password"?10:undefined} className="form-control w-full" value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}/></label>)}<label className="space-y-1 text-sm sm:col-span-2"><span>Department</span><select className="form-control w-full" value={form.dept_id} onChange={e=>setForm(p=>({...p,dept_id:e.target.value}))}><option value="">Unassigned</option>{departments.map(d=><option key={d.dept_id} value={d.dept_id}>{d.dept_name}</option>)}</select></label>{error&&<p className="text-sm text-red-400 sm:col-span-2">{error}</p>}<div className="flex justify-end gap-3 sm:col-span-2"><button type="button" className="btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button><button className="btn-primary">Create Worker</button></div></form></div></div>}
      </div>
    </DashboardLayout>
  );
}
