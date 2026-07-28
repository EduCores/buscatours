import { test, expect } from '@playwright/test';

test.describe('Home Page - Tour Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    // Esperar a que cargue el contenido principal
    await page.waitForSelector('h2:has-text("Latino América"), h2:has-text("Latino America")', { timeout: 15000 });
  });

  test('Muestra sección Latino América con destinos', async ({ page }) => {
    await expect(page.locator('h2:has-text("Latino América"), h2:has-text("Latino America")')).toBeVisible();
    
    // Verifica que hay destinos visible (tarjetas con banderas/íconos)
    const destinationCards = page.locator('.destination-card, .glass-card').first();
    await expect(destinationCards).toBeVisible({ timeout: 10000 });
  });

  test('Muestra tour destacado en home', async ({ page }) => {
    // Buscar tarjetas de tour (usan glass-card con título)
    const tourCards = page.locator('.glass-card').filter({ hasText: 'Tour' }).first();
    await expect(tourCards).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Búsqueda de tours', () => {
  test('Realiza búsqueda y muestra resultados', async ({ page }) => {
    // Cambiar a búsqueda tradicional
    await page.locator('button:has-text("Búsqueda Tradicional"), button:has-text("Traditional Search")').click();
    
    // Buscar en el input con testid
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill('Cusco');
    
    // Enviar búsqueda
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(2000);
    
    // Verificar que hay al menos un resultado
    const results = page.locator('.glass-card').filter({ hasText: 'Cusco' });
    await expect(results.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Interacción usuario anónimo', () => {
  test('Acceso a página principal sin autenticación', async ({ page }) => {
    await page.goto('http://localhost:5173');
    // Verificar que la página carga correctamente
    await expect(page).toHaveTitle(/Busca Tours|Buscatours/i);
  });
});

test.describe('Integración de AI y wishlist', () => {
  test('AI Copilot está disponible', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Verificar que el AI Copilot botón existe
    const aiButton = page.locator('button:has-text("Copiloto"), button:has-text("Copiloto de Viajes")');
    await expect(aiButton).toBeVisible({ timeout: 10000 });
  });
});