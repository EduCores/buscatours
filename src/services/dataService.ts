import { httpsCallable } from 'firebase/functions';
import { getDataConnect, connectDataConnectEmulator } from 'firebase/data-connect';
import { getFirebaseApp, getCloudFunctions, getAuthUid } from './firebaseAuth';
import {
  connectorConfig,
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  getUsers,
  getCurrentUser,
  getActiveSliderSlides,
  createSliderSlide,
  updateSliderSlide,
  deleteSliderSlide,
  getGuides,
  createGuide,
  updateGuide,
  deleteGuide,
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getOfflineQueue,
  addOfflineCheckin,
  deletePwaCheckin
} from '@dataconnect/generated';
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
} from './mappers';

export interface TourInput {
  title: string;
  location: string;
  duration: string;
  durationHours: number;
  originalPrice: number;
  price: number;
  discount?: string | null;
  category: string;
  description: string;
  image: string;
  featured: boolean;
  oneDay: boolean;
  popular: boolean;
  status: string;
  destination: string;
  vibeAdrenaline: number;
  vibeRelax: number;
  vibeCulture: number;
  vibeFamily: number;
  lat?: number | null;
  lng?: number | null;
  heroImages?: string;
  heroBackgroundPosition: string;
  operatorId?: string | null;
  translations?: Record<string, Record<string, string>> | string | null;
  // Professional fields
  durationDays?: number;
  shortDescription?: string;
  availableDates?: unknown;
  itinerary?: unknown;
  minAge?: number;
  maxPassengers?: number;
  trailerUrl?: string;
  galleryImages?: unknown;
  mapCenterLat?: number;
  mapCenterLng?: number;
  mapZoom?: number;
  difficulty?: string;
  seasonality?: unknown;
  includes?: unknown;
  excludes?: unknown;
  requirements?: unknown;
  pickupInfo?: string;
  cancellationPrice?: number;
  cancellationPolicy?: string;
  languages?: unknown;
  groupType?: string;
  vibeScores?: { adrenalina: number; relax: number; cultura: number; familia: number };
  destinationCountry?: string;
  bgPosition?: string;
}

export interface BookingInput {
  id?: string;
  bookingId?: string;
  tourId: string;
  userId: string;
  guests: number;
  date: string;
  totalPrice: number;
  totalPriceUSD?: number;
  currency: string;
  status?: string;
  addons?: unknown;
  specialRequests?: string;
}

export interface GuideInput {
  id?: string;
  name: string;
  specialty: string;
  status: string;
  operatorId: string;
}

export interface VehicleInput {
  id?: string;
  name: string;
  seats: number;
  status: string;
  operatorId: string;
}

export interface SliderSlideInput {
  id?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  link: string;
  image: string;
  order: number;
  active: boolean;
  translations?: Record<string, Record<string, string>> | string | null;
}

export interface OfflineCheckinInput {
  tourId: string;
  bookingId: string;
  tourTitle: string;
  customerName: string;
  operator: string;
  status: string;
  timestamp: string;
}

// Type alias for the generic DB row shape returned by Data Connect.
type Tour = Record<string, unknown>;

// Inicializar Data Connect con la app explícita
let dataconnect: ReturnType<typeof getDataConnect> | null = null;
let dataConnectFailed = false;

async function getDataconnect() {
  if (dataconnect) return dataconnect;
  if (dataConnectFailed) throw new Error('DataConnect emulator not available');
  try {
    const app = getFirebaseApp();
    dataconnect = getDataConnect(app, connectorConfig);
    if (import.meta.env.VITE_USE_EMULATORS === 'true') {
      connectDataConnectEmulator(dataconnect, '127.0.0.1', 9399);
    }
    return dataconnect;
  } catch (e) {
    dataConnectFailed = true;
    console.warn('DataConnect init failed, using offline mode:', e);
    throw e;
  }
}

const functions = getCloudFunctions();

function handleError(error: unknown): never {
  const message = error instanceof Error ? error.message : String(error);
  console.error('DataConnect error:', error);
  throw new Error(message || 'Error en la operación');
}

function isUnauthenticatedError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('unauthenticated') || error.message.includes('UNAUTHENTICATED');
  }
  return false;
}

