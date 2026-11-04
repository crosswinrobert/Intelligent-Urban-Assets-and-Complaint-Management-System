
"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search, RefreshCw, UserPlus } from "lucide-react";

type Complaint = {
  complaint_id: number;
  Category: string;
  RawDescription: string;
  UrgencyScore: number;
  SubmittedAt: string;
  ResolvedAt: string | null;
  current_status: string;
  citizen_fname: string;
  citizen_lname: string;
  citizen_email: string;
  AssetName: string | null;
  staff_id: number | null;
};

type Worker = {
  staff_id: number;
  Fname: string;
  Lname: string;
  Position: string;
  dept_name: string | null;
};

export default function ComplaintsPage() {
  const [rows, setRows] = useState<Complaint[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<Record<number, string>>({});
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assigningId, setAssigningId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const [complaintResponse, workerResponse] = await Promise.all([
        fetch("/api/complaints"),
        fetch("/api/workers"),
      ]);

      const complaintData = await complaintResponse.json();
      const workerData = await workerResponse.json();

      if (!complaintResponse.ok || !complaintData.success) {
        throw new Error(complaintData.error || "Unable to load complaints");
      }

      if (!workerResponse.ok || !workerData.success) {
        throw new Error(workerData.error || "Unable to load workers");
      }

      setRows(complaintData.complaints || []);
      setWorkers(workerData.workers || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      rows.filter(
        (x) =>
          (status === "All" || x.current_status === status) &&
          `${x.complaint_id} ${x.Category} ${x.RawDescription} ${x.citizen_fname} ${x.citizen_lname}`
            .toLowerCase()
            .includes(search.toLowerCase())
      ),
    [rows, status, search]
  );

  async function update(id: number, next: string) {
    setError("");

    try {
      const r = await fetch("/api/complaints", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaint_id: id,
          status: next,
        }),
      });

      const j = await r.json();

      if (!r.ok || !j.success) {
        throw new Error(j.error || "Update failed");
      }

      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  async function assignWorker(complaintId: number) {
    const staffId = Number(selectedWorkers[complaintId]);

    if (!staffId) {
      setError("Please select a worker first.");
      return;
    }

    setError("");
    setAssigningId(complaintId);

    try {
      const r = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaint_id: complaintId,
          staff_id: staffId,
        }),
      });

      const j = await r.json();

      if (!r.ok || !j.success) {
        throw new Error(j.error || "Worker assignment failed");
      }

      setSelectedWorkers((old) => ({
        ...old,
        [complaintId]: "",
      }));

      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Assignment failed");
    } finally {
      setAssigningId(null);
    }
  }

  function getAssignedWorker(staffId: number | null) {
    if (!staffId) return null;
    return workers.find((w) => w.staff_id === staffId);
  }

  return (
    <DashboardLayout
      title="Complaints"
      description="Review, filter and manage citizen complaints."
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Complaints Management
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Live complaints retrieved from MySQL.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          {["Open", "In Progress", "Resolved", "Rejected"].map((s) => (
            <div key={s} className="panel p-4">
              <p className="text-sm text-[var(--text-secondary)]">{s}</p>
              <p className="mt-2 text-2xl font-semibold">
                {rows.filter((x) => x.current_status === s).length}
              </p>
            </div>
          ))}
        </div>

        <div className="panel flex flex-wrap gap-3 p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              size={17}
            />
            <input
              className="form-control w-full pl-10"
              placeholder="Search complaints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {["All", "Open", "In Progress", "Resolved", "Rejected"].map(
              (s) => (
                <option key={s}>{s}</option>
              )
            )}
          </select>

          <button
            className="btn-secondary flex items-center gap-2"
            onClick={load}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[1250px] text-left text-sm">
            <thead className="text-[var(--text-secondary)]">
              <tr>
                {[
                  "ID",
                  "Category / Description",
                  "Citizen",
                  "Asset",
                  "Urgency",
                  "Submitted",
                  "Status",
                  "Update status",
                  "Assigned worker",
                  "Assign",
                ].map((x) => (
                  <th key={x} className="p-4">
                    {x}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="p-6 text-center">
                    Loading complaints...
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const assignedWorker = getAssignedWorker(c.staff_id);

                  return (
                    <tr
                      key={c.complaint_id}
                      className="border-t border-[var(--border)]"
                    >
                      <td className="p-4">#{c.complaint_id}</td>

                      <td className="max-w-sm p-4">
                        <strong>{c.Category}</strong>
                        <p className="mt-1 text-xs text-[var(--text-secondary)]">
                          {c.RawDescription}
                        </p>
                      </td>

                      <td className="p-4">
                        {c.citizen_fname} {c.citizen_lname}
                        <p className="text-xs text-[var(--text-muted)]">
                          {c.citizen_email}
                        </p>
                      </td>

                      <td className="p-4">{c.AssetName || "—"}</td>

                      <td className="p-4">{c.UrgencyScore}/5</td>

                      <td className="p-4">
                        {new Date(c.SubmittedAt).toLocaleDateString()}
                      </td>

                      <td className="p-4">{c.current_status}</td>

                      <td className="p-4">
                        <select
                          className="form-control min-w-[130px]"
                          value={c.current_status}
                          onChange={(e) =>
                            update(c.complaint_id, e.target.value)
                          }
                          disabled={c.current_status === "Resolved"}
                        >
                          <option>Open</option>
                          <option>In Progress</option>
                          <option>Resolved</option>
                          <option>Rejected</option>
                        </select>
                      </td>

                      <td className="p-4">
                        {assignedWorker ? (
                          <span>
                            {assignedWorker.Fname} {assignedWorker.Lname}
                          </span>
                        ) : c.staff_id ? (
                          `Staff #${c.staff_id}`
                        ) : (
                          <span className="text-[var(--text-muted)]">
                            Unassigned
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        {c.staff_id ? (
                          <span className="text-sm text-emerald-400">
                            Assigned
                          </span>
                        ) : c.current_status === "Resolved" ||
                          c.current_status === "Rejected" ? (
                          <span className="text-[var(--text-muted)]">—</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <select
                              className="form-control min-w-[145px]"
                              value={selectedWorkers[c.complaint_id] || ""}
                              onChange={(e) =>
                                setSelectedWorkers((old) => ({
                                  ...old,
                                  [c.complaint_id]: e.target.value,
                                }))
                              }
                              disabled={assigningId === c.complaint_id}
                            >
                              <option value="">Select worker</option>
                              {workers.map((w) => (
                                <option
                                  key={w.staff_id}
                                  value={w.staff_id}
                                >
                                  {w.Fname} {w.Lname}
                                </option>
                              ))}
                            </select>

                            <button
                              className="btn-primary flex items-center gap-1 whitespace-nowrap"
                              onClick={() => assignWorker(c.complaint_id)}
                              disabled={
                                !selectedWorkers[c.complaint_id] ||
                                assigningId === c.complaint_id
                              }
                            >
                              <UserPlus size={15} />
                              {assigningId === c.complaint_id
                                ? "Assigning..."
                                : "Assign"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}

              {!loading && !filtered.length && (
                <tr>
                  <td colSpan={10} className="p-6 text-center">
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-[var(--text-muted)]">
          {filtered.length} of {rows.length} complaints. Urgency is stored as
          a score from 1 to 5.
        </p>
      </div>
    </DashboardLayout>
  );
}
