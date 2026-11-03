"use client";

import RoleSwitcher from "@/components/layout/RoleSwitcher";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Bell, Menu, Search, X, ArrowRight } from "lucide-react";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const searchPages = [
  { label: "Dashboard", description: "City overview and analytics", href: "/admin/dashboard" },
  { label: "Complaints", description: "Manage citizen complaints", href: "/admin/complaints" },
  { label: "Assets", description: "Manage urban infrastructure assets", href: "/admin/assets" },
  { label: "Workers", description: "Manage municipal workers", href: "/admin/workers" },
  { label: "Departments", description: "Manage city departments", href: "/admin/departments" },
  { label: "Assignments", description: "View worker assignments", href: "/admin/assignments" },
  { label: "Resolutions", description: "Review complaint resolutions", href: "/admin/resolutions" },
  { label: "Smart Search", description: "Search similar complaints", href: "/admin/search" },
  { label: "Activity Logs", description: "View system activity", href: "/admin/activity" },
  { label: "Analytics", description: "View performance analytics", href: "/admin/analytics" },
  { label: "Settings", description: "Manage application settings", href: "/admin/settings" },
];

export default function DashboardLayout({
  children,
  title,
  description,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return searchPages;

    return searchPages.filter(
      (page) =>
        page.label.toLowerCase().includes(query) ||
        page.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((previous) => !previous)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className={`min-h-screen transition-all duration-300 ${
          collapsed ? "lg:pl-[76px]" : "lg:pl-[260px]"
        }`}
      >
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div>
              <h1 className="text-lg font-semibold text-[var(--text-primary)]">
                {title}
              </h1>
              {description && (
                <p className="hidden text-xs text-[var(--text-muted)] sm:block">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open global search"
              onClick={() => {
                setSearchOpen(true);
                setSearchQuery("");
              }}
              className="rounded-xl border border-[var(--border)] p-2.5 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            >
              <Search size={18} />
            </button>

            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-xl border border-[var(--border)] p-2.5 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--accent)]" />
            </button>

            <div className="flex items-center gap-2 border-l border-[var(--border)] pl-3 sm:pl-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)]/15 text-sm font-semibold text-[var(--accent)]">
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  Administrator
                </p>
                <p className="text-xs text-[var(--text-muted)]">Admin</p>
              </div>
            </div>
          </div>
        <RoleSwitcher /></header>

        <main className="mx-auto w-full max-w-[1600px] p-5 sm:p-8">
          {children}
        </main>
      </div>

      {/* Global search dialog */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 pt-[15vh]"
          onClick={() => setSearchOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Global search"
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-[var(--border)] px-4">
              <Search size={19} className="text-[var(--accent)]" />

              <input
                autoFocus
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setSearchOpen(false);
                }}
                placeholder="Search pages and sections..."
                className="h-14 flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              />

              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-3">
              <p className="px-3 py-2 text-[10px] font-semibold tracking-widest text-[var(--text-muted)]">
                {searchQuery ? "SEARCH RESULTS" : "QUICK NAVIGATION"}
              </p>

              {filteredPages.length > 0 ? (
                <div className="space-y-1">
                  {filteredPages.map((page) => (
                    <Link
                      key={page.href}
                      href={page.href}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-[var(--surface-hover)]"
                    >
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          {page.label}
                        </p>
                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                          {page.description}
                        </p>
                      </div>
                      <ArrowRight size={16} className="text-[var(--text-muted)]" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="px-3 py-8 text-center text-sm text-[var(--text-muted)]">
                  No matching pages found.
                </p>
              )}
            </div>

            <div className="border-t border-[var(--border)] px-4 py-3 text-xs text-[var(--text-muted)]">
              Search across Urban Pulse pages
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
