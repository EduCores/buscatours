import { Client } from 'pg';
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5433/buscatours-e0816-database';
const client = new Client({ connectionString, ssl: false });

const USERS = [
  { id: '11111111-1111-4111-8111-111111111111', email: 'admin@buscatours.com', name: 'Busca Tours', role: 'PLATFORM_ADMIN', description: 'Dueño de la plataforma' },
  { id: '22222222-2222-4222-8222-222222222222', email: 'operador1@buscatours.com', name: 'Andes Expeditions', role: 'OPERATOR', description: 'Operador turístico - Andes' },
  { id: '33333333-3333-4333-8333-333333333333', email: 'operador2@buscatours.com', name: 'Patagonia Wild Outdoors', role: 'OPERATOR', description: 'Operador turístico - Patagonia' },
  { id: '44444444-4444-4444-8444-444444444444', email: 'operador3@buscatours.com', name: 'Amazon Green Travel', role: 'OPERATOR', description: 'Operador turístico - Amazonia' },
  { id: '55555555-5555-4555-8555-555555555555', email: 'operador4@buscatours.com', name: 'Maya Tours S.A.', role: 'OPERATOR', description: 'Operador turístico - Centroamérica' },
  { id: '66666666-6666-4666-8666-666666666666', email: 'editor@buscatours.com', name: 'Admin de Contenido', role: 'TOUR_ADMIN', description: 'Administrador de contenido y tours' },
  { id: '77777777-7777-4777-8777-777777777777', email: 'cliente@buscatours.com', name: 'Cliente Frecuente', role: 'CUSTOMER', description: 'Usuario final de prueba' },
];

const INSERT = `
INSERT INTO users (id, email, name, role, description, created_at, updated_at)
VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  description = EXCLUDED.description,
  updated_at = NOW()
`;

try {
  await client.connect();
  for (const u of USERS) {
    await client.query(INSERT, [u.id, u.email, u.name, u.role, u.description]);
    console.log(`OK ${u.email} -> ${u.role}`);
  }
} catch (err) {
  console.error(err);
  process.exit(1);
} finally {
  await client.end();
}
