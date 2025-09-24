import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { app } from './firebase';
const auth = getAuth(app);

// Only connect to emulator in development
if (process.env.NODE_ENV === 'development' && !auth.emulatorConfig) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
  } catch (error) {
    // Emulator might already be connected
    }
}

export { auth };
