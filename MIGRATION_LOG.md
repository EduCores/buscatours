# MIGRATION LOG - Neon + GraphQL → Firebase Data Connect

## ✅ FASES COMPLETADAS

### Fase 1: Setup y Configuración
- [x] firebase.json actualizado (dataconnect + functions)
- [x] .firebaserc creado
- [x] .env.local creado
- [x] .gitignore actualizado
- [x] package.json scripts unificados

### Fase 2: Schema Data Connect
- [x] dataconnect/schema.graphql (modelos + enums + inputs)
- [x] dataconnect/queries/tours.graphql
- [x] dataconnect/queries/bookings.graphql
- [x] dataconnect/queries/users.graphql
- [x] dataconnect/queries/destinations.graphql
- [x] dataconnect/queries/slider.graphql
- [x] dataconnect/mutations/tours.graphql
- [x] dataconnect/mutations/bookings.graphql
- [x] dataconnect/mutations/users.graphql
- [x] dataconnect/mutations/ai.graphql
- [x] dataconnect/mutations/slider.graphql

### Fase 3: Cloud Functions (Gen 2, TypeScript)
- [x] functions/package.json
- [x] functions/tsconfig.json
- [x] functions/src/utils/gemini.ts
- [x] functions/src/utils/firestore.ts
- [x] functions/src/utils/errors.ts
- [x] functions/src/ai/recommendTours.ts
- [x] functions/src/ai/generateTour.ts
- [x] functions/src/ai/searchTours.ts
- [x] functions/src/bookings/createBooking.ts
- [x] functions/src/bookings/updateBooking.ts
- [x] functions/src/bookings/splitPayment.ts
- [x] functions/src/tours/tourValidation.ts
- [x] functions/src/tours/tourHelpers.ts
- [x] functions/src/users/userManagement.ts
- [x] functions/src/index.ts
- [x] functions/scripts/seed.ts
- [x] functions/scripts/import-dataconnect.ts

### Fase 4: Frontend Integration
- [x] src/services/firebaseAuth.ts
- [x] src/services/dataService.ts (API compatible)
- [x] src/hooks/useTours.ts
- [x] src/hooks/useBookings.ts
- [x] src/hooks/useAuth.ts
- [x] src/hooks/useAI.ts
- [x] src/hooks/useAdmin.ts

### Fase 5: Migración Datos
- [x] backend/scripts/export-neon.js

## 📋 PRÓXIMOS PASOS (EJECUTAR EN ORDEN)

### 1. Configurar Firebase Project
\\\ash
firebase login
firebase use --add  # Seleccionar proyecto Pro
\\\

### 2. Habilitar Data Connect en Console
- Firebase Console > Project Settings > Data Connect > Get started
- Región: us-central1
- Servicio: buscatours

### 3. Deploy Data Connect Schema
\\\ash
firebase deploy --only dataconnect
\\\

### 4. Deploy Functions
\\\ash
cd functions && npm install && npm run build
cd .. && firebase deploy --only functions
\\\

### 5. Instalar dependencias Frontend y Deploy
\\\ash
npm install
npm run build
firebase deploy --only hosting
\\\

### 6. Migración de Datos (CUT-OVER)
\\\ash
# Exportar de Neon/SQLite actual
cd backend && node scripts/export-neon.js

# Importar a Data Connect
cd ../functions && npm run db:import
\\\

### 7. Testing E2E
\\\ash
# Local con emuladores
firebase emulators:start --only dataconnect,functions,auth,hosting

# Prod
# Verificar checklist abajo
\\\

## ✅ CHECKLIST VALIDACIÓN PRODUCCIÓN

- [ ] \irebase deploy\ completa sin errores
- [ ] Data Connect schema activo en consola
- [ ] 6+ Cloud Functions deployadas y respondiendo
- [ ] Frontend carga tours, bookings, users sin errores
- [ ] Auth Firebase funciona (login, roles, currentUser)
- [ ] IA: \ecommendTours\ y \generateTourWithAI\ responden < 3s
- [ ] Booking atómico: 2 users mismo tour → 1 success, 1 conflict
- [ ] AdminPanel: CRUD tours, bookings, slider funcionan
- [ ] Datos migrados: 12 tours, 7 users, 3 slides visibles
- [ ] Performance: queries < 300ms (p95)
- [ ] Zero console errors en frontend
- [ ] \
pm run deploy\ = deploy completo en un comando

## 🔄 ROLLBACK PLAN

Si hay problemas críticos:
1. \git checkout legacy/neon-graphql-prisma\ (rama fallback)
2. \cd backend && npm run dev\ (backend original)
3. Frontend usa \VITE_GRAPHQL_ENDPOINT=http://localhost:4000/graphql\

## 📝 NOTAS IMPORTANTES

- Región Data Connect: us-central1 (Vertex AI cerca)
- Custom claims: configurados en \unctions/src/users/userManagement.ts\ (onCreateUser)
- Fallback IA: si Gemini falla, retorna tours featured
- Booking: transacciones atómicas con validación de capacidad
- Auth: Firebase Auth nativo + custom claims para roles
