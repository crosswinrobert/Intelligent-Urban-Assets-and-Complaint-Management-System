import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const [rows]: any = await pool.query(
      `SELECT user_id, Fname, Lname, Email, Role, PasswordHash, dept_id 
       FROM user WHERE Email = ?`,
      [email]
    );

    if (rows.length === 0 || rows[0].PasswordHash !== password) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const user = rows[0];
    delete user.PasswordHash;

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}