const MOCK_TOURS: Tour[] = [
  {
    id: 'tour-mock-1',
    title: 'Torres del Paine Full Day',
    location: 'Puerto Natales, Chile',
    price: 120,
    originalPrice: 150,
    discount: '20% Off',
    duration: '1 Día',
    durationHours: 12,
    category: 'Outdoor',
    description: 'Cueva del Milodón, Laguna Sofía y Lago Grey en la excursión más completa de Patagonia.',
    image: '/uploads/tours/torres-del-paine-card-tour.webp',
    oneDay: true,
    popular: true,
    guideId: 'guide-1',
    vehicleId: 'vehicle-1',
    operator: 'Andes Expeditions',
    vibeScores: { adrenalina: 75, relax: 30, cultura: 40, familia: 70 },
    destinationCountry: 'Argentina',
    lat: -51.2533,
    lng: -72.9814,
    heroImages: ['/uploads/tours/torres-del-paine-card-tour.webp'],
    bgPosition: 'center',
    status: 'PUBLISHED',
    destination: 'Argentina'
  },
  {
    id: 'tour-mock-2',
    title: 'Camino Inca a Machu Picchu',
    location: 'Cusco, Perú',
    price: 130,
    originalPrice: 160,
    discount: 'Recomendado',
    duration: '1 Día',
    durationHours: 9,
    category: 'Aventura',
    description: 'Trekking legendario hasta la ciudadela sagrada de Machu Picchu.',
    image: '/uploads/tours/Machu-Picchu-card-tour.webp',
    oneDay: true,
    popular: true,
    guideId: 'guide-2',
    vehicleId: 'vehicle-2',
    operator: 'Andes Expeditions',
    vibeScores: { adrenalina: 85, relax: 15, cultura: 95, familia: 50 },
    destinationCountry: 'Perú',
    lat: -13.1631,
    lng: -72.545,
    heroImages: ['/uploads/tours/Machu-Picchu-card-tour.webp'],
    bgPosition: 'center',
    status: 'PUBLISHED',
    destination: 'Perú'
  },
  {
    id: 'tour-mock-3',
    title: 'Salar de Uyuni 4x4',
    location: 'Potosí, Bolivia',
    price: 195,
    originalPrice: 210,
    discount: null,
    duration: '10 Horas',
    durationHours: 10,
    category: 'Outdoor',
    description: 'Espejo de sal infinito, Isla Incahuasi y lagunas de colores.',
    image: '/uploads/tours/salar-de-uyuni-card-tour.webp',
    oneDay: true,
    popular: false,
    guideId: 'guide-3',
    vehicleId: 'vehicle-3',
    operator: 'Bolivia Salt Flats',
    vibeScores: { adrenalina: 70, relax: 35, cultura: 50, familia: 75 },
    destinationCountry: 'Bolivia',
    lat: -20.1338,
    lng: -67.4891,
    heroImages: ['/uploads/tours/salar-de-uyuni-card-tour.webp'],
    bgPosition: 'center',
    status: 'PUBLISHED',
    destination: 'Bolivia'
  },
  {
    id: 'tour-mock-4',
    title: 'Río de Janeiro Imprescindible',
    location: 'Río de Janeiro, Brasil',
    price: 220,
    originalPrice: 250,
    discount: '12% Off',
    duration: '1 Día',
    durationHours: 14,
    category: 'Cultural',
    description: 'Cristo Redentor, Pan de Azúcar y playas de Copacabana.',
    image: '/uploads/tours/rio-de-janeiro-card-tour.webp',
    oneDay: true,
    popular: true,
    guideId: 'guide-4',
    vehicleId: 'vehicle-4',
    operator: 'Rio Experience',
    vibeScores: { adrenalina: 40, relax: 65, cultura: 85, familia: 70 },
    destinationCountry: 'Brasil',
    lat: -22.9068,
    lng: -43.1729,
    heroImages: ['/uploads/tours/rio-de-janeiro-card-tour.webp'],
    bgPosition: 'center',
    status: 'PUBLISHED',
    destination: 'Brasil'
  },
  {
    id: 'tour-mock-5',
    title: 'Caribe Mágico Cartagena',
    location: 'Cartagena, Colombia',
    price: 80,
    originalPrice: 95,
    discount: '15% Off',
    duration: '6 Horas',
    durationHours: 6,
    category: 'Familiar',
    description: 'Ciudad amurallada, Castillo San Felipe e Islas del Rosario.',
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80',
    oneDay: true,
    popular: false,
    guideId: 'guide-5',
    vehicleId: 'vehicle-5',
    operator: 'Colombia Caribe',
    vibeScores: { adrenalina: 30, relax: 75, cultura: 75, familia: 90 },
    destinationCountry: 'Colombia',
    lat: 10.391,
    lng: -75.4794,
    heroImages: ['https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80'],
    bgPosition: 'center',
    status: 'PUBLISHED',
    destination: 'Colombia'
  },
  {
    id: 'tour-mock-6',
    title: 'Crucero Galápagos Aventura',
    location: 'Islas Galápagos, Ecuador',
    price: 3500,
    originalPrice: 4300,
    discount: '20% Off',
    duration: '7 Días',
    durationHours: 168,
    category: 'Lujo',
    description: 'Tortugas gigantes, iguanas marinas y leones de mar en crucero científico.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    oneDay: false,
    popular: true,
    guideId: 'guide-6',
    vehicleId: 'vehicle-6',
    operator: 'Galápagos Expeditions',
    vibeScores: { adrenalina: 50, relax: 80, cultura: 60, familia: 80 },
    destinationCountry: 'Ecuador',
    lat: -0.8293,
    lng: -90.9821,
    heroImages: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'],
    bgPosition: 'center',
    status: 'PUBLISHED',
    destination: 'Ecuador'
  },
  {
    id: 'tour-mock-7',
    title: 'Chichén Itzá y Cenotes',
    location: 'Riviera Maya, México',
    price: 145,
    originalPrice: 180,
    discount: '20% Off',
    duration: '1 Día',
    durationHours: 12,
    category: 'Cultural',
    description: 'Templo de Kukulcán y baño en cenote sagrado.',
    image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80',
    oneDay: true,
    popular: true,
    guideId: 'guide-7',
    vehicleId: 'vehicle-7',
    operator: 'Mayan Routes',
    vibeScores: { adrenalina: 45, relax: 50, cultura: 95, familia: 75 },
    destinationCountry: 'México',
    lat: 20.6843,
    lng: -88.5678,
    heroImages: ['https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80'],
    bgPosition: 'center',
    status: 'PUBLISHED',
    destination: 'México'
  },
  {
    id: 'tour-mock-8',
    title: 'Cataratas del Iguazú Completas',
    location: 'Iguazú, Argentina/Brasil',
    price: 250,
    originalPrice: 280,
    discount: '10% Off',
    duration: '2 Días',
    durationHours: 48,
    category: 'Outdoor',
    description: 'Garganta del Diablo, pasarelas y selva tropical.',
    image: 'https://images.unsplash.com/photo-1596489370607-f3c95977ba2e?auto=format&fit=crop&w=800&q=80',
    oneDay: false,
    popular: true,
    guideId: 'guide-8',
    vehicleId: 'vehicle-8',
    operator: 'Iguazú Jungle',
    vibeScores: { adrenalina: 65, relax: 45, cultura: 40, familia: 85 },
    destinationCountry: 'Argentina',
    lat: -25.6953,
    lng: -54.4367,
    heroImages: ['https://images.unsplash.com/photo-1596489370607-f3c95977ba2e?auto=format&fit=crop&w=800&q=80'],
    bgPosition: 'center',
    status: 'PUBLISHED',
    destination: 'Argentina'
  },
  {
    id: 'tour-mock-9',
    title: 'Valle de la Luna y Géiseres',
    location: 'Atacama, Chile',
    price: 290,
    originalPrice: 320,
    discount: 'Recomendado',
    duration: '3 Días',
    durationHours: 72,
    category: 'Aventura',
    description: 'Paisajes lunares, géiseres al amanecer y termas.',
    image: 'https://images.unsplash.com/photo-1533202967160-b21a36b13689?auto=format&fit=crop&w=800&q=80',
    oneDay: false,
    popular: true,
    guideId: 'guide-9',
    vehicleId: 'vehicle-9',
    operator: 'Atacama Extreme',
    vibeScores: { adrenalina: 80, relax: 40, cultura: 60, familia: 60 },
    destinationCountry: 'Chile',
    lat: -22.9115,
    lng: -68.199,
    heroImages: ['https://images.unsplash.com/photo-1533202967160-b21a36b13689?auto=format&fit=crop&w=800&q=80'],
    bgPosition: 'center',
    status: 'PUBLISHED',
    destination: 'Chile'
  },
  {
    id: 'tour-mock-10',
    title: 'Escapada Punta Cana',
    location: 'Punta Cana, Rep. Dominicana',
    price: 850,
    originalPrice: 1100,
    discount: '25% Off',
    duration: '5 Días',
    durationHours: 120,
    category: 'Relaxación',
    description: 'Playas blancas, aguas turquesas y resorts exclusivos.',
    image: 'https://images.unsplash.com/photo-1505080031861-125032dce30a?auto=format&fit=crop&w=800&q=80',
    oneDay: false,
    popular: false,
    guideId: 'guide-10',
    vehicleId: 'vehicle-10',
    operator: 'Caribe Dreams',
    vibeScores: { adrenalina: 15, relax: 95, cultura: 30, familia: 85 },
    destinationCountry: 'Rep. Dominicana',
    lat: 18.582,
    lng: -68.4055,
    heroImages: ['https://images.unsplash.com/photo-1505080031861-125032dce30a?auto=format&fit=crop&w=800&q=80'],
    bgPosition: 'center',
    status: 'PUBLISHED',
    destination: 'Rep. Dominicana'
  },
  {
    id: 'tour-mock-11',
    title: 'Glaciar Perito Moreno',
    location: 'El Calafate, Argentina',
    price: 165,
    originalPrice: 195,
    discount: 'Special Offer',
    duration: '1 Día',
    durationHours: 10,
    category: 'Outdoor',
    description: 'Pasarelas frente al hielo y navegación entre témpanos.',
    image: 'https://images.unsplash.com/photo-1544600584-6997ce381676?auto=format&fit=crop&w=800&q=80',
    oneDay: true,
    popular: true,
    guideId: 'guide-11',
    vehicleId: 'vehicle-11',
    operator: 'Patagonia Wild',
    vibeScores: { adrenalina: 70, relax: 30, cultura: 45, familia: 80 },
    destinationCountry: 'Argentina',
    lat: -50.4968,
    lng: -73.1377,
    heroImages: ['https://images.unsplash.com/photo-1544600584-6997ce381676?auto=format&fit=crop&w=800&q=80'],
    bgPosition: 'center',
    status: 'PUBLISHED',
    destination: 'Argentina'
  },
  {
    id: 'tour-mock-12',
    title: 'Trekking Ciudad Perdida',
    location: 'Santa Marta, Colombia',
    price: 410,
    originalPrice: 450,
    discount: null,
    duration: '4 Días',
    durationHours: 96,
    category: 'Aventura',
    description: 'Selva de Sierra Nevada hasta terrazas Tayrona.',
    image: 'https://images.unsplash.com/photo-1596766442657-3a13916dd3f0?auto=format&fit=crop&w=800&q=80',
    oneDay: false,
    popular: false,
    guideId: 'guide-12',
    vehicleId: 'vehicle-12',
    operator: 'Sierra Expeditions',
    vibeScores: { adrenalina: 90, relax: 10, cultura: 75, familia: 45 },
    destinationCountry: 'Colombia',
    lat: 11.036,
    lng: -73.9161,
    heroImages: ['https://images.unsplash.com/photo-1596766442657-3a13916dd3f0?auto=format&fit=crop&w=800&q=80'],
    bgPosition: 'center',
    status: 'PUBLISHED',
    destination: 'Colombia'
  },
  {
    id: 'tour-mock-13',
    title: 'Desierto de Atacama + Uyuni',
    location: 'Atacama-Uyuni, Chile/Bolivia',
    price: 680,
    originalPrice: 750,
    discount: '10% Off',
    duration: '6 Días',
    durationHours: 144,
    category: 'Aventura',
    description: 'Uyuni, lagunas altiplánicas y desierto de Atacama en circuito 4x4.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    oneDay: false,
    popular: true,
    guideId: 'guide-13',
    vehicleId: 'vehicle-13',
    operator: 'Andes Cross',
    vibeScores: { adrenalina: 85, relax: 20, cultura: 60, familia: 55 },
    destinationCountry: 'Bolivia',
    lat: -22.5,
    lng: -68.0,
    heroImages: ['https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'],
    bgPosition: 'center',
    status: 'PUBLISHED',
    destination: 'Bolivia'
  },
  {
    id: 'tour-mock-14',
    title: 'Buenos Aires Tango & Asado',
    location: 'Buenos Aires, Argentina',
    price: 95,
    originalPrice: 120,
    discount: '20% Off',
    duration: '1 Día',
    durationHours: 8,
    category: 'Cultural',
    description: 'City tour, show de tango en San Telmo y asado premium.',
    image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=800&q=80',
    oneDay: true,
    popular: false,
    guideId: 'guide-14',
    vehicleId: 'vehicle-14',
    operator: 'BA Culture',
    vibeScores: { adrenalina: 20, relax: 60, cultura: 90, familia: 80 },
    destinationCountry: 'Argentina',
    lat: -34.6118,
    lng: -58.396,
    heroImages: ['https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=800&q=80'],
    bgPosition: 'center',
    status: 'PUBLISHED',
    destination: 'Argentina'
  },
  {
    id: 'tour-mock-15',
    title: 'Isla de Pascua Misteriosa',
    location: 'Rapa Nui, Chile',
    price: 520,
    originalPrice: 600,
    discount: '15% Off',
    duration: '4 Días',
    durationHours: 96,
    category: 'Cultural',
    description: 'Moáis, volcanes y cultura Rapa Nui en el ombligo del mundo.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    oneDay: false,
    popular: true,
    guideId: 'guide-15',
    vehicleId: 'vehicle-15',
    operator: 'Rapa Nui Travel',
    vibeScores: { adrenalina: 55, relax: 50, cultura: 95, familia: 75 },
    destinationCountry: 'Chile',
    lat: -27.1127,
    lng: -109.3497,
    heroImages: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'],
    bgPosition: 'center',
    status: 'PUBLISHED',
    destination: 'Chile'
  }
];

