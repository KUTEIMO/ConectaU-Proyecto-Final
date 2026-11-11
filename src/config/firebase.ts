import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

// Validar que las variables de entorno estén configuradas (100% Spark Free Tier: sin Storage Blaze)
const requiredEnvVars = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Verificar que todas las variables requeridas estén presentes
const envVarNames: Record<string, string> = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  messagingSenderId: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'VITE_FIREBASE_APP_ID',
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => envVarNames[key]);

if (missingVars.length > 0) {
  const errorMessage = `❌ Variables de entorno de Firebase faltantes:\n${missingVars.join('\n')}\n\n` +
    `Por favor, crea un archivo .env en la raíz del proyecto con estas variables.\n` +
    `Consulta SETUP.md para más información.`;
  console.error(errorMessage);
  // En desarrollo, mostrar alert solo si estamos en el navegador
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    console.warn('⚠️ La aplicación podría no funcionar correctamente sin las variables de entorno de Firebase.');
    console.warn('⚠️ Variables faltantes:', missingVars.join(', '));
  }
  // NO lanzar error que rompa la app - permitir que se renderice aunque Firebase no funcione
}

// Configuración de Firebase - Las credenciales deben venir de variables de entorno (Spark Free Tier)
export const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey || '',
  authDomain: requiredEnvVars.authDomain || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL, // Opcional
  projectId: requiredEnvVars.projectId || '',
  messagingSenderId: requiredEnvVars.messagingSenderId || '',
  appId: requiredEnvVars.appId || '',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services (Auth + Cloud Firestore)
export const auth = getAuth(app);
export const db = initializeFirestore(app, { ignoreUndefinedProperties: true });

export default app;

