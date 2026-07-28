/**
 * Seed para Firebase Data Connect (PostgreSQL) — Busca Tours
 * ----------------------------------------------------------
 * Reemplaza a los antiguos scripts que sembraban en Firestore (DB equivocada).
 *
 * Flujo:
 *   1. Crea los usuarios (operadores/admins/customer) y captura los UUID generados.
 *   2. Crea los 12 tours usando los UUID de los operadores como operatorId.
 *   3. Crea los slides del hero.
 *
 * Uso (con emuladores corriendo):
 *   node functions/scripts/seed-dataconnect.mjs
 *
 * Requiere: firebase emulators:start --only dataconnect,auth  (en otra terminal)
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDataConnect, connectDataConnectEmulator } from 'firebase/data-connect';
import {
  connectorConfig,
  createUser,
  createTour,
  createSliderSlide,
  getTours,
  deleteTour,
} from '@dataconnect/generated';

// --- Config Firebase (apunta al emulador) ---
const firebaseConfig = {
  apiKey: 'buscatours-e0816-emulator',
  projectId: 'buscatours-e0816',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const dc = getDataConnect(app, connectorConfig);
connectDataConnectEmulator(dc, '127.0.0.1', 9399);

// ============================================================
//  DATOS DE EJEMPLO (basados en src/data/tours.js)
// ============================================================

// Operadores y usuarios. El id real lo asigna Postgres (UUID); aquí solo
// usamos "key" para luego referenciar el operador correcto desde cada tour.
const SEED_USERS = [
  { key: 'platform-admin', email: 'admin@buscatours.com', name: 'Busca Tours', role: 'PLATFORM_ADMIN', description: 'Dueño de la plataforma' },
  { key: 'operator-andes', email: 'operador1@buscatours.com', name: 'Andes Expeditions', role: 'OPERATOR', description: 'Operador especializado en Perú y cultura andina' },
  { key: 'operator-patagonia', email: 'operador2@buscatours.com', name: 'Patagonia Wild Outdoors', role: 'OPERATOR', description: 'Operador regional para Patagonia y Argentina' },
  { key: 'operator-amazon', email: 'operador3@buscatours.com', name: 'Amazon Green Travel', role: 'OPERATOR', description: 'Operador de experiencias en la selva y Bolivia' },
  { key: 'operator-maya', email: 'operador4@buscatours.com', name: 'Maya Tours S.A.', role: 'OPERATOR', description: 'Operador de viajes culturales en México y Caribe' },
  { key: 'tour-admin', email: 'editor@buscatours.com', name: 'Admin de Contenido', role: 'TOUR_ADMIN', description: 'Administrador con acceso a crear/editar tours' },
  { key: 'customer', email: 'cliente@buscatours.com', name: 'Cliente Frecuente', role: 'CUSTOMER', description: 'Usuario final de prueba' },
  { key: 'operator-marvelous', email: 'marvelousperu@buscatours.com', name: 'Marvelous Peru', role: 'OPERATOR', description: 'Tour operador especializado en Cusco, Caminos del Inca y aventura selvática.' },
  { key: 'operator-galasky', email: 'galapagos@galasky.com.ec', name: 'Galasky', role: 'OPERATOR', description: 'Tour operador de aventura y ecoturismo en las Islas Galápagos, Ecuador.' },
];

// Mapeo operator-key -> asignado abajo tras crear usuarios.
// Por defecto, todos los tours se asignan al operador Patagonia, salvo
// los que tienen un operador más temático definido en "operatorKey".
const SEED_TOURS = [
  {
    title: 'Full Day Torres del Paine', location: 'Patagonia, Argentina', duration: '1 Day', durationHours: 12,
    originalPrice: 150, price: 120, discount: '20% Off', rating: 4.9, reviewsCount: 38,
    category: 'OUTDOOR',
    description: 'Visita la Cueva del Milodón, Laguna Sofía, Mirador del Nordenskjöld y navega cerca del impresionante Lago Grey en la excursión más completa.',
    image: '/uploads/tours/torres-del-paine-card-tour.webp', featured: true, oneDay: true, popular: true,
    destination: 'ARGENTINA', vibeAdrenaline: 75, vibeRelax: 30, vibeCulture: 40, vibeFamily: 70, lat: -51.2533, lng: -72.9814,
    operatorKey: 'operator-patagonia',
  },
  {
    title: 'Camino Inca a Machu Picchu', location: 'Cusco, Perú', duration: '1 Day (Trekking)', durationHours: 9,
    originalPrice: 160, price: 130, discount: 'Recomendado', rating: 4.9, reviewsCount: 54,
    category: 'AVENTURA',
    description: 'Recorre el legendario Camino Inca hasta las ruinas sagradas de Machu Picchu. Una aventura de trekking sin precedentes entre templos y naturaleza.',
    image: '/uploads/tours/Machu-Picchu-card-tour.webp', featured: true, oneDay: true, popular: true,
    destination: 'PERU', vibeAdrenaline: 85, vibeRelax: 15, vibeCulture: 95, vibeFamily: 50, lat: -13.1631, lng: -72.5450,
    operatorKey: 'operator-andes',
  },
  {
    title: 'Aventura Salar de Uyuni', location: 'Potosí, Bolivia', duration: '10 Hours', durationHours: 10,
    originalPrice: 210, price: 195, discount: null, rating: 4.8, reviewsCount: 29,
    category: 'OUTDOOR',
    description: 'Explora el espejo de sal más grande del mundo en un vehículo 4x4. Visita la Isla Incahuasi, el cementerio de trenes y lagunas de colores.',
    image: '/uploads/tours/salar-de-uyuni-card-tour.webp', featured: true, oneDay: true, popular: false,
    destination: 'BOLIVIA', vibeAdrenaline: 70, vibeRelax: 35, vibeCulture: 50, vibeFamily: 75, lat: -20.1338, lng: -67.4891,
    operatorKey: 'operator-amazon',
  },
  {
    title: 'Río de Janeiro Imprescindible', location: 'Río de Janeiro, Brasil', duration: '1 Day', durationHours: 14,
    originalPrice: 250, price: 220, discount: '12% Off', rating: 4.7, reviewsCount: 16,
    category: 'CULTURAL',
    description: 'Visita el Cristo Redentor en el Cerro Corcovado, el Pan de Azúcar y relájate en las famosas playas de Copacabana e Ipanema.',
    image: '/uploads/tours/rio-de-janeiro-card-tour.webp', featured: false, oneDay: true, popular: true,
    destination: 'BRAZIL', vibeAdrenaline: 40, vibeRelax: 65, vibeCulture: 85, vibeFamily: 70, lat: -22.9068, lng: -43.1729,
    operatorKey: 'operator-patagonia',
  },
  {
    title: 'Caribe Mágico en Cartagena', location: 'Cartagena de Indias, Colombia', duration: '6 Hours', durationHours: 6,
    originalPrice: 95, price: 80, discount: '15% Off', rating: 4.6, reviewsCount: 12,
    category: 'FAMILIAR',
    description: 'Recorre la hermosa ciudad amurallada de Cartagena, sus iglesias coloniales, el Castillo de San Felipe y disfruta del sol en las Islas del Rosario.',
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80', featured: false, oneDay: true, popular: false,
    destination: 'COLOMBIA', vibeAdrenaline: 30, vibeRelax: 75, vibeCulture: 75, vibeFamily: 90, lat: 10.3910, lng: -75.4794,
    operatorKey: 'operator-amazon',
  },
  {
    title: 'Crucero de Aventura en Galápagos', location: 'Islas Galápagos, Ecuador', duration: '7 Days', durationHours: 168,
    originalPrice: 4300, price: 3500, discount: '20% Off', rating: 4.9, reviewsCount: 24,
    category: 'LUJO',
    description: 'Navega por el archipiélago de Galápagos. Observa tortugas gigantes, iguanas marinas y leones de mar en una experiencia científica única.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', featured: true, oneDay: false, popular: true,
    destination: 'ECUADOR', vibeAdrenaline: 50, vibeRelax: 80, vibeCulture: 60, vibeFamily: 80, lat: -0.8293, lng: -90.9821,
    operatorKey: 'operator-maya',
  },
  {
    title: 'Chichén Itzá y Cenotes Sagrados', location: 'Riviera Maya, México', duration: '1 Day', durationHours: 12,
    originalPrice: 180, price: 145, discount: '20% Off', rating: 4.8, reviewsCount: 112,
    category: 'CULTURAL',
    description: 'Descubre el impresionante templo de Kukulcán, explora la antigua ciudad maya y refréscate nadando en las aguas cristalinas de un cenote sagrado.',
    image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80', featured: true, oneDay: true, popular: true,
    destination: 'MEXICO', vibeAdrenaline: 45, vibeRelax: 50, vibeCulture: 95, vibeFamily: 75, lat: 20.6843, lng: -88.5678,
    operatorKey: 'operator-maya',
  },
  {
    title: 'Cataratas del Iguazú Completas', location: 'Iguazú, Argentina/Brasil', duration: '2 Days', durationHours: 48,
    originalPrice: 280, price: 250, discount: '10% Off', rating: 4.9, reviewsCount: 89,
    category: 'OUTDOOR',
    description: 'Maravíllate con la inmensidad de la Garganta del Diablo y explora las pasarelas rodeado de selva tropical, fauna exótica y arcoíris.',
    image: 'https://images.unsplash.com/photo-1596489370607-f3c95977ba2e?auto=format&fit=crop&w=800&q=80', featured: true, oneDay: false, popular: true,
    destination: 'ARGENTINA', vibeAdrenaline: 65, vibeRelax: 45, vibeCulture: 40, vibeFamily: 85, lat: -25.6953, lng: -54.4367,
    operatorKey: 'operator-patagonia',
  },
  {
    title: 'Valle de la Luna y Géiseres', location: 'Atacama, Chile', duration: '3 Days', durationHours: 72,
    originalPrice: 320, price: 290, discount: 'Recomendado', rating: 4.8, reviewsCount: 45,
    category: 'AVENTURA',
    description: 'Recorre los paisajes lunares de Atacama, observa los impresionantes géiseres al amanecer y relájate en las termas purificadoras.',
    image: 'https://images.unsplash.com/photo-1533202967160-b21a36b13689?auto=format&fit=crop&w=800&q=80', featured: false, oneDay: false, popular: true,
    destination: 'CHILE', vibeAdrenaline: 80, vibeRelax: 40, vibeCulture: 60, vibeFamily: 60, lat: -22.9115, lng: -68.1990,
    operatorKey: 'operator-patagonia',
  },
  {
    title: 'Escapada a Punta Cana', location: 'Punta Cana, Rep. Dominicana', duration: '5 Days', durationHours: 120,
    originalPrice: 1100, price: 850, discount: '25% Off', rating: 4.7, reviewsCount: 156,
    category: 'RELAXACION',
    description: 'Disfruta de playas de arena blanca, aguas turquesas, cócteles tropicales y la máxima relajación en los resorts más exclusivos del Caribe.',
    image: 'https://images.unsplash.com/photo-1505080031861-125032dce30a?auto=format&fit=crop&w=800&q=80', featured: true, oneDay: false, popular: false,
    destination: 'DOMINICAN_REPUBLIC', vibeAdrenaline: 15, vibeRelax: 95, vibeCulture: 30, vibeFamily: 85, lat: 18.5820, lng: -68.4055,
    operatorKey: 'operator-maya',
  },
  {
    title: 'Glaciar Perito Moreno', location: 'El Calafate, Argentina', duration: '1 Day', durationHours: 10,
    originalPrice: 195, price: 165, discount: 'Special Offer', rating: 4.9, reviewsCount: 210,
    category: 'OUTDOOR',
    description: 'Camina por las pasarelas frente a la imponente pared de hielo del Glaciar Perito Moreno y navega muy cerca de los témpanos flotantes.',
    image: 'https://images.unsplash.com/photo-1544600584-6997ce381676?auto=format&fit=crop&w=800&q=80', featured: true, oneDay: true, popular: true,
    destination: 'ARGENTINA', vibeAdrenaline: 70, vibeRelax: 30, vibeCulture: 45, vibeFamily: 80, lat: -50.4968, lng: -73.1377,
    operatorKey: 'operator-patagonia',
  },
  {
    title: 'Trekking Ciudad Perdida', location: 'Santa Marta, Colombia', duration: '4 Days 3 Nights', durationHours: 96,
    originalPrice: 450, price: 410, discount: null, rating: 4.8, reviewsCount: 34,
    category: 'AVENTURA',
    description: 'Una expedición de senderismo profundo por la selva tropical de la Sierra Nevada hasta las misteriosas terrazas de los antiguos Tayrona.',
    image: '/uploads/tours/ciudad-perdida-card-tour.webp', featured: true, oneDay: false, popular: false,
    destination: 'COLOMBIA', vibeAdrenaline: 90, vibeRelax: 10, vibeCulture: 75, vibeFamily: 45, lat: 11.0360, lng: -73.9161,
    operatorKey: 'operator-amazon',
  },
  {
    title: 'City Tour Cusco + Inka Jungle a Machu Picchu (4 días)', location: 'Cusco, Perú', duration: '4 Days / 3 Nights', durationHours: 96,
    originalPrice: 399, price: 349, discount: '12% Off', rating: 4.8, reviewsCount: 21,
    category: 'AVENTURA',
    description: 'El programa City Tour + Inka Jungle 4 días es una combinación perfecta entre cultura, naturaleza y aventura en Cusco. Combina ciclismo de montaña (downhill) en Abra Málaga, trekking y visita guiada a Machu Picchu.',
    image: 'https://images.unsplash.com/photo-1587593817642-87a248556637?auto=format&fit=crop&w=800&q=80', featured: true, oneDay: false, popular: true,
    destination: 'PERU', vibeAdrenaline: 80, vibeRelax: 20, vibeCulture: 90, vibeFamily: 50, lat: -13.1631, lng: -72.5450,
    operatorKey: 'operator-marvelous',
  },
  {
    title: 'Galapagos Small Group: 4 Islands, 7 Days of Pure Adventure and Great Atmosphere', location: 'Islas Galápagos, Ecuador', duration: '7 Days', durationHours: 168,
    originalPrice: 2499, price: 2199, discount: '12% Off', rating: 4.9, reviewsCount: 15,
    category: 'AVENTURA',
    description: 'Viaje grupal diseñado para espíritus aventureros en Galápagos. Salta de isla en isla recorriendo San Cristóbal, Floreana, Isabela y Santa Cruz. Incluye snorkel con leones marinos y tiburones, senderismo en volcán Sierra Negra y visita a tortugas gigantes.',
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=800&q=80', featured: true, oneDay: false, popular: true,
    destination: 'ECUADOR', vibeAdrenaline: 85, vibeRelax: 40, vibeCulture: 40, vibeFamily: 70, lat: -0.9016, lng: -89.6101,
    operatorKey: 'operator-galasky',
  },
];

const SEED_SLIDES = [
  { subtitle: 'Tour Especial de Aventura', title: '7 Días / 6 Noches', description: 'Cueva del Milodón, Laguna Sofía, Base Torres del Paine y Glaciar Grey. La experiencia patagónica definitiva.', buttonText: 'Ver Más', image: '/uploads/tours/hero/slider-cataratas-del-iguazu.webp', link: '#tours', order: 0, active: true },
  { subtitle: 'Encuentra tus Vacaciones Perfectas', title: 'Descubre la Magia de la Patagonia', description: 'Excursiones exclusivas saliendo de Punta Arenas, Puerto Natales y exploraciones en la salvaje Tierra del Fuego.', buttonText: 'Explorar Destinos', image: '/uploads/tours/hero/slider-machu-pichu.webp', link: '#destinos', order: 1, active: true },
  { subtitle: 'Abre tus Ojos a...', title: 'Un Mundo Oculto', description: 'Explora glaciares milenarios, estancias remotas y senderos vírgenes en el extremo sur del planeta.', buttonText: 'Ver Actividades', image: '/uploads/tours/hero/slider-cataratas-del-iguazu.webp', link: '#actividades', order: 2, active: true },
];

// ============================================================
//  LÓGICA DE SEMBRADO
// ============================================================

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function clearExistingTours() {
  try {
    const result = await getTours(dc);
    const tours = result.data?.tours || [];
    if (tours.length === 0) {
      console.log('  (no había tours previos)');
      return;
    }
    console.log(`  Eliminando ${tours.length} tours previos...`);
    for (const t of tours) {
      try {
        await deleteTour(dc, { id: t.id });
        await wait(30);
      } catch (e) {
        console.warn(`  (no se pudo borrar tour ${t.id}: ${e.message})`);
      }
    }
  } catch (e) {
    console.warn('  (aviso al leer tours para limpiar:', e.message, ')');
  }
}

async function seedUsers() {
  const userIdByKey = {};
  console.log('\n👤 Creando usuarios...');
  for (const u of SEED_USERS) {
    try {
      const res = await createUser(dc, {
        email: u.email,
        name: u.name,
        role: u.role,
        description: u.description,
      });
      const newId = res.data?.user_insert?.id;
      userIdByKey[u.key] = newId;
      console.log(`  ✓ ${u.key} -> ${newId} (${u.name})`);
      await wait(50);
    } catch (e) {
      // Si ya existe por email único, lo reportamos pero continuamos.
      console.warn(`  ⚠ ${u.key} (${u.email}): ${e.message}`);
    }
  }
  return userIdByKey;
}

async function seedTours(userIdByKey) {
  console.log('\n🗺️  Creando tours...');
  let created = 0;
  for (const t of SEED_TOURS) {
    const operatorId = userIdByKey[t.operatorKey];
    if (!operatorId) {
      console.warn(`  ⚠ Saltando "${t.title}": operador "${t.operatorKey}" sin UUID`);
      continue;
    }
    try {
      await createTour(dc, {
        title: t.title,
        location: t.location,
        duration: t.duration,
        durationHours: t.durationHours,
        originalPrice: t.originalPrice,
        price: t.price,
        discount: t.discount,
        category: t.category,
        description: t.description,
        image: t.image,
        featured: t.featured,
        oneDay: t.oneDay,
        popular: t.popular,
        status: 'PUBLISHED',
        destination: t.destination,
        vibeAdrenaline: t.vibeAdrenaline,
        vibeRelax: t.vibeRelax,
        vibeCulture: t.vibeCulture,
        vibeFamily: t.vibeFamily,
        lat: t.lat,
        lng: t.lng,
        operatorId,
      });
      created++;
      console.log(`  ✓ ${t.title}`);
      await wait(50);
    } catch (e) {
      console.warn(`  ⚠ "${t.title}": ${e.message}`);
    }
  }
  return created;
}

async function seedSlides() {
  console.log('\n🖼️  Creando slides del hero...');
  let created = 0;
  for (const s of SEED_SLIDES) {
    try {
      await createSliderSlide(dc, s);
      created++;
      console.log(`  ✓ ${s.title}`);
      await wait(50);
    } catch (e) {
      console.warn(`  ⚠ "${s.title}": ${e.message}`);
    }
  }
  return created;
}

async function main() {
  console.log('🌱 Seed para Firebase Data Connect (PostgreSQL)');
  console.log('   Proyecto: buscatours-e0816 (emulador localhost:9399)');

  // 0. Limpiar tours previos (idempotente)
  console.log('\n🧹 Limpiando tours existentes...');
  await clearExistingTours();

  // 1. Usuarios
  const userIdByKey = await seedUsers();

  // 2. Tours
  const toursCreated = await seedTours(userIdByKey);

  // 3. Slides
  const slidesCreated = await seedSlides();

  console.log('\n────────────────────────────────────────');
  console.log('✅ Seed completado:');
  console.log(`   Usuarios creados: ${Object.keys(userIdByKey).length}`);
  console.log(`   Tours creados:    ${toursCreated}/${SEED_TOURS.length}`);
  console.log(`   Slides creados:   ${slidesCreated}/${SEED_SLIDES.length}`);
  console.log('────────────────────────────────────────');

  // Mapa de operadores para referencia futura (login, etc.)
  console.log('\n📋 Operadores disponibles (email):');
  SEED_USERS.filter((u) => u.role === 'OPERATOR').forEach((u) => {
    console.log(`   - ${u.email} (${u.name}) [id: ${userIdByKey[u.key] || 'N/A'}]`);
  });

  process.exit(0);
}

main().catch((err) => {
  console.error('\n❌ Error fatal en el seed:', err);
  process.exit(1);
});
