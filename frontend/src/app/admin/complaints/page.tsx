
"use client";

import { useMemo, useRef, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  MapPin,
  AlertCircle,
  Clock3,
  CheckCircle2,
  ClipboardList,
  X,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

type ComplaintStatus = "Pending" | "In Progress" | "Resolved";
type Priority = "Low" | "Medium" | "High";

interface Complaint {
  id: string;
  subject: string;
  description: string;
  citizen: string;
  location: string;
  department: string;
  date: string;
  status: ComplaintStatus;
  priority: Priority;
}

const initialComplaints: Complaint[] = [
  {
    id: "CMP-1024",
    subject: "Streetlight not working",
    description: "Streetlight near the main junction has not been working for three days, making the road unsafe at night.",
    citizen: "Rahul Sharma",
    location: "Koramangala, Ward 15",
    department: "Electrical",
    date: "03 Nov 2026",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "CMP-1023",
    subject: "Garbage accumulation",
    description: "Garbage has accumulated near the public park and has not been collected.",
    citizen: "Priya Nair",
    location: "Indiranagar, Ward 12",
    department: "Sanitation",
    date: "03 Nov 2026",
    status: "Pending",
    priority: "Medium",
  },
  {
    id: "CMP-1022",
    subject: "Damaged road surface",
    description: "A large pothole is causing difficulty for vehicles.",
    citizen: "Arjun Kumar",
    location: "Jayanagar, Ward 8",
    department: "Roads",
    date: "02 Nov 2026",
    status: "Resolved",
    priority: "High",
  },
  {
    id: "CMP-1021",
    subject: "Water leakage",
    description: "Continuous water leakage from a damaged pipeline.",
    citizen: "Sneha Rao",
    location: "BTM Layout, Ward 19",
    department: "Water Supply",
    date: "02 Nov 2026",
    status: "In Progress",
    priority: "Medium",
  },
  {
    id: "CMP-1020",
    subject: "Broken drainage cover",
    description: "Drainage cover is broken and presents a safety hazard.",
    citizen: "Kiran Das",
    location: "HSR Layout, Ward 7",
    department: "Drainage",
    date: "01 Nov 2026",
    status: "Pending",
    priority: "High",
  },
  {
    id: "CMP-1019",
    subject: "Damaged public bench",
    description: "A public park bench has been damaged and needs repair.",
    citizen: "Meera Iyer",
    location: "JP Nagar, Ward 10",
    department: "Parks",
    date: "01 Nov 2026",
    status: "Resolved",
    priority: "Low",
  },
  {
    id: "CMP-1018",
    subject: "Water supply interruption",
    description: "No water supply in the residential area since morning.",
    citizen: "Vikram Rao",
    location: "Rajajinagar, Ward 4",
    department: "Water Supply",
    date: "31 Oct 2026",
    status: "Pending",
    priority: "High",
  },
];

const statusStyles: Record<ComplaintStatus, string> = {
  Pending: "bg-amber-400/10 text-amber-400",
  "In Progress": "bg-sky-400/10 text-sky-400",
  Resolved: "bg-emerald-400/10 text-emerald-400",
};

const priorityStyles: Record<Priority, string> = {
  Low: "text-[var(--text-muted)]",
  Medium: "text-amber-400",
  High: "text-red-400",
};

function StatusBadge({ status }: { status: ComplaintStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesSearch =
        complaint.id.toLowerCase().includes(search.toLowerCase()) ||
        complaint.subject.toLowerCase().includes(search.toLowerCase()) ||
        complaint.location.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || complaint.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || complaint.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [complaints, search, statusFilter, priorityFilter]);

  const stats = [
    {
      label: "Total Complaints",
      value: complaints.length,
      icon: ClipboardList,
      color: "text-sky-400",
      bg: "bg-sky-400/10",
    },
    {
      label: "Pending",
      value: complaints.filter((c) => c.status === "Pending").length,
      icon: Clock3,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    {
      label: "In Progress",
      value: complaints.filter((c) => c.status === "In Progress").length,
      icon: AlertCircle,
      color: "text-sky-400",
      bg: "bg-sky-400/10",
    },
    {
      label: "Resolved",
      value: complaints.filter((c) => c.status === "Resolved").length,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
  ];

  function updateStatus(id: string, status: ComplaintStatus) {
    setComplaints((previous) =>
      previous.map((complaint) =>
        complaint.id === id ? { ...complaint, status } : complaint
      )
    );

    setSelectedComplaint((previous) =>
      previous?.id === id ? { ...previous, status } : previous
    );
  }

  return (
    <DashboardLayout
      title="Complaints"
      description="Review, filter and manage citizen complaints."
    >
      <div className="space-y-7">

        {/* Page heading */}
        <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
              Complaints Management
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Monitor and manage reported urban infrastructure issues.
            </p>
          </div>
          <span className="w-fit rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-muted)]">
            Sample records
          </span>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div key={stat.label} className="panel p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[var(--text-secondary)]">
                    {stat.label}
                  </p>
                  <div className={`rounded-xl p-3 ${stat.bg} ${stat.color}`}>
                    <Icon size={20} />
                  </div>
                </div>
                <h3 className="mt-3 text-3xl font-semibold text-[var(--text-primary)]">
                  {stat.value}
                </h3>
              </div>
            );
          })}
        </section>

        {/* Filters */}
        <section className="panel p-5">
          <div className="mb-4 flex items-center gap-2">
            <Filter size={17} className="text-[var(--accent)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Search and Filters
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative">
              <button
                type="button"
                aria-label="Focus complaint search"
                onClick={() => searchInputRef.current?.focus()}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent)]"
              >
                <Search size={17} />
              </button>
              <input
                ref={searchInputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ID, subject or location..."
                className="form-control w-full pl-10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control w-full"
            >
              <option value="All">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="form-control w-full"
            >
              <option value="All">All priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="mt-3 flex justify-between text-xs text-[var(--text-muted)]">
            <span>{filteredComplaints.length} complaints found</span>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setPriorityFilter("All");
              }}
              className="text-[var(--accent)] hover:underline"
            >
              Clear filters
            </button>
          </div>
        </section>

        {/* Complaints table */}
        <section className="panel overflow-hidden">
          <div className="border-b border-[var(--border)] p-5">
            <h3 className="font-semibold text-[var(--text-primary)]">
              All Complaints
            </h3>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Select a complaint to inspect its details.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-[var(--surface-hover)] text-xs text-[var(--text-muted)]">
                <tr>
                  <th className="px-5 py-3 font-medium">Complaint</th>
                  <th className="px-5 py-3 font-medium">Citizen</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="px-5 py-3 font-medium">Department</th>
                  <th className="px-5 py-3 font-medium">Priority</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="border-t border-[var(--border)] hover:bg-[var(--surface-hover)]"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-[var(--text-primary)]">
                        {complaint.subject}
                      </p>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        {complaint.id} · {complaint.date}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-xs text-[var(--text-secondary)]">
                      {complaint.citizen}
                    </td>

                    <td className="px-5 py-4 text-xs text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} />
                        {complaint.location}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-[var(--text-secondary)]">
                      {complaint.department}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium ${priorityStyles[complaint.priority]}`}>
                        {complaint.priority}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={complaint.status} />
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedComplaint(complaint)}
                        className="flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] hover:underline"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredComplaints.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-[var(--text-muted)]">
                      No complaints match your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Complaint details modal */}
        {selectedComplaint && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
            onClick={() => setSelectedComplaint(null)}
          >
            <div
              className="w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-[var(--accent)]">
                    {selectedComplaint.id}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
                    {selectedComplaint.subject}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  aria-label="Close details"
                  className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                >
                  <X size={19} />
                </button>
              </div>

              <p className="mt-5 text-sm leading-6 text-[var(--text-secondary)]">
                {selectedComplaint.description}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Citizen</p>
                  <p className="mt-1 text-[var(--text-primary)]">{selectedComplaint.citizen}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Department</p>
                  <p className="mt-1 text-[var(--text-primary)]">{selectedComplaint.department}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Location</p>
                  <p className="mt-1 text-[var(--text-primary)]">{selectedComplaint.location}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Reported on</p>
                  <p className="mt-1 text-[var(--text-primary)]">{selectedComplaint.date}</p>
                </div>
              </div>

              <div className="mt-6 border-t border-[var(--border)] pt-5">
                <label className="mb-2 block text-xs text-[var(--text-muted)]">
                  Update complaint status
                </label>

                <select
                  value={selectedComplaint.status}
                  onChange={(e) =>
                    updateStatus(selectedComplaint.id, e.target.value as ComplaintStatus)
                  }
                  className="form-control w-full"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>

                <p className="mt-3 text-xs text-[var(--text-muted)]">
                  Demo only: status changes are held in browser memory and are not saved to MySQL.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
