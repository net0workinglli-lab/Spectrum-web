// Utility functions for handling image uploads in forms
import { uploadImage } from '@/lib/firebase-storage';

// Helper to check if a string is a base64 data URL (local preview)
export const isBase64DataUrl = (str: string): boolean => {
  return str.startsWith('data:image/');
};

// Helper to check if a string is a Firebase Storage URL
export const isFirebaseStorageUrl = (str: string): boolean => {
  return str.includes('firebasestorage.googleapis.com') || str.includes('firebasestorage.app');
};

// Process content data to upload base64 images to Firebase Storage
export const processContentImages = async (contentData: Record<string, unknown>): Promise<Record<string, unknown>> => {
  const processedData = { ...contentData };
  console.log('[imageUploadHelper] processContentImages start', {
    keys: Object.keys(processedData),
  });
  
  // Helper function to process a single image field
  const processImageField = async (obj: Record<string, unknown>, fieldName: string) => {
    if (obj[fieldName] && typeof obj[fieldName] === 'string' && isBase64DataUrl(obj[fieldName] as string)) {
      try {
        console.log(`[imageUploadHelper] Processing ${fieldName} image...`);
        
        // Convert base64 to File object
        const response = await fetch(obj[fieldName] as string);
        const blob = await response.blob();
        const file = new File([blob], `${fieldName}_${Date.now()}.jpg`, { type: blob.type });
        
        // Upload to Firebase Storage
        console.log('[imageUploadHelper] Uploading to Firebase...');
        const uploadResult = await uploadImage(file, { folder: 'content' });
        const downloadURL = uploadResult.url;
        obj[fieldName] = downloadURL;
        console.log(`[imageUploadHelper] ${fieldName} uploaded successfully`, { downloadURL });
      } catch (error) {
        console.error(`[imageUploadHelper] Error uploading ${fieldName}:`, error);
        throw new Error(`Failed to upload ${fieldName} image`);
      }
    }
  };
  
  // Process common image fields
  const imageFields = ['imageUrl', 'logoImage', 'featuredImage', 'image'];
  
  for (const field of imageFields) {
    if (processedData[field]) {
      await processImageField(processedData, field);
    }
  }
  
  // Process hero slides if they exist
  if (processedData.heroSlides && Array.isArray(processedData.heroSlides)) {
    for (let i = 0; i < processedData.heroSlides.length; i++) {
      const slide = processedData.heroSlides[i] as Record<string, unknown>;
      await processImageField(slide, 'image');
    }
  }
  
  // Process featured products if they exist
  if (processedData.featuredProducts && Array.isArray(processedData.featuredProducts)) {
    for (let i = 0; i < processedData.featuredProducts.length; i++) {
      const product = processedData.featuredProducts[i] as Record<string, unknown>;
      if (product.images && Array.isArray(product.images)) {
        for (let j = 0; j < product.images.length; j++) {
          const imageUrl = product.images[j];
          if (typeof imageUrl === 'string' && isBase64DataUrl(imageUrl)) {
            try {
              const response = await fetch(imageUrl);
              const blob = await response.blob();
              const file = new File([blob], `product_${i}_${j}_${Date.now()}.jpg`, { type: blob.type });
              
              console.log('[imageUploadHelper] Uploading featured product image...', { index: `${i}-${j}`});
              const uploadResult = await uploadImage(file, { folder: 'products' });
              const downloadURL = uploadResult.url;
              product.images[j] = downloadURL;
            } catch (error) {
              console.error(`[imageUploadHelper] Error uploading product image ${i}-${j}:`, error);
              throw new Error(`Failed to upload product image`);
            }
          }
        }
      }
    }
  }
  
  console.log('[imageUploadHelper] processContentImages end');
  return processedData;
};

// Show upload progress to user
export const showImageUploadProgress = (message: string) => {
  console.log('Image Upload:', message);
  // You can integrate with a toast notification system here
};
