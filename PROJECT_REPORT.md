# Informe de Estado del Proyecto — BuscaTours (modern-app)

Fecha: 2026-07-07
Stack: React 19 + Vite + Firebase (Auth, Data Connect, Cloud Functions Gen2) + Vertex AI (Gemini)

---

## 1. Resumen ejecutivo

El frontend está **muy avanzado** (todas las vistas y componentes implementados, sin stubs
visuales). La capa de datos (Data Connect) está bien definida y coincide con lo que consume el
frontend. Sin embargo, **faltan piezas críticas de backend, integración y configuración** para
llegar a producción:

- Backend de funciones solo tiene 2 de ~12 funciones esperadas.
- No hay integración real de pagos ni de búsqueda IA.
- El SDK generado está desactualizado frente al schema.
- Faltan variables de entorno y scripts de seed no están cableados.
- Hay código muerto y un error de lint que rompe.

---

## 2. Bloqueantes / Críticos (P0)

### 2.1 Error de lint (rompe calidad, no el build)
- `src/components/admin/ToursManagement.tsx:69` — array de dependencias inválido en `useMemo`
  (`['price', originalPrice]` con `price` literal). Genera 1 error ESLint.
  - Acción: corregir a `[price, originalPrice]`.

### 2.2 SDK generado desactualizado
- `src/dataconnect-generated` tiene `TourStatus = { DRAFT, PUBLISHED, ARCHIVED }` pero
  `dataconnect/schema.graphql` define también `PENDING`. El SDK necesita regenerarse.
  - Acción: `firebase dataconnect generate-sdk` (o redeploy Data Connect).
- Además, `dataService.ts` lee propiedades que el SDK no devuelve:
  - `:757` lee `result.data?.offlineCheckin_insert` → debería ser `pwaCheckin_insert`.
  - `:795` lee `result.data?.deleteSliderSlide` → debería ser `sliderSlide_delete`.
  - Estas mutaciones devuelven `undefined`/null en runtime (bug lógico).

### 2.3 Variables de entorno faltantes
- `DATABASE_URL` no existe en `.env` / `.env.local` / `.env.production`, pero
  `schema.graphql` declara `url = env("DATABASE_URL")` como datasource de Cloud SQL.
  Sin esto el emulador/servicio de Data Connect no puede conectar a Postgres.
- `VITE_GEMINI_API_KEY` está vacío en `.env.local` (inofensivo: la IA usa Cloud Function, pero
  conviene limpiarlo).

### 2.4 Migración de datos no ejecutable
- `MIGRATION_LOG.md` indica exportar de Neon vía `backend/scripts/export-neon.js`, pero
  **`backend/` está vacío** (solo `node_modules`, sin código fuente) y no existe `export-neon.js`.
  El cut-over de datos no se puede realizar con el estado actual.
- Scripts de seed (`functions/scripts/*.mjs`):
  - `seed-dataconnect-sql.mjs` usa `pg` pero **`pg` no está en `functions/package.json`**.
  - Ninguno de los dos está cableado en `package.json` scripts (no hay `db:seed` real funcional).

### 2.5 Type mismatch en mutations
- En `dataconnect/connector/mutations.gql`, `operatorId`/`userId` se declaran `String` pero el
  schema los define como `UUID!`. Debe verificarse/coincidir (FDC puede coercer, pero es inconsistente).

---

## 3. Funcionalidades incompletas (P1)

### 3.1 Backend / Cloud Functions
Solo existen 2 funciones (`functions/src/index.ts` exporta `generateTourWithAI` y `searchTours`):
- ✅ `generateTourWithAI` — implementada (devuelve tour sheet vía Gemini, no persiste).
- ⚠️ `searchTours` — implementada pero **devuelve IDs alucinados por Gemini**, no hace lookup real
  en Data Connect. No es búsqueda IA real.
- ❌ `recommendTours` — **no existe** (el MIGRATION_LOG la lista como requerida).
- ❌ `bookings/*`, `tours/*`, `users/*` callable functions — **no implementadas** (el CRUD vive
  solo en Data Connect, invocado directo desde el frontend). Esto es válido, pero implica que la
  lógica de `errors.ts` (`BOOKING_CONFLICT`, `USER_NOT_FOUND`, etc.) es código muerto de funciones
  que nunca se construyeron.

### 3.2 Roles de admin simulados
- `AdminPanel.tsx:81` inicializa `currentRole = 'Platform Admin'` y trae un switcher de rol en UI.
  `App.jsx` no propaga el rol real del usuario (custom claims de Firebase).
  - Riesgo: cualquiera que llegue a `#admin` obtiene acceso total de Platform Admin (solo `customer`
    está bloqueado).
- Inconsistencia de taxonomía de roles: admin usa Title Case (`'Platform Admin'`) vs el resto
  usa kebab (`'platform-admin'`). `AuthContext.tsx:56` hace cast inseguro `as UserRole`.

