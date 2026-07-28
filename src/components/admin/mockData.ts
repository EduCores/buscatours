import { Tour, Booking, Guide, Vehicle, Slide, LogisticNode } from './types';

// Initial Mock Guides
export const INITIAL_GUIDES: Guide[] = [
  { id: 'gd-1', name: 'Sofía Huamán', specialty: 'Arqueología & Trekking Cusco', status: 'Disponible' },
  { id: 'gd-2', name: 'Juan Pérez', specialty: 'Glaciares & Patagonia Trek', status: 'En tour' },
  { id: 'gd-3', name: 'Carlos Gómez', specialty: 'Supervivencia & Selva Amazónica', status: 'En tour' },
  { id: 'gd-4', name: 'Diego Ruiz', specialty: 'Historia Maya & Cenotes', status: 'Disponible' },
  { id: 'gd-5', name: 'Elena Espinoza', specialty: 'Montañismo de Altura Andes', status: 'Offline' }
];

// Initial Mock Vehicles
export const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'vh-1', name: 'Van Hyundai H1 (8 Plazas) - Cusco', seats: 8, status: 'Disponible' },
  { id: 'vh-2', name: 'Sprinter Mercedes Benz (15 Plazas) - Patagonia', seats: 15, status: 'En uso' },
  { id: 'vh-3', name: 'Lancha Tracker 150 (6 Plazas) - Amazonas', seats: 6, status: 'En uso' },
  { id: 'vh-4', name: 'Toyota Hiace Executive (14 Plazas) - Riviera Maya', seats: 14, status: 'Disponible' },
  { id: 'vh-5', name: 'Ford Ranger 4x4 (4 Plazas) - Patagonia Wild', seats: 4, status: 'Offline' }
];

// Initial Mock Tours
export const INITIAL_TOURS: Tour[] = [
  {
    id: 'tr-1',
    title: 'Camino Inca Sagrado a Machu Picchu',
    location: 'Cusco, Perú',
    price: 499,
    originalPrice: 599,
    discount: 100,
    duration: '4 días / 3 noches',
    durationHours: 96,
    category: 'Cultural',
    description: 'Sigue el legendario camino empedrado de los Incas. Una travesía espiritual e histórica cruzando abras andinas y bosques de neblina hasta llegar al amanecer en el Intipunku frente a la majestuosa ciudadela.',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94adb1?w=800&auto=format&fit=crop&q=60',
    oneDay: false,
    popular: true,
    guideId: 'gd-1',
    vehicleId: 'vh-1',
    operator: 'Andes Expeditions',
    vibeScores: {
      adrenalina: 45,
      relax: 30,
      cultura: 100,
      familia: 50
    },
    destinationCountry: 'Perú',
    lat: -13.1631,
    lng: -72.5450,
    heroImages: [
      'https://images.unsplash.com/photo-1587595431973-160d0d94adb1?w=1200',
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200'
    ],
    bgPosition: 'center',
    status: 'PUBLISHED'
  },
  {
    id: 'tr-2',
    title: 'Expedición Extrema Glaciar Grey',
    location: 'Torres del Paine, Chile',
    price: 750,
    originalPrice: 850,
    discount: 100,
    duration: '2 días / 1 noche',
    durationHours: 36,
    category: 'Glaciar',
    description: 'Camina sobre hielos milenarios con crampones en el Glaciar Grey. Explora grietas azuladas profundas, túneles de hielo y navega entre témpanos gigantes en el lago Grey con la supervisión de expertos certificados UIAGM.',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=60',
    oneDay: false,
    popular: true,
    guideId: 'gd-2',
    vehicleId: 'vh-2',
    operator: 'Patagonia Wild',
    vibeScores: {
      adrenalina: 95,
      relax: 15,
      cultura: 10,
      familia: 20
    },
    destinationCountry: 'Chile',
    lat: -51.2500,
    lng: -73.1500,
    heroImages: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200'
    ],
    bgPosition: 'top',
    status: 'PUBLISHED'
  },
  {
    id: 'tr-3',
    title: 'Safari Amazónico Profundo',
    location: 'Amazonas, Colombia',
    price: 320,
    originalPrice: 320,
    discount: 0,
    duration: '3 días / 2 noches',
    durationHours: 72,
    category: 'Selva',
    description: 'Adéntrate en la selva virgen del Amazonas. Avistamiento de delfines rosados, caminatas nocturnas para buscar caimanes e insectos exóticos, y pernocte en un eco-lodge suspendido en el dosel forestal.',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&auto=format&fit=crop&q=60',
    oneDay: false,
    popular: false,
    guideId: 'gd-3',
    vehicleId: 'vh-3',
    operator: 'Amazon Green',
    vibeScores: {
      adrenalina: 80,
      relax: 40,
      cultura: 65,
      familia: 40
    },
    destinationCountry: 'Colombia',
    lat: -4.2112,
    lng: -69.9406,
    heroImages: [
      'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200'
    ],
    bgPosition: 'bottom',
    status: 'PUBLISHED'
  },
  {
    id: 'tr-4',
    title: 'Cenotes Sagrados & Ruinas de Tulum',
    location: 'Riviera Maya, México',
    price: 110,
    originalPrice: 150,
    discount: 40,
    duration: '1 día / 8 horas',
    durationHours: 8,
    category: 'Cultural',
    description: 'Visita las icónicas ruinas amuralladas de Tulum frente al mar Caribe y sumérgete en las aguas místicas y cristalinas del cenote subterráneo Sac Actun, sagrado para la civilización maya.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60',
    oneDay: true,
    popular: true,
    guideId: 'gd-4',
    vehicleId: 'vh-4',
    operator: 'Andes Expeditions',
    vibeScores: {
      adrenalina: 30,
      relax: 75,
      cultura: 90,
      familia: 85
    },
    destinationCountry: 'México',
    lat: 20.2114,
    lng: -87.4654,
    heroImages: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200'
    ],
    bgPosition: 'center',
    status: 'PUBLISHED'
  }
];

