import { pipeline } from "@xenova/transformers";

type Embedder = (
  text: string,
  options: { pooling: "mean"; normalize: true }
) => Promise<{ data: Float32Array }>;

const CHROMA_URL = (process.env.CHROMA_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const TENANT = "default_tenant";
const DATABASE = "default_database";
const COLLECTION_NAME = "urban_complaints";

const COLLECTIONS_URL =
  `${CHROMA_URL}/api/v2/tenants/${TENANT}/databases/${DATABASE}/collections`;

let embedderPromise: Promise<Embedder> | null = null;
let collectionIdPromise: Promise<string> | null = null;

export async function getEmbedding(text: string): Promise<number[]> {
  if (!text?.trim()) throw new Error("Text cannot be empty.");

  if (!embedderPromise) {
    embedderPromise = pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    ) as unknown as Promise<Embedder>;
  }

  try {
    const embedder = await embedderPromise;
    const output = await embedder(text, {
      pooling: "mean",
      normalize: true,
    });
    return Array.from(output.data);
  } catch (error) {
    embedderPromise = null;
    throw error;
  }
}

async function getCollectionId(): Promise<string> {
  if (!collectionIdPromise) {
    collectionIdPromise = (async () => {
      const response = await fetch(COLLECTIONS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: COLLECTION_NAME,
          get_or_create: true,
          metadata: { "hnsw:space": "cosine" },
        }),
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `ChromaDB collection error (${response.status}): ${await response.text()}`
        );
      }

      const collection = await response.json();
      if (!collection.id) throw new Error("ChromaDB returned no collection ID.");

      return collection.id as string;
    })().catch((error) => {
      collectionIdPromise = null;
      throw error;
    });
  }

  return collectionIdPromise;
}

export async function addComplaintToChroma(
  complaintId: number,
  description: string,
  category: string,
  embedding: number[]
): Promise<void> {
  const collectionId = await getCollectionId();

  const response = await fetch(
    `${COLLECTIONS_URL}/${collectionId}/upsert`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ids: [String(complaintId)],
        embeddings: [embedding],
        documents: [description],
        metadatas: [{ category, description }],
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `ChromaDB upsert failed (${response.status}): ${await response.text()}`
    );
  }
}

export async function findSimilarChromaComplaints(
  queryVector: number[],
  topK = 3
) {
  const collectionId = await getCollectionId();

  const response = await fetch(
    `${COLLECTIONS_URL}/${collectionId}/query`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query_embeddings: [queryVector],
        n_results: topK,
        include: ["documents", "metadatas", "distances"],
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `ChromaDB query failed (${response.status}): ${await response.text()}`
    );
  }

  const results = await response.json();
  const ids: string[] = results.ids?.[0] || [];

  return ids.map((id, index) => {
    const distance = results.distances?.[0]?.[index] ?? 1;
    const similarity = Math.max(0, Math.min(1, 1 - distance));

    return {
      complaint_id: Number(id),
      description: results.documents?.[0]?.[index] || "",
      category: results.metadatas?.[0]?.[index]?.category || "General",
      similarity_score: Math.round(similarity * 100) / 100,
    };
  });
}

// Retained for compatibility with any existing callers.
export function calculateCosineSimilarity(
  vecA: number[],
  vecB: number[]
): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;
  const dot = vecA.reduce((sum, value, i) => sum + value * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, value) => sum + value * value, 0));
  const magB = Math.sqrt(vecB.reduce((sum, value) => sum + value * value, 0));
  if (!magA || !magB) return 0;
  return dot / (magA * magB);
}
