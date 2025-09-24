'use client';

import React from 'react';
import { Calendar, User, Clock, Tag, Play, Image as ImageIcon, Star, List as ListIcon } from 'lucide-react';

interface BlogLayoutTemplateProps {
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

export default function BlogLayoutTemplate({ layout, formData, author }: BlogLayoutTemplateProps) {
  // Common meta info component
  const MetaInfo = () => (
    <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
      <span className="flex items-center gap-2">
        <User className="h-4 w-4" />
        {author.name}
      </span>
      <span className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        {new Date().toLocaleDateString()}
      </span>
      <span className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        {formData.readingTime || '0 min read'}
      </span>
    </div>
  );

  // Common tags component
  const Tags = ({ colorClass = 'bg-blue-100 text-blue-800', icon: Icon = Tag }) => (
    formData.tags.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {formData.tags.map((tag, index) => (
          <span
            key={index}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${colorClass}`}
          >
            <Icon className="h-3 w-3 mr-1" />
            {tag}
          </span>
        ))}
      </div>
    )
  );

  // Common content component
  const Content = () => (
    <div className="prose prose-lg max-w-none">
      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
        {formData.content}
      </div>
    </div>
  );

  // Featured Layout
  if (layout === 'featured') {
    return (
      <article className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
          {formData.featuredImage ? (
            <img
              src={formData.featuredImage}
              alt={formData.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <ImageIcon className="h-16 w-16 text-white opacity-50" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl px-6">
              <h1 className="text-5xl font-bold mb-4 leading-tight">
                {formData.title || 'Untitled Post'}
              </h1>
              {formData.excerpt && (
                <p className="text-xl opacity-90 leading-relaxed">
                  {formData.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between mb-8 p-6 bg-gray-50 rounded-xl">
          <MetaInfo />
          <Tags colorClass="bg-yellow-100 text-yellow-800" icon={Star} />
        </div>

        <Content />
      </article>
    );
  }

  // List Layout
  if (layout === 'list') {
    return (
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {formData.title || 'Untitled Post'}
          </h1>
          
          <MetaInfo />

          {formData.excerpt && (
            <div className="p-6 bg-green-50 border-l-4 border-green-400 rounded-r-lg mb-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                {formData.excerpt}
              </p>
            </div>
          )}

          <Tags colorClass="bg-green-100 text-green-800" icon={ListIcon} />
        </header>

        {/* List Content */}
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {formData.content.split('\n').map((paragraph, index) => {
              const isListItem = /^\d+\.|^[-*]\s|^•\s/.test(paragraph.trim());
              
              if (isListItem) {
                return (
                  <div key={index} className="flex items-start gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1 text-gray-700">
                      {paragraph.trim()}
                    </div>
                  </div>
                );
              }
              
              return (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </article>
    );
  }

  // Gallery Layout
  if (layout === 'gallery') {
    return (
      <article className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {formData.title || 'Untitled Post'}
          </h1>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-6">
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {author.name}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString()}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {formData.readingTime || '0 min read'}
            </span>
          </div>

          {formData.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-6">
              {formData.excerpt}
            </p>
          )}
        </header>

        {/* Featured Image */}
        {formData.featuredImage && (
          <div className="w-full h-96 rounded-2xl overflow-hidden mb-8">
            <img
              src={formData.featuredImage}
              alt={formData.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <Content />

        {/* Tags */}
        {formData.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 justify-center">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-purple-100 text-purple-800"
                >
                  <ImageIcon className="h-3 w-3 mr-2" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    );
  }

  // Video Layout
  if (layout === 'video') {
    return (
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {formData.title || 'Untitled Post'}
          </h1>
          
          <MetaInfo />

          {formData.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              {formData.excerpt}
            </p>
          )}
        </header>

        {/* Video Placeholder */}
        <div className="relative w-full h-96 bg-gray-900 rounded-2xl overflow-hidden mb-8 flex items-center justify-center">
          {formData.featuredImage ? (
            <img
              src={formData.featuredImage}
              alt={formData.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center text-white">
              <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Video content sẽ được embed ở đây</p>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <button className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors">
              <Play className="h-8 w-8 text-white ml-1" />
            </button>
          </div>
        </div>

        <Content />

        <Tags colorClass="bg-red-100 text-red-800" icon={Play} />
      </article>
    );
  }

  // Default: Standard Layout
  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {formData.title || 'Untitled Post'}
        </h1>
        
        <MetaInfo />

        {formData.featuredImage && (
          <div className="w-full h-80 rounded-lg overflow-hidden bg-gray-100 mb-6">
            <img
              src={formData.featuredImage}
              alt={formData.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {formData.excerpt && (
          <p className="text-xl text-gray-600 leading-relaxed mb-6">
            {formData.excerpt}
          </p>
        )}

        <Tags />
      </header>

      <Content />
    </article>
  );
}