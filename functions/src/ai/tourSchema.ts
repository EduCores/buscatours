import { z } from 'zod';

// Shared schema for the tour payload produced by the AI generator and validated before
// it is returned to the client. Kept in its own module so it can be unit-tested without
// pulling in Vertex AI / firebase-functions.
export const TourInputSchema = z.object({
  title: z.string().min(5).max(100),
  location: z.string().min(3).max(100),
  duration: z.string().min(2).max(50),
  durationHours: z.number().int().positive().max(8760),
  originalPrice: z.number().positive(),
  price: z.number().positive(),
  discount: z.string().nullable(),
  category: z.enum([
    'OUTDOOR', 'RELAXACION', 'FERIADO', 'TEMPORADA', 'SALVAJE', 'AVENTURA',
    'TEMATICO', 'CULTURAL', 'CIUDAD', 'MONTANA', 'GLACIAR', 'LUJO',
    'HISTORICO', 'FAMILIAR', 'SELVA', 'FULLDAY', 'NAVEGACION'
  ]),
  description: z.string().min(20).max(500),
  image: z.string().url(),
  featured: z.boolean().default(false),
  oneDay: z.boolean().default(true),
  popular: z.boolean().default(false),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  destination: z.enum([
    'ARGENTINA', 'PERU', 'BOLIVIA', 'BRAZIL', 'COLOMBIA', 'ECUADOR',
    'CHILE', 'MEXICO', 'DOMINICAN_REPUBLIC'
  ]),
  vibeAdrenaline: z.number().int().min(0).max(100).default(50),
  vibeRelax: z.number().int().min(0).max(100).default(50),
  vibeCulture: z.number().int().min(0).max(100).default(50),
  vibeFamily: z.number().int().min(0).max(100).default(50),
  operatorId: z.string().uuid(),
});

export type GeneratedTour = z.infer<typeof TourInputSchema>;
