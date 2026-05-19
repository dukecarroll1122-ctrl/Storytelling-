import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const editorStyles = `
  .ProseMirror {
    outline: none;
    min-height: 400px;
    color: #d4d0c8;
    font-family: Georgia, serif;
    font-size: 16px;
    line-height: 1.8;
  }
  .ProseMirror h1 {
    color: #ffffff;
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 8px;
    margin-top: 8px;
  }
  .ProseMirror h2 {
    color: #dddddd;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 6px;
    margin-top: 6px;
  }
  .ProseMirror strong {
    color: #ffffff;
    font-weight: bold;
  }
  .ProseMirror em {
    color: #d4d0c8;
    font-style: italic;
  }
  .ProseMirror s {
    color: #888;
    text-decoration: line-through;
  }
  .ProseMirror p {
    margin-bottom: 4px;
    margin-top: 0;
  }
  .ProseMirror ul {
    padding-left: 24px;
    margin-bottom: 8px;
  }
  .ProseMirror ol {
    padding-left: 24px;
    margin-bottom: 8px;
  }
  .ProseMirror li {
    margin-bottom: 4px;
    color: #d4d0c8;
  }
  .ProseMirror blockquote {
    border-left: 3px solid #2a2a2e;
    padding-left: 16px;
    margin-left: 0;
    color: #888;
    font-style: italic;
  }
`

function Editor({ selectedDoc, setSelectedDoc, docName, folders, setFolders, docData, setDocData, projectId }) {
  const [title, setTitle] = useState(docName || '')
  const [wordCount, setWordCount] = useState(0)

  const storageKey = projectId && selectedDoc ? `${projectId}-${selectedDoc}` : selectedDoc

  const editor = useEditor({
    extensions: [StarterKit],
    content: localStorage.getItem(storageKey) || '',
    onUpdate: ({ editor }) => {
      localStorage.setItem(storageKey, editor.getHTML())
      const text = editor.state.doc.textContent.trim()
      const count = text === '' ? 0 : text.split(/\s+/).length
      setWordCount(count)
      if (selectedDoc && setDocData) {
        setDocData(prev => ({
          ...prev,
          [selectedDoc]: {
            ...prev[selectedDoc],
            wordCount: count,
          }
        }))
      }
    },
  })

  useEffect(() => {
    setTitle(docName || '')
    if (editor) {
      const saved = localStorage.getItem(storageKey) || ''
      editor.commands.setContent(saved)
      const text = editor.state.doc.textContent.trim()
      const count = text === '' ? 0 : text.split(/\s+/).length
      setWordCount(count)
    }
  }, [selectedDoc, editor, docName, storageKey])

  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (setFolders && folders) {
      setFolders(folders.map(f => ({
        ...f,
        docs: f.docs.map(d =>
          d.id === selectedDoc ? { ...d, name: newTitle } : d
        )
      })))
    }
  }

  const tbStyle = (active) => ({
    background: active ? '#1a1a2e' : 'transparent',
    border: '1px solid #2a2a2e',
    color: active ? '#fff' : '#666',
    borderRadius: '4px',
    padding: '4px 10px',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'Inter, sans-serif',
  })

  return (
    <>
      <style>{editorStyles}</style>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0f0f11' }}>

        <div style={{ padding: '24px 48px 0', borderBottom: '1px solid #1a1a1d' }}>
          <input
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#ffffff', fontSize: '22px', fontFamily: 'Georgia, serif', width: '100%', marginBottom: '12px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 48px', borderBottom: '1px solid #1a1a1d', flexWrap: 'wrap' }}>

          <button onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleBold().run() }} style={tbStyle(editor?.isActive('bold'))}>
            <strong>B</strong>
          </button>
          <button onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleItalic().run() }} style={tbStyle(editor?.isActive('italic'))}>
            <em>I</em>
          </button>
          <button onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleStrike().run() }} style={tbStyle(editor?.isActive('strike'))}>
            <span style={{ textDecoration: 'line-through' }}>S</span>
          </button>

          <div style={{ width: '1px', height: '14px', background: '#2a2a2e', margin: '0 4px' }} />

          <button onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleHeading({ level: 1 }).run() }} style={tbStyle(editor?.isActive('heading', { level: 1 }))}>
            H1
          </button>
          <button onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleHeading({ level: 2 }).run() }} style={tbStyle(editor?.isActive('heading', { level: 2 }))}>
            H2
          </button>

          <div style={{ width: '1px', height: '14px', background: '#2a2a2e', margin: '0 4px' }} />

          <button onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleBulletList().run() }} style={tbStyle(editor?.isActive('bulletList'))}>
            ≡
          </button>
          <button onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleOrderedList().run() }} style={tbStyle(editor?.isActive('orderedList'))}>
            1≡
          </button>
          <button onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleBlockquote().run() }} style={tbStyle(editor?.isActive('blockquote'))}>
            ❝
          </button>

        </div>

        <div style={{ flex: 1, padding: '32px 48px', overflow: 'auto' }}>
          <EditorContent editor={editor} />
        </div>

        <div style={{ padding: '8px 48px', borderTop: '1px solid #1a1a1d', color: '#555', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
          {wordCount} words
        </div>

      </div>
    </>
  )
}

export default Editor