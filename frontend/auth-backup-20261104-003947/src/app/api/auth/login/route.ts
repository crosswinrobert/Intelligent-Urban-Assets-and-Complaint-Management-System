import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!email || !password) return NextResponse.json({ success: false, error: "Email and password are required." }, { status: 400 });
    const [rows]: any = await pool.execute("SELECT user_id,Fname,Lname,Email,Role,PasswordHash,dept_id FROM user WHERE Email=? LIMIT 1", [email]);
    if (!rows.length || !(await verifyPassword(password, rows[0].PasswordHash))) return NextResponse.json({ success: false, error: "Invalid credentials. Existing seed passwords must be migrated to scrypt hashes first." }, { status: 401 });
    const { PasswordHash: _secret, ...user } = rows[0];
    return NextResponse.json({ success: true, user, message: "Credentials verified. A signed session mechanism is not yet configured." });
  } catch (error) {
    console.error("Login API:", error);
    return NextResponse.json({ success: false, error: "Unable to authenticate." }, { status: 500 });
  }
}
