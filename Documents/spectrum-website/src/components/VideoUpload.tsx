'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Loader2, Video } from 'lucide-react';
import { uploadImage } from '@/lib/firebase-storage';

interface VideoUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  description?: string;
}

export function VideoUpload({ 
  value, 
  onChange, 
  placeholder, 
  className,
  label = "Video",
  description,
}: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate video file
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file');
      return;
    }

    // Check file size (max 50MB for videos)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert('Video file size must be less than 50MB');
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Firebase Storage - use uploadImage with video types
      const uploadResult = await uploadImage(file, {
        folder: 'content/videos',
        maxSize: maxSize,
        allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/ogg'],
      });

      if (typeof onChange === 'function') {
        onChange(uploadResult.url);
      } else {
        console.error('VideoUpload: onChange prop is not a function', onChange);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload video');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveVideo = () => {
    try {
      if (typeof onChange === 'function') {
        onChange('');
      } else {
        console.error('VideoUpload: onChange prop is not a function', onChange);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('[VideoUpload] Error in handleRemoveVideo:', error);
    }
  };

  const handleUrlChange = (url: string) => {
    try {
      if (typeof onChange === 'function') {
        onChange(url);
      } else {
        console.error('VideoUpload: onChange prop is not a function', onChange);
      }
    } catch (error) {
      console.error('[VideoUpload] Error in handleUrlChange:', error);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm">{label}</Label>

      {/* Video Preview */}
      {value && (
        <div className="relative">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border max-w-md">
            <video
              src={value}
              controls
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Video load error:', e);
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveVideo}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Upload Options */}
      <div className="space-y-2">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
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
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Video className="h-4 w-4 mr-2" />
                Upload Video
              </>
            )}
          </Button>
        </div>
        <div className="text-center text-sm text-gray-500">or</div>
        <div>
          <Input
            value={value || ''}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={placeholder || "Enter video URL (YouTube, Vimeo, or direct link)..."}
            className="w-full"
          />
        </div>
      </div>

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        {description || 'Upload a video file or enter a video URL. Max size: 50MB. Supported formats: MP4, WebM, MOV'}
      </p>
    </div>
  );
}

