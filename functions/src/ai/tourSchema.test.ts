import { describe, it, expect } from 'vitest';
import { TourInputSchema } from '../ai/tourSchema';

const validTour = {
  title: 'Tour de prueba en la Patagonia',
  location: 'Torres del Paine, Chile',
  duration: '3 Days',
  durationHours: 72,
  originalPrice: 500,
  price: 450,
  discount: '10% Off',
  category: 'AVENTURA',
  description: 'Una aventura épica por los glaciares del sur de Chile.',
  image: 'https://images.unsplash.com/photo-123',
  featured: false,
  oneDay: false,
  popular: false,
  status: 'DRAFT',
  destination: 'CHILE',
  vibeAdrenaline: 80,
  vibeRelax: 30,
  vibeCulture: 50,
  vibeFamily: 20,
  operatorId: '3f1d5e2a-9b2c-4c6d-8e1f-0a1b2c3d4e5f',
};

describe('TourInputSchema', () => {
  it('accepts a valid tour', () => {
    expect(() => TourInputSchema.parse(validTour)).not.toThrow();
  });

  it('rejects a short title', () => {
    expect(() => TourInputSchema.parse({ ...validTour, title: 'abc' })).toThrow();
  });

  it('rejects a short description', () => {
    expect(() => TourInputSchema.parse({ ...validTour, description: 'corto' })).toThrow();
  });

  it('rejects an invalid category', () => {
    expect(() => TourInputSchema.parse({ ...validTour, category: 'INVALID' })).toThrow();
  });

  it('rejects a non-uuid operatorId', () => {
    expect(() => TourInputSchema.parse({ ...validTour, operatorId: 'operator-01' })).toThrow();
  });

  it('rejects a non-url image', () => {
    expect(() => TourInputSchema.parse({ ...validTour, image: 'not-a-url' })).toThrow();
  });

  it('defaults optional booleans/status/vibes', () => {
    const parsed = TourInputSchema.parse({
      title: 'Tour de prueba en la Patagonia',
      location: 'Torres del Paine, Chile',
      duration: '3 Days',
      durationHours: 72,
      originalPrice: 500,
      price: 450,
      discount: null,
      category: 'AVENTURA',
      description: 'Una aventura épica por los glaciares del sur de Chile.',
      image: 'https://images.unsplash.com/photo-123',
      destination: 'CHILE',
      operatorId: '3f1d5e2a-9b2c-4c6d-8e1f-0a1b2c3d4e5f',
    });
    expect(parsed.status).toBe('DRAFT');
    expect(parsed.featured).toBe(false);
    expect(parsed.vibeAdrenaline).toBe(50);
  });
});