// (Other MOCK_* arrays removed: Bookings, Guides, Vehicles, Slides fall back to empty
// results from Data Connect when unauthenticated, which is the correct production behavior.)


// (duplicate maps/normalizers moved to ./mappers)

async function safeRead<T>(label: string, fallback: T, call: () => Promise<T>): Promise<T> {
  try {
    return await call();
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (isUnauthenticatedError(error) || msg.includes('Failed to fetch') || msg.includes('DataConnect emulator not available')) {
      console.warn(`DataConnect ${label} unavailable; using fallback data.`);
      return fallback;
    }
    throw error;
  }
}

export const dataService = {
  // TOURS
  async getTours() {
    return safeRead(
      'getTours',
      MOCK_TOURS,
      async () => {
        const result = await getTours(await getDataconnect());
        const tours = result.data?.tours || [];
        return tours.map((t: Record<string, unknown>) => {
const parsedHeroImages = parseHeroImages(t.heroImages);
           return {
             ...t,
             heroImages: parsedHeroImages,
             category: mapCategoryFromDb(t.category),
             destination: mapDestinationFromDb(t.destination),
             destinationCountry: mapDestinationFromDb(t.destination),
             bgPosition: typeof t.heroBackgroundPosition === 'string' && t.heroBackgroundPosition ? t.heroBackgroundPosition : 'center',
             translations: parseTranslations(t.translations),
             vibeScores: {
               adrenalina: t.vibeAdrenaline !== undefined ? Number(t.vibeAdrenaline) : 50,
               relax: t.vibeRelax !== undefined ? Number(t.vibeRelax) : 50,
               cultura: t.vibeCulture !== undefined ? Number(t.vibeCulture) : 50,
               familia: t.vibeFamily !== undefined ? Number(t.vibeFamily) : 50,
             },
             vibeAdrenaline: t.vibeAdrenaline !== undefined ? Number(t.vibeAdrenaline) : 50,
             vibeRelax: t.vibeRelax !== undefined ? Number(t.vibeRelax) : 50,
             vibeColor: t.vibeCulture !== undefined ? Number(t.vibeCulture) : 50,
             vibeFamily: t.vibeFamily !== undefined ? Number(t.vibeFamily) : 50,
             featured: Boolean(t.featured),
             rating: t.rating !== undefined ? Number(t.rating) : 0,
             reviewsCount: t.reviewsCount !== undefined ? Number(t.reviewsCount) : 0,
             durationDays: t.durationDays !== undefined ? Number(t.durationDays) : 1,
             itinerary: Array.isArray(t.itinerary) ? t.itinerary : [],
             minAge: t.minAge !== undefined ? Number(t.minAge) : 12,
             maxPassengers: t.maxPassengers !== undefined ? Number(t.maxPassengers) : 15,
             trailerUrl: t.trailerUrl || '',
             galleryImages: Array.isArray(t.galleryImages) ? t.galleryImages : [],
             mapCenterLat: t.mapCenterLat !== null ? Number(t.mapCenterLat) : null,
             mapCenterLng: t.mapCenterLng !== null ? Number(t.mapCenterLng) : null,
             mapZoom: t.mapZoom !== undefined ? Number(t.mapZoom) : 12,
             difficulty: t.difficulty || 'MODERATE',
             seasonality: Array.isArray(t.seasonality) ? t.seasonality : [],
             includes: Array.isArray(t.includes) ? t.includes : [],
             excludes: Array.isArray(t.excludes) ? t.excludes : [],
             requirements: Array.isArray(t.requirements) ? t.requirements : [],
             pickupInfo: t.pickupInfo || '',
             cancellationPolicy: t.cancellationPolicy || '',
             languages: Array.isArray(t.languages) ? t.languages : [],
             groupType: t.groupType || 'SHARED',
             availableDates: typeof t.availableDates === 'string' ? JSON.parse(t.availableDates) : (t.availableDates || {}),
           };
        });
      }
    );
  },

  async translateContent(sourceLang: string, targetLangs: string[], fields: Record<string, string>) {
    try {
      const functions = getCloudFunctions();
      const callable = httpsCallable(functions, 'translateContent');
      const result = await callable({ sourceLang, targetLangs, fields });
      return (result.data || {}) as Record<string, Record<string, string>>;
    } catch (error) {
      console.error('translateContent failed:', error);
      return {};
    }
  },

  async extractTourFromUrl(url: string) {
    try {
      const functions = getCloudFunctions();
      const callable = httpsCallable(functions, 'extractTourFromUrl');
      const result = await callable({ url });
      return result.data as Record<string, unknown>;
    } catch (error) {
      console.error('extractTourFromUrl failed:', error);
      throw new Error('No se pudo extraer la información del tour desde la URL. Verificá el enlace e intentá de nuevo.');
    }
  },

  async getTour(id: string) {
    try {
      const result = await getTour(await getDataconnect(), { id });
      const tour = result.data?.tour;
      if (!tour) return null;
      const parsedHeroImages = parseHeroImages(tour.heroImages);
      return {
        ...tour,
        heroImages: parsedHeroImages,
        category: mapCategoryFromDb(tour.category),
        destination: mapDestinationFromDb(tour.destination),
        destinationCountry: mapDestinationFromDb(tour.destination),
        bgPosition: typeof tour.heroBackgroundPosition === 'string' && tour.heroBackgroundPosition ? tour.heroBackgroundPosition : 'center',
        translations: parseTranslations(tour.translations),
        vibeScores: {
          adrenalina: tour.vibeAdrenaline !== undefined ? Number(tour.vibeAdrenaline) : 50,
          relax: tour.vibeRelax !== undefined ? Number(tour.vibeRelax) : 50,
          cultura: tour.vibeCulture !== undefined ? Number(tour.vibeCulture) : 50,
          familia: tour.vibeFamily !== undefined ? Number(tour.vibeFamily) : 50,
        }
      };
    } catch (error) {
      if (isUnauthenticatedError(error)) {
        return MOCK_TOURS[0] || null;
      }
      handleError(error);
    }
  },

  async saveTour(tourToSave: TourInput) {
    try {
      const { id, ...rawFields } = tourToSave;

      // Map arrays & enums
      let heroImagesStr = rawFields.heroImages;
      if (Array.isArray(heroImagesStr)) {
        heroImagesStr = JSON.stringify(heroImagesStr);
      }

      const dbCategory = rawFields.category ? mapCategoryToDb(rawFields.category) : "OUTDOOR";
      const dbDestination = rawFields.destinationCountry
        ? mapDestinationToDb(rawFields.destinationCountry)
        : (rawFields.destination ? mapDestinationToDb(rawFields.destination) : "ARGENTINA");

      // Explicitly pick only the fields that are declared in mutations.gql
      const mutationData: TourInput = {
        title: rawFields.title,
        location: rawFields.location,
        duration: rawFields.duration,
        durationHours: Number(rawFields.durationHours || 0),
        originalPrice: Number(rawFields.originalPrice || 0),
        price: Number(rawFields.price || 0),
        discount: rawFields.discount != null ? String(rawFields.discount) : null,
        category: dbCategory,
        description: rawFields.description,
        image: rawFields.image,
        featured: rawFields.featured ?? false,
        oneDay: rawFields.oneDay ?? true,
        popular: rawFields.popular ?? false,
        status: rawFields.status || "PUBLISHED",
        destination: dbDestination,
        vibeAdrenaline: rawFields.vibeScores?.adrenalina !== undefined ? Number(rawFields.vibeScores.adrenalina) : (rawFields.vibeAdrenaline !== undefined ? Number(rawFields.vibeAdrenaline) : 50),
        vibeRelax: rawFields.vibeScores?.relax !== undefined ? Number(rawFields.vibeScores.relax) : (rawFields.vibeRelax !== undefined ? Number(rawFields.vibeRelax) : 50),
        vibeCulture: rawFields.vibeScores?.cultura !== undefined ? Number(rawFields.vibeScores.cultura) : (rawFields.vibeCulture !== undefined ? Number(rawFields.vibeCulture) : 50),
        vibeFamily: rawFields.vibeScores?.familia !== undefined ? Number(rawFields.vibeScores.familia) : (rawFields.vibeFamily !== undefined ? Number(rawFields.vibeFamily) : 50),
        lat: rawFields.lat !== undefined && rawFields.lat !== null && rawFields.lat !== "" ? Number(rawFields.lat) : null,
        lng: rawFields.lng !== undefined && rawFields.lng !== null && rawFields.lng !== "" ? Number(rawFields.lng) : null,
        heroImages: heroImagesStr,
        heroBackgroundPosition: rawFields.bgPosition || rawFields.heroBackgroundPosition || "center",
        translations: rawFields.translations
          ? (typeof rawFields.translations === 'string' ? rawFields.translations : JSON.stringify(rawFields.translations))
          : null,
        operatorId: rawFields.operatorId,
        availableDates: rawFields.availableDates ? JSON.stringify(rawFields.availableDates) : null,
        itinerary: JSON.stringify(rawFields.itinerary || []),
        minAge: Number(rawFields.minAge || 12),
        maxPassengers: Number(rawFields.maxPassengers || 15),
        trailerUrl: rawFields.trailerUrl || '',
        galleryImages: JSON.stringify(Array.isArray(rawFields.galleryImages) ? rawFields.galleryImages : []),
        mapCenterLat: Number(rawFields.mapCenterLat || 0),
        mapCenterLng: Number(rawFields.mapCenterLng || 0),
        mapZoom: Number(rawFields.mapZoom || 12),
        difficulty: rawFields.difficulty || 'MODERATE',
        seasonality: JSON.stringify(Array.isArray(rawFields.seasonality) ? rawFields.seasonality : []),
        includes: JSON.stringify(Array.isArray(rawFields.includes) ? rawFields.includes : []),
        excludes: JSON.stringify(Array.isArray(rawFields.excludes) ? rawFields.excludes : []),
        requirements: JSON.stringify(Array.isArray(rawFields.requirements) ? rawFields.requirements : []),
        pickupInfo: rawFields.pickupInfo || '',
        cancellationPrice: Number(rawFields.cancellationPrice || 0),
        languages: JSON.stringify(Array.isArray(rawFields.languages) ? rawFields.languages : []),
        groupType: rawFields.groupType || 'SHARED',
      };

      const isNew = !id || typeof id === 'number' || !isUuid(id);
      if (isNew) {
        const result = await createTour(await getDataconnect(), mutationData);
        const newId = result.data?.tour_insert?.id;
return {
           ...tourToSave,
           id: newId,
           category: mapCategoryFromDb(dbCategory),
           destination: mapDestinationFromDb(dbDestination),
           durationDays: Number(tourToSave.durationDays || 1),
           minAge: Number(tourToSave.minAge || 12),
           maxPassengers: Number(tourToSave.maxPassengers || 15),
           trailerUrl: tourToSave.trailerUrl || '',
           galleryImages: Array.isArray(tourToSave.galleryImages) ? tourToSave.galleryImages : [],
           mapCenterLat: Number(tourToSave.mapCenterLat || 0),
           mapCenterLng: Number(tourToSave.mapCenterLng || 0),
           mapZoom: Number(tourToSave.mapZoom || 12),
           difficulty: tourToSave.difficulty || 'MODERATE',
           seasonality: Array.isArray(tourToSave.seasonality) ? tourToSave.seasonality : [],
           includes: Array.isArray(tourToSave.includes) ? tourToSave.includes : [],
           excludes: Array.isArray(tourToSave.excludes) ? tourToSave.excludes : [],
           requirements: Array.isArray(tourToSave.requirements) ? tourToSave.requirements : [],
           pickupInfo: tourToSave.pickupInfo || '',
           cancellationPrice: Number(tourToSave.cancellationPrice || 0),
           languages: Array.isArray(tourToSave.languages) ? tourToSave.languages : [],
           groupType: tourToSave.groupType || 'SHARED',
         };
      } else {
        await updateTour(await getDataconnect(), { id, ...mutationData });
return {
           ...tourToSave,
           category: mapCategoryFromDb(dbCategory),
           destination: mapDestinationFromDb(dbDestination),
           durationDays: Number(tourToSave.durationDays || 1),
           minAge: Number(tourToSave.minAge || 12),
           maxPassengers: Number(tourToSave.maxPassengers || 15),
           trailerUrl: tourToSave.trailerUrl || '',
           galleryImages: Array.isArray(tourToSave.galleryImages) ? tourToSave.galleryImages : [],
           mapCenterLat: Number(tourToSave.mapCenterLat || 0),
           mapCenterLng: Number(tourToSave.mapCenterLng || 0),
           mapZoom: Number(tourToSave.mapZoom || 12),
           difficulty: tourToSave.difficulty || 'MODERATE',
           seasonality: Array.isArray(tourToSave.seasonality) ? tourToSave.seasonality : [],
           includes: Array.isArray(tourToSave.includes) ? tourToSave.includes : [],
           excludes: Array.isArray(tourToSave.excludes) ? tourToSave.excludes : [],
           requirements: Array.isArray(tourToSave.requirements) ? tourToSave.requirements : [],
           pickupInfo: tourToSave.pickupInfo || '',
           cancellationPrice: Number(tourToSave.cancellationPrice || 0),
           languages: Array.isArray(tourToSave.languages) ? tourToSave.languages : [],
           groupType: tourToSave.groupType || 'SHARED',
         };
      }
    } catch (error) { handleError(error); }
  },

  async deleteTour(tourId: string) {
    try {
      await deleteTour(await getDataconnect(), { id: tourId });
      return true;
    } catch (error) { handleError(error); }
  },

  // BOOKINGS
  async getBookings() {
    try {
      const result = await getBookings(await getDataconnect());
      const bookings = result.data?.bookings || [];
      return bookings.map((b: Record<string, unknown>) => ({
        ...b,
        status: denormalizeBookingStatus(b.status),
        price: b.totalPrice ?? b.price,
        customerName: b.user?.name || b.userId || b.customerName || 'Cliente',
        pax: b.guests ?? b.pax,
        tourTitle: b.tour?.title || b.tourTitle || 'Tour'
      }));
    } catch (error) { handleError(error); }
  },

  async addBooking(booking: BookingInput) {
    try {
      const { ...data } = booking;

      // SECURITY: a booking must always be created under the authenticated user.
      // Ignore any caller-supplied userId; use the real auth.uid (Data Connect enforces
      // an authenticated session, and the backend must reject userId !== auth.uid).
      const authedUid = getAuthUid();
      if (!authedUid) {
        throw new Error('Debes iniciar sesión para crear una reserva.');
      }
      const graphqlData: BookingInput = {
        bookingId: data.bookingId || ('BK-' + Date.now()),
        tourId: data.tourId,
        userId: authedUid,
        guests: Number(data.guests),
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        totalPrice: Number(data.totalPrice || data.totalPriceUSD),
        currency: data.currency || 'USD',
        status: normalizeBookingStatus(data.status),
        addons: data.addons,
        specialRequests: data.specialRequests || ''
      };

      const result = await createBooking(await getDataconnect(), graphqlData);
      const newId = result.data?.booking_insert?.id;
      return {
        ...booking,
        id: newId,
        status: booking.status || 'Confirmada'
      };
    } catch (error) { handleError(error); }
  },

  async updateBooking(updatedBooking: BookingInput) {
    try {
      const { id, ...data } = updatedBooking;

      const graphqlData: BookingInput = {
        id,
        tourId: data.tourId,
        // SECURITY: never reassign booking to another user; tie to auth.uid.
        userId: getAuthUid() ?? data.userId,
        guests: data.guests ? Number(data.guests) : undefined,
        date: data.date ? new Date(data.date).toISOString() : undefined,
        totalPrice: data.totalPrice || data.totalPriceUSD ? Number(data.totalPrice || data.totalPriceUSD) : undefined,
        currency: data.currency,
        status: normalizeBookingStatus(data.status),
        addons: data.addons,
        specialRequests: data.specialRequests
      };

      const filtered = Object.fromEntries(
        Object.entries(graphqlData).filter(([_, v]) => v !== undefined)
      );

      await updateBooking(await getDataconnect(), filtered as Parameters<typeof updateBooking>[1]);
      return updatedBooking;
    } catch (error) { handleError(error); }
  },

  async deleteBooking(bookingId: string) {
    try {
      await deleteBooking(await getDataconnect(), { id: bookingId });
      return true;
    } catch (error) { handleError(error); }
  },

  // USERS
  async getUsers() {
    try {
      const result = await getUsers(await getDataconnect());
      const dbUsers = result.data?.users || [];
      return dbUsers.map((u: Record<string, unknown>) => ({
        ...u,
        role: normalizeDbRole(u.role as string | undefined)
      }));
    } catch (error) {
      console.warn('getUsers failed, returning empty array');
      return [];
    }
  },

  async getCurrentUser() {
    try {
      const result = await getCurrentUser(await getDataconnect());
      const user = result.data?.user;
      if (!user) return null;
      return {
        ...user,
        role: normalizeDbRole(user.role as string | undefined)
      };
    } catch (error) {
      console.warn('getCurrentUser failed, returning null');
      return null;
    }
  },

  async addUser(user: { name: string; email: string; role?: string }) {
    try {
      const dbUser = {
        ...user,
        role: user.role ? user.role.toUpperCase().replace('-', '_') : 'CUSTOMER'
      };
      const createUserFn = httpsCallable<{ user: typeof dbUser }, { users: Array<Record<string, unknown>> }>(functions, 'createUser');
      const result = await createUserFn({ user: dbUser });
      const returnedUsers = result.data?.users || [];
      return returnedUsers.map((u: Record<string, unknown>) => ({
        ...u,
        role: normalizeDbRole(u.role as string | undefined)
      }));
    } catch (error) { handleError(error); }
  },

  // SLIDER
  async getSliderSlides() {
    try {
      const result = await getActiveSliderSlides(await getDataconnect());
      return (result.data?.sliderSlides || []).map((s: Record<string, unknown>) => ({
        ...s,
        ctaText: s.ctaText ?? s.buttonText
      }));
    } catch (error) { handleError(error); }
  },

  async saveSliderSlides(slides: SliderSlideInput[]) {
    try {
      // 1. Get existing slides
      const existingResult = await getActiveSliderSlides(await getDataconnect());
      const existingSlides = existingResult.data?.sliderSlides || [];
      const existingIds = new Set(existingSlides.map((s) => s.id));

      const newIds = new Set(slides.filter((s) => typeof s.id === 'string').map((s) => s.id));

      // 2. Delete removed slides
      const toDelete = existingSlides.filter((s) => !newIds.has(s.id));
      for (const slide of toDelete) {
        await deleteSliderSlide(await getDataconnect(), { id: slide.id });
      }

       // 3. Create or update
       const results = [];
       for (const slide of slides) {
          const { id, translations, ctaText, ...rest } = slide as SliderSlideInput & { translations?: unknown; ctaText?: string };
          const data = {
            ...rest,
            buttonText: ctaText ?? (rest as Record<string, unknown>).buttonText,
            translations: translations
              ? (typeof translations === 'string' ? translations : JSON.stringify(translations))
              : null,
          };
         if (typeof id === 'string' && existingIds.has(id)) {
           // Update
           const result = await updateSliderSlide(await getDataconnect(), { id, ...data });
           results.push(result.data?.sliderSlide_update);
         } else {
           // Create (ignoring the temporary frontend id)
           const result = await createSliderSlide(await getDataconnect(), data);
           results.push(result.data?.sliderSlide_insert);
         }
       }
      return results;
    } catch (error) {
      handleError(error);
    }
  },

  // GUIDES
  async getGuides(operatorId?: string) {
    try {
    const result = await getGuides(await getDataconnect(), { operatorId });
    return (result.data?.guides || []).map((g: Record<string, unknown>) => ({
      ...g,
      status: denormalizeGuideStatus(g.status as string)
    }));
    } catch (error) { handleError(error); }
  },

  async saveGuide(guide: GuideInput) {
    try {
      const { id, ...rawFields } = guide;
      const isNew = !id || typeof id === 'number' || !isUuid(id);

      const mutationData: GuideInput = {
        name: rawFields.name,
        specialty: rawFields.specialty,
        status: normalizeGuideStatus(rawFields.status),
        operatorId: rawFields.operatorId
      };

      if (isNew) {
        const result = await createGuide(await getDataconnect(), mutationData);
        const newId = result.data?.guide_insert?.id;
        return { ...guide, id: newId };
      } else {
        await updateGuide(await getDataconnect(), { id, ...mutationData });
        return guide;
      }
    } catch (error) { handleError(error); }
  },

  async deleteGuide(guideId: string) {
    try {
      await deleteGuide(await getDataconnect(), { id: guideId });
      return true;
    } catch (error) { handleError(error); }
  },

  // VEHICLES
  async getVehicles(operatorId?: string) {
    try {
    const result = await getVehicles(await getDataconnect(), { operatorId });
    return (result.data?.vehicles || []).map((v: Record<string, unknown>) => ({
      ...v,
      status: denormalizeVehicleStatus(v.status as string)
    }));
    } catch (error) { handleError(error); }
  },

  async saveVehicle(vehicle: VehicleInput) {
    try {
      const { id, ...rawFields } = vehicle;
      const isNew = !id || typeof id === 'number' || !isUuid(id);

      const mutationData: VehicleInput = {
        name: rawFields.name,
        seats: Number(rawFields.seats),
        status: normalizeVehicleStatus(rawFields.status),
        operatorId: rawFields.operatorId
      };

      if (isNew) {
        const result = await createVehicle(await getDataconnect(), mutationData);
        const newId = result.data?.vehicle_insert?.id;
        return { ...vehicle, id: newId };
      } else {
        await updateVehicle(await getDataconnect(), { id, ...mutationData });
        return vehicle;
      }
    } catch (error) { handleError(error); }
  },

  async deleteVehicle(vehicleId: string) {
    try {
      await deleteVehicle(await getDataconnect(), { id: vehicleId });
      return true;
    } catch (error) { handleError(error); }
  },

  // PWA CHECK-INS
  async getOfflineQueue(operatorId?: string) {
    try {
      const result = await getOfflineQueue(await getDataconnect(), { operatorId });
      return result.data?.pwaCheckins || [];
    } catch (error) { handleError(error); }
  },

  async addOfflineCheckin(checkin: OfflineCheckinInput) {
    try {
      const mutationData: OfflineCheckinInput = {
        tourId: checkin.tourId,
        bookingId: checkin.bookingId,
        tourTitle: checkin.tourTitle,
        customerName: checkin.customerName,
        operator: checkin.operator,
        status: checkin.status || 'PENDIENTE_SYNC',
        timestamp: checkin.timestamp ? new Date(checkin.timestamp).toISOString() : new Date().toISOString()
      };
      const result = await addOfflineCheckin(await getDataconnect(), mutationData);
      return result.data?.pwaCheckin_insert;
    } catch (error) { handleError(error); }
  },

  async syncOfflineQueue(operatorId: string) {
    try {
      const queue = await this.getOfflineQueue(operatorId);
      const results: unknown[] = [];
      const failedIds: string[] = [];

      for (const checkin of queue) {
        try {
          // Convert checkin to booking
          const tour = checkin.tourId ? await this.getTour(checkin.tourId) : null;
          if (!tour) {
            // Tour inexistente: no se puede sincronizar, se conserva para revisión manual
            failedIds.push(checkin.id);
            continue;
          }
          const dateStr =
            checkin.timestamp && typeof checkin.timestamp === 'string'
              ? checkin.timestamp.substring(0, 10)
              : new Date().toISOString().substring(0, 10);
          const booking = {
            tourId: checkin.tourId,
            customerName: checkin.customerName,
            date: dateStr,
            pax: 2,
            price: tour.price * 2,
            currency: 'USD',
            status: 'Confirmada'
          };
          const result = await this.addBooking(booking);
          results.push(result);
          // Solo se elimina el check-in si la reserva se creó con éxito
          await deletePwaCheckin(await getDataconnect(), { id: checkin.id });
        } catch (err) {
          console.error('syncOfflineQueue: falló check-in', checkin.id, err);
          failedIds.push(checkin.id);
        }
      }

      if (failedIds.length) {
        console.warn(`syncOfflineQueue: ${failedIds.length} check-in(s) no sincronizados:`, failedIds);
      }
      return { results, failedIds };
    } catch (error) { handleError(error); }
  },

  async deleteSliderSlide(id: string) {
    try {
      const result = await deleteSliderSlide(await getDataconnect(), { id });
      return result.data?.sliderSlide_delete ?? null;
    } catch (error) { handleError(error); }
  },

  // BOTTOM SLIDER
  // NOTE: kept in localStorage on purpose. This is purely decorative pre-footer imagery
  // (no auth, no PII, no business data), so it does not belong in the authenticated
  // Data Connect tables. The MAIN hero slider (getSliderSlides/saveSliderSlides) is the
  // one backed by Data Connect and protected by @auth(level: USER). If you later want to
  // make the bottom slider editable from the admin and persisted server-side, add a
  // `kind: BOTTOM | HERO` enum column to slider_slides and query by it.
  getBottomSliderSlides() {
    const data = localStorage.getItem('bottom_slider_slides');
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: "b1", image: "https://images.unsplash.com/photo-1517086822157-2b0358e7684a?q=80&w=1200&auto=format&fit=crop", order: 1, active: true },
      { id: "b2", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?q=80&w=1200&auto=format&fit=crop", order: 2, active: true },
      { id: "b3", image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1200&auto=format&fit=crop", order: 3, active: true },
      { id: "b4", image: "https://images.unsplash.com/photo-1463137537628-a3f2dbdc17c8?q=80&w=1200&auto=format&fit=crop", order: 4, active: true }
    ];
  },

  saveBottomSliderSlides(slides: SliderSlideInput[]) {
    localStorage.setItem('bottom_slider_slides', JSON.stringify(slides));
    return slides;
  },
};

