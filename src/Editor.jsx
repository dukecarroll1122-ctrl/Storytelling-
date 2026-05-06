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
  .ProseMirror p {
    margin-bottom: 4px;
    margin-top: 0;
  }
`

function Editor({ selectedDoc, setSelectedDoc, documents, setDocuments, research, setResearch, characters, setCharacters }) {
  const [title, setTitle] = useState(selectedDoc)
  const [wordCount, setWordCount] = useState(0)

  const editor = useEditor({
    extensions: [StarterKit],
    content: localStorage.getItem(selectedDoc) || '',
    onUpdate: ({ editor }) => {
      localStorage.setItem(selectedDoc, editor.getHTML())
      const text = editor.state.doc.textContent.trim()
      const count = text === '' ? 0 : text.split(/\s+/).length
      setWordCount(count)
    },
  })

  useEffect(() => {
    setTitle(selectedDoc.startsWith('Untitled') ? 'Untitled' : selectedDoc)
    if (editor) {
      const saved = localStorage.getItem(selectedDoc) || ''
      editor.commands.setContent(saved)
      const text = editor.state.doc.textContent.trim()
      const count = text === '' ? 0 : text.split(/\s+/).length
      setWordCount(count)
    }
  }, [selectedDoc, editor])

  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    const allLists = [
      { list: documents, setList: setDocuments },
      { list: research, setList: setResearch },
      { list: characters, setList: setCharacters },
    ]
    allLists.forEach(({ list, setList }) => {
      if (list.includes(selectedDoc)) {
        const updated = list.map(d => d === selectedDoc ? newTitle : d)
        setList(updated)
        setSelectedDoc(newTitle)
      }
    })
  }

  const handleBold = (e) => {
    e.preventDefault()
    editor && editor.chain().focus().toggleBold().run()
  }

  const handleItalic = (e) => {
    e.preventDefault()
    editor && editor.chain().focus().toggleItalic().run()
  }

  const handleH1 = (e) => {
    e.preventDefault()
    editor && editor.chain().focus().toggleHeading({ level: 1 }).run()
  }

  const handleH2 = (e) => {
    e.preventDefault()
    editor && editor.chain().focus().toggleHeading({ level: 2 }).run()
  }

  return (
    <>
      <style>{editorStyles}</style>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0f0f11' }}>

        <div style={{ padding: '24px 48px 0', borderBottom: '1px solid #1a1a1d' }}>
          <input
            value={title}
            onChange={handleTitleChange}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#ffffff', fontSize: '22px', fontFamily: 'Georgia', width: '100%', marginBottom: '12px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', padding: '8px 48px', borderBottom: '1px solid #1a1a1d' }}>
          <button
            onMouseDown={handleBold}
            style={{ background: editor?.isActive('bold') ? '#1a1a2e' : 'transparent', border: '1px solid #2a2a2e', color: editor?.isActive('bold') ? '#fff' : '#666', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
            B
          </button>
          <button
            onMouseDown={handleItalic}
            style={{ background: editor?.isActive('italic') ? '#1a1a2e' : 'transparent', border: '1px solid #2a2a2e', color: editor?.isActive('italic') ? '#fff' : '#666', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontStyle: 'italic', fontSize: '13px' }}>
            I
          </button>
          <button
            onMouseDown={handleH1}
            style={{ background: editor?.isActive('heading', { level: 1 }) ? '#1a1a2e' : 'transparent', border: '1px solid #2a2a2e', color: editor?.isActive('heading', { level: 1 }) ? '#fff' : '#666', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '13px' }}>
            H1
          </button>
          <button
            onMouseDown={handleH2}
            style={{ background: editor?.isActive('heading', { level: 2 }) ? '#1a1a2e' : 'transparent', border: '1px solid #2a2a2e', color: editor?.isActive('heading', { level: 2 }) ? '#fff' : '#666', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '13px' }}>
            H2
          </button>
        </div>

        <div style={{ flex: 1, padding: '32px 48px', overflow: 'auto' }}>
          <EditorContent editor={editor} />
        </div>

        <div style={{ padding: '8px 48px', borderTop: '1px solid #1a1a1d', color: '#555', fontSize: '12px' }}>
          {wordCount} words
        </div>

      </div>
    </>
  )
}

export default Editor