import { Client } from 'pg';
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/buscatours-e0816-database';
const client = new Client({ connectionString, ssl: false });

try {
  await client.connect();
  const result = await client.query("SELECT id, email, name, role FROM users WHERE role='PLATFORM_ADMIN'");
  console.log(JSON.stringify(result.rows, null, 2));
} catch (err) {
  console.error(err);
  process.exit(1);
} finally {
  await client.end();
}
