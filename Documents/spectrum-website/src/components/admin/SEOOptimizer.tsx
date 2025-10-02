'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Search, TrendingUp, Target, CheckCircle, 
  AlertCircle, Lightbulb, BarChart3, 
  Eye, Clock, Hash, Tag
} from 'lucide-react';

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  slug: string;
  content: string;
}

interface SEOOptimizerProps {
  title: string;
  description: string;
  content: string;
  slug: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onKeywordsChange: (keywords: string[]) => void;
  onSlugChange: (slug: string) => void;
}

export default function SEOOptimizer({
  title,
  description,
  content,
  slug,
  onTitleChange,
  onDescriptionChange,
  onKeywordsChange,
  onSlugChange
}: SEOOptimizerProps) {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Calculate SEO score
  useEffect(() => {
    let score = 0;
    const newSuggestions: string[] = [];

    // Title analysis
    if (title.length >= 30 && title.length <= 60) {
      score += 20;
    } else if (title.length < 30) {
      newSuggestions.push('Tiêu đề nên dài hơn 30 ký tự để tối ưu SEO');
    } else if (title.length > 60) {
      newSuggestions.push('Tiêu đề nên ngắn hơn 60 ký tự để hiển thị đầy đủ trên Google');
    }

    // Description analysis
    if (description.length >= 120 && description.length <= 160) {
      score += 20;
    } else if (description.length < 120) {
      newSuggestions.push('Mô tả nên dài hơn 120 ký tự để tối ưu SEO');
    } else if (description.length > 160) {
      newSuggestions.push('Mô tả nên ngắn hơn 160 ký tự để hiển thị đầy đủ trên Google');
    }

    // Slug analysis
    if (slug && slug.length > 0) {
      score += 15;
    } else {
      newSuggestions.push('Cần có slug cho bài viết');
    }

    // Keywords analysis
    if (keywords.length >= 3 && keywords.length <= 10) {
      score += 15;
    } else if (keywords.length < 3) {
      newSuggestions.push('Nên có ít nhất 3 từ khóa');
    } else if (keywords.length > 10) {
      newSuggestions.push('Không nên có quá 10 từ khóa');
    }

    // Content analysis
    const wordCount = content.split(/\s+/).length;
    if (wordCount >= 300) {
      score += 20;
    } else {
      newSuggestions.push('Nội dung nên có ít nhất 300 từ');
    }

    // Keyword density analysis
    if (keywords.length > 0 && content.length > 0) {
      const keywordDensity = keywords.reduce((total, keyword) => {
        const regex = new RegExp(keyword.toLowerCase(), 'gi');
        const matches = content.toLowerCase().match(regex);
        return total + (matches ? matches.length : 0);
      }, 0);
      
      const density = (keywordDensity / wordCount) * 100;
      if (density >= 1 && density <= 3) {
        score += 10;
      } else if (density < 1) {
        newSuggestions.push('Mật độ từ khóa quá thấp, nên sử dụng từ khóa nhiều hơn trong nội dung');
      } else if (density > 3) {
        newSuggestions.push('Mật độ từ khóa quá cao, có thể bị Google coi là spam');
      }
    }

    setSeoScore(score);
    setSuggestions(newSuggestions);
  }, [title, description, slug, keywords, content]);

  // Add keyword
  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      const updatedKeywords = [...keywords, newKeyword.trim()];
      setKeywords(updatedKeywords);
      onKeywordsChange(updatedKeywords);
      setNewKeyword('');
    }
  };

  // Remove keyword
  const removeKeyword = (keywordToRemove: string) => {
    const updatedKeywords = keywords.filter(keyword => keyword !== keywordToRemove);
    setKeywords(updatedKeywords);
    onKeywordsChange(updatedKeywords);
  };

  // Auto-generate keywords from title and content
  const generateKeywords = () => {
    const text = `${title} ${description} ${content}`.toLowerCase();
    const words = text.split(/\s+/).filter(word => word.length > 3);
    const wordCount: { [key: string]: number } = {};
    
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    const sortedWords = Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
    
    setKeywords(sortedWords);
    onKeywordsChange(sortedWords);
  };

  // Get SEO score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Get SEO score label
  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          SEO Optimization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* SEO Score */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(seoScore)}`}>
              {seoScore}/100
            </div>
            <span className="text-sm text-gray-600">
              SEO Score: <strong>{getScoreLabel(seoScore)}</strong>
            </span>
          </div>
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>

        {/* SEO Fields */}
        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="seo-title">SEO Title</Label>
            <Input
              id="seo-title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Tiêu đề tối ưu cho SEO (30-60 ký tự)"
              maxLength={60}
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{title.length}/60 ký tự</span>
              {title.length >= 30 && title.length <= 60 ? (
                <span className="text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Tối ưu
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Cần điều chỉnh
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="seo-description">SEO Description</Label>
            <Textarea
              id="seo-description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Mô tả tối ưu cho SEO (120-160 ký tự)"
              maxLength={160}
              rows={3}
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{description.length}/160 ký tự</span>
              {description.length >= 120 && description.length <= 160 ? (
                <span className="text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Tối ưu
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Cần điều chỉnh
                </span>
              )}
            </div>
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="seo-slug">URL Slug</Label>
            <Input
              id="seo-slug"
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
              placeholder="url-slug-cho-bai-viet"
            />
            <div className="text-xs text-gray-500">
              URL: {typeof window !== 'undefined' ? window.location.origin : 'https://spec-9233a.web.app'}/blog/{slug || 'untitled-post'}
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label>Keywords</Label>
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Thêm từ khóa"
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              />
              <Button variant="outline" size="sm" onClick={addKeyword}>
                <Tag className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={generateKeywords}>
                <Lightbulb className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Keywords List */}
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    {keyword}
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="text-xs text-gray-500">
              {keywords.length}/10 từ khóa
            </div>
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              SEO Suggestions
            </Label>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-yellow-800">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Analysis */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Content Analysis</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <span>Words: {content.split(/\s+/).length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>Reading time: {Math.ceil(content.split(/\s+/).length / 200)} min</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
