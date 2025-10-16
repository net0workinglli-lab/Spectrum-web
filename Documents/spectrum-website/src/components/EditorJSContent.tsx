'use client';

import React from 'react';

interface EditorJSBlock {
  id: string;
  type: string;
  data: any;
}

interface EditorJSData {
  time: number;
  blocks: EditorJSBlock[];
  version: string;
}

interface EditorJSContentProps {
  data: string | EditorJSData;
  className?: string;
}

// Enhanced helper function to sanitize data for React compatibility
const sanitizeForReact = (obj: any): any => {
  try {
    if (obj === null || obj === undefined) {
      return obj;
    }
    
    // Handle primitives
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      return obj;
    }
    
    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map(item => sanitizeForReact(item)).filter(item => item !== null && item !== undefined);
    }
    
    // Handle objects
    if (typeof obj === 'object') {
      // Check for circular references
      if (obj instanceof Date || obj instanceof RegExp || obj instanceof Function) {
        return null;
      }
      
      // Handle objects that might cause React Error #31
      const sanitized: any = {};
      const allowedKeys = new Set(['time', 'blocks', 'version', 'id', 'type', 'data', 'text', 'level', 'items', 'content', 'caption', 'code', 'link', 'style', 'meta', 'title', 'description', 'image', 'url']);
      
      for (const [key, value] of Object.entries(obj)) {
        // Only allow safe keys and skip problematic ones
        if (!allowedKeys.has(key) && !key.startsWith('_') && !key.includes('content') && !key.includes('meta') && !key.includes('items')) {
          continue;
        }
        
        try {
          if (
            typeof value === 'string' || 
            typeof value === 'number' || 
            typeof value === 'boolean' ||
            value === null ||
            value === undefined
          ) {
            sanitized[key] = value;
          } else if (Array.isArray(value)) {
            sanitized[key] = sanitizeForReact(value);
          } else if (typeof value === 'object' && value !== null) {
            // Prevent the specific problematic objects mentioned in the error
            const valueAny = value as any;
            if (valueAny.content || valueAny.meta || valueAny.items) {
              // Further sanitize these specific problematic structures
              const safeValue: any = {};
              if (typeof valueAny.content === 'string') safeValue.content = valueAny.content;
              if (typeof valueAny.text === 'string') safeValue.text = valueAny.text;
              if (typeof valueAny.level === 'number') safeValue.level = valueAny.level;
              if (typeof valueAny.style === 'string') safeValue.style = valueAny.style;
              if (Array.isArray(valueAny.items)) {
                safeValue.items = valueAny.items.map((item: any) => {
                  if (typeof item === 'string') return item;
                  if (typeof item === 'object' && item && typeof (item as any).text === 'string') return (item as any).text;
                  return String(item || '');
                });
              }
              sanitized[key] = safeValue;
            } else {
              sanitized[key] = sanitizeForReact(value);
            }
          }
        } catch (e) {
          // Skip problematic properties
          continue;
        }
      }
      return sanitized;
    }
    
    // Fallback for unknown types
    return null;
  } catch (error) {
    console.warn('Error sanitizing data for React:', error);
    return null;
  }
};

