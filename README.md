# Buscao Tours — modern-app

Plataforma de marketplace de tours (B2B/B2C) en Latinoamérica. Frontend en React + Vite con
Firebase (Auth, Data Connect / PostgreSQL, Cloud Functions con Gemini).

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19, Vite 8, Tailwind 4, TypeScript |
| Estado / datos | React Query + Firebase Data Connect (PostgreSQL) |
| Auth | Firebase Auth |
| Backend serverless | Firebase Cloud Functions (Node 20) + Gemini (Vertex AI) |
| Mapas | Leaflet / react-leaflet |
| i18n | `LanguageContext` propio + `src/data/translations.js` |
| Despliegue | Firebase Hosting + Data Connect + Functions |

## Requisitos

- Node 18+ y npm
- Firebase CLI: `npm i -g firebase-tools`
- (Local) Java 17+ para los emuladores de Firebase
- Un proyecto Firebase con Data Connect, Authentication y Functions habilitados

## Configuración de entorno

El proyecto usa dos archivos de variables (ambos en `.gitignore`, nunca se commitean):

- `.env.local` — desarrollo local. `VITE_USE_EMULATORS=true` (apunta a emuladores).
- `.env.production` — build de producción. `VITE_USE_EMULATORS=false` (apunta a Firebase real).

Copia las plantillas y completa los valores de tu proyecto:

```bash
# .env.local
VITE_FIREBASE_PROJECT_ID=buscatours-e0816
VITE_FIREBASE_AUTH_DOMAIN=buscatours-e0816.firebaseapp.com
VITE_FIREBASE_API_KEY=__TU_API_KEY__
VITE_FIREBASE_APP_ID=__TU_APP_ID__
VITE_USE_EMULATORS=true
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/buscatours?schema=public"
VITE_GEMINI_API_KEY=   # vacío: la IA se usa vía Cloud Functions, no desde el frontend
```

```bash
# .env.production  (igual que arriba pero...)
VITE_USE_EMULATORS=false
VITE_GEMINI_API_KEY=
```

> El `apiKey` de Firebase es público por diseño (la seguridad la da Auth + las reglas de
> Data Connect). No lo trates como secreto, pero sí asegúrate de que las reglas protejan los datos.

## Scripts

```bash
npm install                 # instala dependencias (raíz + functions + generados)
npm run dev                 # emuladores (auth, dataconnect, functions) + Vite en paralelo
npm run build               # build de functions + frontend
npm run build:frontend      # solo el build de Vite -> dist/
npm run deploy              # build + firebase deploy (hosting, dataconnect, functions)
npm run deploy:hosting      # solo hosting
npm run deploy:dataconnect  # solo el connector/schema de Data Connect
npm run deploy:functions    # solo Cloud Functions
npm run db:seed             # seed de la base (Data Connect SQL)
npm run lint                # ESLint
npm run scan                # escáner de bugs del proyecto
```

## Estructura

```
src/
  components/          UI pública (Header, HeroSlider, SearchBar, TourCard, TourDetailView, ...)
  components/admin/    Panel admin (tours, bookings, guías, vehículos, slider, dashboard, IA)
  context/AuthContext  Usuario/rol/operador actual (vía Firebase Auth + Data Connect)
  data/                Datos estáticos/i18n (translations.js, tours.js, users.js, socialPosts.js)
  i18n/LanguageContext  Contexto de idioma (ES/EN/PT)
  services/            dataService.ts (capa de datos), firebaseAuth.ts, mappers.ts (enums)
  dataconnect-generated/  SDK auto-generado — NO EDITAR A MANO
dataconnect/           schema.graphql + connector (queries.gql, mutations.gql) + seeds
functions/             Cloud Functions (IA: generateTour, searchTours, translate)
public/                assets estáticos y uploads (solo dev)
```

## Modelo de datos (Data Connect / PostgreSQL)

`User` (rol: PLATFORM_ADMIN / OPERATOR / TOUR_ADMIN / CUSTOMER), `Tour`, `Booking`,
`SliderSlide`, `Guide`, `Vehicle`, `PwaCheckin`. Las relaciones usan FKs a `User` vía
`operatorId` / `userId`.

## Seguridad (importante)

Las reglas de Data Connect están en `dataconnect/connector/mutations.gql` y `queries.gql`.

- Lecturas públicas: `GetTours`, `GetTour`, `GetActiveSliderSlides` (`@auth(level: PUBLIC)`).
- Escrituras protegidas: tours, bookings, guías, vehículos, slider y check-ins requieren
  usuario autenticado (`@auth(level: USER)`).
- `CreateUser` es `PUBLIC` (necesario para el signup) pero **siempre** crea el usuario con
  rol `CUSTOMER`. La escalada de privilegios (OPERATOR/ADMIN) solo debe hacerse desde una
  Cloud Function autenticada por un admin, nunca desde el cliente.
- El `userId` de una reserva se fija en el servidor (`dataService.addBooking` usa
  `auth.uid`); el cliente no puede reservar a nombre de otro.
- **No existe** `SetCurrentUser`: se eliminó porque permitía a cualquier usuario logueado
  pisar el registro de otro por id. El usuario actual se obtiene con `GetCurrentUser`
  (`user(key: { id_expr: "auth.uid" })`).
- En producción, `AuthContext` NO falla abierto a `platform-admin`: si no hay sesión, el
  usuario es `null` y la UI debe redirigir a login. El fallback a dev-user solo aplica con
  `VITE_USE_EMULATORS=true`.

## Uploads de imágenes

En desarrollo, `vite.config.js` tiene un middleware que escribe a `public/uploads`. **Eso no
funciona en Hosting (serverless).** En producción usa Firebase Storage para los uploads.

## i18n

`LanguageContext` expone `t("clave")` y `t.clave`. Los diccionarios están en
`src/data/translations.js`. Para escalar, conviene migrar a i18next con un archivo por idioma.

## Notas de deuda técnica conocida

- `App.jsx`, `TourDetailView.jsx` y `CheckoutModal.jsx` son componentes grandes ("Dios");
  se recomienda dividirlos en subcomponentes/hooks.
- `translations.js` y `data/tours.js` son datos estáticos; con la DB real activa gran parte
  es redundante.
- No hay suite de tests automatizada (hay un escáner `npm run scan` de bugs).

## Deploy

1. `firebase login` y `firebase use buscatours-e0816`.
2. `npm run build`
3. `npm run deploy`

El deploy de Data Connect regenera el SDK en `src/dataconnect-generated`.
