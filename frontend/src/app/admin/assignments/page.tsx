
"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Trash2, RefreshCw } from "lucide-react";

type Assignment = {
  assignment_id: number;
  complaint_id: number;
  staff_id: number;
  AssignedAt: string;
  CompletedAt: string | null;
  Category: string;
  RawDescription: string;
  current_status: string;
  StaffFirstName: string;
  StaffLastName: string;
  Position: string | null;
};

type Option = {
  id: number;
  label: string;
};

export default function AssignmentsPage() {
  const [rows, setRows] = useState<Assignment[]>([]);
  const [complaints, setComplaints] = useState<Option[]>([]);
  const [workers, setWorkers] = useState<Option[]>([]);
  const [complaint, setComplaint] = useState("");
  const [worker, setWorker] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const [a, c, w] = await Promise.all([
        fetch("/api/assignments"),
        fetch("/api/complaints"),
        fetch("/api/workers"),
      ]);

      const [aj, cj, wj] = await Promise.all([
        a.json(),
        c.json(),
        w.json(),
      ]);

      if (
        !a.ok ||
        !c.ok ||
        !w.ok ||
        !aj.success ||
        !cj.success ||
        !wj.success
      ) {
        throw new Error("Unable to load assignment data.");
      }

      setRows(aj.data || []);

      setComplaints(
        (cj.complaints || [])
          .filter(
            (x: any) =>
              x.current_status !== "Resolved" &&
              x.current_status !== "Rejected"
          )
          .map((x: any) => ({
            id: x.complaint_id,
            label: `#${x.complaint_id} · ${x.Category}`,
          }))
      );

      setWorkers(
        (wj.workers || []).map((x: any) => ({
          id: x.staff_id,
          label: `#${x.staff_id} · ${x.Fname} ${x.Lname}`,
        }))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const r = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaint_id: Number(complaint),
          staff_id: Number(worker),
        }),
      });

      const j = await r.json();

      if (!r.ok || !j.success) {
        throw new Error(j.error || "Assignment failed");
      }

      setComplaint("");
      setWorker("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Assignment failed");
    } finally {
      setSaving(false);
    }
  }

  async function removeAssignment(item: Assignment) {
    const confirmed = window.confirm(
      `Remove ${item.StaffFirstName} ${item.StaffLastName} from complaint #${item.complaint_id}?\n\nIf no other active worker is assigned, the complaint will return to Open status.`
    );

    if (!confirmed) return;

    setError("");
    setRemovingId(item.assignment_id);

    try {
      const r = await fetch("/api/assignments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignment_id: item.assignment_id,
        }),
      });

      const j = await r.json();

      if (!r.ok || !j.success) {
        throw new Error(j.error || "Unable to remove assignment");
      }

      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Removal failed");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <DashboardLayout title="Assignments">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Assignments</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Assign and manage workers for citizen complaints.
          </p>
        </div>

        <form
          onSubmit={add}
          className="panel grid gap-3 p-4 md:grid-cols-3"
        >
          <select
            required
            className="form-control"
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
          >
            <option value="">Select complaint</option>
            {complaints.map((x) => (
              <option key={x.id} value={x.id}>
                {x.label}
              </option>
            ))}
          </select>

          <select
            required
            className="form-control"
            value={worker}
            onChange={(e) => setWorker(e.target.value)}
          >
            <option value="">Select worker</option>
            {workers.map((x) => (
              <option key={x.id} value={x.id}>
                {x.label}
              </option>
            ))}
          </select>

          <button className="btn-primary" disabled={saving}>
            {saving ? "Assigning..." : "Assign Worker"}
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="text-[var(--text-secondary)]">
              <tr>
                {[
                  "Assignment",
                  "Complaint",
                  "Description",
                  "Worker",
                  "Assigned",
                  "Status",
                  "Action",
                ].map((x) => (
                  <th className="p-4" key={x}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center">
                    Loading assignments...
                  </td>
                </tr>
              ) : (
                rows.map((x) => (
                  <tr
                    key={x.assignment_id}
                    className="border-t border-[var(--border)]"
                  >
                    <td className="p-4">{x.assignment_id}</td>

                    <td className="p-4">
                      #{x.complaint_id} · {x.Category}
                    </td>

                    <td className="max-w-sm p-4">
                      {x.RawDescription}
                    </td>

                    <td className="p-4">
                      {x.StaffFirstName} {x.StaffLastName} (#{x.staff_id})
                    </td>

                    <td className="p-4">
                      {x.AssignedAt
                        ? new Date(x.AssignedAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="p-4">
                      {x.CompletedAt ? "Completed" : x.current_status}
                    </td>

                    <td className="p-4">
                      {x.CompletedAt ? (
                        <span className="text-xs text-[var(--text-muted)]">
                          Completed
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="btn-secondary flex items-center gap-2 whitespace-nowrap text-red-400"
                          onClick={() => removeAssignment(x)}
                          disabled={removingId === x.assignment_id}
                        >
                          {removingId === x.assignment_id ? (
                            <RefreshCw size={15} />
                          ) : (
                            <Trash2 size={15} />
                          )}

                          {removingId === x.assignment_id
                            ? "Removing..."
                            : "Remove Worker"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}

              {!loading && !rows.length && (
                <tr>
                  <td colSpan={7} className="p-6 text-center">
                    No assignments yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-[var(--text-muted)]">
          {rows.length} assignments retrieved from MySQL.
        </p>
      </div>
    </DashboardLayout>
  );
}

