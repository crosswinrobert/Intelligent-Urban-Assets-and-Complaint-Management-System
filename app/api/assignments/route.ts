import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { complaint_id, staff_id } = await request.json();
    await pool.query('CALL sp_assign_worker(?, ?)', [complaint_id, staff_id]);
    return NextResponse.json({ success: true, message: 'Worker assigned successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}