import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getEmbedding, findSimilarChromaComplaints } from "@/lib/vector";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  if (user.Role === "Citizen") {
    return NextResponse.json(
      { success: false, error: "Forbidden." },
      { status: 403 }
    );
  }

  try {
    const { description } = await req.json();

    if (typeof description !== "string" || !description.trim()) {
      return NextResponse.json(
        { success: false, error: "Description required." },
        { status: 400 }
      );
    }

    // ChromaDB indexing and querying both use description-only embeddings.
    const vector = await getEmbedding(description.trim());
    const matches = await findSimilarChromaComplaints(vector, 3);

    if (matches.length === 0) {
      return NextResponse.json({
        success: true,
        similar_complaints: [],
      });
    }

    // Fetch canonical complaint details from MySQL.
    const ids = matches.map((item) => item.complaint_id);
    const [rows]: any = await pool.query(
      `SELECT complaint_id, RawDescription, Category
       FROM complaint
       WHERE complaint_id IN (?)`,
      [ids]
    );

    const byId = new Map(
      rows.map((row: any) => [Number(row.complaint_id), row])
    );

    const similarComplaints = matches
      .filter((match) => byId.has(match.complaint_id))
      .map((match) => {
        const row: any = byId.get(match.complaint_id);
        return {
          complaint_id: match.complaint_id,
          description: row.RawDescription,
          category: row.Category,
          similarity_score: match.similarity_score,
        };
      });

    return NextResponse.json({
      success: true,
      similar_complaints: similarComplaints,
    });
  } catch (error) {
    console.error("ChromaDB similarity search failed:", error);
    return NextResponse.json(
      { success: false, error: "Similarity search failed." },
      { status: 500 }
    );
  }
}
