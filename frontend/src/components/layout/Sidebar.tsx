
"use client";

import Link from "next/link";
import RoleSwitcher from "./RoleSwitcher";
import { usePathname } from "next/navigation";
import {
  AlertCircle,
  BarChart3,
  Building2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileCheck,
  LayoutDashboard,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navigationGroups = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Complaints", href: "/admin/complaints", icon: AlertCircle },
      { label: "Assets", href: "/admin/assets", icon: Building2 },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { label: "Workers", href: "/admin/workers", icon: Users },
      { label: "Departments", href: "/admin/departments", icon: ShieldCheck },
      { label: "Assignments", href: "/admin/assignments", icon: ClipboardList },
      { label: "Resolutions", href: "/admin/resolutions", icon: FileCheck },
    ],
  },
  {
    title: "INTELLIGENCE",
    items: [
      { label: "Smart Search", href: "/admin/search", icon: Search },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
];

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-all duration-300 ${
          collapsed ? "w-[76px]" : "w-[260px]"
        } ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[76px] items-center justify-between border-b border-[var(--border)] px-5">
          <Link
            href="/admin/dashboard"
            className="flex min-w-0 items-center gap-3"
            onClick={onMobileClose}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-[#07120B]">
              <Building2 size={21} strokeWidth={2.5} />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-bold tracking-wide text-[var(--text-primary)]">
                  URBAN PULSE
                </p>
                <p className="text-[10px] tracking-[0.18em] text-[var(--text-muted)]">
                  CITY MANAGEMENT
                </p>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close sidebar"
            className="rounded-lg p-1 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-6">
          {navigationGroups.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.16em] text-[var(--text-muted)]">
                  {group.title}
                </p>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      onClick={onMobileClose}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                        active
                          ? "bg-[var(--accent)]/10 font-semibold text-[var(--accent)]"
                          : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <Icon size={19} className="shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                      {active && !collapsed && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-[var(--border)] p-3">
          <Link
            href="/admin/settings"
            onClick={onMobileClose}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
          >
            <Settings size={19} className="shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>
          <RoleSwitcher collapsed={collapsed} />

          <button
            type="button"
            onClick={onToggle}
            className="mt-3 hidden w-full items-center justify-center rounded-xl border border-[var(--border)] py-2 text-[var(--text-muted)] hover:bg-[var(--surface-hover)] lg:flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>
        </div>
      </aside>
    </>
  );
}


