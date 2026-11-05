import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getEmbedding, addComplaintToChroma } from "@/lib/vector";
import { getCurrentUser } from "@/lib/auth";

export async function POST() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  if (user.Role !== "Admin") {
    return NextResponse.json(
      { success: false, error: "Admin access required." },
      { status: 403 }
    );
  }

  try {
    const [rows]: any = await pool.query(
      "SELECT complaint_id, RawDescription, Category FROM complaint ORDER BY complaint_id"
    );

    let indexed = 0;
    const failed: number[] = [];

    for (const row of rows) {
      try {
        const embedding = await getEmbedding(row.RawDescription);
        await addComplaintToChroma(
          Number(row.complaint_id),
          row.RawDescription,
          row.Category,
          embedding
        );
        indexed++;
      } catch (error) {
        console.error(
          `ChromaDB indexing failed for complaint ${row.complaint_id}:`,
          error
        );
        failed.push(Number(row.complaint_id));
      }
    }

    return NextResponse.json({
      success: true,
      total: rows.length,
      indexed,
      failed: failed.length,
      failed_ids: failed,
    });
  } catch (error) {
    console.error("ChromaDB reindex failed:", error);
    return NextResponse.json(
      { success: false, error: "Unable to reindex complaints." },
      { status: 500 }
    );
  }
}
