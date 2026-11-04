import { NextResponse } from 'next/server';
import { getEmbedding, findSimilarChromaComplaints } from '@/lib/vector';

export async function POST(request: Request) {
  try {
    const { description } = await request.json();
    if (!description) {
      return NextResponse.json({ success: false, error: 'Description required' }, { status: 400 });
    }

    // 1. Convert text to vector
    const queryVector = await getEmbedding(description);

    // 2. Search nearest neighbors in ChromaDB
    const matches = await findSimilarChromaComplaints(queryVector, 3);

    return NextResponse.json({ success: true, similar_complaints: matches });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}