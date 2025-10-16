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

export default function EditorJSContent({ data, className = "prose prose-lg max-w-none" }: EditorJSContentProps) {
  const renderBlock = (block: EditorJSBlock, index: number) => {
    const { type, data: blockData } = block;

    switch (type) {
      case 'header':
        const HeaderTag = `h${blockData.level || 2}` as keyof JSX.IntrinsicElements;
        return (
          <HeaderTag key={index} className="font-bold mb-4 mt-6 first:mt-0">
            {blockData.text}
          </HeaderTag>
        );

      case 'paragraph':
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {blockData.text}
          </p>
        );

      case 'list':
        const ListTag = blockData.style === 'ordered' ? 'ol' : 'ul';
        const ListItemTag = 'li';
        return (
          <ListTag key={index} className={`mb-4 ${blockData.style === 'ordered' ? 'list-decimal list-inside' : 'list-disc list-inside'}`}>
            {blockData.items?.map((item: string, itemIndex: number) => (
              <ListItemTag key={itemIndex} className="mb-1">
                {item}
              </ListItemTag>
            ))}
          </ListTag>
        );

      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-gray-300 pl-4 my-6 italic text-gray-700">
            <p className="mb-2">{blockData.text}</p>
            {blockData.caption && (
              <cite className="text-sm text-gray-500 not-italic">— {blockData.caption}</cite>
            )}
          </blockquote>
        );

      case 'code':
        return (
          <pre key={index} className="bg-gray-100 rounded-lg p-4 my-4 overflow-x-auto">
            <code className="text-sm font-mono">
              {blockData.code}
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
                  {blockData.content[0]?.map((cell: string, cellIndex: number) => (
                    <th key={cellIndex} className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {blockData.content.slice(1).map((row: string[], rowIndex: number) => (
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
            {blockData.link && (
              <a 
                href={blockData.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block hover:bg-gray-50 p-3 rounded transition-colors"
              >
                {blockData.meta && (
                  <div className="flex gap-3">
                    {blockData.meta.image && (
                      <img 
                        src={blockData.meta.image.url} 
                        alt={blockData.meta.title || 'Link preview'}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {blockData.meta.title || blockData.link}
                      </h4>
                      {blockData.meta.description && (
                        <p className="text-sm text-gray-600">{blockData.meta.description}</p>
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
            {blockData && (
              <pre className="text-xs mt-2 text-gray-500">
                {JSON.stringify(blockData, null, 2)}
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
      parsedData = JSON.parse(data);
    } else {
      parsedData = data;
    }

    if (!parsedData.blocks || !Array.isArray(parsedData.blocks)) {
      return <div className={className}></div>;
    }

    return (
      <div className={className}>
        {parsedData.blocks.map((block, index) => renderBlock(block, index))}
      </div>
    );
  } catch (error) {
    console.error('Error parsing Editor.js data:', error);
    // Fallback: render as plain text
    return (
      <div className={className}>
        <div dangerouslySetInnerHTML={{ __html: typeof data === 'string' ? data : JSON.stringify(data) }} />
      </div>
    );
  }
}
