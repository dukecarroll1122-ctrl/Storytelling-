import { useState } from 'react'
import Inspector from './Inspector'
import Sidebar from './Sidebar'
import Editor from './Editor'

function App() {
  const [selectedDoc, setSelectedDoc] = useState('Chapter 1')
  const [projectType, setProjectType] = useState('novel')
  const [documents, setDocuments] = useState(['Chapter 1', 'Chapter 2'])
  const [research, setResearch] = useState(['World Bible'])
  const [characters, setCharacters] = useState(['Character 1'])

  const projectTypes = [
    { id: 'novel', icon: '📖', label: 'Novel', color: '#e8a87c' },
    { id: 'comic', icon: '💥', label: 'Comic', color: '#f4a261' },
    { id: 'tv', icon: '📺', label: 'TV Show', color: '#7ec8e3' },
    { id: 'movie', icon: '🎬', label: 'Movie', color: '#c77dff' },
    { id: 'game', icon: '🎮', label: 'Game', color: '#52b788' },
  ]

  const currentType = projectTypes.find(p => p.id === projectType)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f0f11' }}>

      <div style={{ height: '48px', background: '#0c0c0e', borderBottom: '1px solid #1a1a1d', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px' }}>

        <p style={{ color: '#ffffff', fontSize: '14px', fontFamily: 'Georgia', marginRight: '16px' }}>Storytelling</p>

        {projectTypes.map(pt => (
          <button
            key={pt.id}
            onClick={() => setProjectType(pt.id)}
            style={{
              background: projectType === pt.id ? pt.color + '22' : 'transparent',
              border: projectType === pt.id ? `1px solid ${pt.color}55` : '1px solid transparent',
              color: projectType === pt.id ? pt.color : '#555',
              borderRadius: '4px',
              padding: '3px 8px',
              fontSize: '11px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
            {pt.icon} {pt.label}
          </button>
        ))}

      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        <Sidebar
          key={projectType}
          selectedDoc={selectedDoc}
          setSelectedDoc={setSelectedDoc}
          documents={documents}
          setDocuments={setDocuments}
          research={research}
          setResearch={setResearch}
          characters={characters}
          setCharacters={setCharacters}
          projectType={projectType}
          accentColor={currentType.color}
        />

        <Editor
          selectedDoc={selectedDoc}
          setSelectedDoc={setSelectedDoc}
          documents={documents}
          setDocuments={setDocuments}
          research={research}
          setResearch={setResearch}
          characters={characters}
          setCharacters={setCharacters}
        />

        <Inspector />

      </div>

      <div style={{ height: '28px', background: '#0a0a0c', borderTop: '1px solid #1a1a1d', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '16px' }}>
        <span style={{ color: currentType.color, fontSize: '11px' }}>{currentType.icon} {currentType.label}</span>
        <span style={{ color: '#333', fontSize: '11px' }}>•</span>
        <span style={{ color: '#444', fontSize: '11px' }}>
  {selectedDoc.includes('-') && !isNaN(selectedDoc.split('-').pop()) ? 'Untitled' : selectedDoc}
</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: '#52b788', fontSize: '11px' }}>● Saved</span>
      </div>

    </div>
  )
}

export default App