// Helper function to render HTML content safely
const renderHtmlContent = (content: any): JSX.Element => {
  if (!content) return <></>;
  
  let text = '';
  if (typeof content === 'string') {
    text = content;
  } else if (typeof content === 'number') {
    text = String(content);
  } else if (typeof content === 'boolean') {
    text = String(content);
  } else if (content && typeof content === 'object') {
    if (typeof content.text === 'string') {
      text = content.text;
    } else if (typeof content.content === 'string') {
      text = content.content;
    } else {
      text = String(content);
    }
  } else {
    text = String(content || '');
  }
  
  if (!text || text.trim() === '') return <></>;
  
  // Check if content contains HTML tags
  const hasHtmlTags = /<[^>]*>/.test(text);
  
  if (hasHtmlTags) {
    // Sanitize HTML content
    let sanitizedHtml = text
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/<object[^>]*>.*?<\/object>/gi, '')
      .replace(/<embed[^>]*>.*?<\/embed>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '');
    
    // Enhance HTML tags with proper CSS classes for better styling
    sanitizedHtml = sanitizedHtml
      .replace(/<strong(?![^>]*class=)[^>]*>/gi, '<strong class="font-bold">')
      .replace(/<b(?![^>]*class=)[^>]*>/gi, '<strong class="font-bold">')
      .replace(/<em(?![^>]*class=)[^>]*>/gi, '<em class="italic">')
      .replace(/<i(?![^>]*class=)[^>]*>/gi, '<em class="italic">')
      .replace(/<u(?![^>]*class=)[^>]*>/gi, '<u class="underline">')
      .replace(/<mark(?![^>]*class=)[^>]*>/gi, '<mark class="bg-yellow-200 px-1">')
      .replace(/<code(?![^>]*class=)[^>]*>/gi, '<code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">')
      .replace(/<small(?![^>]*class=)[^>]*>/gi, '<small class="text-sm">');
    
    // Render as HTML
    return <span dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
  }
  
  // Render as plain text with line breaks
  return (
    <>
      {text.split('\n').map((line, lineIndex, array) => (
        <React.Fragment key={lineIndex}>
          {line}
          {lineIndex < array.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
};

export default function EditorJSContent({ data, className = "prose prose-lg max-w-none" }: EditorJSContentProps) {
  const renderBlock = (block: EditorJSBlock, index: number) => {
    // Sanitize block data to prevent React errors
    const sanitizedBlock = sanitizeForReact(block) as EditorJSBlock;
    const { type, data: blockData } = sanitizedBlock;
    
    // Also sanitize blockData to ensure all nested objects are safe
    const safeBlockData = sanitizeForReact(blockData);

    switch (type) {
      case 'header':
        const HeaderTag = `h${safeBlockData.level || 2}` as keyof JSX.IntrinsicElements;
        const getHeaderSizeClass = (level: number) => {
          switch (level) {
            case 1: return "text-4xl font-bold mb-6 mt-8 first:mt-0";
            case 2: return "text-3xl font-bold mb-5 mt-7 first:mt-0";
            case 3: return "text-2xl font-bold mb-4 mt-6 first:mt-0";
            case 4: return "text-xl font-bold mb-3 mt-5 first:mt-0";
            case 5: return "text-lg font-bold mb-3 mt-4 first:mt-0";
            case 6: return "text-base font-bold mb-2 mt-3 first:mt-0";
            default: return "text-2xl font-bold mb-4 mt-6 first:mt-0";
          }
        };
        return (
          <HeaderTag key={index} className={getHeaderSizeClass(safeBlockData.level || 2)}>
            {renderHtmlContent(safeBlockData.text)}
          </HeaderTag>
        );

      case 'paragraph':
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {renderHtmlContent(safeBlockData.text)}
          </p>
        );

      case 'list':
        const ListTag = safeBlockData.style === 'ordered' ? 'ol' : 'ul';
        const ListItemTag = 'li';
        return (
          <ListTag key={index} className={`mb-4 ${safeBlockData.style === 'ordered' ? 'list-decimal list-inside' : 'list-disc list-inside'}`}>
            {safeBlockData.items?.map((item: string, itemIndex: number) => (
              <ListItemTag key={itemIndex} className="mb-1">
                {renderHtmlContent(item)}
              </ListItemTag>
            ))}
          </ListTag>
        );

      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-gray-300 pl-4 my-6 italic text-gray-700">
            <p className="mb-2">{renderHtmlContent(safeBlockData.text)}</p>
            {safeBlockData.caption && (
              <cite className="text-sm text-gray-500 not-italic">— {renderHtmlContent(safeBlockData.caption)}</cite>
            )}
          </blockquote>
        );

      case 'code':
        return (
          <pre key={index} className="bg-gray-100 rounded-lg p-4 my-4 overflow-x-auto">
            <code className="text-sm font-mono">
              {safeBlockData.code}
            </code>
          </pre>
        );

      case 'delimiter':
        return (
          <div key={index} className="flex items-center justify-center my-8">
            <div className="w-full h-px bg-gray-300"></div>
            <div className="mx-4 text-gray-400">* * *</div>
            <div className="w-full h-px bg-gray-300"></div>
          </div>
        );

      case 'table':
        return (
          <div key={index} className="overflow-x-auto my-6">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  {safeBlockData.content[0]?.map((cell: string, cellIndex: number) => (
                    <th key={cellIndex} className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left">
                      {renderHtmlContent(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {safeBlockData.content.slice(1).map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.map((cell: string, cellIndex: number) => (
                      <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                        {renderHtmlContent(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'linkTool':
        return (
          <div key={index} className="my-4 p-4 border border-gray-200 rounded-lg">
            {safeBlockData.link && (
              <a 
                href={safeBlockData.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block hover:bg-gray-50 p-3 rounded transition-colors"
              >
                {safeBlockData.meta && (
                  <div className="flex gap-3">
                    {safeBlockData.meta.image && (
                      <img 
                        src={safeBlockData.meta.image.url} 
                        alt={safeBlockData.meta.title || 'Link preview'}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {renderHtmlContent(safeBlockData.meta.title || safeBlockData.link)}
                      </h4>
                      {safeBlockData.meta.description && (
                        <p className="text-sm text-gray-600">{renderHtmlContent(safeBlockData.meta.description)}</p>
                      )}
                    </div>
                  </div>
                )}
              </a>
            )}
          </div>
        );

      default:
        // Fallback for unknown block types
        return (
          <div key={index} className="my-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Unknown block type: {type}
            </p>
            {safeBlockData && (
              <pre className="text-xs mt-2 text-gray-500">
                {JSON.stringify(safeBlockData, null, 2)}
              </pre>
            )}
          </div>
        );
    }
  };

  try {
    let parsedData: EditorJSData;

    if (typeof data === 'string') {
      if (!data.trim()) {
        return <div className={className}></div>;
      }
      const rawParsed = JSON.parse(data);
      // Sanitize parsed data before using
      parsedData = sanitizeForReact(rawParsed) as EditorJSData;
    } else {
      // Sanitize object data before using
      parsedData = sanitizeForReact(data) as EditorJSData;
    }

    // Double validation - ensure data structure is safe
    if (!parsedData || typeof parsedData !== 'object' || !parsedData.blocks || !Array.isArray(parsedData.blocks)) {
      return <div className={className}></div>;
    }

    // Multiple layers of sanitization for each block
    const sanitizedBlocks = parsedData.blocks
      .map(block => {
        try {
          const sanitized = sanitizeForReact(block) as EditorJSBlock;
          // Additional validation for each block
          if (sanitized && typeof sanitized === 'object' && sanitized.type && sanitized.data) {
            return sanitized;
          }
          return null;
        } catch (e) {
          console.warn('Failed to sanitize block:', e);
          return null;
        }
      })
      .filter(block => block !== null) as EditorJSBlock[];

    // Final safety check before rendering
    try {
      return (
        <div className={className}>
          {sanitizedBlocks.map((block, index) => {
            try {
              return renderBlock(block, index);
            } catch (e) {
              console.warn(`Error rendering block ${index}:`, e);
              return (
                <div key={index} className="my-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-700">Error rendering block</p>
                </div>
              );
            }
          })}
        </div>
      );
    } catch (renderError) {
      console.error('Error rendering blocks:', renderError);
      return <div className={className}></div>;
    }
  } catch (error) {
    console.error('Error parsing Editor.js data:', error);
    // Fallback: render as plain text with sanitization
    try {
      const fallbackContent = typeof data === 'string' ? data : JSON.stringify(sanitizeForReact(data));
      return (
        <div className={className}>
          <div dangerouslySetInnerHTML={{ __html: fallbackContent }} />
        </div>
      );
    } catch (fallbackError) {
      console.error('Fallback rendering also failed:', fallbackError);
      return <div className={className}></div>;
    }
  }
}
