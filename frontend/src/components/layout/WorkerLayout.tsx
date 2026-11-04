import RoleSwitcher from "@/components/layout/RoleSwitcher";
import Link from "next/link";
import { LayoutDashboard, ClipboardList, FileCheck, History, LogOut, MapPin } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/worker/dashboard", icon: LayoutDashboard },
  { name: "My Assignments", href: "/worker/assignments", icon: ClipboardList },
  { name: "Resolutions", href: "/worker/resolutions", icon: FileCheck },
  { name: "Work History", href: "/worker/history", icon: History },
];

export default function WorkerLayout({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="min-h-screen bg-[#101614] text-[#F1F5F3]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-[#29352F] bg-[#19221E] p-5 md:block">
        <div className="mb-10 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-500 p-2 text-black"><MapPin size={22}/></div>
          <div><h1 className="text-lg font-bold">Urban Pulse</h1><p className="text-xs text-[#A3B1A9]">Worker Portal</p></div>
        </div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#78877F]">Workspace</p>
        <nav className="space-y-2">
          {navigation.map(item => {
            const Icon = item.icon;
            return <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-[#A3B1A9] transition hover:bg-[#202C25] hover:text-white">
              <Icon size={18}/>{item.name}
            </Link>;
          })}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 border-t border-[#29352F] pt-4">
          <div className="mb-4"><p className="text-sm font-semibold">Worker Account</p><p className="text-xs text-[#78877F]">Field Operations</p></div>
          <Link href="/login" className="flex items-center gap-2 text-sm text-red-400"><LogOut size={17}/> Sign out</Link>
        </div>
      </aside>
      <main className="md:ml-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#29352F] bg-[#101614]/95 px-6 backdrop-blur">
          <div><p className="text-sm text-[#A3B1A9]">Worker Portal / {title}</p></div>
          <div className="flex items-center gap-3"><div className="text-right"><p className="text-sm font-medium">Worker</p><p className="text-xs text-[#78877F]">Field Staff</p></div><div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 font-semibold text-emerald-400">W</div></div>
        <RoleSwitcher /></header>
        <div className="p-5 md:p-8">{children}</div>
      </main>
    </div>
  );
}
