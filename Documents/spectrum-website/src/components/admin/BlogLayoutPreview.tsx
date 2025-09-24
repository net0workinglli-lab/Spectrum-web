'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Calendar, User, Clock, Tag, Play, Image as ImageIcon, Star, List as ListIcon } from 'lucide-react';

interface BlogLayoutPreviewProps {
  layout: string;
  formData: {
    title: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    readingTime: string;
    tags: string[];
    category: string;
  };
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export default function BlogLayoutPreview({ layout, formData, author }: BlogLayoutPreviewProps) {
  const getLayoutColor = (layout: string) => {
    switch (layout) {
      case 'featured': return 'bg-yellow-50 border-yellow-200';
      case 'list': return 'bg-green-50 border-green-200';
      case 'gallery': return 'bg-purple-50 border-purple-200';
      case 'video': return 'bg-red-50 border-red-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case 'featured': return <Star className="h-4 w-4 text-yellow-600" />;
      case 'list': return <ListIcon className="h-4 w-4 text-green-600" />;
      case 'gallery': return <ImageIcon className="h-4 w-4 text-purple-600" />;
      case 'video': return <Play className="h-4 w-4 text-red-600" />;
      default: return <Tag className="h-4 w-4 text-blue-600" />;
    }
  };

  const getLayoutName = (layout: string) => {
    switch (layout) {
      case 'featured': return 'Featured Story';
      case 'list': return 'List Article';
      case 'gallery': return 'Photo Gallery';
      case 'video': return 'Video Post';
      default: return 'Standard Article';
    }
  };

  return (
    <Card className={`border-2 ${getLayoutColor(layout)}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {getLayoutIcon(layout)}
          <span>Preview: {getLayoutName(layout)}</span>
          <Badge variant="outline" className="ml-auto text-xs">
            {layout}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3 text-xs">
          {/* Title Preview */}
          <div>
            <div className="font-semibold text-gray-700 mb-1">Title:</div>
            <div className="text-gray-600 bg-white p-2 rounded border">
              {formData.title || 'Untitled Post'}
            </div>
          </div>

          {/* Meta Info Preview */}
          <div>
            <div className="font-semibold text-gray-700 mb-1">Meta Info:</div>
            <div className="flex items-center gap-3 text-gray-500 bg-white p-2 rounded border">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {author.name}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date().toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formData.readingTime || '0 min read'}
              </span>
            </div>
          </div>

          {/* Featured Image Preview */}
          {formData.featuredImage && (
            <div>
              <div className="font-semibold text-gray-700 mb-1">Featured Image:</div>
              <div className="w-full h-16 bg-gray-100 rounded border overflow-hidden">
                <img
                  src={formData.featuredImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Excerpt Preview */}
          {formData.excerpt && (
            <div>
              <div className="font-semibold text-gray-700 mb-1">Excerpt:</div>
              <div className="text-gray-600 bg-white p-2 rounded border text-xs">
                {formData.excerpt}
              </div>
            </div>
          )}

          {/* Content Preview */}
          {formData.content && (
            <div>
              <div className="font-semibold text-gray-700 mb-1">Content:</div>
              <div className="text-gray-600 bg-white p-2 rounded border text-xs max-h-20 overflow-hidden">
                {formData.content.substring(0, 100)}
                {formData.content.length > 100 && '...'}
              </div>
            </div>
          )}

          {/* Tags Preview */}
          {formData.tags.length > 0 && (
            <div>
              <div className="font-semibold text-gray-700 mb-1">Tags:</div>
              <div className="flex flex-wrap gap-1">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Layout-specific Preview */}
          {layout === 'featured' && (
            <div className="mt-3 p-2 bg-yellow-100 rounded text-yellow-800 text-xs">
              <strong>Featured Layout:</strong> Hero image với overlay text, prominent title
            </div>
          )}

          {layout === 'list' && (
            <div className="mt-3 p-2 bg-green-100 rounded text-green-800 text-xs">
              <strong>List Layout:</strong> Numbered lists với step indicators, structured content
            </div>
          )}

          {layout === 'gallery' && (
            <div className="mt-3 p-2 bg-purple-100 rounded text-purple-800 text-xs">
              <strong>Gallery Layout:</strong> Image-focused với center alignment, visual emphasis
            </div>
          )}

          {layout === 'video' && (
            <div className="mt-3 p-2 bg-red-100 rounded text-red-800 text-xs">
              <strong>Video Layout:</strong> Video player với thumbnail, multimedia content
            </div>
          )}

          {layout === 'standard' && (
            <div className="mt-3 p-2 bg-blue-100 rounded text-blue-800 text-xs">
              <strong>Standard Layout:</strong> Classic blog với clean typography, sidebar content
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
