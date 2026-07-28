import { describe, it, expect } from 'vitest';
import {
  mapCategoryToDb,
  mapCategoryFromDb,
  mapDestinationToDb,
  mapDestinationFromDb,
  normalizeGuideStatus,
  denormalizeGuideStatus,
  normalizeVehicleStatus,
  denormalizeVehicleStatus,
  normalizeBookingStatus,
  denormalizeBookingStatus,
  normalizeDbRole,
  parseTranslations,
  parseHeroImages,
  isUuid
} from '../services/mappers';

describe('category mapping', () => {
  it('maps UI labels to DB enum', () => {
    expect(mapCategoryToDb('Aventura')).toBe('AVENTURA');
    expect(mapCategoryToDb('Relaxación')).toBe('RELAXACION');
    expect(mapCategoryToDb('Full Day')).toBe('FULLDAY');
  });
  it('falls back to OUTDOOR for unknown', () => {
    expect(mapCategoryToDb('Desconocido')).toBe('OUTDOOR');
  });
  it('maps DB enum to UI label', () => {
    expect(mapCategoryFromDb('AVENTURA')).toBe('Aventura');
    expect(mapCategoryFromDb('FULLDAY')).toBe('Full Day');
  });
});

describe('destination mapping', () => {
  it('handles accents and English forms', () => {
    expect(mapDestinationToDb('Perú')).toBe('PERU');
    expect(mapDestinationToDb('Peru')).toBe('PERU');
    expect(mapDestinationToDb('México')).toBe('MEXICO');
  });
  it('maps back with accents', () => {
    expect(mapDestinationFromDb('PERU')).toBe('Perú');
    expect(mapDestinationFromDb('DOMINICAN_REPUBLIC')).toBe('República Dominicana');
  });
});

describe('status normalization', () => {
  it('guide status', () => {
    expect(normalizeGuideStatus('disponible')).toBe('DISPONIBLE');
    expect(normalizeGuideStatus('en tour')).toBe('EN_TOUR');
    expect(normalizeGuideStatus('OFFLINE')).toBe('OFFLINE');
    expect(denormalizeGuideStatus('EN_TOUR')).toBe('En tour');
  });
  it('vehicle status', () => {
    expect(normalizeVehicleStatus('en uso')).toBe('EN_USO');
    expect(denormalizeVehicleStatus('EN_USO')).toBe('En uso');
  });
  it('booking status', () => {
    expect(normalizeBookingStatus('confirmada')).toBe('CONFIRMED');
    expect(denormalizeBookingStatus('CANCELLED')).toBe('Cancelada');
  });
});

describe('role normalization', () => {
  it('maps DB role to UI role', () => {
    expect(normalizeDbRole('PLATFORM_ADMIN')).toBe('platform-admin');
    expect(normalizeDbRole('TOUR_ADMIN')).toBe('tour-admin');
    expect(normalizeDbRole('OPERATOR')).toBe('operator');
    expect(normalizeDbRole('CUSTOMER')).toBe('customer');
    expect(normalizeDbRole(undefined)).toBe('customer');
  });
});

describe('parseTranslations', () => {
  it('parses a JSON string', () => {
    expect(parseTranslations('{"es":{"title":"Hola"}}')).toEqual({ es: { title: 'Hola' } });
  });
  it('returns empty for invalid', () => {
    expect(parseTranslations('not json')).toEqual({});
    expect(parseTranslations(null)).toEqual({});
  });
});

describe('parseHeroImages', () => {
  it('parses a JSON array string', () => {
    expect(parseHeroImages('["a.jpg","b.jpg"]')).toEqual(['a.jpg', 'b.jpg']);
  });
  it('splits a comma string', () => {
    expect(parseHeroImages('a.jpg, b.jpg')).toEqual(['a.jpg', 'b.jpg']);
  });
  it('returns empty for empty string', () => {
    expect(parseHeroImages('')).toEqual([]);
  });
});

describe('isUuid', () => {
  it('detects valid uuids', () => {
    expect(isUuid('3f1d5e2a-9b2c-4c6d-8e1f-0a1b2c3d4e5f')).toBe(true);
  });
  it('rejects non-uuids', () => {
    expect(isUuid('tour-mock-1')).toBe(false);
    expect(isUuid(123)).toBe(false);
  });
});
