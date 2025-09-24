'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Image, List, Play, Star, 
  Layout, CheckCircle
} from 'lucide-react';

export interface BlogLayout {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const blogLayouts: BlogLayout[] = [
  {
    id: 'standard',
    name: 'Standard Article',
    description: 'Classic blog layout với title, content và sidebar',
    icon: <FileText className="h-5 w-5" />,
    color: 'bg-blue-50 border-blue-200 text-blue-800'
  },
  {
    id: 'featured',
    name: 'Featured Story',
    description: 'Hero layout với large image và prominent title',
    icon: <Star className="h-5 w-5" />,
    color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  },
  {
    id: 'list',
    name: 'List Article',
    description: 'Structured layout cho listicles và step-by-step guides',
    icon: <List className="h-5 w-5" />,
    color: 'bg-green-50 border-green-200 text-green-800'
  },
  {
    id: 'gallery',
    name: 'Photo Gallery',
    description: 'Image-focused layout với multiple photos',
    icon: <Image className="h-5 w-5" />,
    color: 'bg-purple-50 border-purple-200 text-purple-800'
  },
  {
    id: 'video',
    name: 'Video Post',
    description: 'Video-centric layout với embedded player',
    icon: <Play className="h-5 w-5" />,
    color: 'bg-red-50 border-red-200 text-red-800'
  }
];

interface BlogLayoutSelectorProps {
  selectedLayout: string;
  onLayoutChange: (layoutId: string) => void;
}

export default function BlogLayoutSelector({ 
  selectedLayout, 
  onLayoutChange
}: BlogLayoutSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Layout className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Chọn Layout Bài Viết</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {blogLayouts.map((layout) => (
          <Card
            key={layout.id}
            className={`cursor-pointer transition-all duration-200 border-2 ${
              selectedLayout === layout.id
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : 'hover:shadow-sm hover:scale-[1.02]'
            }`}
            onClick={() => onLayoutChange(layout.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${layout.color}`}>
                  {layout.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 text-sm">
                      {layout.name}
                    </h3>
                    {selectedLayout === layout.id && (
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {layout.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Layout Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Layout đã chọn:</span>
          <Badge variant="outline" className="text-xs">
            {blogLayouts.find(layout => layout.id === selectedLayout)?.name || 'Standard Article'}
          </Badge>
        </div>
      </div>
    </div>
  );
}