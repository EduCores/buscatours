import { onRequest } from 'firebase-functions/v2/https';
import { generateTourWithAI, searchTours, translateContent } from './ai/index';
import { extractTourFromUrl } from './tours/extractTourFromUrl';

// Simple health check endpoint
export const health = onRequest((req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export { generateTourWithAI, searchTours, translateContent };
export { extractTourFromUrl };


