import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSessionToken, COOKIE_NAME, SESSION_SECONDS, type SessionUser } from "@/lib/session";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 },
      );
    }

    const [rows]: any = await pool.execute(
      "SELECT user_id,Fname,Lname,Email,Role,PasswordHash,dept_id FROM user WHERE Email=? LIMIT 1",
      [email],
    );

    if (!rows.length || !(await verifyPassword(password, rows[0].PasswordHash))) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const user: SessionUser = {
      user_id: Number(rows[0].user_id),
      Fname: rows[0].Fname,
      Lname: rows[0].Lname,
      Email: rows[0].Email,
      Role: rows[0].Role,
      dept_id: rows[0].dept_id === null ? null : Number(rows[0].dept_id),
    };

    const response = NextResponse.json({
      success: true,
      user,
      redirectTo:
        user.Role === "Admin"
          ? "/admin/dashboard"
          : user.Role === "Staff"
            ? "/worker/dashboard"
            : "/citizen/dashboard",
    });

    response.cookies.set(COOKIE_NAME, createSessionToken(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_SECONDS,
    });

    return response;
  } catch (error) {
    console.error("Login API:", error);
    return NextResponse.json(
      { success: false, error: "Unable to authenticate." },
      { status: 500 },
    );
  }
}

