// Script to cleanup Featured Products Section
import { cleanupFeaturedProductsSection } from './src/lib/firebase-firestore.js';

async function runCleanup() {
  try {
    console.log('🚀 Starting Featured Products Section cleanup...');
    await cleanupFeaturedProductsSection();
    console.log('✅ Cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
  process.exit(0);
}

runCleanup();
