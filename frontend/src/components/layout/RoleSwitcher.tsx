"use client";

import { useRouter } from "next/navigation";

export default function RoleSwitcher() {
  const router = useRouter();

  return (
    <select
      aria-label="Switch role (demo)"
      defaultValue=""
      onChange={(e) => {
        if (e.target.value) router.push(e.target.value);
      }}
      className="form-control max-w-[145px] text-xs"
    >
      <option value="" disabled>Switch role</option>
      <option value="/admin/dashboard">Admin</option>
      <option value="/worker/dashboard">Worker</option>
      <option value="/citizen/dashboard">Citizen</option>
    </select>
  );
}
