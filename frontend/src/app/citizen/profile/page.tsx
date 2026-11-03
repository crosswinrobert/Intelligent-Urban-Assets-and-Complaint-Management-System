import CitizenLayout from "@/components/layout/CitizenLayout";

export default function CitizenProfile() {
 return <CitizenLayout title="My Profile">
  <div className="mb-7"><h1 className="text-2xl font-bold">My Profile</h1><p className="mt-1 text-sm text-[#A3B1A9]">View and manage your account information.</p></div>
  <div className="max-w-2xl rounded-xl border border-[#29352F] bg-[#19221E] p-6">
   <div className="mb-6 flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-xl font-bold text-emerald-400">C</div><div><h2 className="font-semibold">Citizen User</h2><p className="text-sm text-[#78877F]">Resident Account</p></div></div>
   <form className="space-y-5">
    <label className="block text-sm text-[#A3B1A9]">Full name<input defaultValue="Citizen User" className="form-control mt-2 w-full"/></label>
    <label className="block text-sm text-[#A3B1A9]">Email address<input type="email" defaultValue="citizen@example.com" className="form-control mt-2 w-full"/></label>
    <label className="block text-sm text-[#A3B1A9]">Phone number<input defaultValue="9876543210" className="form-control mt-2 w-full"/></label>
    <label className="block text-sm text-[#A3B1A9]">Residential address<textarea defaultValue="Bengaluru, Karnataka" rows={3} className="form-control mt-2 w-full"/></label>
    <p className="text-xs text-[#78877F]">Demo profile. Changes are not saved to a database.</p>
    <button type="button" className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black">Save Changes</button>
   </form>
  </div>
 </CitizenLayout>;
}
