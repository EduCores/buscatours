import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { generateText } from '../utils/gemini';

export const searchTours = onCall<{ query: string }>(async (request) => {
  const { query } = request.data;
  
  if (!query || query.trim().length < 2) {
    throw new HttpsError('invalid-argument', 'Query too short');
  }

  const systemPrompt = 'Find tours matching: "' + query + '"\n' +
    'Return ONLY a JSON array of tour IDs: ["id1", "id2", "id3"]\n' +
    'Maximum 10 results. No explanations.';

  try {
    const responseText = await generateText(systemPrompt);
    const jsonMatch = responseText.match(/\[.*\]/s);
    const ids = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    
    return { tourIds: ids };
  } catch (error) {
    console.error('Error in searchTours:', error);
    throw new HttpsError('internal', 'Error in semantic search');
  }
});