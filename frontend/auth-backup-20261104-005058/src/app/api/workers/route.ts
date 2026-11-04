import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { hashPassword } from "@/lib/password";

export async function GET() {
  try {
    const [rows] = await pool.query(`SELECT s.staff_id, s.user_id, u.Fname, u.Lname, u.Email, u.Role, u.dept_id, s.Position, s.HireDate, s.Salary, d.dept_name, (SELECT GROUP_CONCAT(up.PhoneNumber SEPARATOR ', ') FROM user_phone up WHERE up.user_id=u.user_id) AS phone FROM staff s JOIN user u ON u.user_id=s.user_id LEFT JOIN department d ON d.dept_id=u.dept_id ORDER BY s.staff_id`);
    return NextResponse.json({ success: true, workers: rows });
  } catch (error) {
    console.error("Workers GET:", error);
    return NextResponse.json({ success: false, error: "Unable to retrieve workers." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const connection = await pool.getConnection();
  try {
    const body = await request.json();
    const first = String(body.Fname || "").trim();
    const last = String(body.Lname || "").trim();
    const email = String(body.Email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const dept = body.dept_id ? Number(body.dept_id) : null;
    if (!first || !last || !email || password.length < 10) return NextResponse.json({ success: false, error: "First name, last name, email and a password of at least 10 characters are required." }, { status: 400 });
    if (dept !== null && (!Number.isInteger(dept) || dept <= 0)) return NextResponse.json({ success: false, error: "Invalid department." }, { status: 400 });
    const passwordHash = await hashPassword(password);
    await connection.beginTransaction();
    const [userResult]: any = await connection.execute("INSERT INTO user (Fname,Lname,Email,PasswordHash,Role,dept_id) VALUES (?,?,?,?, 'Staff', ?)", [first,last,email,passwordHash,dept]);
    const [staffResult]: any = await connection.execute("INSERT INTO staff (user_id,Position,HireDate,Salary) VALUES (?,?,?,?)", [userResult.insertId, body.Position || null, body.HireDate || null, body.Salary === "" || body.Salary == null ? null : Number(body.Salary)]);
    if (body.PhoneNumber) await connection.execute("INSERT INTO user_phone (user_id,PhoneNumber) VALUES (?,?)", [userResult.insertId, String(body.PhoneNumber)]);
    await connection.commit();
    return NextResponse.json({ success: true, staff_id: staffResult.insertId, user_id: userResult.insertId }, { status: 201 });
  } catch (error: any) {
    await connection.rollback();
    const duplicate = error?.code === "ER_DUP_ENTRY";
    return NextResponse.json({ success: false, error: duplicate ? "That email or phone number is already registered." : "Unable to create worker. Check the supplied details." }, { status: duplicate ? 409 : 500 });
  } finally { connection.release(); }
}
