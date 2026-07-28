import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const project = process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID;
const location = process.env.VERTEX_AI_LOCATION || 'us-central1';

// Initialize SDK: Uses API key if provided, or Vertex AI project/location fallback.
const ai = apiKey
  ? new GoogleGenAI({ apiKey })
  : new GoogleGenAI({ vertexai: true, project, location });

export async function generateText(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  });

  return response.text || '';
}