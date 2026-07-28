import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as cheerio from 'cheerio';

interface ExtractRequest {
  url: string;
}

interface TourExtractResult {
  title?: string;
  description?: string;
  image?: string;
  location?: string;
  duration?: string;
  durationHours?: number;
  price?: number;
  originalPrice?: number;
  category?: string;
  status?: string;
  destinationCountry?: string;
  operator?: string;
  vibeAdrenaline?: number;
  vibeRelax?: number;
  vibeCulture?: number;
  vibeFamily?: number;
  heroImages?: string[];
  sourceUrl: string;
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  OUTDOOR: ['outdoor', 'trekking', 'hiking', 'caminata', 'ascenso', 'montaña'],
  AVENTURA: ['aventura', 'adventure', 'rafting', 'kayak', 'climbing', 'escalada', 'tirolesa', 'zipline'],
  CULTURAL: ['cultural', 'museo', 'historia', 'ruinas', 'arqueológico', 'patrimonio', 'historical'],
  HISTORICO: ['histórico', 'history', 'colonial', 'heritage'],
  MONTANA: ['montaña', 'mountain', 'cordillera', 'andes', 'pico', 'summit'],
  GLACIAR: ['glaciar', 'glacier', 'hielo', 'ice', 'perito moreno'],
  SELVA: ['selva', 'jungle', 'amazonia', 'amazon', 'rainforest', 'tropical'],
  RELAXACION: ['relax', 'spa', 'termas', 'wellness', 'descanso', 'relajación'],
  FAMILIAR: ['familiar', 'family', 'niños', 'kids', 'children', 'infantil'],
  TEMATICO: ['tematico', 'theme', 'gastronomía', 'gastronomy', 'wine', 'vino'],
  CIUDAD: ['ciudad', 'city', 'urban', 'metrópolis', 'capital'],
  FERIADO: ['feriado', 'holiday', 'vacaciones', 'vacation'],
  TEMPORADA: ['temporada', 'season', 'verano', 'invierno', 'primavera', 'otoño'],
  LUJO: ['lujo', 'luxury', 'premium', 'exclusivo', 'vip'],
  FULLDAY: ['full day', 'día completo', 'full-day', '1 día'],
  NAVEGACION: ['navegación', 'navegacion', 'boat', 'barco', 'crucero', 'kayak', 'velero'],
};

const DESTINATION_KEYWORDS: Record<string, string[]> = {
  CHILE: ['chile', 'santiago', 'patagonia', 'torres del paine', 'valparaíso', 'atacama', 'san pedro', 'pucon', 'frutillar'],
  ARGENTINA: ['argentina', 'buenos aires', 'mendoza', 'bariloche', 'ushuaia', 'el calafate', 'iguazú'],
  PERU: ['perú', 'peru', 'cusco', 'machu picchu', 'lima', 'arequipa', 'puno', 'tacna'],
  COLOMBIA: ['colombia', 'bogotá', 'medellín', 'cartagena', 'cali', 'santa marta', 'tayrona'],
  ECUADOR: ['ecuador', 'quito', 'guayaquil', 'galápagos', 'galapagos', 'cuenca'],
  BOLIVIA: ['bolivia', 'la paz', 'sucre', 'potosí', 'salar de uyuni', 'uyuni'],
  BRASIL: ['brasil', 'brazil', 'rio de janeiro', 'sao paulo', 'salvador', 'fernando de noronha'],
  MEXICO: ['méxico', 'mexico', 'ciudad de méxico', 'cancún', 'tulum', 'oaxaca', 'chichén'],
  DOMINICAN_REPUBLIC: ['dominicana', 'dominican', 'punta cana', 'santo domingo', 'la romana'],
};

function detectCategory(text: string): string {
  const lower = text.toLowerCase();
  let bestMatch = 'CULTURAL';
  let bestScore = 0;
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.reduce((acc, kw) => acc + (lower.includes(kw) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = category;
    }
  }
  return bestMatch;
}

function detectDestination(text: string): string {
  const lower = text.toLowerCase();
  for (const [country, keywords] of Object.entries(DESTINATION_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return country;
    }
  }
  return 'PERU';
}

