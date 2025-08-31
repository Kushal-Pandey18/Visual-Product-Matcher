import { NextRequest, NextResponse } from 'next/server';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import mockProducts from '@/data/mock-products.json';
import { Image, createCanvas } from 'canvas';
import fetch from 'node-fetch';

// Define the shape of a product object, including its embedding
interface Product {
  id: number;
  name: string;
  category: string;
  imageFileName: string;
  embedding: number[];
}

// Helper function to calculate cosine similarity between two vectors
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

// Helper function to load an image from a URL and convert it to a tensor
async function loadImageFromUrl(url: string): Promise<tf.Tensor3D | null> {
  try {
    const response = await (fetch as any)(url);
    if (!response.ok) {
      console.error(`Failed to fetch image from URL: ${url}, status: ${response.status}`);
      return null;
    }
    const buffer = await response.buffer();
    const img = new Image();
    img.src = buffer;
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    return tf.browser.fromPixels(canvas as any);
  } catch (error) {
    console.error(`Error loading image from URL: ${url}`, error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;
    const imageUrl = formData.get('imageUrl') as string | null;

    if (!imageFile && !imageUrl) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const model = await mobilenet.load();

    let userImageTensor: tf.Tensor3D | null = null;
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const img = new Image();
      img.src = buffer;
      const canvas = createCanvas(img.width, img.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);
      userImageTensor = tf.browser.fromPixels(canvas as any);
    } else if (imageUrl) {
      userImageTensor = await loadImageFromUrl(imageUrl);
    }

    if (!userImageTensor) {
      return NextResponse.json({ error: 'Invalid image provided' }, { status: 400 });
    }

    const resizedUserImage = tf.image.resizeBilinear(userImageTensor, [224, 224]);
    const userEmbedding = model.infer(resizedUserImage, true);
    const userEmbeddingData = await userEmbedding.data() as Float32Array;

    const results = (mockProducts as Product[]).map(product => {
      const similarityScore = cosineSimilarity(
        Array.from(userEmbeddingData),
        product.embedding
      );
      return {
        ...product,
        similarityScore,
      };
    });

    const sortedResults = results.sort((a, b) => b.similarityScore - a.similarityScore);

    userImageTensor.dispose();
    resizedUserImage.dispose();
    userEmbedding.dispose();

    return NextResponse.json({ results: sortedResults.slice(0, 5) });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
