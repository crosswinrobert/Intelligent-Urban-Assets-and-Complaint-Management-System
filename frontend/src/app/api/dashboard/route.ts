import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [[counts]]: any = await pool.query(`SELECT (SELECT COUNT(*) FROM complaint) total_complaints,(SELECT COUNT(*) FROM complaint WHERE ResolvedAt IS NOT NULL) resolved_complaints,(SELECT COUNT(*) FROM complaint WHERE ResolvedAt IS NULL) open_complaints,(SELECT COUNT(*) FROM asset) total_assets,(SELECT COUNT(*) FROM staff) total_workers,(SELECT COUNT(*) FROM department) total_departments`);
    const [statuses] = await pool.query(`SELECT cs.Status status, COUNT(c.complaint_id) count FROM complaint_status cs LEFT JOIN complaint c ON c.status_id=cs.status_id GROUP BY cs.status_id,cs.Status ORDER BY cs.status_id`);
    const [recent] = await pool.query(`SELECT c.complaint_id,c.Category,c.RawDescription,c.SubmittedAt,cs.Status current_status,u.Fname,u.Lname FROM complaint c JOIN complaint_status cs ON cs.status_id=c.status_id JOIN user u ON u.user_id=c.user_id ORDER BY c.SubmittedAt DESC LIMIT 8`);
    const [departments] = await pool.query(`SELECT d.dept_id,d.dept_name,(SELECT COUNT(DISTINCT s.staff_id) FROM staff s JOIN user u ON u.user_id=s.user_id WHERE u.dept_id=d.dept_id) total_staff,(SELECT COUNT(DISTINCT ca.complaint_id) FROM complaint_assignments ca JOIN staff s ON s.staff_id=ca.staff_id JOIN user u ON u.user_id=s.user_id WHERE u.dept_id=d.dept_id) total_assigned_complaints,(SELECT COUNT(DISTINCT ca.complaint_id) FROM complaint_assignments ca JOIN staff s ON s.staff_id=ca.staff_id JOIN user u ON u.user_id=s.user_id JOIN complaint c ON c.complaint_id=ca.complaint_id JOIN complaint_status cs ON cs.status_id=c.status_id WHERE u.dept_id=d.dept_id AND cs.Status='In Progress') pending_complaints,(SELECT COUNT(DISTINCT ca.complaint_id) FROM complaint_assignments ca JOIN staff s ON s.staff_id=ca.staff_id JOIN user u ON u.user_id=s.user_id JOIN complaint c ON c.complaint_id=ca.complaint_id JOIN complaint_status cs ON cs.status_id=c.status_id WHERE u.dept_id=d.dept_id AND cs.Status='Resolved') resolved_complaints FROM department d ORDER BY total_assigned_complaints DESC`);
    return NextResponse.json({ success: true, counts, statuses, recent, departments });
  } catch (error) {
    console.error("Dashboard API:", error);
    return NextResponse.json({ success: false, error: "Unable to load dashboard data." }, { status: 500 });
  }
}
