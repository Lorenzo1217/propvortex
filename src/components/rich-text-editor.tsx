// src/components/rich-text-editor.tsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { BulletList } from '@tiptap/extension-bullet-list'
import { OrderedList } from '@tiptap/extension-ordered-list'
import { ListItem } from '@tiptap/extension-list-item'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Bold, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered,
  Undo,
  Redo
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface RichTextEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  name?: string
  className?: string
}

export function RichTextEditor({ 
  content = '', 
  onChange, 
  placeholder = 'Start typing...',
  name,
  className = ''
}: RichTextEditorProps) {
  const [htmlContent, setHtmlContent] = useState(content)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable default list extensions since we're configuring them specifically
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Underline,
      TextStyle,
      BulletList.configure({
        HTMLAttributes: {
          class: 'tiptap-bullet-list',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'tiptap-ordered-list',
        },
      }),
      ListItem,
    ],
    content,
    immediatelyRender: false, // Fix SSR hydration issues
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-sm xl:prose-sm mx-auto focus:outline-none min-h-[120px] px-3 py-3',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      console.log('Editor content updated:', html) // Debug log
      setHtmlContent(html)
      onChange?.(html)
    },
  })

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
      setHtmlContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return (
    <div className={`border border-gray-200 rounded-md ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2">
        <div className="flex items-center space-x-1">
          {/* Bold */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${
              editor.isActive('bold') ? 'bg-gray-100' : ''
            }`}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Button>

          {/* Underline */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${
              editor.isActive('underline') ? 'bg-gray-100' : ''
            }`}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Bullet List */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${
              editor.isActive('bulletList') ? 'bg-gray-100' : ''
            }`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </Button>

          {/* Numbered List */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${
              editor.isActive('orderedList') ? 'bg-gray-100' : ''
            }`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Undo */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>

          {/* Redo */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent 
          editor={editor} 
          className="min-h-[120px]"
        />
        {/* Hidden input for form submission */}
        {name && (
          <input
            type="hidden"
            name={name}
            value={htmlContent}
          />
        )}
        
        {/* Placeholder */}
        {editor.isEmpty && (
          <div className="absolute top-3 left-3 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .ProseMirror {
          outline: none;
        }
        
        .ProseMirror p {
          margin: 0.5rem 0;
        }
        
        .ProseMirror p:first-child {
          margin-top: 0;
        }
        
        .ProseMirror p:last-child {
          margin-bottom: 0;
        }

        .tiptap-bullet-list {
          list-style-type: disc;
          margin-left: 1.5rem;
          margin: 0.5rem 0;
        }

        .tiptap-ordered-list {
          list-style-type: decimal;
          margin-left: 1.5rem;
          margin: 0.5rem 0;
        }

        .tiptap-bullet-list li,
        .tiptap-ordered-list li {
          margin: 0.25rem 0;
          padding-left: 0.25rem;
        }

        .ProseMirror strong {
          font-weight: bold;
        }

        .ProseMirror u {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}