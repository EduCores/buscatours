import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { generateText } from '../utils/gemini';

const LANG_NAMES: Record<string, string> = {
  es: 'Spanish',
  en: 'English',
  pt: 'Portuguese',
};

interface TranslateRequest {
  sourceLang?: string;
  targetLangs?: string[];
  fields?: Record<string, string>;
}

export const translateContent = onCall<TranslateRequest>(async (request) => {
  const data = request.data || {};
  const sourceLang = data.sourceLang || 'es';
  const targetLangs = data.targetLangs || [];
  const fields = data.fields || {};

  const fieldKeys = Object.keys(fields).filter((k) => fields[k] && fields[k].trim().length > 0);
  if (fieldKeys.length === 0) {
    throw new HttpsError('invalid-argument', 'No fields provided to translate');
  }

  const validTargets = targetLangs.filter((l) => l !== sourceLang && LANG_NAMES[l]);
  if (validTargets.length === 0) {
    return {};
  }

  const sourceName = LANG_NAMES[sourceLang] || sourceLang;
  const shapeLines = validTargets
    .map((l) => `  "${l}": { ${fieldKeys.map((k) => `"${k}": "translated text"`).join(', ')} }`)
    .join(',\n');

  const systemPrompt =
    'You are a professional travel content translator for a South America tour marketplace.\n' +
    `Translate the provided fields FROM ${sourceName} INTO EACH of the requested target languages.\n` +
    'Keep proper nouns (city, country and brand names) unchanged unless they have a well-known localized form.\n' +
    'Preserve meaning, commercial/inviting tone and approximate length.\n' +
    'Return ONLY a JSON object (no markdown, no code fences) with this exact shape:\n' +
    '{\n' +
    shapeLines +
    '\n}\n' +
    'Only include the requested target languages. Translate every provided field.\n\n' +
    `Source language: ${sourceName}\n` +
    'Fields to translate (in ' + sourceName + '):\n' +
    JSON.stringify(fields, null, 2);

  try {
    const responseText = await generateText(systemPrompt);

    let cleaned = responseText.trim();
    const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) cleaned = fenceMatch[1].trim();
    const startIndex = cleaned.indexOf('{');
    const endIndex = cleaned.lastIndexOf('}');
    if (startIndex !== -1 && endIndex !== -1) {
      cleaned = cleaned.slice(startIndex, endIndex + 1);
    }

    const parsed = JSON.parse(cleaned);
    const result: Record<string, Record<string, string>> = {};
    for (const t of validTargets) {
      result[t] = parsed[t] || {};
    }
    return result;
  } catch (error) {
    console.error('translateContent error:', error);
    throw new HttpsError('internal', 'Translation failed');
  }
});
