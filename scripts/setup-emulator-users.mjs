/**
 * setup-emulator-users.mjs - Create test users in Firebase Auth emulator
 * 
 * Usage: node scripts/setup-emulator-users.mjs
 * Requires: firebase emulators:start --only auth (running on port 9099)
 */
import { readFileSync } from 'fs';

const AUTH_EMULATOR_URL = 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=any-api-key';

const seedUsers = [
  { email: 'admin@buscatours.com', password: 'admin123', role: 'PLATFORM_ADMIN', name: 'Busca Tours' },
  { email: 'operador1@buscatours.com', password: 'op123456', role: 'OPERATOR', name: 'Andes Expeditions' },
  { email: 'operador2@buscatours.com', password: 'op123456', role: 'OPERATOR', name: 'Patagonia Wild Outdoors' },
  { email: 'operador3@buscatours.com', password: 'op123456', role: 'OPERATOR', name: 'Amazon Green Travel' },
  { email: 'operador4@buscatours.com', password: 'op123456', role: 'OPERATOR', name: 'Maya Tours S.A.' },
  { email: 'editor@buscatours.com', password: 'edit123', role: 'TOUR_ADMIN', name: 'Admin de Contenido' },
  { email: 'cliente@buscatours.com', password: 'client123', role: 'CUSTOMER', name: 'Cliente Frecuente' }
];

async function createEmulatorUser(email, password) {
  const body = {
    email,
    password,
    returnSecureToken: true
  };

  try {
    const res = await fetch(AUTH_EMULATOR_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (res.ok) {
      const data = await res.json();
      console.log(`  ✓ Created: ${email} (${data.localId})`);
      return data.localId;
    } else {
      const err = await res.json();
      console.log(`  ⚠ Skipped ${email}: ${err.error?.message || 'exists or error'}`);
      return null;
    }
  } catch (e) {
    console.error(`  ✗ Error creating ${email}:`, e.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Setting up Firebase Auth emulator users...');
  
  for (const { email, password } of seedUsers) {
    await createEmulatorUser(email, password);
  }
  
  console.log('\n✅ Emulator users ready. Now run: node scripts/seed-real.mjs');
  console.log('\nLogin credentials:');
  console.log('  Admin: admin@buscatours.com / admin123');
  console.log('  Operator: operador1@buscatours.com / op123456');
}

main().catch(console.error);