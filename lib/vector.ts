import { pipeline, env } from '@xenova/transformers';

// Disable native image processors since we only process text embeddings
env.allowLocalModels = true;

const CHROMA_BASE_URL = "http://localhost:8000/api/v1";
const COLLECTION_NAME = "urban_complaints";

let embedder: any = null;

// Load MiniLM-L6-v2 text embedding model
async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedder;
}

export async function getEmbedding(text: string): Promise<number[]> {
  const extractor = await getEmbedder();
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

// Get or Create ChromaDB Collection ID via REST API
async function getOrCreateCollectionId(): Promise<string> {
  const res = await fetch(`${CHROMA_BASE_URL}/collections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: COLLECTION_NAME,
      get_or_create: true,
      metadata: { "hnsw:space": "cosine" }
    })
  });

  if (!res.ok) {
    throw new Error(`Failed to get/create ChromaDB collection: ${res.statusText}`);
  }

  const data = await res.json();
  return data.id;
}

// Add vector to local ChromaDB server
export async function addComplaintToChroma(
  complaintId: number, 
  description: string, 
  category: string, 
  embedding: number[]
) {
  const collectionId = await getOrCreateCollectionId();

  const res = await fetch(`${CHROMA_BASE_URL}/collections/${collectionId}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ids: [complaintId.toString()],
      embeddings: [embedding],
      metadatas: [{ category, description }],
      documents: [description]
    })
  });

  if (!res.ok) {
    console.error('ChromaDB Add Error:', await res.text());
  }
}

// Query top N semantically similar vectors from ChromaDB
export async function findSimilarChromaComplaints(queryVector: number[], topK = 3) {
  try {
    const collectionId = await getOrCreateCollectionId();

    const res = await fetch(`${CHROMA_BASE_URL}/collections/${collectionId}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query_embeddings: [queryVector],
        n_results: topK
      })
    });

    if (!res.ok) return [];

    const results = await res.json();
    if (!results || !results.ids || !results.ids[0]) return [];

    return results.ids[0].map((id: string, index: number) => {
      const distance = results.distances ? results.distances[0][index] : 0;
      // Convert Cosine Distance to Similarity percentage
      const similarity = Math.max(0, 1 - distance);

      return {
        complaint_id: parseInt(id),
        description: results.documents[0][index],
        category: results.metadatas[0][index]?.category || 'General',
        similarity_score: Math.round(similarity * 100) / 100
      };
    });
  } catch (err) {
    console.error('ChromaDB Query Exception:', err);
    return [];
  }
}