import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { generateText } from '../utils/gemini';
import { TourInputSchema } from './tourSchema';
export const generateTourWithAI = onCall<{ draft: string; tone?: string }>(async (request) => {
  const { draft, tone = 'Aventurero' } = request.data;
  
  if (!draft || draft.trim().length < 10) {
    throw new HttpsError('invalid-argument', 'Draft must be at least 10 characters');
  }

  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  const systemPrompt = 'You are a travel content writer and B2B marketing specialist.\n' +
    'From the following tour idea written by an operator:\n"' + draft + '"\n\n' +
    'And with a communication tone of type "' + tone + '".\n\n' +
    'Generate a pure JSON object (no markdown code blocks) containing the complete tour technical sheet.\n' +
    'The JSON must have exactly this structure:\n' +
    '{\n' +
    '  "title": "Short commercial tour title in Spanish",\n' +
    '  "location": "City or Zone, Country (e.g. Torres del Paine, Chile)",\n' +
    '  "duration": "Friendly duration text (e.g. \'1 Day\' or \'3 Days 2 Nights\')",\n' +
    '  "durationHours": total tour hours (integer),\n' +
    '  "originalPrice": suggested price (integer USD),\n' +
    '  "price": final suggested price (integer USD, less than or equal to originalPrice),\n' +
    '  "discount": "Short commercial discount tag (e.g. \'15% Off\' or \'Recommended\' or null)",\n' +
    '  "category": "Exact category (choose one: OUTDOOR, RELAXACION, FERIADO, TEMPORADA, SALVAJE, AVENTURA, TEMATICO, CULTURAL, CIUDAD, MONTANA, GLACIAR, LUJO, HISTORICO, FAMILIAR, SELVA, FULLDAY, NAVEGACION)",\n' +
    '  "description": "Attractive commercial SEO-optimized description (max 3 sentences) detailing the itinerary.",\n' +
    '  "image": "Valid Unsplash thematic high-quality image URL (e.g. https://images.unsplash.com/photo-...) related to destination",\n' +
    '  "featured": false,\n' +
    '  "oneDay": true if lasts 1 day or less, false if longer,\n' +
    '  "popular": false,\n' +
    '  "status": "DRAFT",\n' +
    '  "destination": "Tour country (must match exactly one of: ARGENTINA, PERU, BOLIVIA, BRAZIL, COLOMBIA, ECUADOR, CHILE, MEXICO, DOMINICAN_REPUBLIC)",\n' +
    '  "vibeAdrenaline": 0-100 adrenaline score,\n' +
    '  "vibeRelax": 0-100 relax score,\n' +
    '  "vibeCulture": 0-100 culture score,\n' +
    '  "vibeFamily": 0-100 family score,\n' +
    '  "operatorId": "' + request.auth.uid + '"\n' +
    '}\n\nRespond ONLY with valid JSON.';

  try {
    const responseText = await generateText(systemPrompt);
    
    const jsonMatch = responseText.match(/\{.*\}/s);
    if (!jsonMatch) {
      throw new HttpsError('internal', 'AI did not return valid JSON');
    }
    
    const parsed = TourInputSchema.parse(JSON.parse(jsonMatch[0]));
    parsed.operatorId = request.auth.uid;
    return parsed;
    
  } catch (error) {
    if (error instanceof HttpsError) throw error;
    console.error('Error in generateTourWithAI:', error);
    throw new HttpsError('internal', 'Error generating tour with AI');
  }
});