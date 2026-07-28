# Busca Tours — Desarrollo local y subida a producción

Flujo pensado para crear TODO en tu PC (gratis, $0) y luego subirlo a producción
con un solo comando, sin re-ingresar nada a mano.

## 1. Base de datos local (Postgres, $0)

Elige UNA de estas dos formas (ambas dan el mismo resultado: un Postgres en
`127.0.0.1:5432`, base `buscatours_local`, usuario/clave `postgres`):

### A) Postgres nativo en Windows (recomendado, sin Docker)
Instala PostgreSQL 16 desde https://www.postgresql.org/download/windows/
y crea la base:
```sql
CREATE DATABASE buscatours_local;
```
pgAdmin (se instala con PostgreSQL) es tu "phpMyAdmin" para ver/editar datos.

### B) Docker
```powershell
docker compose up -d
```

`.env.local` ya apunta a `DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/buscatours_local`.

## 2. Levantar el sitio en local

```powershell
npm install
npm run dev
```
Esto corre el emulador de Firebase (auth, dataconnect, functions) + Vite en
http://localhost:5173. El frontend usa el emulador, así que NO se toca Cloud SQL
y no genera costo.

## 3. Poblar / crear tus datos reales

Opción 1 — sembrar datos de ejemplo (9 usuarios: admin, operadores, cliente;
13 tours; slides):
```powershell
npm run db:seed
```
Opción 2 — crear a mano desde la UI en http://localhost:5173 (operadores,
clientes, turistas, tours, fotos). Todo se guarda en tu Postgres local y
**persiste** aunque apagues la PC.

Para usar tus datos reales, edita `dataconnect/seed.sql` (bloques INSERT de
`users` y `tours`) y corre `npm run db:seed` de nuevo.

### Crear tus datos reales en lote (operadores, clientes/turistas, tours)
Si no quieres crear todo a mano en la UI, usa `scripts/seed-real.mjs`:
```powershell
# 1. Copia la plantilla y rellena con TUS datos reales
Copy-Item dataconnect/seed-real.example.json dataconnect/seed-real.json
#   edita seed-real.json: usuarios (operadores/clientes) y tours (operatorId = id del operador)
# 2. Inserta en el Postgres del emulador (idempotente: limpia y reinserta)
npm run db:seed:real
```
El JSON acepta `users` (id/email/name/role/description) y `tours` (todos los
campos del tour, con `operatorId` apuntando al id de un OPERATOR). Valida roles,
categorías y destinos antes de insertar.

## 4. Subir a producción (todo idéntico, sin re-ingresar nada)

Cuando esté listo:

```powershell
# 1. Define la conexión a tu Cloud SQL de producción (NO la commitees).
$env:PROD_DB_URL = "postgresql://USUARIO:PASSWORD@HOST:5432/buscatours-e0816-database"
# DATABASE_URL ya está en .env.local apuntando a tu local.

# 2. Sube código + migra datos + sube fotos a Storage:
npm run deploy:all
```

`deploy:all` hace:
1. `npm run build` + `firebase deploy` (hosting, dataconnect, functions).
2. `scripts/push-data.mjs`: vuelca tu Postgres local y lo restaura en Cloud SQL
   (`pg_dump` → `pg_restore --clean`), y sube `public/uploads/*` a Firebase
   Storage (`/uploads`).

Resultado: producción queda **idéntica** a tu local. No re-subes nada a mano.

## Notas
- El emulador de Firebase es gratis. El único servicio que cobra es Cloud SQL en
  producción, y solo cuando migras/usas en vivo.
- `push-data.mjs` borra y reinserta (igual que seed.sql) para que producción
  quede exacta a local.
- No commitees `.env.local` ni el valor de `PROD_DB_URL`.
