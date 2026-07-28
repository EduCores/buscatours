# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking-flow.spec.ts >> Home Page - Tour Display >> Muestra tour destacado en home
- Location: src\__tests__\e2e\booking-flow.spec.ts:18:3

# Error details

```
TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('h2:has-text("Latino América"), h2:has-text("Latino America")') to be visible

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Home Page - Tour Display', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('http://localhost:5173');
  6  |     // Esperar a que cargue el contenido principal
> 7  |     await page.waitForSelector('h2:has-text("Latino América"), h2:has-text("Latino America")', { timeout: 15000 });
     |                ^ TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
  8  |   });
  9  | 
  10 |   test('Muestra sección Latino América con destinos', async ({ page }) => {
  11 |     await expect(page.locator('h2:has-text("Latino América"), h2:has-text("Latino America")')).toBeVisible();
  12 |     
  13 |     // Verifica que hay destinos visible (tarjetas con banderas/íconos)
  14 |     const destinationCards = page.locator('.destination-card, .glass-card').first();
  15 |     await expect(destinationCards).toBeVisible({ timeout: 10000 });
  16 |   });
  17 | 
  18 |   test('Muestra tour destacado en home', async ({ page }) => {
  19 |     // Buscar tarjetas de tour (usan glass-card con título)
  20 |     const tourCards = page.locator('.glass-card').filter({ hasText: 'Tour' }).first();
  21 |     await expect(tourCards).toBeVisible({ timeout: 10000 });
  22 |   });
  23 | });
  24 | 
  25 | test.describe('Búsqueda de tours', () => {
  26 |   test('Realiza búsqueda y muestra resultados', async ({ page }) => {
  27 |     // Cambiar a búsqueda tradicional
  28 |     await page.locator('button:has-text("Búsqueda Tradicional"), button:has-text("Traditional Search")').click();
  29 |     
  30 |     // Buscar en el input con testid
  31 |     const searchInput = page.locator('[data-testid="search-input"]');
  32 |     await expect(searchInput).toBeVisible({ timeout: 10000 });
  33 |     await searchInput.fill('Cusco');
  34 |     
  35 |     // Enviar búsqueda
  36 |     await page.locator('button[type="submit"]').click();
  37 |     await page.waitForTimeout(2000);
  38 |     
  39 |     // Verificar que hay al menos un resultado
  40 |     const results = page.locator('.glass-card').filter({ hasText: 'Cusco' });
  41 |     await expect(results.first()).toBeVisible({ timeout: 10000 });
  42 |   });
  43 | });
  44 | 
  45 | test.describe('Interacción usuario anónimo', () => {
  46 |   test('Acceso a página principal sin autenticación', async ({ page }) => {
  47 |     await page.goto('http://localhost:5173');
  48 |     // Verificar que la página carga correctamente
  49 |     await expect(page).toHaveTitle(/Busca Tours|Buscatours/i);
  50 |   });
  51 | });
  52 | 
  53 | test.describe('Integración de AI y wishlist', () => {
  54 |   test('AI Copilot está disponible', async ({ page }) => {
  55 |     await page.goto('http://localhost:5173');
  56 |     
  57 |     // Verificar que el AI Copilot botón existe
  58 |     const aiButton = page.locator('button:has-text("Copiloto"), button:has-text("Copiloto de Viajes")');
  59 |     await expect(aiButton).toBeVisible({ timeout: 10000 });
  60 |   });
  61 | });
```