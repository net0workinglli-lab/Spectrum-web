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

  // Add CSS for Editor.js header sizing with more aggressive targeting
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'editorjs-header-styles';
    style.textContent = `
      /* Editor.js container styling */
      .codex-editor__redactor {
        padding: 20px !important;
      }
      
      /* Base header styling */
      .ce-header,
      .ce-block__content h1,
      .ce-block__content h2,
      .ce-block__content h3,
      .ce-block__content h4,
      .ce-block__content h5,
      .ce-block__content h6 {
        font-weight: bold !important;
        margin: 16px 0 8px 0 !important;
        display: block !important;
      }
      
      /* Level 1 - H1 */
      .ce-header[data-level="1"],
      .ce-block__content h1,
      .ce-header[data-level="1"] .ce-paragraph {
        font-size: 2.25rem !important;
        line-height: 2.5rem !important;
        margin: 32px 0 24px 0 !important;
      }
      
      /* Level 2 - H2 */
      .ce-header[data-level="2"],
      .ce-block__content h2,
      .ce-header[data-level="2"] .ce-paragraph {
        font-size: 1.875rem !important;
        line-height: 2.25rem !important;
        margin: 28px 0 20px 0 !important;
      }
      
      /* Level 3 - H3 */
      .ce-header[data-level="3"],
      .ce-block__content h3,
      .ce-header[data-level="3"] .ce-paragraph {
        font-size: 1.5rem !important;
        line-height: 2rem !important;
        margin: 24px 0 16px 0 !important;
      }
      
      /* Level 4 - H4 */
      .ce-header[data-level="4"],
      .ce-block__content h4,
      .ce-header[data-level="4"] .ce-paragraph {
        font-size: 1.25rem !important;
        line-height: 1.75rem !important;
        margin: 20px 0 12px 0 !important;
      }
      
      /* Level 5 - H5 */
      .ce-header[data-level="5"],
      .ce-block__content h5,
      .ce-header[data-level="5"] .ce-paragraph {
        font-size: 1.125rem !important;
        line-height: 1.75rem !important;
        margin: 16px 0 12px 0 !important;
      }
      
      /* Level 6 - H6 */
      .ce-header[data-level="6"],
      .ce-block__content h6,
      .ce-header[data-level="6"] .ce-paragraph {
        font-size: 1rem !important;
        line-height: 1.5rem !important;
        margin: 12px 0 8px 0 !important;
      }
      
      /* Force override any conflicting styles */
      .ce-header * {
        font-size: inherit !important;
        line-height: inherit !important;
      }
    `;
    
    // Remove existing style if it exists
    const existingStyle = document.getElementById('editorjs-header-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);
    console.log('Editor.js header styles injected');
    
    return () => {
      const styleToRemove = document.getElementById('editorjs-header-styles');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, []);

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
                // Multiple layers of sanitization
                let sanitizedData = sanitizeForReact(outputData);
                
                // Double validation - ensure data is safe for React
                try {
                  const testStringify = JSON.stringify(sanitizedData);
                  const testParse = JSON.parse(testStringify);
                  sanitizedData = testParse;
                } catch (e) {
                  // If data is still problematic, create a minimal safe structure
                  sanitizedData = {
                    time: Date.now(),
                    blocks: [],
                    version: '2.28.2'
                  };
                }
                
                // Final safety check before calling onChange
                if (sanitizedData && typeof sanitizedData === 'object' && Array.isArray(sanitizedData.blocks)) {
                  onChange(JSON.stringify(sanitizedData));
                } else {
                  console.warn('Invalid sanitized data structure, skipping onChange');
                }
              } catch (error) {
                console.error('Error saving editor data:', error);
                // Provide fallback safe data
                const fallbackData = {
                  time: Date.now(),
                  blocks: [],
                  version: '2.28.2'
                };
                onChange(JSON.stringify(fallbackData));
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
