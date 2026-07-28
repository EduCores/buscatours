import { Client } from 'pg';
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/buscatours-e0816-database';
const client = new Client({ connectionString, ssl: false });

try {
  await client.connect();
  await client.query("DELETE FROM users WHERE email = 'ventas@tuoperador.com'");
  console.log('Removed ventas@tuoperador.com');
} catch (err) {
  console.error(err);
  process.exit(1);
} finally {
  await client.end();
}
