import { Client } from 'pg';
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/buscatours-e0816-database';
const client = new Client({ connectionString, ssl: false });

try {
  await client.connect();
  const result = await client.query(
    `INSERT INTO tours
      (title,location,duration,duration_hours,original_price,price,discount,rating,reviews_count,category,description,image,featured,one_day,popular,status,destination,vibe_adrenaline,vibe_relax,vibe_culture,vibe_family,lat,lng,operator_id,created_at,updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,NOW(),NOW())
     RETURNING id, title`,
    [
      'Tour de Prueba - Bariloche',
      'Bariloche, Argentina',
      '2 Days',
      16,
      220,
      180,
      '15% Off',
      4.8,
      12,
      'AVENTURA',
      'Tour de prueba para verificar persistencia en DB local.',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
      true,
      false,
      true,
      'PUBLISHED',
      'ARGENTINA',
      70,
      30,
      40,
      75,
      -41.1333,
      -71.3093,
      '22222222-2222-4222-8222-222222222222',
    ]
  );
  console.log('Created:', result.rows[0]);
} catch (err) {
  console.error(err);
  process.exit(1);
} finally {
  await client.end();
}
