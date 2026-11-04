import { pipeline } from "@xenova/transformers";

type Embedder = (
  text: string,
  options: {
    pooling: "mean";
    normalize: true;
  }
) => Promise<{ data: Float32Array }>;

let embedderPromise: Promise<Embedder> | null = null;

export async function getEmbedding(text: string): Promise<number[]> {
  if (!text?.trim()) {
    throw new Error("Text cannot be empty.");
  }

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
