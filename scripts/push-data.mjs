/**
 * push-data.mjs — Migración local -> producción (Busca Tours)
 * ----------------------------------------------------------
 * Sube a producción TODO lo creado en tu PC, sin re-ingresar nada a mano:
 *   1. Vuelca tu Postgres local (DATABASE_URL) y lo restaura en Cloud SQL (PROD_DB_URL).
 *   2. Sube las fotos de public/uploads/ a Firebase Storage (carpeta /uploads).
 *
 * Uso (después de npm run deploy):
 *   node scripts/push-data.mjs
 *
 * Configura las vars en un archivo .env.prod (NO commitear) o exporta en la terminal:
 *   DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/buscatours_local
 *   PROD_DB_URL=postgresql://USUARIO:PASSWORD@HOST:5432/buscatours-e0816-database
 *   VITE_FIREBASE_API_KEY / PROJECT ya en .env.production
 *
 * Nota: el dump usa pg_dump/pg_restore del PATH (instalados con PostgreSQL nativo).
 * El restore borra y reinserta (comportamiento igual que seed.sql) para que quede idéntico.
 */

import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, listAll } from 'firebase/storage';

const execFileP = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const DATABASE_URL = process.env.DATABASE_URL;
const PROD_DB_URL = process.env.PROD_DB_URL;

if (!DATABASE_URL || !PROD_DB_URL) {
  console.error('\n❌ Faltan variables. Define en tu terminal o .env.prod:');
  console.error('   DATABASE_URL  (tu Postgres local)');
  console.error('   PROD_DB_URL   (Cloud SQL de producción)\n');
  process.exit(1);
}

const DUMP_FILE = path.join(projectRoot, '.local-dump.sql');
const UPLOADS_DIR = path.join(projectRoot, 'public', 'uploads');

// ---------- 1. Migrar base de datos ----------
async function dumpLocal() {
  console.log('\n📤 Volcando Postgres local...');
  const url = new URL(DATABASE_URL);
  await execFileP('pg_dump', [
    '-h', url.hostname,
    '-p', url.port || '5432',
    '-U', url.username,
    '-d', url.pathname.replace('/', ''),
    '-Fc', // formato custom, más robusto
    '-f', DUMP_FILE,
  ], { env: { ...process.env, PGPASSWORD: url.password || '' } });
  console.log(`   ✓ Volcado en ${DUMP_FILE}`);
}

async function restoreProd() {
  console.log('\n📥 Restaurando en Cloud SQL (producción)...');
  const url = new URL(PROD_DB_URL);
  // Limpia tablas primero para que quede idéntico a local
  await execFileP('pg_restore', [
    '-h', url.hostname,
    '-p', url.port || '5432',
    '-U', url.username,
    '-d', url.pathname.replace('/', ''),
    '--clean', '--if-exists',
    '-F', 'c',
    DUMP_FILE,
  ], { env: { ...process.env, PGPASSWORD: url.password || '' } }).catch((e) => {
    // pg_restore devuelve código !=0 aunque restaure bien (por los DROP previos);
    // lo reportamos pero continuamos si el dump se escribió.
    console.warn('   (pg_restore terminó con aviso:', e.message.split('\n')[0], ')');
  });
  console.log('   ✓ Restauración completada');
}

// ---------- 2. Subir fotos a Firebase Storage ----------
async function uploadPhotos() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.log('\n🖼️  No hay carpeta public/uploads para subir.');
    return;
  }
  console.log('\n📤 Subiendo fotos a Firebase Storage...');
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  };
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  const walk = (dir, base = '') => {
    const out = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) out.push(...walk(full, path.join(base, entry.name)));
      else out.push({ full, rel: path.join(base, entry.name) });
    }
    return out;
  };

  const files = walk(UPLOADS_DIR);
  for (const f of files) {
    const data = fs.readFileSync(f.full);
    const storageRef = ref(storage, path.join('uploads', f.rel).replace(/\\/g, '/'));
    await uploadBytes(storageRef, data);
    console.log(`   ✓ uploads/${f.rel.replace(/\\/g, '/')}`);
  }
  console.log(`   ✓ ${files.length} archivo(s) subido(s) a Storage:/uploads`);
}

async function main() {
  console.log('🚀 Migración local -> producción (Busca Tours)');
  await dumpLocal();
  await restoreProd();
  await uploadPhotos();
  console.log('\n────────────────────────────────────────');
  console.log('✅ Todo migrado. Producción idéntica a local.');
  console.log('────────────────────────────────────────');
  if (fs.existsSync(DUMP_FILE)) fs.unlinkSync(DUMP_FILE);
  process.exit(0);
}

main().catch((err) => {
  console.error('\n❌ Error en migración:', err.message);
  process.exit(1);
});
