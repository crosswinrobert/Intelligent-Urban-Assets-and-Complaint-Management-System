"use client";
import {useState} from "react";import {useRouter} from "next/navigation";
export default function RoleSwitcher(){const [busy,setBusy]=useState(false);const router=useRouter();async function out(){setBusy(true);try{await fetch("/api/auth/logout",{method:"POST"});router.replace("/login");router.refresh();}finally{setBusy(false);}}return <button type="button" onClick={out} disabled={busy} className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50">{busy?"Signing outâ€¦":"Sign out"}</button>;}
