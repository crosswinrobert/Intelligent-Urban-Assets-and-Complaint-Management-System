import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getEmbedding, addComplaintToChroma } from '@/lib/vector';

export async function POST(request: Request) {
  const connection = await pool.getConnection();
  try {
    const { user_id, category, raw_description, lat, long, photo_url, asset_id } = await request.json();

    if (!user_id || !raw_description) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Generate 384-dimensional vector
    const vector = await getEmbedding(raw_description);

    await connection.beginTransaction();

    // 2. Save metadata & vector in MySQL
    const [result]: any = await connection.execute(
      `INSERT INTO complaint 
        (user_id, Category, RawDescription, Lat, \`Long\`, PhotoURL, asset_id, status_id, UrgencyScore, Embedding) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, 3.00, ?)`,
      [user_id, category || 'General', raw_description, lat || null, long || null, photo_url || null, asset_id || null, JSON.stringify(vector)]
    );

    const complaintId = result.insertId;
    await connection.commit();

    // 3. Index vector in ChromaDB for high-speed retrieval
    await addComplaintToChroma(complaintId, raw_description, category || 'General', vector);

    return NextResponse.json({ success: true, complaint_id: complaintId });
  } catch (error: any) {
    await connection.rollback();
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}