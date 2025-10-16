'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface EditorJSData {
  time: number;
  blocks: Array<{
    id: string;
    type: string;
    data: any;
  }>;
  version: string;
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

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Nhập nội dung bài viết...",
  className = ""
}: RichTextEditorProps) {
  const editorRef = useRef<any>(null);
  const editorInstance = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Editor.js
  useEffect(() => {
    let isMounted = true;

    const initEditor = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Dynamic imports for Editor.js and plugins
        const [
          EditorJS,
          Header,
          List,
          Paragraph,
          Quote,
          Code,
          LinkTool,
          Delimiter,
          Table
        ] = await Promise.all([
          import('@editorjs/editorjs'),
          import('@editorjs/header'),
          import('@editorjs/list'),
          import('@editorjs/paragraph'),
          import('@editorjs/quote'),
          import('@editorjs/code'),
          import('@editorjs/link'),
          import('@editorjs/delimiter'),
          import('@editorjs/table')
        ]);

        if (!isMounted) return;

        // Destroy existing editor
        if (editorInstance.current) {
          editorInstance.current.destroy();
          editorInstance.current = null;
        }

        // Parse existing value with sanitization
        let initialData: EditorJSData | undefined;
        if (value && value.trim()) {
          try {
            // Try to parse as JSON if it looks like Editor.js data
            if (value.startsWith('{') && value.includes('"blocks"')) {
              const parsed = JSON.parse(value);
              initialData = sanitizeForReact(parsed);
            } else {
              // Convert plain text to Editor.js format
              initialData = {
                time: Date.now(),
                blocks: [
                  {
                    id: 'initial-block',
                    type: 'paragraph',
                    data: {
                      text: value
                    }
                  }
                ],
                version: '2.28.2'
              };
            }
          } catch (e) {
            // If parsing fails, treat as plain text
            initialData = {
              time: Date.now(),
              blocks: [
                {
                  id: 'initial-block',
                  type: 'paragraph',
                  data: {
                    text: value
                  }
                }
              ],
              version: '2.28.2'
            };
          }
        }

        // Create Editor.js instance
        const editor = new EditorJS.default({
          holder: editorRef.current,
          placeholder: placeholder,
          data: initialData,
          tools: {
            header: {
              class: Header.default as any,
              config: {
                placeholder: 'Enter a header',
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 2
              }
            },
            list: {
              class: List.default as any,
              inlineToolbar: true,
              config: {
                defaultStyle: 'unordered'
              }
            },
            paragraph: {
              class: Paragraph.default as any,
              inlineToolbar: true
            },
            quote: {
              class: Quote.default as any,
              inlineToolbar: true,
              shortcut: 'CMD+SHIFT+O',
              config: {
                quotePlaceholder: 'Enter a quote',
                captionPlaceholder: 'Quote\'s author'
              }
            },
            code: {
              class: Code.default as any,
              shortcut: 'CMD+SHIFT+C'
            },
            linkTool: {
              class: LinkTool.default as any,
              config: {
                endpoint: '/api/link-preview' // You can implement this endpoint for link previews
              }
            },
            delimiter: Delimiter.default as any,
            table: {
              class: Table.default as any,
              inlineToolbar: true,
              config: {
                rows: 2,
                cols: 3
              }
            }
          },
          onChange: async (api: any) => {
            if (isMounted) {
              try {
                const outputData = await api.saver.save();
                // Sanitize data before passing to onChange to prevent React errors
                const sanitizedData = sanitizeForReact(outputData);
                onChange(JSON.stringify(sanitizedData));
              } catch (error) {
                console.error('Error saving editor data:', error);
              }
            }
          },
          onReady: () => {
            if (isMounted) {
              setIsLoading(false);
            }
          }
        });

        editorInstance.current = editor;

      } catch (error) {
        console.error('Error initializing Editor.js:', error);
        if (isMounted) {
          setError('Failed to load editor');
          setIsLoading(false);
        }
      }
    };

    // Initialize editor with a small delay
    const timer = setTimeout(initEditor, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []);

  // Handle external value changes
  useEffect(() => {
    if (editorInstance.current && value) {
      try {
        const data = JSON.parse(value);
        // Sanitize data before rendering to prevent React errors
        const sanitizedData = sanitizeForReact(data);
        editorInstance.current.render(sanitizedData);
      } catch (error) {
        // If it's not JSON, treat as plain text
        const plainTextData = {
          time: Date.now(),
          blocks: [
            {
              id: 'text-block',
              type: 'paragraph',
              data: {
                text: value
              }
            }
          ],
          version: '2.28.2'
        };
        editorInstance.current.render(plainTextData);
      }
    }
  }, [value]);

  if (error) {
    return (
      <div className={`border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="text-red-600 text-center">
          <p className="font-medium">Error loading editor</p>
          <p className="text-sm mt-1">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {isLoading && (
        <div className="flex items-center justify-center p-8 bg-gray-50">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-gray-500" />
            <p className="text-sm text-gray-500">Loading editor...</p>
          </div>
        </div>
      )}
      <div 
        ref={editorRef}
        className={`min-h-[400px] ${isLoading ? 'hidden' : 'block'}`}
      />
    </div>
  );
}
