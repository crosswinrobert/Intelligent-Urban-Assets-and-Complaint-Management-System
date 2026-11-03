import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getEmbedding, calculateCosineSimilarity } from '@/lib/vector';

export async function POST(request: Request) {
  try {
    const { description } = await request.json();
    if (!description) {
      return NextResponse.json({ success: false, error: 'Description required' }, { status: 400 });
    }

    const queryVector = await getEmbedding(description);
    const [rows]: any = await pool.query(
      `SELECT complaint_id, RawDescription, Category, Embedding FROM complaint WHERE Embedding IS NOT NULL`
    );

    const matches = rows.map((row: any) => {
      const storedVector = JSON.parse(row.Embedding);
      const similarity = calculateCosineSimilarity(queryVector, storedVector);
      return {
        complaint_id: row.complaint_id,
        description: row.RawDescription,
        category: row.Category,
        similarity_score: Math.round(similarity * 100) / 100
      };
    });

    matches.sort((a: any, b: any) => b.similarity_score - a.similarity_score);

    return NextResponse.json({ success: true, similar_complaints: matches.slice(0, 3) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}