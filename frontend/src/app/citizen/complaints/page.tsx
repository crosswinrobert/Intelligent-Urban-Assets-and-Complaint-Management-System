import CitizenLayout from "@/components/layout/CitizenLayout";

const complaints = [
 {id:"CMP-1024",title:"Streetlight not working",category:"Streetlight",location:"Jayanagar",date:"03 Nov 2026",status:"In Progress"},
 {id:"CMP-1028",title:"Garbage not collected",category:"Waste Management",location:"BTM Layout",date:"02 Nov 2026",status:"Pending"},
 {id:"CMP-0982",title:"Water leakage",category:"Water Supply",location:"Banashankari",date:"28 Oct 2026",status:"Resolved"},
 {id:"CMP-0955",title:"Damaged footpath",category:"Road Damage",location:"JP Nagar",date:"24 Oct 2026",status:"Resolved"},
];

export default function MyComplaints() {
 return <CitizenLayout title="My Complaints">
  <div className="mb-7"><h1 className="text-2xl font-bold">My Complaints</h1><p className="mt-1 text-sm text-[#A3B1A9]">Track the status of complaints you've submitted.</p></div>
  <div className="mb-5 flex flex-wrap gap-3"><select className="form-control"><option>All statuses</option><option>Pending</option><option>In Progress</option><option>Resolved</option></select><select className="form-control"><option>All categories</option><option>Streetlight</option><option>Waste Management</option><option>Road Damage</option></select></div>
  <div className="overflow-x-auto rounded-xl border border-[#29352F] bg-[#19221E] p-5"><table className="w-full min-w-[700px] text-left text-sm"><thead className="text-[#78877F]"><tr><th className="pb-4">Complaint</th><th>Category</th><th>Location</th><th>Submitted</th><th>Status</th></tr></thead><tbody>{complaints.map(c=><tr key={c.id} className="border-t border-[#29352F]"><td className="py-4"><p className="font-medium">{c.title}</p><p className="text-xs text-[#78877F]">{c.id}</p></td><td>{c.category}</td><td>{c.location}</td><td>{c.date}</td><td><span className="rounded-full bg-[#29352F] px-3 py-1 text-xs">{c.status}</span></td></tr>)}</tbody></table></div>
 </CitizenLayout>;
}
