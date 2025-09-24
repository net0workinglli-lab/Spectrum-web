'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadImage, isDataURL } from '@/lib/firebase-storage';

interface ImageUploadProps {
  // Single-image mode
  value?: string;
  onChange?: (url: string) => void;
  // Multi-image mode
  images?: string[];
  onImagesChange?: (urls: string[]) => void;
  maxImages?: number;
  // Common
  placeholder?: string;
  className?: string;
  label?: string;
  description?: string;
}

export function ImageUpload({ 
  value, 
  onChange, 
  images,
  onImagesChange,
  maxImages = 5,
  placeholder, 
  className,
  label = "Image",
  description,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMultiple = Array.isArray(images);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Upload to Firebase Storage
      const uploadResult = await uploadImage(file, {
        folder: 'content',
        maxSize: 5 * 1024 * 1024, // 5MB
      });

      if (isMultiple) {
        if (typeof onImagesChange === 'function') {
          const current = Array.isArray(images) ? images : [];
          if (current.length >= maxImages) {
            alert(`Maximum ${maxImages} images allowed`);
          } else {
            onImagesChange([...current, uploadResult.url]);
          }
        } else {
          console.error('ImageUpload: onImagesChange prop is not a function', onImagesChange);
        }
      } else {
        if (typeof onChange === 'function') {
          onChange(uploadResult.url);
        } else {
          console.error('ImageUpload: onChange prop is not a function', onChange);
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    try {
      if (isMultiple) {
        if (typeof onImagesChange === 'function') {
          const current = Array.isArray(images) ? images : [];
          if (current.length > 0) {
            onImagesChange(current.slice(0, current.length - 1));
            console.log('[ImageUpload] Removed last image (multi)', { newCount: current.length - 1 });
          }
        } else {
          console.error('ImageUpload: onImagesChange prop is not a function', onImagesChange);
        }
      } else {
        if (typeof onChange === 'function') {
          onChange('');
          console.log('[ImageUpload] Cleared image (single)');
        } else {
          console.error('ImageUpload: onChange prop is not a function', onChange);
        }
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('[ImageUpload] Error in handleRemoveImage:', error);
    }
  };

  const handleRemoveImageAt = (index: number) => {
    try {
      if (!isMultiple) return;
      if (typeof onImagesChange === 'function') {
        const current = Array.isArray(images) ? images : [];
        onImagesChange(current.filter((_, i) => i !== index));
        console.log('[ImageUpload] Removed image at index (multi)', { index, newCount: Math.max(0, current.length - 1) });
      } else {
        console.error('ImageUpload: onImagesChange prop is not a function', onImagesChange);
      }
    } catch (error) {
      console.error('[ImageUpload] Error in handleRemoveImageAt:', error);
    }
  };

  const handleUrlChange = (url: string) => {
    try {
      if (isMultiple) {
        setUrlInput(url);
        console.log('[ImageUpload] URL typing (multi)', { length: url.length });
      } else {
        if (typeof onChange === 'function') {
          onChange(url);
          console.log('[ImageUpload] URL set (single)', { length: url.length });
        } else {
          console.error('ImageUpload: onChange prop is not a function', onChange);
        }
      }
    } catch (error) {
      console.error('[ImageUpload] Error in handleUrlChange:', error);
    }
  };

  const handleAddUrlToList = () => {
    if (!isMultiple) return;
    try {
      const url = urlInput.trim();
      if (!url) return;
      if (!/^https?:\/\//.test(url) && !url.startsWith('data:image/')) {
        alert('Please enter a valid image URL');
        console.warn('[ImageUpload] Invalid URL format (multi)', { url });
        return;
      }
      if (typeof onImagesChange === 'function') {
        const current = Array.isArray(images) ? images : [];
        if (current.length >= maxImages) {
          alert(`Maximum ${maxImages} images allowed`);
          console.warn('[ImageUpload] Max images reached (multi) when adding URL', { currentCount: current.length, maxImages });
          return;
        }
        onImagesChange([...current, url]);
        console.log('[ImageUpload] URL added (multi)', { newCount: current.length + 1 });
        setUrlInput('');
      } else {
        console.error('ImageUpload: onImagesChange prop is not a function', onImagesChange);
      }
    } catch (error) {
      console.error('[ImageUpload] Error in handleAddUrlToList:', error);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm">{label}</Label>

      {!isMultiple ? (
        <>
          {/* Image Preview (single) */}
          {value && (
            <div className="relative">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border max-w-xs">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image load error:', e);
                  }}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Upload Options (single) */}
          <div className="space-y-2">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </Button>
            </div>
            <div className="text-center text-sm text-gray-500">or</div>
            <div>
              <Input
                value={value || ''}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder={placeholder || "Enter image URL..."}
                className="w-full"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Images Preview (multiple) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {(images || []).map((img, idx) => (
              <div key={`${img}-${idx}`} className="relative">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                  <img
                    src={img}
                    alt={`Image ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => console.error('Image load error:', e)}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => handleRemoveImageAt(idx)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {(images || []).length === 0 && (
              <div className="text-xs text-gray-500">No images yet</div>
            )}
          </div>

          {/* Upload Options (multiple) */}
          <div className="space-y-2">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length === 0) return;
                  for (const f of files) {
                    // Reuse single file handler for validation and read
                    const ev = { target: { files: [f] } } as unknown as React.ChangeEvent<HTMLInputElement>;
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    await handleFileSelect(ev);
                  }
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || ((images || []).length >= maxImages)}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : `Upload Image${maxImages > 1 ? 's' : ''}`}
              </Button>
            </div>
            <div className="text-center text-sm text-gray-500">or</div>
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder={placeholder || "Enter image URL..."}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddUrlToList}
                disabled={(images || []).length >= maxImages}
              >
                Add
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        {description || (isMultiple ? `Upload images or enter image URLs. Max ${maxImages} images. Max size per image: 5MB` : 'Upload an image file or enter an image URL. Max size: 5MB')}
      </p>
    </div>
  );
}