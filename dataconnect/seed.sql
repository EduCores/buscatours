-- ============================================================
-- Seed Busca Tours — PostgreSQL (Data Connect)
-- ============================================================
-- Ejecutar con emuladores corriendo:
--   firebase dataconnect:sql:execute --schema buscatours-e0816 < dataconnect/seed.sql
-- ============================================================

-- Limpieza previa (orden FK: bookings → tours → slider_slides → users)
DELETE FROM "public"."bookings";
DELETE FROM "public"."tours";
DELETE FROM "public"."slider_slides";
DELETE FROM "public"."users";

-- ============================================================
-- 1. USUARIOS (7 usuarios con UUIDs v4 fijos)
-- ============================================================
INSERT INTO "public"."users" ("id", "email", "name", "role", "description", "created_at", "updated_at") VALUES
('a1b2c3d4-0001-4000-8000-000000000001', 'admin@buscatours.com',     'Busca Tours',             'PLATFORM_ADMIN', 'Dueño de la plataforma',                         NOW(), NOW()),
('a1b2c3d4-0002-4000-8000-000000000002', 'operador1@buscatours.com', 'Andes Expeditions',       'OPERATOR',       'Operador especializado en Perú y cultura andina',  NOW(), NOW()),
('a1b2c3d4-0003-4000-8000-000000000003', 'operador2@buscatours.com', 'Patagonia Wild Outdoors', 'OPERATOR',       'Operador regional para Patagonia y Argentina',    NOW(), NOW()),
('a1b2c3d4-0004-4000-8000-000000000004', 'operador3@buscatours.com', 'Amazon Green Travel',     'OPERATOR',       'Operador de experiencias en la selva y Bolivia',   NOW(), NOW()),
('a1b2c3d4-0005-4000-8000-000000000005', 'operador4@buscatours.com', 'Maya Tours S.A.',         'OPERATOR',       'Operador de viajes culturales en México y Caribe', NOW(), NOW()),
('a1b2c3d4-0006-4000-8000-000000000006', 'editor@buscatours.com',    'Admin de Contenido',      'TOUR_ADMIN',     'Administrador con acceso a crear/editar tours',    NOW(), NOW()),
('a1b2c3d4-0007-4000-8000-000000000007', 'cliente@buscatours.com',   'Cliente Frecuente',       'CUSTOMER',       'Usuario final de prueba',                          NOW(), NOW()),
('a1b2c3d4-0008-4000-8000-000000000008', 'marvelousperu@buscatours.com', 'Marvelous Peru', 'OPERATOR', 'Tour operador especializado en Cusco, Caminos del Inca y aventura selvática.', NOW(), NOW()),
('a1b2c3d4-0009-4000-8000-000000000009', 'galapagos@galasky.com.ec', 'Galasky', 'OPERATOR', 'Tour operador de aventura y ecoturismo en las Islas Galápagos, Ecuador.', NOW(), NOW());

-- ============================================================
-- 2. TOURS (12 tours — operator_id = UUID del operador)
-- ============================================================
INSERT INTO "public"."tours" (
  "title", "location", "duration", "duration_hours", "original_price", "price",
  "discount", "rating", "reviews_count", "category", "description", "image",
  "featured", "one_day", "popular", "status", "destination",
  "vibe_adrenaline", "vibe_relax", "vibe_culture", "vibe_family",
  "lat", "lng", "operator_id",
  "created_at", "updated_at"
) VALUES
('Full Day Torres del Paine', 'Patagonia, Argentina', '1 Day', 12,
 150.0, 120.0, '20% Off', 4.9, 38, 'OUTDOOR',
 'Visita la Cueva del Milodón, Laguna Sofía, Mirador del Nordenskjöld y navega cerca del impresionante Lago Grey en la excursión más completa.',
 '/uploads/tours/torres-del-paine-card-tour.webp', true, true, true, 'PUBLISHED', 'ARGENTINA',
 75, 30, 40, 70, -51.2533, -72.9814, 'a1b2c3d4-0003-4000-8000-000000000003', NOW(), NOW()),

('Camino Inca a Machu Picchu', 'Cusco, Perú', '1 Day (Trekking)', 9,
 160.0, 130.0, 'Recomendado', 4.9, 54, 'AVENTURA',
 'Recorre el legendario Camino Inca hasta las ruinas sagradas de Machu Picchu. Una aventura de trekking sin precedentes entre templos y naturaleza.',
 '/uploads/tours/Machu-Picchu-card-tour.webp', true, true, true, 'PUBLISHED', 'PERU',
 85, 15, 95, 50, -13.1631, -72.5450, 'a1b2c3d4-0002-4000-8000-000000000002', NOW(), NOW()),

('Aventura Salar de Uyuni', 'Potosí, Bolivia', '10 Hours', 10,
 210.0, 195.0, NULL, 4.8, 29, 'OUTDOOR',
 'Explora el espejo de sal más grande del mundo en un vehículo 4x4. Visita la Isla Incahuasi, el cementerio de trenes y lagunas de colores.',
 '/uploads/tours/salar-de-uyuni-card-tour.webp', true, true, false, 'PUBLISHED', 'BOLIVIA',
 70, 35, 50, 75, -20.1338, -67.4891, 'a1b2c3d4-0004-4000-8000-000000000004', NOW(), NOW()),

