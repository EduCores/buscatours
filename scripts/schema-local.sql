-- =====================================================================
-- Schema local para BuscaTours (Postgres nativo en 127.0.0.1:5432)
-- Generado para coincidir con dataconnect/schema.graphql.
-- Incluye el enum Category con NAVEGACION.
-- Idempotente: CREATE TABLE IF NOT EXISTS / CREATE TYPE IF NOT EXISTS.
-- =====================================================================

-- ---------- Enums ----------
DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('PLATFORM_ADMIN','OPERATOR','TOUR_ADMIN','CUSTOMER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "TourStatus" AS ENUM ('DRAFT','PENDING','PUBLISHED','ARCHIVED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "BookingStatus" AS ENUM ('PENDING','CONFIRMED','CANCELLED','COMPLETED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "GuideStatus" AS ENUM ('DISPONIBLE','EN_TOUR','OFFLINE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "VehicleStatus" AS ENUM ('DISPONIBLE','EN_USO','OFFLINE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "CheckinStatus" AS ENUM ('PENDING','SYNCED','PENDIENTE_SYNC');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "Category" AS ENUM (
    'OUTDOOR','RELAXACION','FERIADO','TEMPORADA','SALVAJE','AVENTURA',
    'TEMATICO','CULTURAL','CIUDAD','MONTANA','GLACIAR','LUJO','HISTORICO',
    'FAMILIAR','SELVA','FULLDAY','NAVEGACION'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "Destination" AS ENUM (
    'ARGENTINA','PERU','BOLIVIA','BRAZIL','COLOMBIA','ECUADOR','CHILE',
    'MEXICO','DOMINICAN_REPUBLIC'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ---------- Users ----------
CREATE TABLE IF NOT EXISTS "public"."users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
  "description" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Tours ----------
CREATE TABLE IF NOT EXISTS "public"."tours" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "duration" TEXT NOT NULL,
  "duration_hours" INT NOT NULL,
  "original_price" FLOAT NOT NULL,
  "price" FLOAT NOT NULL,
  "discount" TEXT,
  "rating" FLOAT NOT NULL DEFAULT 0,
  "reviews_count" INT NOT NULL DEFAULT 0,
  "category" "Category" NOT NULL,
  "description" TEXT NOT NULL,
  "image" TEXT NOT NULL,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "one_day" BOOLEAN NOT NULL DEFAULT true,
  "popular" BOOLEAN NOT NULL DEFAULT false,
  "status" "TourStatus" NOT NULL DEFAULT 'PUBLISHED',
  "destination" "Destination" NOT NULL,
  "vibe_adrenaline" INT NOT NULL DEFAULT 50,
  "vibe_relax" INT NOT NULL DEFAULT 50,
  "vibe_culture" INT NOT NULL DEFAULT 50,
  "vibe_family" INT NOT NULL DEFAULT 50,
  "lat" FLOAT,
  "lng" FLOAT,
  "hero_images" TEXT,
  "hero_background_position" TEXT,
  "translations" TEXT,
  "operator_id" UUID NOT NULL REFERENCES "public"."users"("id"),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Bookings ----------
CREATE TABLE IF NOT EXISTS "public"."bookings" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "booking_id" TEXT NOT NULL UNIQUE,
  "tour_id" UUID NOT NULL REFERENCES "public"."tours"("id"),
  "user_id" UUID NOT NULL REFERENCES "public"."users"("id"),
  "guests" INT NOT NULL,
  "date" TIMESTAMPTZ NOT NULL,
  "total_price" FLOAT NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
  "addons" JSONB,
  "special_requests" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Guides ----------
CREATE TABLE IF NOT EXISTS "public"."guides" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "specialty" TEXT NOT NULL,
  "status" "GuideStatus" NOT NULL DEFAULT 'DISPONIBLE',
  "operator_id" UUID NOT NULL REFERENCES "public"."users"("id"),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Vehicles ----------
CREATE TABLE IF NOT EXISTS "public"."vehicles" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "seats" INT NOT NULL,
  "status" "VehicleStatus" NOT NULL DEFAULT 'DISPONIBLE',
  "operator_id" UUID NOT NULL REFERENCES "public"."users"("id"),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- PWA Checkins ----------
CREATE TABLE IF NOT EXISTS "public"."pwa_checkins" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tour_id" UUID REFERENCES "public"."tours"("id"),
  "booking_id" UUID REFERENCES "public"."bookings"("id"),
  "is_offline" BOOLEAN,
  "status" "CheckinStatus" NOT NULL DEFAULT 'PENDING',
  "timestamp" TIMESTAMPTZ NOT NULL,
  "tour_title" TEXT,
  "customer_name" TEXT,
  "operator" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Slider Slides ----------
CREATE TABLE IF NOT EXISTS "public"."slider_slides" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "subtitle" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "button_text" TEXT NOT NULL,
  "image" TEXT NOT NULL,
  "link" TEXT NOT NULL,
  "translations" TEXT,
  "order" INT NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indices utiles
CREATE INDEX IF NOT EXISTS "idx_tours_operator" ON "public"."tours"("operator_id");
CREATE INDEX IF NOT EXISTS "idx_bookings_tour" ON "public"."bookings"("tour_id");
CREATE INDEX IF NOT EXISTS "idx_bookings_user" ON "public"."bookings"("user_id");
