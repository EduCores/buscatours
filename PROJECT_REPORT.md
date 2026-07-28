# 🚨 INFORME DE ERRORES Y PROBLEMAS — BuscaTours

> **Fecha:** 28/07/2026
> **Propósito:** Lista detallada de todos los problemas encontrados para corregir antes de poblar datos reales y subir a producción.

---

## 🔴 PROBLEMAS CRÍTICOS (Deben corregirse antes de continuar)

### 1. Runtime mismatch — Node version

**Archivos involucrados:**
- `functions/package.json` → línea 29: `"node": "22"`
- `firebase.json` → línea 39: `"runtime": "nodejs20"`

**Problema:** Firebase Functions NO soporta Node 22 actualmente. El package.json pide Node 22 pero firebase.json configura Node 20.

**Solución:** Cambiar `functions/package.json` línea 29 de `"node": "22"` a `"node": "20"`.

---

### 2. Mutations.gql no incluye campos profesionales del schema

**Archivo:** `dataconnect/connector/mutations.gql`

**Problema:** Las mutations `CreateTour` y `UpdateTour` NO aceptan estos campos que están definidos en `schema.graphql`:

| Campo | Tipo | ¿En mutation? |
|-------|------|:---:|
| `availableDates` | JSON | ❌ |
| `itinerary` | JSON | ❌ |
| `minAge` | Int | ❌ |
| `maxPassengers` | Int | ❌ |
| `trailerUrl` | String | ❌ |
| `galleryImages` | JSON | ❌ |
| `mapCenterLat` | Float | ❌ |
| `mapCenterLng` | Float | ❌ |
| `mapZoom` | Int | ❌ |
| `difficulty` | Difficulty | ❌ |
| `seasonality` | JSON | ❌ |
| `includes` | JSON | ❌ |
| `excludes` | JSON | ❌ |
| `requirements` | JSON | ❌ |
| `pickupInfo` | String | ❌ |
| `cancellationPolicy` | String | ❌ |
| `languages` | JSON | ❌ |
| `groupType` | GroupType | ❌ |

**Impacto:** Cuando guardas un tour desde el panel admin, estos campos se envían pero el mutation los ignora. Los datos se pierden.

**Solución:** Agregar todos estos campos como parámetros opcionales en `CreateTour` y `UpdateTour` en `mutations.gql`.

---

### 3. Queries.gql no retorna campos profesionales

**Archivo:** `dataconnect/connector/queries.gql`

**Problema:** `GetTours` (línea 1-34) y `GetTour` (línea 36-69) no solicitan los campos profesionales. Cuando el frontend carga los tours, estos campos vienen vacíos.

**Campos faltantes en ambas queries:**
- `durationDays`
- `shortDescription`
- `availableDates`
- `itinerary`
- `minAge`
- `maxPassengers`
- `trailerUrl`
- `galleryImages`
- `mapCenterLat`
- `mapCenterLng`
- `mapZoom`
- `difficulty`
- `seasonality`
- `includes`
- `excludes`
- `requirements`
- `pickupInfo`
- `cancellationPolicy`
- `languages`
- `groupType`

**Solución:** Agregar todos estos campos a las queries `GetTours` y `GetTour`.

---

### 4. dataService.ts envía campos que el mutation no acepta

**Archivo:** `src/services/dataService.ts`

**Problema:** En el método `saveTour()` (líneas 386-503), el código serializa a JSON y envía campos como `itinerary`, `minAge`, `maxPassengers`, `difficulty`, `seasonality`, `includes`, `excludes`, `requirements`, `pickupInfo`, `cancellationPrice`, `languages`, `groupType`, `galleryImages`, `mapCenterLat`, `mapCenterLng`, `mapZoom`, `trailerUrl`, `availableDates`. Pero el mutation GQL no los recibe, por lo que Firebase Data Connect lanzará un error de validación o ignorará silenciosamente estos campos.

