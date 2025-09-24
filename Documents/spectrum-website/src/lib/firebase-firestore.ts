import { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, orderBy, setDoc, where } from 'firebase/firestore';
import { app } from './firebase';

export const db = getFirestore(app);

// Blog Posts Collection
export const blogPostsCollection = collection(db, 'blogPosts');

// Sections Collection for CMS
export const sectionsCollection = collection(db, 'sections');

// Blog Post Functions
export const createBlogPost = async (postData: Record<string, unknown>) => {
  try {
    const docRef = await addDoc(blogPostsCollection, {
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      likes: 0,
      comments: 0
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

export const getBlogPosts = async () => {
  try {
    const q = query(blogPostsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting blog posts:', error);
    throw error;
  }
};

export const updateBlogPost = async (postId: string, postData: Record<string, unknown>) => {
  try {
    const postRef = doc(db, 'blogPosts', postId);
    await updateDoc(postRef, {
      ...postData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

export const deleteBlogPost = async (postId: string) => {
  try {
    const postRef = doc(db, 'blogPosts', postId);
    await deleteDoc(postRef);
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

// Section Content Functions for CMS
export const getSectionContent = async (sectionId: string) => {
  try {
    const q = query(sectionsCollection, orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const sections = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return sections.find(section => section.id === sectionId) || null;
  } catch (error) {
    console.error('Error getting section content:', error);
    throw error;
  }
};

export const getSectionContentById = async (sectionId: string) => {
  try {
    const sectionRef = doc(db, 'sections', sectionId);
    const sectionDoc = await getDoc(sectionRef);
    
    if (sectionDoc.exists()) {
      return {
        id: sectionDoc.id,
        ...sectionDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting section content by ID:', error);
    throw error;
  }
};

export const getAllSections = async () => {
  try {
    const q = query(sectionsCollection, orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const sections = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return sections;
  } catch (error) {
    console.error('Error getting all sections:', error);
    throw error;
  }
};

export const updateSectionContent = async (sectionId: string, content: Record<string, unknown>) => {
  try {
    const sectionRef = doc(db, 'sections', sectionId);
    await updateDoc(sectionRef, {
      ...content,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating section content:', error);
    throw error;
  }
};

export const createOrUpdateSection = async (sectionId: string, content: Record<string, unknown>) => {
  try {
    const sectionRef = doc(db, 'sections', sectionId);
    
    // Try to get the document first
    const sectionDoc = await getDoc(sectionRef);
    
    if (sectionDoc.exists()) {
      // Document exists, update it
      await updateDoc(sectionRef, {
        ...content,
        updatedAt: new Date()
      });
    } else {
      // Document doesn't exist, create it
      await setDoc(sectionRef, {
        ...content,
        id: sectionId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error creating or updating section:', error);
    throw error;
  }
};


// Products Collection
export const productsCollection = collection(db, 'products');

export const createProduct = async (productData: Record<string, unknown>) => {
  try {
    const docRef = await addDoc(productsCollection, {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Auto-update category product count
    if (productData.category) {
      await updateCategoryProductCount(productData.category as string, 'increment');
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    console.log('🔍 Loading products from Firebase...');
    const q = query(productsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`📦 Loaded ${products.length} products from Firebase:`, products.map(p => p.name));
    return products;
  } catch (error) {
    console.error('❌ Error getting products:', error);
    throw error;
  }
};

export const updateProduct = async (productId: string, productData: Record<string, unknown>) => {
  try {
    // Get current product to check category change
    const productRef = doc(db, 'products', productId);
    const currentProduct = await getDoc(productRef);
    
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date()
    });
    
    // Auto-update category counts if category changed
    if (currentProduct.exists()) {
      const oldCategory = currentProduct.data().category;
      const newCategory = productData.category as string;
      
      if (oldCategory !== newCategory) {
        console.log('📊 Category changed, updating counts:', { oldCategory, newCategory });
        
        // Decrement old category
        if (oldCategory) {
          await updateCategoryProductCount(oldCategory, 'decrement');
        }
        
        // Increment new category
        if (newCategory) {
          await updateCategoryProductCount(newCategory, 'increment');
        }
      }
    }
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    // Get product data before deleting to update category count
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);
    
    if (productDoc.exists()) {
      const productData = productDoc.data();
      
      // Delete the product
      await deleteDoc(productRef);
      
      // Auto-update category product count
      if (productData.category) {
        await updateCategoryProductCount(productData.category, 'decrement');
      }
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Auto-update category product count
const updateCategoryProductCount = async (categorySlug: string, operation: 'increment' | 'decrement') => {
  try {
    console.log(`📊 ${operation === 'increment' ? 'Incrementing' : 'Decrementing'} product count for category: ${categorySlug}`);
    
    // Find category by slug
    const q = query(categoriesCollection, where('slug', '==', categorySlug), where('type', '==', 'product'));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const categoryDoc = querySnapshot.docs[0];
      const categoryData = categoryDoc.data();
      const currentCount = categoryData.productCount || 0;
      const newCount = operation === 'increment' ? 
        currentCount + 1 : 
        Math.max(0, currentCount - 1);
      
      console.log(`📊 Updating ${categoryData.name}: ${currentCount} → ${newCount} products`);
      
      await updateDoc(categoryDoc.ref, {
        productCount: newCount,
        updatedAt: new Date()
      });
    } else {
      console.warn(`⚠️ Category not found: ${categorySlug}`);
    }
  } catch (error) {
    console.error('❌ Error updating category product count:', error);
  }
};

// Users Collection
export const usersCollection = collection(db, 'users');

export const createUser = async (userData: Record<string, unknown>) => {
  try {
    const docRef = await addDoc(usersCollection, {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const q = query(usersCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Record<string, unknown>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Categories Collection
export const categoriesCollection = collection(db, 'categories');

// Category Functions
export const createCategory = async (categoryData: Record<string, unknown>) => {
  try {
    const docRef = await addDoc(categoriesCollection, {
      ...categoryData,
      createdAt: new Date(),
      updatedAt: new Date(),
      postCount: 0
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const q = query(categoriesCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

export const updateCategory = async (categoryId: string, categoryData: Record<string, unknown>) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, {
      ...categoryData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// Contacts Collection
export const contactsCollection = collection(db, 'contacts');

// Contact Functions
export const getContacts = async () => {
  try {
    const q = query(contactsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting contacts:', error);
    throw error;
  }
};

export const createContact = async (contactData: Record<string, unknown>) => {
  try {
    const docRef = await addDoc(contactsCollection, {
      ...contactData,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'unread'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
};

export const updateContact = async (contactId: string, contactData: Record<string, unknown>) => {
  try {
    const contactRef = doc(db, 'contacts', contactId);
    await updateDoc(contactRef, {
      ...contactData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
};

export const deleteContact = async (contactId: string) => {
  try {
    const contactRef = doc(db, 'contacts', contactId);
    await deleteDoc(contactRef);
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
};