function extractPrice(text: string): { price?: number; originalPrice?: number } {
  const usdMatch = text.match(/\$[\s,]*(\d{2,5})/);
  const priceMatch = text.match(/(?:precio|price|desde|from)[:\s]*\$?[\s,]*(\d{2,5})/i);
  const discountMatch = text.match(/(\d+)%\s*(?:off|descuento|dcto)/i);

  let price = priceMatch ? parseInt(priceMatch[1]) : usdMatch ? parseInt(usdMatch[1]) : undefined;
  let originalPrice = price;

  if (discountMatch && price) {
    const discount = parseInt(discountMatch[1]);
    originalPrice = Math.round(price / (1 - discount / 100));
  } else if (price) {
    originalPrice = Math.round(price * 1.2);
  }

  return { price, originalPrice };
}

function extractDuration(text: string): string {
  const daysMatch = text.match(/(\d+)\s*(?:días|dias|days?)/i);
  const hoursMatch = text.match(/(\d+)\s*(?:horas|hours?|hrs?)/i);
  if (daysMatch && hoursMatch) {
    return `${daysMatch[1]} días / ${hoursMatch[1]} horas`;
  }
  if (daysMatch) {
    return `${daysMatch[1]} días / ${parseInt(daysMatch[1]) * 8} horas`;
  }
  if (hoursMatch) {
    return `1 día / ${hoursMatch[1]} horas`;
  }
  return '1 día / 8 horas';
}

function extractDurationHours(text: string): number {
  const hoursMatch = text.match(/(\d+)\s*(?:horas|hours?|hrs?)/i);
  if (hoursMatch) return parseInt(hoursMatch[1]);
  return 8;
}

function pickBestImage($: cheerio.CheerioAPI, baseUrl: string): string | undefined {
  const ogImage = $('meta[property="og:image"]').attr('content');
  if (ogImage) return ogImage;
  const twitterImage = $('meta[name="twitter:image"]').attr('content');
  if (twitterImage) return twitterImage;
  const firstImg = $('img').first().attr('src');
  if (firstImg) {
    try {
      return new URL(firstImg, baseUrl).href;
    } catch {
      return firstImg;
    }
  }
  return undefined;
}

export const extractTourFromUrl = onCall<ExtractRequest>(async (request) => {
  const { url } = request.data;

  if (!url || typeof url !== 'string') {
    throw new HttpsError('invalid-argument', 'Missing url');
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(url);
  } catch {
    throw new HttpsError('invalid-argument', 'Invalid URL');
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BuscaTours/1.0; +https://buscatours.cl)',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new HttpsError('internal', `HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const baseUrl = `${targetUrl.protocol}//${targetUrl.host}`;

    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      '';

    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      '';

    const image = pickBestImage($, baseUrl);

    const allText = $('body').text();
    const combinedText = `${title} ${description} ${allText}`;

    const category = detectCategory(combinedText);
    const destinationCountry = detectDestination(combinedText);
    const duration = extractDuration(combinedText);
    const durationHours = extractDurationHours(combinedText);
    const { price, originalPrice } = extractPrice(combinedText);

    const images: string[] = [];
    $('meta[property="og:image"]').each((_, el) => {
      const src = $(el).attr('content');
      if (src) {
        try {
          images.push(new URL(src, baseUrl).href);
        } catch {
          images.push(src);
        }
      }
    });
    if (images.length === 0) {
      $('img').each((_, el) => {
        const src = $(el).attr('src');
        if (src && images.length < 5) {
          try {
            images.push(new URL(src, baseUrl).href);
          } catch {
            images.push(src);
          }
        }
      });
    }

    const result: TourExtractResult = {
      title: title || targetUrl.hostname,
      description: description || '',
      image: image || '',
      location: destinationCountry,
      duration,
      durationHours,
      price: price || 199,
      originalPrice: originalPrice || Math.round((price || 199) * 1.2),
      category,
      status: 'DRAFT',
      destinationCountry,
      vibeAdrenaline: 50,
      vibeRelax: 50,
      vibeCulture: 50,
      vibeFamily: 50,
      heroImages: images,
      sourceUrl: targetUrl.toString(),
    };

    return result;
  } catch (error) {
    console.error('Error extracting tour from URL:', error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError('internal', 'Failed to extract tour data');
  }
});
