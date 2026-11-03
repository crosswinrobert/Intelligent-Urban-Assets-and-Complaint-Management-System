import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getEmbedding } from '@/lib/vector';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let query = `
      SELECT 
        c.complaint_id, c.Category, c.RawDescription, c.Lat, c.\`Long\`, 
        c.UrgencyScore, c.SubmittedAt, c.ResolvedAt,
        cs.Status AS current_status,
        u.Fname AS citizen_fname, u.Lname AS citizen_lname,
        a.AssetName
      FROM complaint c
      JOIN complaint_status cs ON c.status_id = cs.status_id
      JOIN user u ON c.user_id = u.user_id
      LEFT JOIN asset a ON c.asset_id = a.asset_id
    `;
    const params: any[] = [];

    if (userId) {
      query += ` WHERE c.user_id = ?`;
      params.push(userId);
    }
    query += ` ORDER BY c.SubmittedAt DESC`;

    const [rows] = await pool.query(query, params);
    return NextResponse.json({ success: true, complaints: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const connection = await pool.getConnection();
  try {
    const { user_id, category, raw_description, lat, long, photo_url, asset_id } = await request.json();

    if (!user_id || !raw_description) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const vector = await getEmbedding(raw_description);
    const vectorJson = JSON.stringify(vector);

    await connection.beginTransaction();

    const [result]: any = await connection.execute(
      `INSERT INTO complaint 
        (user_id, Category, RawDescription, Lat, \`Long\`, PhotoURL, asset_id, status_id, UrgencyScore, Embedding) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, 3.00, ?)`,
      [user_id, category || 'General', raw_description, lat || null, long || null, photo_url || null, asset_id || null, vectorJson]
    );

    await connection.commit();
    return NextResponse.json({ success: true, complaint_id: result.insertId });
  } catch (error: any) {
    await connection.rollback();
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}