import pg from 'pg';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ddl = readFileSync(resolve(__dirname, 'schema-local.sql'), 'utf-8');

const client = new pg.Client({
  connectionString: 'postgresql://postgres:postgres@127.0.0.1:5432/buscatours-e0816-database',
  ssl: false,
});

await client.connect();
console.log('Conectado. Aplicando esquema...');
await client.query(ddl);
console.log('Esquema aplicado.');

const r = await client.query(`
  SELECT e.enumlabel AS val
  FROM pg_type t JOIN pg_enum e ON e.enumtypid = t.oid
  WHERE t.typname = 'Category'
  ORDER BY e.enumsortorder;
`);
console.log('Category values:', r.rows.map(x => x.val).join(', '));

const t = await client.query(`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema='public' AND table_name IN ('users','tours','bookings','guides','vehicles','pwa_checkins','slider_slides')
  ORDER BY table_name;
`);
console.log('Tablas creadas:', t.rows.map(x => x.table_name).join(', '));

await client.end();
process.exit(0);
