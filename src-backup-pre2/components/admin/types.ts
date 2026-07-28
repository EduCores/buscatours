export type UserRole = 'platform-admin' | 'tour-admin' | 'operator' | 'customer';

export type ActiveTab = 
  | 'dashboard' 
  | 'logistics' 
  | 'copilot' 
  | 'tours' 
  | 'slider' 
  | 'bookings' 
  | 'resources' 
  | 'pwa'
  | 'tourists';

export interface Tourist {
  id: string;
  name: string;
  email: string;
  avatar: string;
  ecoPoints: number;
  phone: string;
  status: 'Activo' | 'En ruta' | 'Completado';
  country?: string;
  flag?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'operator' | 'tourist';
  text: string;
  timestamp: string;
}

export interface Tour {
  id: string;
  title: string;
  location: string;
  price: number;
  originalPrice: number;
  discount: number;
  duration: string; // e.g. "3 días / 2 noches"
  durationHours: number;
  category: 'Outdoor' | 'Relaxación' | 'Feriado' | 'Temporada' | 'Salvaje' | 'Aventura' | 'Temático' | 'Cultural' | 'Ciudad' | 'Montaña' | 'Glaciar' | 'Lujo' | 'Histórico' | 'Familiar' | 'Selva' | 'Full Day';
  description: string;
  image: string; // main image URL or base64
  oneDay: boolean;
  popular: boolean;
  guideId: string;
  vehicleId: string;
  operator: string; // e.g., "Andes Expeditions", "Patagonia Wild", "Amazon Green"
  vibeScores: {
    adrenalina: number;
    relax: number;
    cultura: number;
    familia: number;
  };
  vibeAdrenaline?: number;
  vibeRelax?: number;
  vibeCulture?: number;
  vibeFamily?: number;
  destinationCountry: 'Chile' | 'Perú' | 'Colombia' | 'México' | 'Argentina' | 'Ecuador' | 'Bolivia' | 'Brasil' | 'República Dominicana';
  lat: number;
  lng: number;
  heroImages: string[];
  bgPosition: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  status: 'PUBLISHED' | 'DRAFT' | 'PENDING';
  translations?: Record<string, Record<string, string>>;
}

export interface Booking {
  id: string;
  tourId: string;
  tourTitle: string;
  customerName: string;
  date: string; // YYYY-MM-DD
  pax: number;
  price: number;
  currency: 'USD' | 'CLP' | 'PEN' | 'COP';
  status: 'Confirmada' | 'Pendiente' | 'Cancelada';
  conflict?: string; // Double booked guide or vehicle warning text
}

export interface Guide {
  id: string;
  name: string;
  specialty: string;
  status: 'Disponible' | 'En tour' | 'Offline';
}

export interface Vehicle {
  id: string;
  name: string;
  seats: number;
  status: 'Disponible' | 'En uso' | 'Offline';
}

export interface Slide {
  id: string;
  order: number;
  image: string; // base64 or URL
  title: string;
  subtitle: string;
  ctaText: string;
  link: string;
  active: boolean;
  description?: string;
  translations?: Record<string, Record<string, string>>;
}

export interface LogisticNode {
  id: string;
  name: string;
  top: string; // percentage, e.g. "82%"
  left: string; // percentage, e.g. "42%"
  operator: string;
  guide: string;
  pax: number;
  vehicle: string;
  connection: string;
  weather: {
    temp: string;
    wind: string;
  };
  currentStatus: string;
}

export interface PwaCheckin {
  id: string;
  tourId?: string;
  bookingId?: string;
  isOffline?: boolean;
  status: 'PENDING' | 'SYNCED' | 'PENDIENTE_SYNC';
  timestamp: string;
  tourTitle?: string;
  customerName?: string;
  operator?: string;
}
