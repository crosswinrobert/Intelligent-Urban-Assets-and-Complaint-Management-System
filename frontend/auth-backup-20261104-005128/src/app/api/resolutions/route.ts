import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get("staffId");
    const [rows] = await pool.query(`SELECT c.complaint_id,c.RawDescription,c.Category,c.SubmittedAt,c.ResolvedAt,cs.Status AS current_status,u.Fname,u.Lname,ca.staff_id,s.Position FROM complaint c JOIN complaint_status cs ON cs.status_id=c.status_id JOIN user u ON u.user_id=c.user_id LEFT JOIN complaint_assignments ca ON ca.complaint_id=c.complaint_id LEFT JOIN staff s ON s.staff_id=ca.staff_id WHERE c.ResolvedAt IS NOT NULL ${staffId ? "AND ca.staff_id = ?" : ""} ORDER BY c.ResolvedAt DESC`, staffId ? [Number(staffId)] : []);
    return NextResponse.json({ success: true, resolutions: rows });
  } catch (error) {
    console.error("Resolutions GET:", error);
    return NextResponse.json({ success: false, error: "Unable to retrieve resolutions." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.complaint_id);
    const staffId = body.staff_id == null ? null : Number(body.staff_id);
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ success: false, error: "Valid complaint_id is required." }, { status: 400 });
    const [rows]: any = await pool.execute("SELECT complaint_id, ResolvedAt FROM complaint WHERE complaint_id=?", [id]);
    if (!rows.length) return NextResponse.json({ success: false, error: "Complaint not found." }, { status: 404 });
    if (rows[0].ResolvedAt) return NextResponse.json({ success: false, error: "Complaint is already resolved." }, { status: 409 });
    if (staffId !== null) {
      if (!Number.isInteger(staffId) || staffId <= 0) return NextResponse.json({ success: false, error: "Invalid staff_id." }, { status: 400 });
      const [assigned]: any = await pool.execute("SELECT assignment_id FROM complaint_assignments WHERE complaint_id=? AND staff_id=? AND CompletedAt IS NULL", [id, staffId]);
      if (!assigned.length) return NextResponse.json({ success: false, error: "This complaint is not actively assigned to that staff member." }, { status: 403 });
    }
    await pool.query("CALL sp_resolve_complaint(?)", [id]);
    return NextResponse.json({ success: true, message: "Complaint marked as resolved." });
  } catch (error) {
    console.error("Resolutions POST:", error);
    return NextResponse.json({ success: false, error: "Unable to resolve complaint." }, { status: 500 });
  }
}