('Río de Janeiro Imprescindible', 'Río de Janeiro, Brasil', '1 Day', 14,
 250.0, 220.0, '12% Off', 4.7, 16, 'CULTURAL',
 'Visita el Cristo Redentor en el Cerro Corcovado, el Pan de Azúcar y relájate en las famosas playas de Copacabana e Ipanema.',
 '/uploads/tours/rio-de-janeiro-card-tour.webp', false, true, true, 'PUBLISHED', 'BRAZIL',
 40, 65, 85, 70, -22.9068, -43.1729, 'a1b2c3d4-0003-4000-8000-000000000003', NOW(), NOW()),

('Caribe Mágico en Cartagena', 'Cartagena de Indias, Colombia', '6 Hours', 6,
 95.0, 80.0, '15% Off', 4.6, 12, 'FAMILIAR',
 'Recorre la hermosa ciudad amurallada de Cartagena, sus iglesias coloniales, el Castillo de San Felipe y disfruta del sol en las Islas del Rosario.',
 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80', false, true, false, 'PUBLISHED', 'COLOMBIA',
 30, 75, 75, 90, 10.3910, -75.4794, 'a1b2c3d4-0004-4000-8000-000000000004', NOW(), NOW()),

('Crucero de Aventura en Galápagos', 'Islas Galápagos, Ecuador', '7 Days', 168,
 4300.0, 3500.0, '20% Off', 4.9, 24, 'LUJO',
 'Navega por el archipiélago de Galápagos. Observa tortugas gigantes, iguanas marinas y leones de mar en una experiencia científica única.',
 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', true, false, true, 'PUBLISHED', 'ECUADOR',
 50, 80, 60, 80, -0.8293, -90.9821, 'a1b2c3d4-0005-4000-8000-000000000005', NOW(), NOW()),

('Chichén Itzá y Cenotes Sagrados', 'Riviera Maya, México', '1 Day', 12,
 180.0, 145.0, '20% Off', 4.8, 112, 'HISTORICO',
 'Descubre el impresionante templo de Kukulcán, explora la antigua ciudad maya y refréscate nadando en las aguas cristalinas de un cenote sagrado.',
 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80', true, true, true, 'PUBLISHED', 'MEXICO',
 45, 50, 95, 75, 20.6843, -88.5678, 'a1b2c3d4-0005-4000-8000-000000000005', NOW(), NOW()),

('Cataratas del Iguazú Completas', 'Iguazú, Argentina/Brasil', '2 Days', 48,
 280.0, 250.0, '10% Off', 4.9, 89, 'OUTDOOR',
 'Maravíllate con la inmensidad de la Garganta del Diablo y explora las pasarelas rodeado de selva tropical, fauna exótica y arcoíris.',
 'https://images.unsplash.com/photo-1596489370607-f3c95977ba2e?auto=format&fit=crop&w=800&q=80', true, false, true, 'PUBLISHED', 'ARGENTINA',
 65, 45, 40, 85, -25.6953, -54.4367, 'a1b2c3d4-0003-4000-8000-000000000003', NOW(), NOW()),

('Valle de la Luna y Géiseres', 'Atacama, Chile', '3 Days', 72,
 320.0, 290.0, 'Recomendado', 4.8, 45, 'AVENTURA',
 'Recorre los paisajes lunares de Atacama, observa los impresionantes géiseres al amanecer y relájate en las termas purificadoras.',
 'https://images.unsplash.com/photo-1533202967160-b21a36b13689?auto=format&fit=crop&w=800&q=80', false, false, true, 'PUBLISHED', 'CHILE',
 80, 40, 60, 60, -22.9115, -68.1990, 'a1b2c3d4-0003-4000-8000-000000000003', NOW(), NOW()),

('Escapada a Punta Cana', 'Punta Cana, Rep. Dominicana', '5 Days', 120,
 1100.0, 850.0, '25% Off', 4.7, 156, 'RELAXACION',
 'Disfruta de playas de arena blanca, aguas turquesas, cócteles tropicales y la máxima relajación en los resorts más exclusivos del Caribe.',
 'https://images.unsplash.com/photo-1505080031861-125032dce30a?auto=format&fit=crop&w=800&q=80', true, false, false, 'PUBLISHED', 'DOMINICAN_REPUBLIC',
 15, 95, 30, 85, 18.5820, -68.4055, 'a1b2c3d4-0005-4000-8000-000000000005', NOW(), NOW()),

('Glaciar Perito Moreno', 'El Calafate, Argentina', '1 Day', 10,
 195.0, 165.0, 'Special Offer', 4.9, 210, 'GLACIAR',
 'Camina por las pasarelas frente a la imponente pared de hielo del Glaciar Perito Moreno y navega muy cerca de los témpanos flotantes.',
 'https://images.unsplash.com/photo-1544600584-6997ce381676?auto=format&fit=crop&w=800&q=80', true, true, true, 'PUBLISHED', 'ARGENTINA',
 70, 30, 45, 80, -50.4968, -73.1377, 'a1b2c3d4-0003-4000-8000-000000000003', NOW(), NOW()),

