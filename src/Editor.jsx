import { useState, useEffect } from 'react'

function Editor({ selectedDoc }) {
  const [content, setContent] = useState(() => {
    return localStorage.getItem(selectedDoc) || ''
  })
  const [title, setTitle] = useState(selectedDoc)

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  useEffect(() => {
    setTitle(selectedDoc)
    const saved = localStorage.getItem(selectedDoc)
    setContent(saved || '')
  }, [selectedDoc])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0f0f11' }}>

      <div style={{ padding: '24px 48px 0', borderBottom: '1px solid #1a1a1d' }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ background: 'transparent', border: 'none', outline: 'none', color: '#ffffff', fontSize: '22px', fontFamily: 'Georgia', width: '100%', marginBottom: '12px' }}
        />
      </div>

      <div style={{ flex: 1, padding: '32px 48px', overflow: 'auto' }}>
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
            localStorage.setItem(selectedDoc, e.target.value)
          }}
          placeholder="Start writing..."
          style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#d4d0c8', fontSize: '16px', fontFamily: 'Georgia', lineHeight: '1.8', resize: 'none' }}
        />
      </div>

      <div style={{ padding: '8px 48px', borderTop: '1px solid #1a1a1d', color: '#555', fontSize: '12px' }}>
        {wordCount} words
      </div>

    </div>
  )
}

export default Editor