/**
 * Wrapper: ejecuta seed.sql contra el Postgres del emulador Data Connect.
 * Uso:  node functions/scripts/seed-dataconnect-sql.mjs
 * Requiere: firebase emulators:start --only dataconnect  (en otra terminal)
 */
import pg from 'pg';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '../..');
const sqlFile = resolve(projectRoot, 'dataconnect/seed.sql');

// El emulador de Data Connect crea las tablas en SU Postgres embebido (puerto 5433,
// DB buscatours-e0816-database). Por eso el seed apunta ahí por defecto.
// Si quieres sembrar tu Postgres nativo, define DATABASE_URL con tu conexión.
const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@127.0.0.1:5433/buscatours-e0816-database';

const client = new pg.Client({ connectionString: DATABASE_URL, ssl: false });

async function main() {
  console.log('🌱 Ejecutando seed.sql contra emulador Postgres...');
  console.log(`   Conexión: ${DATABASE_URL}`);

  try {
    await client.connect();
    console.log('   ✓ Conectado a Postgres\n');

    const sql = readFileSync(sqlFile, 'utf-8');
    await client.query(sql);

    // Verificación
    const users = await client.query('SELECT COUNT(*) FROM "public"."users"');
    const tours = await client.query('SELECT COUNT(*) FROM "public"."tours"');
    const slides = await client.query('SELECT COUNT(*) FROM "public"."slider_slides"');

    console.log('────────────────────────────────────────');
    console.log('✅ Seed completado:');
    console.log(`   Usuarios: ${users.rows[0].count}`);
    console.log(`   Tours:    ${tours.rows[0].count}`);
    console.log(`   Slides:   ${slides.rows[0].count}`);
    console.log('────────────────────────────────────────');

    // Listar tours como verificación rápida
    const tourList = await client.query('SELECT title, destination, operator_id FROM "public"."tours" ORDER BY created_at');
    console.log('\n🗺️  Tours sembrados:');
    tourList.rows.forEach((t, i) => console.log(`   ${i + 1}. ${t.title} (${t.destination})`));

  } catch (err) {
    console.error('❌ Error ejecutando seed:', err.message);
    if (err.message.includes('ECONNREFUSED') || err.message.includes('connect')) {
      console.error('\n   Asegúrate de que el emulador de Data Connect esté corriendo:');
      console.error('   firebase emulators:start --only dataconnect');
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
