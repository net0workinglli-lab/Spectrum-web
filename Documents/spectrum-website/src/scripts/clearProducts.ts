import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCR2Bbg35WB7n7rZxOvsO_KiUciD5MzRVc",
  authDomain: "spec-9233a.firebaseapp.com",
  projectId: "spec-9233a",
  storageBucket: "spec-9233a.firebasestorage.app",
  messagingSenderId: "219410789434",
  appId: "1:219410789434:web:2d3709a9e3ceecf2a8f103"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearAllProducts() {
  try {
    console.log('🗑️ Clearing all products from Firestore...');

    const productsCollection = collection(db, 'products');
    const querySnapshot = await getDocs(productsCollection);
    
    if (querySnapshot.empty) {
      console.log('✅ No products found in Firestore');
      return;
    }

    console.log(`📦 Found ${querySnapshot.docs.length} products to delete`);

    for (const docSnapshot of querySnapshot.docs) {
      const productData = docSnapshot.data();
      await deleteDoc(doc(db, 'products', docSnapshot.id));
      console.log(`✅ Deleted product: ${productData.name || productData.title || docSnapshot.id}`);
    }

    console.log('🎉 All products cleared successfully!');
    console.log('📝 Products collection is now empty and ready for your real products.');
  } catch (error) {
    console.error('❌ Error clearing products:', error);
  }
}

clearAllProducts();
