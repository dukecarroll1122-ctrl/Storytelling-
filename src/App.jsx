import { useState } from 'react'
import Inspector from './Inspector'
import Sidebar from './Sidebar'
import Editor from './Editor'
import Corkboard from './Corkboard'

function App() {
  const [selectedDoc, setSelectedDoc] = useState('Untitled Chapter')
  const [projectType, setProjectType] = useState('novel')
  const [view, setView] = useState('editor')
  const [folders, setFolders] = useState([])

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

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', background: '#1a1a1d', borderRadius: '6px', padding: '2px' }}>
          <button
            onClick={() => setView('editor')}
            style={{ background: view === 'editor' ? '#252528' : 'transparent', border: 'none', color: view === 'editor' ? '#ddd' : '#555', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit' }}>
            Editor
          </button>
          <button
            onClick={() => setView('corkboard')}
            style={{ background: view === 'corkboard' ? '#252528' : 'transparent', border: 'none', color: view === 'corkboard' ? '#ddd' : '#555', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit' }}>
            Corkboard
          </button>
        </div>

      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        <Sidebar
          key={projectType}
          selectedDoc={selectedDoc}
          setSelectedDoc={setSelectedDoc}
          projectType={projectType}
          accentColor={currentType.color}
          folders={folders}
          setFolders={setFolders}
        />

        {view === 'editor' && (
          <Editor
            selectedDoc={selectedDoc}
            setSelectedDoc={setSelectedDoc}
          />
        )}

        {view === 'corkboard' && (
          <Corkboard
            selectedDoc={selectedDoc}
            setSelectedDoc={setSelectedDoc}
            accentColor={currentType.color}
            folders={folders}
          />
        )}

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