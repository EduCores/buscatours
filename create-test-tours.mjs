import pg from 'pg';

const DATABASE_URL = 'postgresql://postgres@127.0.0.1:5433/buscatours-e0816-database';
const client = new pg.Client({ connectionString: DATABASE_URL, ssl: false });

const testTours = [
  {
    title: "Tour de Prueba 1",
    location: "Lima, Peru",
    duration: "1 Day",
    duration_hours: 12,
    original_price: 200,
    price: 150,
    discount: "10% Off",
    rating: 4.5,
    reviews_count: 10,
    category: "Cultural",
    description: "Tour de prueba para verificar funcionamiento del sistema.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    featured: false,
    one_day: true,
    popular: false,
    status: "PUBLISHED",
    destination: "Peru",
    vibe_adrenaline: 50,
    vibe_relax: 40,
    vibe_culture: 60,
    vibe_family: 50,
    lat: -12.0464,
    lng: -77.0428
  },
  {
    title: "Tour de Prueba 2 - Aventura",
    location: "Quito, Ecuador",
    duration: "1 Day",
    duration_hours: 10,
    original_price: 180,
    price: 140,
    discount: null,
    rating: 4.7,
    reviews_count: 8,
    category: "Aventura",
    description: "Recorrido de prueba para validar la funcionalidad de tours de aventura.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    featured: true,
    one_day: true,
    popular: true,
    status: "PUBLISHED",
    destination: "Ecuador",
    vibe_adrenaline: 70,
    vibe_relax: 30,
    vibe_culture: 50,
    vibe_family: 40,
    lat: -0.1807,
    lng: -78.4678
  }
];

async function createTestTours() {
  await client.connect();

  for (const tour of testTours) {
    const result = await client.query(
      `INSERT INTO "public"."tours" (
        "title", "location", "duration", "duration_hours", "original_price", "price",
        "discount", "rating", "reviews_count", "category", "description", "image",
        "featured", "one_day", "popular", "status", "destination",
        "vibe_adrenaline", "vibe_relax", "vibe_culture", "vibe_family",
        "lat", "lng", "operator_id", "created_at", "updated_at"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, NOW(), NOW())
      RETURNING id, title`,
      [
        tour.title, tour.location, tour.duration, tour.duration_hours,
        tour.original_price, tour.price, tour.discount, tour.rating,
        tour.reviews_count, tour.category, tour.description, tour.image,
        tour.featured, tour.one_day, tour.popular, tour.status, tour.destination,
        tour.vibe_adrenaline, tour.vibe_relax, tour.vibe_culture,
        tour.vibe_family, tour.lat, tour.lng, 'a1b2c3d4-0002-4000-8000-000000000002'
      ]
    );
    console.log(`? Creado: ${result.rows[0].title} (ID: ${result.rows[0].id})`);
  }

  console.log('\n? Tours de prueba creados');
  await client.end();
}

createTestTours().catch(console.error);
