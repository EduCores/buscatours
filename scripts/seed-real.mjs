/**
 * seed-real.mjs — Crear tus datos REALES (operadores, clientes/turistas, tours) en lote
 * ------------------------------------------------------------------------------------
 * Lee dataconnect/seed-real.json (tus datos) y los inserta en el Postgres del emulador.
 * Es idempotente: limpia las tablas antes de insertar, así puedes editar el JSON y
 * correrlo otra vez sin duplicados.
 *
 * Uso (con emuladores corriendo: npm run dev):
 *   node scripts/seed-real.mjs
 *
 * Para datos de ejemplo (no reales) usa: npm run db:seed
 *
 * Formato de dataconnect/seed-real.json:
 * {
 *   "users": [
 *     { "id": "uuid-v4", "email": "...", "name": "...", "role": "OPERATOR|TOUR_ADMIN|CUSTOMER|PLATFORM_ADMIN", "description": "..." }
 *   ],
 *   "tours": [
 *     { "title","location","duration","durationHours","originalPrice","price","discount",
 *       "category","description","image","featured","oneDay","popular","destination",
 *       "vibeAdrenaline","vibeRelax","vibeCulture","vibeFamily","lat","lng","operatorId" }
 *   ]
 * }
 *
 * Los UUID deben ser únicos con formato xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx.
 * El operatorId de cada tour debe coincidir con el id de un usuario role OPERATOR.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@127.0.0.1:5433/buscatours-e0816-database';

const jsonPath = resolve(projectRoot, 'dataconnect', 'seed-real.json');
if (!existsSync(jsonPath)) {
  console.error(`\n❌ No se encontró ${jsonPath}`);
  console.error('   Copia dataconnect/seed-real.example.json -> seed-real.json y rellena tus datos.\n');
  process.exit(1);
}

const data = JSON.parse(readFileSync(jsonPath, 'utf-8'));
const client = new pg.Client({ connectionString: DATABASE_URL, ssl: false });

const roleOk = ['PLATFORM_ADMIN', 'OPERATOR', 'TOUR_ADMIN', 'CUSTOMER'];
const catOk = ['OUTDOOR', 'RELAXACION', 'FERIADO', 'TEMPORADA', 'SALVAJE', 'AVENTURA', 'TEMATICO', 'CULTURAL', 'CIUDAD', 'MONTANA', 'GLACIAR', 'LUJO', 'HISTORICO', 'FAMILIAR', 'SELVA', 'FULLDAY', 'NAVEGACION'];
const destOk = ['ARGENTINA', 'PERU', 'BOLIVIA', 'BRAZIL', 'COLOMBIA', 'ECUADOR', 'CHILE', 'MEXICO', 'DOMINICAN_REPUBLIC'];

async function main() {
   await client.connect();
   console.log('🌱 Insertando tus datos reales...');
   console.log(`   Conexión: ${DATABASE_URL}`);

  // Limpieza (orden FK)
  await client.query('DELETE FROM "public"."bookings"');
  await client.query('DELETE FROM "public"."tours"');
  await client.query('DELETE FROM "public"."slider_slides"');
  await client.query('DELETE FROM "public"."users"');

  for (const u of data.users || []) {
    if (!roleOk.includes(u.role)) throw new Error(`Rol inválido: ${u.role}`);
    await client.query(
      `INSERT INTO "public"."users" ("id","email","name","role","description","created_at","updated_at")
       VALUES ($1,$2,$3,$4,$5,NOW(),NOW())`,
      [u.id, u.email, u.name, u.role, u.description || null]
    );
    console.log(`   ✓ ${u.role} -> ${u.name} (${u.email})`);
  }

  const operatorIds = new Set((data.users || []).filter(u => u.role === 'OPERATOR').map(u => u.id));
  for (const t of data.tours || []) {
    if (!operatorIds.has(t.operatorId)) {
      console.warn(`   ⚠ Tour "${t.title}" tiene operatorId sin coincidencia: ${t.operatorId} (se salta)`);
      continue;
    }
    if (!catOk.includes(t.category)) throw new Error(`Categoría inválida: ${t.category}`);
    if (!destOk.includes(t.destination)) throw new Error(`Destino inválido: ${t.destination}`);
    await client.query(
      `INSERT INTO "public"."tours"
       ("title","location","duration","duration_hours","original_price","price","discount",
        "rating","reviews_count","category","description","image","featured","one_day","popular",
        "status","destination","vibe_adrenaline","vibe_relax","vibe_culture","vibe_family",
        "lat","lng","operator_id","created_at","updated_at")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,NOW(),NOW())`,
      [
        t.title, t.location, t.duration, t.durationHours, t.originalPrice, t.price, t.discount ?? null,
        0, 0, t.category, t.description, t.image, t.featured ?? false, t.oneDay ?? true, t.popular ?? false,
        'PUBLISHED', t.destination,
        t.vibeAdrenaline ?? 50, t.vibeRelax ?? 50, t.vibeCulture ?? 50, t.vibeFamily ?? 50,
        t.lat ?? null, t.lng ?? null, t.operatorId,
      ]
    );
    console.log(`   ✓ Tour -> ${t.title}`);
  }

  console.log('\n────────────────────────────────────────');
  console.log(`✅ Datos reales insertados: ${(data.users || []).length} usuarios, ${(data.tours || []).length} tours`);
  console.log('────────────────────────────────────────');
  await client.end();
  process.exit(0);
}

main().catch(async (e) => {
  console.error('\n❌ Error:', e.message);
  try { await client.end(); } catch {}
  process.exit(1);
});
