// create-auth-users.mjs
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  connectAuthEmulator,
  createUserWithEmailAndPassword
} from 'firebase/auth';

// 1. Inicializa Firebase con datos dummy
const app = initializeApp({
  apiKey: 'dummy-key',
  authDomain: 'localhost',
  projectId: 'buscatours-e0816'
});

// 2. CONECTA EXPLÍCITAMENTE AL EMULADOR (clave!)
const auth = getAuth(app);
connectAuthEmulator(auth, 'http://localhost:9099');

// 3. Lista de usuarios
const users = [
  { email: 'admin@buscatours.com', password: 'admin123' },
  { email: 'editor@buscatours.com', password: 'edit123' },
  { email: 'operador1@buscatours.com', password: 'op123456' },
  { email: 'operador2@buscatours.com', password: 'op123456' },
  { email: 'operador3@buscatours.com', password: 'op123456' },
  { email: 'operador4@buscatours.com', password: 'op123456' },
  { email: 'cliente@buscatours.com', password: 'client123' }
];

// 4. Crea usuarios
(async () => {
  console.log('Creando usuarios en el emulador de Auth...');
  for (const user of users) {
    try {
      await createUserWithEmailAndPassword(auth, user.email, user.password);
      console.log(`✓ Creado: ${user.email}`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`✓ Ya existe: ${user.email}`);
      } else {
        console.error(`✗ Error: ${user.email} -> ${error.message}`);
      }
    }
  }
  console.log('Proceso completado.');
})();