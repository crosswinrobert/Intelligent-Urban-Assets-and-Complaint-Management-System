import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getEmbedding } from "@/lib/vector";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const staffId = searchParams.get("staffId");
    let sql = `SELECT c.complaint_id,c.Category,c.RawDescription,c.Lat,c.\`Long\`,c.UrgencyScore,c.PhotoURL,c.SubmittedAt,c.ResolvedAt,c.UpdatedAt,c.user_id,c.asset_id,c.status_id,cs.Status AS current_status,u.Fname AS citizen_fname,u.Lname AS citizen_lname,u.Email AS citizen_email,a.AssetName,ca.staff_id,ca.AssignedAt,ca.CompletedAt FROM complaint c JOIN complaint_status cs ON cs.status_id=c.status_id JOIN user u ON u.user_id=c.user_id LEFT JOIN asset a ON a.asset_id=c.asset_id LEFT JOIN complaint_assignments ca ON ca.complaint_id=c.complaint_id`;
    const params: number[] = [];
    if (userId) { sql += " WHERE c.user_id=?"; params.push(Number(userId)); }
    if (staffId) { sql += userId ? " AND ca.staff_id=?" : " WHERE ca.staff_id=?"; params.push(Number(staffId)); }
    sql += " ORDER BY c.SubmittedAt DESC";
    const [complaints] = await pool.query(sql, params);
    return NextResponse.json({ success: true, complaints });
  } catch (error) {
    console.error("Complaints GET:", error);
    return NextResponse.json({ success: false, error: "Unable to retrieve complaints." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let connection: Awaited<ReturnType<typeof pool.getConnection>> | undefined;
  let transactionStarted = false;
  try {
    const body = await request.json();
    const userId = Number(body.user_id);
    const category = String(body.category || "General").trim();
    const description = String(body.raw_description || "").trim();
    const urgency = body.urgency_score == null ? 3 : Number(body.urgency_score);
    const lat = body.lat == null || body.lat === "" ? null : Number(body.lat);
    const lng = body.long == null || body.long === "" ? null : Number(body.long);
    if (!Number.isInteger(userId) || userId <= 0 || !category || !description) return NextResponse.json({ success: false, error: "user_id, category and raw_description are required." }, { status: 400 });
    if (!Number.isFinite(urgency) || urgency < 1 || urgency > 5 || (lat !== null && !Number.isFinite(lat)) || (lng !== null && !Number.isFinite(lng))) return NextResponse.json({ success: false, error: "Invalid urgency score or coordinates." }, { status: 400 });
    const [users]: any = await pool.execute("SELECT user_id FROM user WHERE user_id=? AND Role='Citizen'", [userId]);
    if (!users.length) return NextResponse.json({ success: false, error: "Citizen account not found." }, { status: 404 });
    const embedding = JSON.stringify(await getEmbedding(`${category}. ${description}`));
    connection = await pool.getConnection();
    await connection.beginTransaction(); transactionStarted = true;
    const [result]: any = await connection.execute("INSERT INTO complaint (user_id,Category,RawDescription,Lat,`Long`,PhotoURL,asset_id,status_id,UrgencyScore,Embedding) VALUES (?,?,?,?,?,?,?,1,?,?)", [userId,category,description,lat,lng,body.photo_url || null,body.asset_id || null,urgency,embedding]);
    await connection.commit(); transactionStarted = false;
    return NextResponse.json({ success: true, complaint_id: result.insertId }, { status: 201 });
  } catch (error) {
    if (connection && transactionStarted) await connection.rollback();
    console.error("Complaints POST:", error);
    return NextResponse.json({ success: false, error: "Unable to submit complaint." }, { status: 500 });
  } finally { connection?.release(); }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.complaint_id);
    const status = String(body.status || "");
    const urgency = body.urgency_score === undefined ? null : Number(body.urgency_score);
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ success: false, error: "Valid complaint_id is required." }, { status: 400 });
    if (urgency !== null && (!Number.isFinite(urgency) || urgency < 1 || urgency > 5)) return NextResponse.json({ success: false, error: "Urgency score must be between 1 and 5." }, { status: 400 });
    if (status) {
      const [statuses]: any = await pool.execute("SELECT status_id FROM complaint_status WHERE Status=?", [status]);
      if (!statuses.length) return NextResponse.json({ success: false, error: "Unknown complaint status." }, { status: 400 });
      if (status === "Resolved") {
        await pool.query("CALL sp_resolve_complaint(?)", [id]);
        if (urgency !== null) await pool.execute("UPDATE complaint SET UrgencyScore=? WHERE complaint_id=?", [urgency, id]);
      } else {
        await pool.execute("UPDATE complaint SET status_id=?, UrgencyScore=COALESCE(?,UrgencyScore) WHERE complaint_id=?", [statuses[0].status_id,urgency,id]);
      }
    } else if (urgency !== null) await pool.execute("UPDATE complaint SET UrgencyScore=? WHERE complaint_id=?", [urgency,id]);
    else return NextResponse.json({ success: false, error: "No supported fields supplied." }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Complaints PATCH:", error);
    return NextResponse.json({ success: false, error: "Unable to update complaint." }, { status: 500 });
  }
}
