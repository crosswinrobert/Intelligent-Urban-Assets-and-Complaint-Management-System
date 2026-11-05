"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function RoleSwitcher({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function out() {
    setBusy(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });

      if (!response.ok) throw new Error("Unable to sign out.");

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={out}
      disabled={busy}
      title={collapsed ? "Sign out" : undefined}
      aria-label="Sign out"
      className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 ${
        collapsed ? "justify-center" : ""
      }`}
    >
      <LogOut size={19} className="shrink-0" />
      {!collapsed && <span>{busy ? "Signing out..." : "Sign out"}</span>}
    </button>
  );
}
