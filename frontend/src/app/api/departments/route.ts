import { NextResponse } from "next/server";
import pool from "@/lib/db";

const departmentQuery = `
SELECT d.dept_id,d.dept_name,d.description,d.head_of_dept,d.created_at,
 (SELECT COUNT(DISTINCT s.staff_id) FROM staff s JOIN user u ON u.user_id=s.user_id WHERE u.dept_id=d.dept_id) total_staff,
 (SELECT COUNT(DISTINCT ca.complaint_id) FROM complaint_assignments ca JOIN staff s ON s.staff_id=ca.staff_id JOIN user u ON u.user_id=s.user_id WHERE u.dept_id=d.dept_id) total_assigned_complaints,
 (SELECT COUNT(DISTINCT ca.complaint_id) FROM complaint_assignments ca JOIN staff s ON s.staff_id=ca.staff_id JOIN user u ON u.user_id=s.user_id JOIN complaint c ON c.complaint_id=ca.complaint_id JOIN complaint_status cs ON cs.status_id=c.status_id WHERE u.dept_id=d.dept_id AND cs.Status='In Progress') pending_complaints,
 (SELECT COUNT(DISTINCT ca.complaint_id) FROM complaint_assignments ca JOIN staff s ON s.staff_id=ca.staff_id JOIN user u ON u.user_id=s.user_id JOIN complaint c ON c.complaint_id=ca.complaint_id JOIN complaint_status cs ON cs.status_id=c.status_id WHERE u.dept_id=d.dept_id AND cs.Status='Resolved') resolved_complaints
FROM department d ORDER BY d.dept_id`;

export async function GET() {
  try {
    const [departments] = await pool.query(departmentQuery);
    return NextResponse.json({ success: true, departments });
  } catch (error) {
    console.error("Departments GET:", error);
    return NextResponse.json({ success: false, error: "Unable to retrieve departments." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.dept_name || "").trim();
    if (!name) return NextResponse.json({ success: false, error: "Department name is required." }, { status: 400 });
    const [result]: any = await pool.execute("INSERT INTO department (dept_name, description, head_of_dept) VALUES (?, ?, ?)", [name, body.description || null, body.head_of_dept || null]);
    return NextResponse.json({ success: true, dept_id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error("Departments POST:", error);
    return NextResponse.json({ success: false, error: "Unable to create department." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.dept_id);
    const name = String(body.dept_name || "").trim();
    if (!Number.isInteger(id) || id <= 0 || !name) return NextResponse.json({ success: false, error: "Valid department ID and name are required." }, { status: 400 });
    await pool.execute("UPDATE department SET dept_name=?, description=?, head_of_dept=? WHERE dept_id=?", [name, body.description || null, body.head_of_dept || null, id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Departments PATCH:", error);
    return NextResponse.json({ success: false, error: "Unable to update department." }, { status: 500 });
  }
}