('Trekking Ciudad Perdida', 'Santa Marta, Colombia', '4 Days 3 Nights', 96,
 450.0, 410.0, NULL, 4.8, 34, 'SALVAJE',
 'Una expedición de senderismo profundo por la selva tropical de la Sierra Nevada hasta las misteriosas terrazas de los antiguos Tayrona.',
 '/uploads/tours/ciudad-perdida-card-tour.webp', true, false, false, 'PUBLISHED', 'COLOMBIA',
 90, 10, 75, 45, 11.0360, -73.9161, 'a1b2c3d4-0004-4000-8000-000000000004', NOW(), NOW());

-- ============================================================
-- 2.1 TOURS ADICIONALES (Marvelous Peru y Galasky)
-- ============================================================
INSERT INTO "public"."tours" (
  "title", "location", "duration", "duration_hours", "original_price", "price",
  "discount", "rating", "reviews_count", "category", "description", "image",
  "featured", "one_day", "popular", "status", "destination",
  "vibe_adrenaline", "vibe_relax", "vibe_culture", "vibe_family",
  "lat", "lng", "operator_id",
  "created_at", "updated_at", "translations"
) VALUES
('City Tour Cusco + Inka Jungle a Machu Picchu (4 días)', 'Cusco, Perú', '4 Days / 3 Nights', 96,
 399.0, 349.0, '12% Off', 4.8, 21, 'AVENTURA',
 'El programa City Tour + Inka Jungle 4 días es una combinación perfecta entre cultura, naturaleza y aventura en Cusco. Combina ciclismo de montaña (downhill) en Abra Málaga, senderismo y visita guiada a Machu Picchu.',
 'https://images.unsplash.com/photo-1587593817642-87a248556637?auto=format&fit=crop&w=800&q=80', true, false, true, 'PUBLISHED', 'PERU',
 80, 20, 90, 50, -13.1631, -72.5450, 'a1b2c3d4-0008-4000-8000-000000000008', NOW(), NOW(),
 '{"en":{"title":"City Tour Cusco + Inka Jungle to Machu Picchu (4 days)","location":"Cusco, Peru","description":"The 4-day City Tour + Inka Jungle program is a perfect combination of culture, nature, and adventure in Cusco. It combines mountain biking (downhill) in Abra Malaga, trekking, and a guided visit to Machu Picchu."}}'),

('Galapagos Small Group: 4 Islands, 7 Days of Pure Adventure and Great Atmosphere', 'Islas Galápagos, Ecuador', '7 Days', 168,
 2499.0, 2199.0, '12% Off', 4.9, 15, 'AVENTURA',
 'Viaje grupal diseñado para espíritus aventureros en Galápagos. Salta de isla en isla recorriendo San Cristóbal, Floreana, Isabela y Santa Cruz. Incluye snorkel con leones marinos y tiburones, senderismo en volcán Sierra Negra y visita a tortugas gigantes.',
 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=800&q=80', true, false, true, 'PUBLISHED', 'ECUADOR',
 85, 40, 40, 70, -0.9016, -89.6101, 'a1b2c3d4-0009-4000-8000-000000000009', NOW(), NOW(),
 '{"en":{"title":"Galapagos Small Group: 4 Islands, 7 Days of Pure Adventure and Great Atmosphere","location":"Galapagos Islands, Ecuador","description":"Group trip designed for adventurous spirits in Galapagos. Island-hop through San Cristobal, Floreana, Isabela, and Santa Cruz. Includes snorkeling with sea lions and sharks, hiking Sierra Negra volcano, and giant tortoises."}}');

-- ============================================================
-- 3. SLIDES DEL HERO
-- ============================================================
INSERT INTO "public"."slider_slides" ("subtitle", "title", "description", "button_text", "image", "link", "order", "active", "created_at", "updated_at") VALUES
('Tour Especial de Aventura', '7 Días / 6 Noches',
 'Cueva del Milodón, Laguna Sofía, Base Torres del Paine y Glaciar Grey. La experiencia patagónica definitiva.',
 'Ver Más', '/uploads/tours/hero/slider-cataratas-del-iguazu.webp', '#tours', 0, true, NOW(), NOW()),
('Encuentra tus Vacaciones Perfectas', 'Descubre la Magia de la Patagonia',
 'Excursiones exclusivas saliendo de Punta Arenas, Puerto Natales y exploraciones en la salvaje Tierra del Fuego.',
 'Explorar Destinos', '/uploads/tours/hero/slider-machu-pichu.webp', '#destinos', 1, true, NOW(), NOW()),
('Abre tus Ojos a...', 'Un Mundo Oculto',
 'Explora glaciares milenarios, estancias remotas y senderos vírgenes en el extremo sur del planeta.',
 'Ver Actividades', '/uploads/tours/hero/slider-cataratas-del-iguazu.webp', '#actividades', 2, true, NOW(), NOW());