// Initial Mock Bookings
export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-9932',
    tourId: 'tr-1',
    tourTitle: 'Camino Inca Sagrado a Machu Picchu',
    customerName: 'Thomas Müller',
    date: '2026-07-05',
    pax: 4,
    price: 1996,
    currency: 'USD',
    status: 'Confirmada'
  },
  {
    id: 'BK-1044',
    tourId: 'tr-2',
    tourTitle: 'Expedición Extrema Glaciar Grey',
    customerName: 'Claire Laurent',
    date: '2026-07-08',
    pax: 2,
    price: 1500,
    currency: 'USD',
    status: 'Confirmada'
  },
  {
    id: 'BK-5821',
    tourId: 'tr-3',
    tourTitle: 'Safari Amazónico Profundo',
    customerName: 'Lucas Silva',
    date: '2026-07-12',
    pax: 3,
    price: 960,
    currency: 'USD',
    status: 'Pendiente'
  },
  {
    id: 'BK-2099',
    tourId: 'tr-4',
    tourTitle: 'Cenotes Sagrados & Ruinas de Tulum',
    customerName: 'Amara Walker',
    date: '2026-07-05',
    pax: 5,
    price: 550,
    currency: 'USD',
    status: 'Confirmada'
  }
];

// Initial Mock Logistics Nodes
export const LOGISTICS_NODES: LogisticNode[] = [
  {
    id: 'node-patagonia',
    name: 'Patagonia Wild Base Camp',
    top: '82%',
    left: '42%',
    operator: 'Patagonia Wild',
    guide: 'Juan Pérez',
    pax: 12,
    vehicle: 'Sprinter Mercedes Benz (vh-2)',
    connection: 'SATELITAL GARMIN',
    weather: { temp: '6°C', wind: '45 km/h O' },
    currentStatus: 'Trekking activo en Glaciar Grey. Retornando a base camp.'
  },
  {
    id: 'node-cusco',
    name: 'Cusco Central Hub',
    top: '52%',
    left: '48%',
    operator: 'Andes Expeditions',
    guide: 'Sofía Huamán',
    pax: 8,
    vehicle: 'Van Hyundai H1 (vh-1)',
    connection: '4G LTE',
    weather: { temp: '18°C', wind: '10 km/h NE' },
    currentStatus: 'Ascendiendo a Intipunku en Camino Inca. Todo pax estable.'
  },
  {
    id: 'node-amazonas',
    name: 'Amazonas River Lodge',
    top: '35%',
    left: '54%',
    operator: 'Amazon Green',
    guide: 'Carlos Gómez',
    pax: 5,
    vehicle: 'Lancha Tracker 150 (vh-3)',
    connection: 'LANCHA TRACKER GLOBALSTAR',
    weather: { temp: '29°C', wind: '8 km/h S' },
    currentStatus: 'Navegación nocturna completada. Observando delfines.'
  },
  {
    id: 'node-maya',
    name: 'Tulum Beach Point',
    top: '12%',
    left: '38%',
    operator: 'Andes Expeditions',
    guide: 'Diego Ruiz',
    pax: 14,
    vehicle: 'Toyota Hiace Executive (vh-4)',
    connection: 'TOYOTA HIACE LTE',
    weather: { temp: '32°C', wind: '15 km/h E' },
    currentStatus: 'Snorkel finalizado en cenote Sac Actun. Almuerzo buffet.'
  }
];

// Initial Slides
export const INITIAL_SLIDES: Slide[] = [
  {
    id: 'sl-1',
    order: 1,
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800',
    title: 'Descubre los Tesoros de LATAM',
    subtitle: 'Tours exclusivos guiados por operadores locales certificados.',
    ctaText: 'Ver Destinos',
    link: '#admin',
    active: true
  },
  {
    id: 'sl-2',
    order: 2,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    title: 'Aventura al Límite en Patagonia',
    subtitle: 'Escalada extrema y trekking sobre glaciares milenarios.',
    ctaText: 'Explorar Glaciar',
    link: '#admin',
    active: true
  },
  {
    id: 'sl-3',
    order: 3,
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800',
    title: 'Sumergirse en el Amazonas',
    subtitle: 'Ecolodges y safaris de biodiversidad profunda.',
    ctaText: 'Reservar Amazonas',
    link: '#admin',
    active: false
  }
];
