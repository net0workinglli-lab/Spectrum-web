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

// Helper function to sanitize data for React compatibility
const sanitizeForReact = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForReact(item));
  }
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
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
        sanitized[key] = sanitizeForReact(value);
      }
    }
    return sanitized;
  }
  return null;
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
        return (
          <HeaderTag key={index} className="font-bold mb-4 mt-6 first:mt-0">
            {safeBlockData.text}
          </HeaderTag>
        );

      case 'paragraph':
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {safeBlockData.text}
          </p>
        );

      case 'list':
        const ListTag = safeBlockData.style === 'ordered' ? 'ol' : 'ul';
        const ListItemTag = 'li';
        return (
          <ListTag key={index} className={`mb-4 ${safeBlockData.style === 'ordered' ? 'list-decimal list-inside' : 'list-disc list-inside'}`}>
            {safeBlockData.items?.map((item: string, itemIndex: number) => (
              <ListItemTag key={itemIndex} className="mb-1">
                {item}
              </ListItemTag>
            ))}
          </ListTag>
        );

      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-gray-300 pl-4 my-6 italic text-gray-700">
            <p className="mb-2">{safeBlockData.text}</p>
            {safeBlockData.caption && (
              <cite className="text-sm text-gray-500 not-italic">— {safeBlockData.caption}</cite>
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
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {safeBlockData.content.slice(1).map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.map((cell: string, cellIndex: number) => (
                      <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                        {cell}
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
                        {safeBlockData.meta.title || safeBlockData.link}
                      </h4>
                      {safeBlockData.meta.description && (
                        <p className="text-sm text-gray-600">{safeBlockData.meta.description}</p>
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

    if (!parsedData.blocks || !Array.isArray(parsedData.blocks)) {
      return <div className={className}></div>;
    }

    // Sanitize each block before rendering
    const sanitizedBlocks = parsedData.blocks.map(block => sanitizeForReact(block) as EditorJSBlock);

    return (
      <div className={className}>
        {sanitizedBlocks.map((block, index) => renderBlock(block, index))}
      </div>
    );
  } catch (error) {
    console.error('Error parsing Editor.js data:', error);
    // Fallback: render as plain text with sanitization
    const fallbackContent = typeof data === 'string' ? data : JSON.stringify(sanitizeForReact(data));
    return (
      <div className={className}>
        <div dangerouslySetInnerHTML={{ __html: fallbackContent }} />
      </div>
    );
  }
}
