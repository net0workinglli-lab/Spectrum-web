// Simple script to check Featured Products data
import { getSectionContentById } from './src/lib/firebase-firestore.js';

async function checkFeaturedProducts() {
  try {
    console.log('🔍 Checking Featured Products Section data...');
    
    const data = await getSectionContentById('featured-products-section');
    
    if (data) {
      console.log('📊 Featured Products Section data:');
      console.log('- selectedProductIds:', data.selectedProductIds || 'undefined');
      console.log('- maxProducts:', data.maxProducts || 'undefined');
      console.log('- title:', data.title || 'undefined');
      console.log('- Full data keys:', Object.keys(data));
    } else {
      console.log('❌ No data found for featured-products-section');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkFeaturedProducts();
