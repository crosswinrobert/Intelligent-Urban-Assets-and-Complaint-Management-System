"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search, Plus, X, Trash2 } from "lucide-react";

type Department = {
  Dept_ID: number;
  DName: string;
  Location: string;
  Phone: string;
};

const initialDepartments: Department[] = [
  { Dept_ID: 1, DName: "Roads and Transport", Location: "Central Zone", Phone: "9876500001" },
  { Dept_ID: 2, DName: "Electrical Services", Location: "North Zone", Phone: "9876500002" },
  { Dept_ID: 3, DName: "Water Supply", Location: "East Zone", Phone: "9876500003" },
  { Dept_ID: 4, DName: "Drainage Department", Location: "South Zone", Phone: "9876500004" },
  { Dept_ID: 5, DName: "Traffic Management", Location: "West Zone", Phone: "9876500005" },
  { Dept_ID: 6, DName: "Parks and Recreation", Location: "Central Zone", Phone: "9876500006" },
  { Dept_ID: 7, DName: "Waste Management", Location: "North Zone", Phone: "9876500007" },
  { Dept_ID: 8, DName: "Public Infrastructure", Location: "East Zone", Phone: "9876500008" },
];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ Dept_ID: "", DName: "", Location: "", Phone: "" });

  const filtered = departments.filter((d) =>
    [String(d.Dept_ID), d.DName, d.Location, d.Phone]
      .some((v) => v.toLowerCase().includes(search.toLowerCase()))
  );

  function addDepartment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const id = Number(form.Dept_ID);
    if (!Number.isInteger(id) || id <= 0) {
      setError("Enter a valid department ID.");
      return;
    }
    if (departments.some((d) => d.Dept_ID === id)) {
      setError("Department ID already exists.");
      return;
    }
    if (departments.some((d) => d.Phone === form.Phone)) {
      setError("Phone number already exists.");
      return;
    }
    if (!/^\d{10,15}$/.test(form.Phone)) {
      setError("Enter a valid phone number (10?15 digits).");
      return;
    }

    setDepartments((prev) => [...prev, { ...form, Dept_ID: id }]);
    setForm({ Dept_ID: "", DName: "", Location: "", Phone: "" });
    setShowForm(false);
  }

  function deleteDepartment(id: number) {
    if (!window.confirm("Delete this department from the local list?")) return;
    setDepartments((prev) => prev.filter((d) => d.Dept_ID !== id));
  }

  return (
    <DashboardLayout title="Departments">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Departments</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Manage municipal departments and their contact details.
          </p>
        </div>

        <div className="panel flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search departments..." className="form-control w-full pl-10" />
          </div>
          <button onClick={() => { setError(""); setShowForm(true); }}
            className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Department
          </button>
        </div>

        <div className="panel overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border)] text-[var(--text-secondary)]">
              <tr>
                {["Department ID", "Department Name", "Location", "Phone", "Action"].map((h) => (
                  <th key={h} className="p-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.Dept_ID} className="border-b border-[var(--border)] last:border-0">
                  <td className="p-4">{d.Dept_ID}</td>
                  <td className="p-4 font-medium">{d.DName}</td>
                  <td className="p-4">{d.Location || "?"}</td>
                  <td className="p-4">{d.Phone || "?"}</td>
                  <td className="p-4">
                    <button onClick={() => deleteDepartment(d.Dept_ID)}
                      title="Remove from local list" className="text-[var(--text-muted)] hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-[var(--text-muted)]">No departments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-[var(--text-muted)]">
          Showing {filtered.length} of {departments.length} departments. Changes are local until API integration.
        </p>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="panel w-full max-w-lg p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Add Department</h2>
                <button onClick={() => setShowForm(false)} aria-label="Close"><X size={20} /></button>
              </div>
              <form onSubmit={addDepartment} className="space-y-4">
                {([
                  ["Dept_ID", "Department ID", "number"],
                  ["DName", "Department Name", "text"],
                  ["Location", "Location / Zone", "text"],
                  ["Phone", "Phone", "tel"],
                ] as const).map(([field, label, type]) => (
                  <label key={field} className="block space-y-2 text-sm">
                    <span>{label}</span>
                    <input required type={type} min={type === "number" ? 1 : undefined}
                      value={form[field]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
                      className="form-control w-full" placeholder={label} />
                  </label>
                ))}
                {error && <p className="text-sm text-red-400">{error}</p>}
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Save Department</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
