"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search, Plus, X, Trash2 } from "lucide-react";

const departments = [
  { id: 1, name: "Roads and Transport" },
  { id: 2, name: "Electrical Services" },
  { id: 3, name: "Water Supply" },
  { id: 4, name: "Drainage Department" },
  { id: 5, name: "Traffic Management" },
  { id: 6, name: "Parks and Recreation" },
  { id: 7, name: "Waste Management" },
  { id: 8, name: "Public Infrastructure" },
];

const initialWorkers = [
  { id: 301, first: "Suresh", last: "Kumar", phone: "9100000001", role: "Road Engineer", dept: 1, skills: "Road Repair" },
  { id: 302, first: "Mahesh", last: "Rao", phone: "9100000002", role: "Road Technician", dept: 1, skills: "Pothole Repair" },
  { id: 303, first: "Deepak", last: "Sharma", phone: "9100000003", role: "Electrician", dept: 2, skills: "Streetlight Repair" },
  { id: 304, first: "Ravi", last: "Nair", phone: "9100000004", role: "Electrical Technician", dept: 2, skills: "Electrical Systems" },
  { id: 305, first: "Prakash", last: "Menon", phone: "9100000005", role: "Water Engineer", dept: 3, skills: "Pipeline Repair" },
];

const emptyForm = {
  id: "",
  first: "",
  last: "",
  phone: "",
  role: "",
  dept: "",
  skills: "",
};

export default function WorkersPage() {
  const [workers, setWorkers] = useState(initialWorkers);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filtered = workers.filter((w) =>
    [String(w.id), w.first, w.last, w.phone, w.role, w.skills,
      departments.find((d) => d.id === w.dept)?.name || ""]
      .some((v) => v.toLowerCase().includes(search.toLowerCase()))
  );

  function addWorker(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const id = Number(form.id);
    const phonePattern = /^\d{10,15}$/;

    if (!Number.isInteger(id) || id <= 0) {
      setError("Enter a valid positive Worker ID.");
      return;
    }
    if (workers.some((w) => w.id === id)) {
      setError("This Worker ID already exists.");
      return;
    }
    if (!phonePattern.test(form.phone)) {
      setError("Phone must contain 10 to 15 digits.");
      return;
    }

    setWorkers((prev) => [
      ...prev,
      { ...form, id, dept: Number(form.dept) },
    ]);
    setForm(emptyForm);
    setShowForm(false);
  }

  function updateField(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={17} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workers..."
              className="form-control w-full pl-10"
            />
          </div>
          <button onClick={() => { setError(""); setShowForm(true); }}
            className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Worker
          </button>
        </div>

        <div className="panel overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border)] text-[var(--text-secondary)]">
              <tr>
                {["Worker ID", "Name", "Phone", "Role", "Department", "Skills"].map((h) => (
                  <th key={h} className="p-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((w) => (
                <tr key={w.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="p-4">{w.id}</td>
                  <td className="p-4 font-medium">{w.first} {w.last}</td>
                  <td className="p-4">{w.phone}</td>
                  <td className="p-4">{w.role}</td>
                  <td className="p-4">{departments.find((d) => d.id === w.dept)?.name}</td>
                  <td className="p-4">{w.skills || "?"}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-[var(--text-muted)]">No workers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-[var(--text-muted)]">
          Showing {filtered.length} of {workers.length} workers. Changes are currently local and are not saved to MySQL.
        </p>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="panel max-h-[90vh] w-full max-w-xl overflow-y-auto p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Add Worker</h2>
                <button onClick={() => setShowForm(false)} aria-label="Close form">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={addWorker} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    ["id", "Worker ID", "number"],
                    ["first", "First Name", "text"],
                    ["last", "Last Name", "text"],
                    ["phone", "Phone", "tel"],
                    ["role", "Role", "text"],
                    ["skills", "Skills", "text"],
                  ].map(([field, label, type]) => (
                    <label key={field} className="space-y-2 text-sm">
                      <span>{label}</span>
                      <input
                        type={type}
                        required
                        min={type === "number" ? 1 : undefined}
                        value={form[field as keyof typeof emptyForm]}
                        onChange={(e) => updateField(field as keyof typeof emptyForm, e.target.value)}
                        className="form-control w-full"
                        placeholder={label}
                      />
                    </label>
                  ))}

                  <label className="space-y-2 text-sm sm:col-span-2">
                    <span>Department</span>
                    <select required value={form.dept}
                      onChange={(e) => updateField("dept", e.target.value)}
                      className="form-control w-full">
                      <option value="">Select department</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.id} ? {d.name}</option>
                      ))}
                    </select>
                  </label>
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Add Worker
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
