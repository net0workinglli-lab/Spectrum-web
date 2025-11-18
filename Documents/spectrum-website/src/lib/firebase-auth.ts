import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { app } from './firebase';

const auth = getAuth(app);

const shouldUseAuthEmulator =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true';

if (shouldUseAuthEmulator && !auth.emulatorConfig) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    if (typeof window !== 'undefined') {
      console.info('[Firebase] Connected auth emulator at http://localhost:9099');
    }
  } catch (error) {
    console.warn('[Firebase] Unable to connect auth emulator. Falling back to production auth.', error);
    }
}

export { auth };
