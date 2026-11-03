import CitizenLayout from "@/components/layout/CitizenLayout";

export default function SubmitComplaint() {
  return <CitizenLayout title="Submit Complaint">
    <div className="mb-7"><h1 className="text-2xl font-bold">Submit a Complaint</h1><p className="mt-1 text-sm text-[#A3B1A9]">Tell us about an issue in your neighbourhood.</p></div>
    <form className="max-w-3xl space-y-5 rounded-xl border border-[#29352F] bg-[#19221E] p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm text-[#A3B1A9]">Complaint category<select defaultValue="" className="form-control mt-2 w-full"><option value="" disabled>Select category</option><option>Road Damage</option><option>Waste Management</option><option>Streetlight</option><option>Water Supply</option><option>Drainage</option><option>Other</option></select></label>
        <label className="text-sm text-[#A3B1A9]">Priority<select defaultValue="Medium" className="form-control mt-2 w-full"><option>Low</option><option>Medium</option><option>High</option></select></label>
      </div>
      <label className="block text-sm text-[#A3B1A9]">Complaint title<input required placeholder="Briefly describe the issue" className="form-control mt-2 w-full"/></label>
      <label className="block text-sm text-[#A3B1A9]">Location<input required placeholder="Area, street or landmark" className="form-control mt-2 w-full"/></label>
      <label className="block text-sm text-[#A3B1A9]">Detailed description<textarea required rows={5} placeholder="Explain the issue and where it occurs..." className="form-control mt-2 w-full"/></label>
      <label className="block text-sm text-[#A3B1A9]">Attach image (optional)<input type="file" accept="image/*" className="mt-2 block w-full text-sm text-[#A3B1A9] file:mr-4 file:rounded-lg file:border-0 file:bg-[#29352F] file:px-4 file:py-2 file:text-white"/></label>
      <p className="text-xs text-[#78877F]">Demo form only. Complaint submission and image upload will be connected to the backend later.</p>
      <button type="button" className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black">Submit Complaint</button>
    </form>
  </CitizenLayout>;
}