### 3.3 Pagos simulados
- `CheckoutModal.jsx` y `SplitPaymentGate` recolectan datos de tarjeta/Webpay/MercadoPago pero
  **nunca llaman a ningún gateway**. `onBookingSuccess` solo es local. No hay Stripe/Webpay/Mercado
  Pago/PayPal integrado.

### 3.4 Búsqueda IA / vibe scoring
- Modo `"ai"` en `App.jsx` es solo filtrado de texto (no llama IA).
- `useAI.ts:10` `useSearchTours` es un stub (`Promise.resolve([])`), y el hook completo `useAI` no
  está cableado en ningún lado.
- Mapeo de vibe scores: datos semilla usan `vibeAdrenaline/vibeRelax/...` pero `dataService.getTours`
  (`:302-324`) no renombra `vibeScores` del DB a esos campos → con datos reales quedarían en 50.

---

## 4. Código muerto / Limpieza (P2)

- **`src/hooks/*` completo (5 hooks)** — `useAdmin, useBookings, useTours, useAuth, useAI` están
  implementados pero **nunca importados** en ningún lado (el app usa `context/AuthContext` y
  `dataService` directo). `useAuth.ts` es duplicado de `AuthContext.tsx`.
- **`src/components/Activities.jsx`** y **`src/components/Testimonials.jsx`** — no se importan
  (el home usa datos inline / `SocialProofFeed`).
- **`src/components/admin/ToursManagement.tsx.bak`** — archivo backup, eliminar.
- **`functions/src/utils/errors.ts`** — helpers para funciones inexistentes (código muerto).
- Métodos de `dataService` no usados: `getDestinations`, `getActivities`, `deleteBooking`,
  `deleteSliderSlide`.
- `lucide-react` está fijado a `^1.21.0` (raro para esta librería, normalmente 0.x). Verificar que
  resuelva en `npm install` limpio.
- `@tanstack/react-query` está instalado pero no se usa (los hooks que lo usaban están muertos);
  el SDK generado declara peer `@tanstack-query-firebase/react` que tampoco está instalado.
- `README.md` es el template por defecto de Vite (no documenta el proyecto real).
- `backend/` legacy es un stub vacío → eliminar o documentar como deprecado.

---

## 5. Datos / Seed (contexto)

- Datos mock en `dataService.ts` (`MOCK_TOURS/BOOKINGS/...`) usados como fallback en 401 — aceptable
  para dev, pero el seed real (12 tours, 7 users, 3 slides) depende de los scripts de seed que hoy
  no están cableados (ver 2.4).

---

## 6. Checklist de producción (de MIGRATION_LOG.md) — pendientes

- [ ] `firebase deploy` completo sin errores
- [ ] Data Connect schema activo en consola
- [ ] 6+ Cloud Functions deployadas (hoy solo 2 existen)
- [ ] Auth Firebase con roles reales propagados al AdminPanel
- [ ] IA `recommendTours` y `generateTourWithAI` responden < 3s
- [ ] Booking atómico (validación de capacidad / conflict) — hoy solo en Data Connect, sin capa de
      función que lo garantice con los errores definidos
- [ ] AdminPanel CRUD tours/bookings/slider funcionando
- [ ] Datos migrados (12 tours, 7 users, 3 slides)
- [ ] Performance queries < 300ms p95
- [ ] Zero console errors
- [ ] `npm run deploy` = deploy completo en un comando

---

## 7. Plan recomendado (orden)

1. **Corregir bloqueantes P0**: arreglar lint error, regenerar SDK, añadir `DATABASE_URL`,
   corregir los 2 reads en `dataService.ts`, definir/fijar scripts de seed (añadir `pg`).
2. **Backend mínimo viable**: implementar `recommendTours` y convertir `searchTours` para que haga
   lookup real en Data Connect (usar `GetTours` + filtrar por resultados de Gemini).
3. **Seguridad de admin**: propagar custom claims de rol desde `AuthContext`/`App.jsx` al
   `AdminPanel` y eliminar el switcher simulado. Unificar taxonomía de roles.
4. **Pagos**: decidir gateway (Webpay/MercadoPago/Stripe) e integrar backend + frontend.
5. **Migración de datos**: crear/recuperar script de export y cablear `db:seed` funcional.
6. **Limpieza**: eliminar hooks muertos, componentes huérfanos, `.bak`, y actualizar `README.md`.
7. **Deploy + validación**: ejecutar checklist de producción.

---

## 8. Métricas rápidas

- Lint: **1 error**, 6 warnings (corregible en minutos).
- Funciones Cloud implementadas: **2 / ~12 esperadas**.
- Hooks del frontend cableados: **0 / 5** (todos muertos).
- Vistas (hash routes): **5/5 implementadas**.
- Operaciones Data Connect referenciadas por frontend: **100% presentes**.
- SDK generado vs schema: **desincronizado** (falta `TourStatus.PENDING`).
