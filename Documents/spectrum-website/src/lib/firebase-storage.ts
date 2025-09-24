import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export interface UploadResult {
  url: string;
  path: string;
  size: number;
}

export interface UploadOptions {
  folder?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

const DEFAULT_OPTIONS: UploadOptions = {
  folder: 'uploads',
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
};

/**
 * Upload a file to Firebase Storage
 */
export async function uploadImage(
  file: File, 
  options: UploadOptions = {}
): Promise<UploadResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Validate file type
  if (opts.allowedTypes && !opts.allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} not allowed. Allowed types: ${opts.allowedTypes.join(', ')}`);
  }
  
  // Validate file size
  if (opts.maxSize && file.size > opts.maxSize) {
    throw new Error(`File size ${file.size} exceeds maximum ${opts.maxSize} bytes`);
  }
  
  // Generate unique filename
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2);
  const extension = file.name.split('.').pop() || 'jpg';
  const filename = `${timestamp}_${randomId}.${extension}`;
  
  // Create storage reference
  const storagePath = `${opts.folder}/${filename}`;
  const storageRef = ref(storage, storagePath);
  
  try {
    // Upload file
    console.log(`Uploading ${file.name} to ${storagePath}...`);
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log(`Upload successful: ${downloadURL}`);
    
    return {
      url: downloadURL,
      path: storagePath,
      size: file.size
    };
  } catch (error) {
    console.error('Upload failed:', error);
    throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Upload multiple images
 */
export async function uploadImages(
  files: File[], 
  options: UploadOptions = {}
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];
  
  for (const file of files) {
    try {
      const result = await uploadImage(file, options);
      results.push(result);
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
      throw error;
    }
  }
  
  return results;
}

/**
 * Delete an image from Firebase Storage
 */
export async function deleteImage(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    console.log(`Deleted image: ${path}`);
  } catch (error) {
    console.error('Delete failed:', error);
    throw new Error(`Delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Convert base64 data URL to File object
 */
export function dataURLtoFile(dataURL: string, filename: string): File {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
}

/**
 * Check if a string is a base64 data URL
 */
export function isDataURL(str: string): boolean {
  return str.startsWith('data:image/');
}

/**
 * Check if a string is a Firebase Storage URL
 */
export function isFirebaseStorageURL(str: string): boolean {
  return str.includes('firebasestorage.googleapis.com') || str.includes('firebasestorage.app');
}
