import { useEffect, useState, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Extension } from '@tiptap/core'
import jsPDF from 'jspdf'
import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx'
import { saveAs } from 'file-saver'
import { saveDocument } from './api'
import AIAssistant from './AIAssistant'
import { QuoteIcon, SearchIcon, SparkleIcon, PaletteIcon, MoonIcon, ScrollIcon, SunIcon, FileIcon, FileTextIcon, BookIcon } from './icons'

const TextAlign = Extension.create({
  name: 'textAlign',
  addGlobalAttributes() {
    return [{
      types: ['paragraph', 'heading'],
      attributes: {
        textAlign: {
          default: 'left',
          parseHTML: element => element.style.textAlign || 'left',
          renderHTML: attributes => {
            if (attributes.textAlign === 'left') return {}
            return { style: `text-align: ${attributes.textAlign}` }
          },
        },
      },
    }]
  },
  addCommands() {
    return {
      setTextAlign: (alignment) => ({ commands }) => {
        return commands.updateAttributes('paragraph', { textAlign: alignment })
      },
    }
  },
})

function Editor({ selectedDoc, setSelectedDoc, docName, folders, setFolders, docData, setDocData, projectId, distractionFree, setDistractionFree, userPlan, wordGoal, todayWords, onWordsUpdate, theme, setTheme, fontFamily, setFontFamily }) {
  const themes = {
    dark: { bg: '#0f0f11', text: '#d4d0c8', heading: '#ffffff', border: '#1a1a1d' },
    sepia: { bg: '#f4ecd8', text: '#5b4636', heading: '#3a2e22', border: '#ddd0b5' },
    light: { bg: '#ffffff', text: '#2a2a2a', heading: '#0a0a0a', border: '#e5e5e5' },
  }
  const currentTheme = themes[theme] || themes.dark

  const [isNarrow, setIsNarrow] = useState(() => window.innerWidth < 640)
  const contentPadX = isNarrow ? '20px' : '48px'

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 640)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const [title, setTitle] = useState(docName || '')
  const [wordCount, setWordCount] = useState(0)
  const [showExport, setShowExport] = useState(false)
  const [showFindReplace, setShowFindReplace] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [saveStatus, setSaveStatus] = useState('saved')
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [showFontMenu, setShowFontMenu] = useState(false)
  const projectIdRef = useRef(projectId)
  const selectedDocRef = useRef(selectedDoc)

  useEffect(() => {
    projectIdRef.current = projectId
  }, [projectId])

  useEffect(() => {
    selectedDocRef.current = selectedDoc
  }, [selectedDoc])

  const storageKey = projectId && selectedDoc ? `${projectId}-${selectedDoc}` : selectedDoc

  const centerCursor = (smooth = true) => {
    if (!editor) return
    requestAnimationFrame(() => {
      const { from } = editor.state.selection
      const coords = editor.view.coordsAtPos(from)
      const editorWrapper = document.querySelector('.editor-scroll-area')
      if (editorWrapper && coords) {
        const wrapperRect = editorWrapper.getBoundingClientRect()
        const lineHeight = 26
        const cursorOffsetFromTop = coords.top - wrapperRect.top
        const targetScroll = editorWrapper.scrollTop + cursorOffsetFromTop - (wrapperRect.height / 2) + (lineHeight / 2)
        editorWrapper.scrollTo({ top: Math.max(0, targetScroll), behavior: smooth ? 'smooth' : 'auto' })
      }
    })
  }

  const editor = useEditor({
    extensions: [StarterKit, TextAlign],
    content: localStorage.getItem(storageKey) || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const currentProjectId = projectIdRef.current
      const currentDocId = selectedDocRef.current
      const currentStorageKey = currentProjectId && currentDocId ? `${currentProjectId}-${currentDocId}` : currentDocId
      localStorage.setItem(currentStorageKey, html)
      const text = editor.state.doc.textContent.trim()
      const count = text === '' ? 0 : text.split(/\s+/).length
      setWordCount(count)
      if (onWordsUpdate) onWordsUpdate(count)
      if (currentDocId && setDocData) {
        setDocData(prev => ({
          ...prev,
          [currentDocId]: {
            ...prev[currentDocId],
            wordCount: count,
          }
        }))
      }
      if (currentProjectId && currentDocId) {
        const dbId = localStorage.getItem(`db-${currentProjectId}`) || currentProjectId
        if (dbId) {
          setSaveStatus('saving')
          const attemptSave = async (retries = 3) => {
            try {
              await saveDocument(dbId, currentDocId, html)
              setSaveStatus('saved')
              const backupKey = `backup-${currentDocId}`
              const backups = JSON.parse(localStorage.getItem(backupKey) || '[]')
              backups.unshift({ content: html, timestamp: new Date().toISOString() })
              if (backups.length > 5) backups.pop()
              localStorage.setItem(backupKey, JSON.stringify(backups))
            } catch (err) {
              if (retries > 1) {
                setTimeout(() => attemptSave(retries - 1), 2000)
              } else {
                setSaveStatus('error')
              }
            }
          }
          attemptSave()
        }
      }
    },
    onSelectionUpdate: () => {
      if (!distractionFree) return
      centerCursor(true)
    },
  })

  useEffect(() => {
    if (distractionFree && editor) {
      setTimeout(() => centerCursor(false), 50)
    }
  }, [distractionFree, editor])

  useEffect(() => {
    setTitle(docName || '')
    if (editor && projectId && selectedDoc) {
      const dbId = localStorage.getItem(`db-${projectId}`) || projectId
      if (dbId) {
        import('./api').then(({ getDocument }) => {
          getDocument(dbId, selectedDoc).then(data => {
            const content = data?.content || localStorage.getItem(storageKey) || ''
            editor.commands.setContent(content)
            const text = editor.state.doc.textContent.trim()
            const count = text === '' ? 0 : text.split(/\s+/).length
            setWordCount(count)
          })
        })
      }
    }
  }, [selectedDoc, editor, docName, storageKey, projectId])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault()
        setShowFindReplace(prev => !prev)
      }
      if (e.key === 'Escape') {
        setShowFindReplace(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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

  const findNext = () => {
    if (!findText || !editor) return
    const text = editor.state.doc.textContent
    const { from } = editor.state.selection
    let index = text.indexOf(findText, from)
    if (index === -1) index = text.indexOf(findText)
    if (index !== -1) {
      editor.chain().focus().setTextSelection({
        from: index + 1,
        to: index + findText.length + 1
      }).run()
    }
  }

  const replaceAll = () => {
    if (!findText || !editor) return
    const content = editor.getHTML()
    const newContent = content.split(findText).join(replaceText)
    editor.commands.setContent(newContent)
    localStorage.setItem(storageKey, newContent)
    setShowFindReplace(false)
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    const margin = 20
    const maxWidth = doc.internal.pageSize.getWidth() - margin * 2
    let y = 20
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.text(title || 'Untitled', margin, y)
    y += 12
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
    const plainText = editor?.state.doc.textContent || ''
    const lines = doc.splitTextToSize(plainText, maxWidth)
    lines.forEach(line => {
      if (y > 280) { doc.addPage(); y = 20 }
      doc.text(line, margin, y)
      y += 7
    })
    doc.save(`${title || 'Untitled'}.pdf`)
    setShowExport(false)
  }

  const exportDOCX = async () => {
    const plainText = editor?.state.doc.textContent || ''
    const paragraphs = plainText.split('\n').filter(p => p.trim()).map(text =>
      new Paragraph({
        children: [new TextRun({ text, size: 24 })],
        spacing: { after: 200 },
      })
    )
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: title || 'Untitled',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
          }),
          ...paragraphs
        ],
      }],
    })
    const blob = await Packer.toBlob(doc)
    saveAs(blob, `${title || 'Untitled'}.docx`)
    setShowExport(false)
  }

  const exportEPUB = async () => {
    try {
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      const content = editor?.getHTML() || ''
      const docTitle = title || 'Untitled'

      zip.file('mimetype', 'application/epub+zip')
      zip.folder('META-INF').file('container.xml',
        `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`)

      const oebps = zip.folder('OEBPS')
      oebps.file('content.opf',
        `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="uid" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${docTitle}</dc:title>
    <dc:language>en</dc:language>
    <dc:identifier id="uid">storytelling-${Date.now()}</dc:identifier>
  </metadata>
  <manifest>
    <item id="chapter1" href="chapter1.html" media-type="application/xhtml+xml"/>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="chapter1"/>
  </spine>
</package>`)

      oebps.file('toc.ncx',
        `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="storytelling-${Date.now()}"/>
  </head>
  <docTitle><text>${docTitle}</text></docTitle>
  <navMap>
    <navPoint id="chapter1" playOrder="1">
      <navLabel><text>${docTitle}</text></navLabel>
      <content src="chapter1.html"/>
    </navPoint>
  </navMap>
</ncx>`)

      oebps.file('chapter1.html',
        `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${docTitle}</title>
  <style>
    body { font-family: Georgia, serif; font-size: 1em; line-height: 1.8; margin: 2em; }
    h1 { font-size: 1.8em; margin-bottom: 0.5em; }
    h2 { font-size: 1.4em; margin-bottom: 0.4em; }
    p { margin-bottom: 0.8em; }
  </style>
</head>
<body>
  <h1>${docTitle}</h1>
  ${content}
</body>
</html>`)

      const blob = await zip.generateAsync({
        type: 'blob',
        mimeType: 'application/epub+zip',
      })
      saveAs(blob, `${docTitle}.epub`)
      setShowExport(false)
    } catch (err) {
      console.error('EPUB export failed:', err)
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

  const readingTime = Math.max(1, Math.round(wordCount / 200))

  return (
    <>
      <style>{`
        .ProseMirror {
          outline: none;
          min-height: 400px;
          color: ${currentTheme.text};
          font-family: ${fontFamily};
          font-size: 16px;
          line-height: 1.8;
        }
        .ProseMirror h1 {
          color: ${currentTheme.heading};
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 8px;
          margin-top: 8px;
        }
        .ProseMirror h2 {
          color: ${currentTheme.heading};
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 6px;
          margin-top: 6px;
        }
        .ProseMirror strong {
          color: ${currentTheme.heading};
          font-weight: bold;
        }
        .ProseMirror em {
          color: ${currentTheme.text};
          font-style: italic;
        }
        .ProseMirror s {
          color: #888;
          text-decoration: line-through;
        }
        .ProseMirror u {
          text-decoration: underline;
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
          color: ${currentTheme.text};
        }
        .ProseMirror blockquote {
          border-left: 3px solid ${currentTheme.border};
          padding-left: 16px;
          margin-left: 0;
          color: #888;
          font-style: italic;
        }
      `}</style>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: currentTheme.bg, position: 'relative' }}>

        <div style={{ padding: '24px 48px 0', borderBottom: `1px solid ${currentTheme.border}` }}>
          <input
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            style={{ background: 'transparent', border: 'none', outline: 'none', color: currentTheme.heading, fontSize: '22px', fontFamily: 'Georgia, serif', width: '100%', marginBottom: '12px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: `8px ${contentPadX}`, borderBottom: `1px solid ${currentTheme.border}`, flexWrap: 'wrap' }}>

          <button onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleBold().run() }} style={tbStyle(editor?.isActive('bold'))}>
            <strong>B</strong>
          </button>
          <button onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleItalic().run() }} style={tbStyle(editor?.isActive('italic'))}>
            <em>I</em>
          </button>
          <button onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleStrike().run() }} style={tbStyle(editor?.isActive('strike'))}>
            <span style={{ textDecoration: 'line-through' }}>S</span>
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault()
              editor?.chain().focus().toggleMark('underline').run()
            }}
            style={tbStyle(editor?.isActive('underline'))}>
            <span style={{ textDecoration: 'underline' }}>U</span>
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
          <button aria-label="Blockquote" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleBlockquote().run() }} style={tbStyle(editor?.isActive('blockquote'))}>
            <QuoteIcon width="14" height="14" />
          </button>

          <div style={{ width: '1px', height: '14px', background: '#2a2a2e', margin: '0 4px' }} />

          <button onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().setTextAlign('left').run() }} style={tbStyle(false)}>
            ←
          </button>
          <button onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().setTextAlign('center').run() }} style={tbStyle(false)}>
            ↔
          </button>
          <button onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().setTextAlign('right').run() }} style={tbStyle(false)}>
            →
          </button>

          <div style={{ width: '1px', height: '14px', background: '#2a2a2e', margin: '0 4px' }} />

          <button
            aria-label="Find and replace"
            onMouseDown={(e) => { e.preventDefault(); setShowFindReplace(!showFindReplace) }}
            style={tbStyle(showFindReplace)}>
            <SearchIcon width="14" height="14" />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault()
              if (userPlan === 'free') {
                alert('AI Assistant is a Pro feature. Upgrade to unlock AI writing assistance.')
                return
              }
              setShowAI(!showAI)
            }}
            style={{ ...tbStyle(showAI), display: 'flex', alignItems: 'center', gap: '4px' }}>
            <SparkleIcon width="14" height="14" /> AI
          </button>

          <div style={{ width: '1px', height: '14px', background: '#2a2a2e', margin: '0 4px' }} />

          <div style={{ position: 'relative' }}>
            <button
              onMouseDown={(e) => { e.preventDefault(); setShowThemeMenu(!showThemeMenu) }}
              style={{ ...tbStyle(showThemeMenu), display: 'flex', alignItems: 'center', gap: '4px' }}>
              <PaletteIcon width="14" height="14" /> Theme
            </button>
            {showThemeMenu && (
              <div style={{ position: 'absolute', top: '34px', left: '0', background: '#141416', border: '1px solid #2a2a2e', borderRadius: '6px', padding: '4px', zIndex: 100, minWidth: '120px' }}>
                {['dark', 'sepia', 'light'].map(t => {
                  const ThemeIcon = t === 'dark' ? MoonIcon : t === 'sepia' ? ScrollIcon : SunIcon
                  return (
                    <button
                      key={t}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { setTheme(t); setShowThemeMenu(false) }}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', border: 'none', padding: '8px 12px', background: 'transparent', color: theme === t ? '#7ec8e3' : '#ccc', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', fontFamily: 'Inter, sans-serif', textTransform: 'capitalize' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#1e1e22'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <ThemeIcon width="14" height="14" /> {t}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <button
              onMouseDown={(e) => { e.preventDefault(); setShowFontMenu(!showFontMenu) }}
              style={tbStyle(showFontMenu)}>
              Aa Font
            </button>
            {showFontMenu && (
              <div style={{ position: 'absolute', top: '34px', left: '0', background: '#141416', border: '1px solid #2a2a2e', borderRadius: '6px', padding: '4px', zIndex: 100, minWidth: '180px' }}>
                {[
                  { label: 'Georgia', value: 'Georgia, serif' },
                  { label: 'Times New Roman', value: '"Times New Roman", serif' },
                  { label: 'Courier (Screenplay)', value: '"Courier New", monospace' },
                  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
                ].map(f => (
                  <button
                    key={f.value}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { setFontFamily(f.value); setShowFontMenu(false) }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', border: 'none', padding: '8px 12px', background: 'transparent', color: fontFamily === f.value ? '#7ec8e3' : '#ccc', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', fontFamily: f.value }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1e1e22'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ width: '1px', height: '14px', background: '#2a2a2e', margin: '0 4px' }} />

          <div style={{ position: 'relative' }}>
            <button
              onMouseDown={(e) => { e.preventDefault(); setShowExport(!showExport) }}
              style={tbStyle(showExport)}>
              Export ↓
            </button>
            {showExport && (
              <div style={{ position: 'absolute', top: '34px', left: '0', background: '#141416', border: '1px solid #2a2a2e', borderRadius: '6px', padding: '4px', zIndex: 100, minWidth: '170px' }}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={exportPDF}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', textAlign: 'left', border: 'none', padding: '8px 12px', background: 'transparent', color: '#ccc', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', fontFamily: 'Inter, sans-serif' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1e1e22'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <FileIcon width="14" height="14" /> Export as PDF
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={exportDOCX}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', textAlign: 'left', border: 'none', padding: '8px 12px', background: 'transparent', color: '#ccc', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', fontFamily: 'Inter, sans-serif' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1e1e22'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <FileTextIcon width="14" height="14" /> Export as DOCX
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={exportEPUB}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', textAlign: 'left', border: 'none', padding: '8px 12px', background: 'transparent', color: '#ccc', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', fontFamily: 'Inter, sans-serif' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1e1e22'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <BookIcon width="14" height="14" /> Export as EPUB
                </button>
              </div>
            )}
          </div>

          {distractionFree && (
            <button
              onMouseDown={(e) => { e.preventDefault(); setDistractionFree(false) }}
              style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid #2a2a2e', color: '#555', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>
              Exit Focus
            </button>
          )}

        </div>

        {showFindReplace && (
          <div style={{
            position: 'absolute',
            top: '120px',
            right: '32px',
            background: '#141416',
            border: '1px solid #2a2a2e',
            borderRadius: '8px',
            padding: '16px',
            zIndex: 200,
            width: '300px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: '#888', fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: '500', letterSpacing: '0.08em' }}>FIND & REPLACE</span>
              <span onClick={() => setShowFindReplace(false)} style={{ color: '#555', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>×</span>
            </div>
            <input
              autoFocus
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') findNext() }}
              placeholder="Find..."
              style={{ width: '100%', background: '#1e1e22', border: '1px solid #2a2a2e', borderRadius: '6px', color: '#ccc', fontSize: '13px', padding: '8px 10px', outline: 'none', marginBottom: '8px', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}
            />
            <input
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="Replace with..."
              style={{ width: '100%', background: '#1e1e22', border: '1px solid #2a2a2e', borderRadius: '6px', color: '#ccc', fontSize: '13px', padding: '8px 10px', outline: 'none', marginBottom: '12px', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={findNext}
                style={{ flex: 1, background: '#1e1e22', border: '1px solid #2a2a2e', color: '#ccc', borderRadius: '6px', padding: '8px', cursor: 'pointer', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
                Find Next
              </button>
              <button
                onClick={replaceAll}
                style={{ flex: 1, background: 'rgba(232,168,124,0.15)', border: '1px solid rgba(232,168,124,0.3)', color: '#e8a87c', borderRadius: '6px', padding: '8px', cursor: 'pointer', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
                Replace All
              </button>
            </div>
          </div>
        )}

        {showAI && <AIAssistant editor={editor} onClose={() => setShowAI(false)} />}

        <div className="editor-scroll-area" style={{ flex: 1, padding: distractionFree ? `40vh ${contentPadX}` : `32px ${contentPadX}`, overflow: 'auto' }}>
          <EditorContent editor={editor} />
        </div>

        <div style={{ padding: `8px ${contentPadX}`, borderTop: `1px solid ${currentTheme.border}`, display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
          <span style={{ color: theme === 'dark' ? '#555' : '#888' }}>{wordCount} words</span>
          <span style={{ color: theme === 'dark' ? '#555' : '#888' }}>· {readingTime} min read</span>
          <span style={{ color: saveStatus === 'saved' ? '#52b788' : saveStatus === 'saving' ? '#7ec8e3' : '#e06060' }}>
            {saveStatus === 'saved' ? '● Saved' : saveStatus === 'saving' ? '◌ Saving...' : '● Save failed'}
          </span>
        </div>

      </div>
    </>
  )
}

export default Editor