**Solución:** Esto se resuelve automáticamente cuando se corrija el punto #2 (mutations.gql).

---

### 5. seed-real.json tiene datos placeholder

**Archivo:** `dataconnect/seed-real.json`

**Problema:** Contiene datos de ejemplo no reales:
- 1 operador placeholder: `ventas@tuoperador.com` / "Tu Operador Real S.A.C."
- 2 clientes placeholder
- 1 tour de ejemplo genérico

**Solución:** Reemplazar con tus datos reales de operadores, clientes y tours. Luego ejecutar:
```
node scripts/seed-real.mjs
```

---

## 🟠 PROBLEMAS IMPORTANTES

### 6. Categorías inconsistentes entre frontend y schema

**Archivos:** `src/data/tours.js` vs `dataconnect/schema.graphql`

**Problema:** El frontend usa nombres en español para categorías (e.g. "Relaxación", "Familiar", "Full Day") pero el schema usa `RELAXACION`, `FAMILIAR`, `FULLDAY`. El mapper `mappers.ts` hace la conversión, pero algunas categorías en `activitiesData` (líneas 559-576 de tours.js) no tienen对应 en el schema:

| activitiesData | ¿En schema? |
|----------------|:-----------:|
| Outdoor | ✅ OUTDOOR |
| Relaxación | ✅ RELAXACION |
| Feriado | ✅ FERIADO |
| Temporada | ✅ TEMPORADA |
| Salvaje | ✅ SALVAJE |
| Aventura | ✅ AVENTURA |
| Temático | ✅ TEMATICO |
| Cultural | ✅ CULTURAL |
| Ciudad | ✅ CIUDAD |
| Montaña | ✅ MONTANA |
| Glaciar | ✅ GLACIAR |
| Lujo | ✅ LUJO |
| Histórico | ✅ HISTORICO |
| Familiar | ✅ FAMILIAR |
| Selva | ✅ SELVA |
| Full Day | ✅ FULLDAY |
| **Navegación** | ✅ NAVEGACION |

**Verificar:** Que `mapCategoryToDb` en `mappers.ts` tenga todas las categorías correctamente mapeadas.

---

### 7. Destinos limitados en el schema

**Archivo:** `dataconnect/schema.graphql` (líneas 69-79)

**Problema:** El enum `Destination` solo incluye 9 países:
```
ARGENTINA, PERU, BOLIVIA, BRAZIL, COLOMBIA, ECUADOR, CHILE, MEXICO, DOMINICAN_REPUBLIC
```

Pero `destinationsData` en `src/data/tours.js` tiene **17 destinos**, incluyendo:
- Guatemala ❌
- Costa Rica ❌
- Panamá ❌
- Cuba ❌
- Belice ❌
- El Salvador ❌
- Honduras ❌
- Nicaragua ❌
- Haití ❌

**Impacto:** Si creas tours para esos países, el schema no los aceptará.

**Solución:** Agregar los países faltantes al enum `Destination` en `schema.graphql`.

---

### 8. Mock tours en dataService.ts tienen estructura diferente

**Archivo:** `src/services/dataService.ts` (líneas 170-255)

**Problema:** Los 3 tours mock usan `vibeScores` (objeto con `adrenalina`, `relax`, `cultura`, `familia`) mientras que el schema y los tours reales usan campos planos `vibeAdrenaline`, `vibeRelax`, `vibeCulture`, `vibeFamily`. El mapper.js los maneja, pero crea duplicación y confusión.

**Además:** Los mock tours tienen campos como `guideId`, `vehicleId`, `operator`, `vibeScores`, `destinationCountry` que NO existen en el schema de la DB.

---

### 9. OperadoresManagement no aparece en el menú del sidebar

**Archivo:** `src/components/admin/AdminPanel.tsx`

**Problema:** El array `MENU_ITEMS` (líneas 56-66) no incluye un item con `id: 'operators'`, pero el render condicional (línea 740-747) sí tiene un bloque para `activeTab === 'operators'`. Esto significa que la pestaña de operadores existe pero no hay forma de acceder a ella desde el menú.

