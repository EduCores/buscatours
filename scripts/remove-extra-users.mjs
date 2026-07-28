import { Client } from 'pg';
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/buscatours-e0816-database';
const client = new Client({ connectionString, ssl: false });

const REMOVE = [
  'clienta@clientareal.com',
  'cliente@clientereal.com',
];

try {
  await client.connect();
  for (const email of REMOVE) {
    await client.query('DELETE FROM users WHERE email = $1', [email]);
    console.log(`Removed ${email}`);
  }
} catch (err) {
  console.error(err);
  process.exit(1);
} finally {
  await client.end();
}