---

### 10. Roles: TOUR_ADMIN no está considerado en filtros de tours

**Archivo:** `src/app/useToursFilter.js` (líneas 164-178)

**Problema:** En el filtro de tours, solo se considera:
```javascript
if (userRole === "platform-admin" || userRole === "tour-admin") { /* admins see all */ }
```
Pero `TOUR_ADMIN` en la DB se mapea a `tour-admin` (con guión). El mapper `normalizeDbRole` en `mappers.ts` línea 173 devuelve `"tour-admin"`. Esto debería funcionar, pero **verificar** que el rol `TOUR_ADMIN` en seed.sql se esté mapeando correctamente.

---

## 🟡 PROBLEMAS MENORES / ADVERTENCIAS

### 11. Archivos duplicados / backups

**Carpeta:** `src-backup-pre2/`

Hay una copia de seguridad completa del frontend. Esto ocupa espacio y puede causar confusión. Considerar eliminar cuando ya no sea necesaria.

---

### 12. Scripts de reconstrucción

**Archivos:** `reconstruct.py`, `reconstruct2.py`, `reconstruct3.py`, `reconstruct4.py`, `reconstruct5.py`, `reconstruct6.py`

Múltiples scripts Python de reconstrucción. Probablemente de intentos anteriores de recuperar el proyecto. Revisar si aún son necesarios.

---

### 13. Archivo Header.jsx.bak

**Archivo:** `src/components/Header.jsx.bak`

Backup del Header. Probablemente se puede eliminar.

---

### 14. Exportaciones de Firebase emulator

**Carpetas:**
- `firebase-export-1785095989936GbrCgq/`
- `firebase-export-17851157921387U9PY9/`
- `firebase-export-1785258719450zyGXOo/`

Son exportaciones del emulador de Firebase. Ocupan espacio. Se pueden eliminar si no se necesitan.

---

### 15. Test results de Playwright

**Carpeta:** `test-results/`

Contiene capturas de pantalla y traces de tests fallidos. Ocupan espacio. Se pueden eliminar.

---

### 16. playwright-report

**Carpeta:** `playwright-report/`

Reporte HTML de tests. Ocupa ~10MB. Se puede eliminar.

---

## 📋 LISTA DE VERIFICACIÓN PARA CORREGIR

### Prioridad 1 — Antes de poblar datos
- [ ] Corregir runtime Node en `functions/package.json` (22 → 20)
- [ ] Agregar campos profesionales a `mutations.gql` (CreateTour, UpdateTour)
- [ ] Agregar campos profesionales a `queries.gql` (GetTours, GetTour)
- [ ] Regenerar el SDK de Data Connect después de los cambios GQL

### Prioridad 2 — Antes de crear tours reales
- [ ] Reemplazar `dataconnect/seed-real.json` con datos reales
- [ ] Agregar países faltantes al enum `Destination` en `schema.graphql`
- [ ] Verificar que todas las categorías en `mappers.ts` tengan对应 en el schema

### Prioridad 3 — Limpieza
- [ ] Eliminar `src-backup-pre2/` (cuando ya no sea necesaria)
- [ ] Eliminar scripts de reconstrucción (reconstruct*.py)
- [ ] Eliminar `Header.jsx.bak`
- [ ] Eliminar exportaciones de emulador (`firebase-export-*/`)
- [ ] Eliminar `test-results/` y `playwright-report/`

---

## 🛠 COMANDOS ÚTILES

```bash
# Ver el estado actual de Git
git status

# Ver el historial de commits
git log --oneline

# Volver al checkpoint si algo sale mal
git checkout a48830f

# Ejecutar seed con datos reales (después de editar seed-real.json)
node scripts/seed-real.mjs

# Iniciar emuladores
npm run dev

# Ejecutar el bug scanner
npm run scan