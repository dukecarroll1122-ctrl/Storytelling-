import { useState, useEffect } from 'react'
import Inspector from './Inspector'
import Sidebar from './Sidebar'
import Editor from './Editor'
import Corkboard from './Corkboard'
import Outline from './Outline'
import Home from './Home'

function App() {
  const [screen, setScreen] = useState('home')
  const [selectedDoc, setSelectedDoc] = useState('')
  const [projectType, setProjectType] = useState('novel')
  const [projectName, setProjectName] = useState('My Project')
  const [projectId, setProjectId] = useState(null)
  const [view, setView] = useState('editor')
  const [folders, setFolders] = useState([])
  const [statuses, setStatuses] = useState({})

  const projectTypes = [
    { id: 'novel', icon: '📖', label: 'Novel', color: '#e8a87c' },
    { id: 'comic', icon: '💥', label: 'Comic', color: '#f4a261' },
    { id: 'tv', icon: '📺', label: 'TV Show', color: '#7ec8e3' },
    { id: 'movie', icon: '🎬', label: 'Movie', color: '#c77dff' },
    { id: 'game', icon: '🎮', label: 'Game', color: '#52b788' },
  ]

  const currentType = projectTypes.find(p => p.id === projectType)

  const getDocName = () => {
    for (const folder of folders) {
      const doc = folder.docs.find(d => d.id === selectedDoc)
      if (doc) return doc.name
    }
    return ''
  }

  useEffect(() => {
  if (!projectId) return
  const projects = JSON.parse(localStorage.getItem('projects') || '[]')
  const updated = projects.filter(p => p.id !== projectId)
  updated.unshift({
    id: projectId,
    name: projectName,
    type: projectType,
    folders: folders,
    statuses: statuses,
    lastEdited: new Date().toLocaleDateString(),
  })
  localStorage.setItem('projects', JSON.stringify(updated))
}, [folders, statuses, projectName, projectId])

  const handleSelectProject = (type, name, existingProject) => {
    if (existingProject) {
      setProjectId(existingProject.id)
      setProjectType(existingProject.type)
      setProjectName(existingProject.name)
      setFolders(existingProject.folders || [])
      setStatuses(existingProject.statuses || {})
    } else {
      const newId = `project-${Date.now()}`
      setProjectId(newId)
      setProjectType(type)
      setProjectName(name)
      setFolders([])
      setStatuses({})
    }
    setSelectedDoc('')
    setView('editor')
    setScreen('editor')
  }

  if (screen === 'home') {
    return <Home onSelectProject={handleSelectProject} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f0f11' }}>

      <div style={{ height: '48px', background: '#0c0c0e', borderBottom: '1px solid #1a1a1d', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px' }}>

        <p
          onClick={() => setScreen('home')}
          style={{ color: '#ffffff', fontSize: '14px', fontFamily: 'Georgia', marginRight: '16px', cursor: 'pointer' }}>
          {projectName}
        </p>

        {projectTypes.map(pt => (
          <button
            key={pt.id}
            onClick={() => {
              setProjectType(pt.id)
              setFolders([])
              setStatuses({})
              setSelectedDoc('')
            }}
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
          <button
            onClick={() => setView('outline')}
            style={{ background: view === 'outline' ? '#252528' : 'transparent', border: 'none', color: view === 'outline' ? '#ddd' : '#555', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit' }}>
            Outline
          </button>
        </div>

      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        <Sidebar
          key={projectId}
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
            docName={getDocName()}
            folders={folders}
            setFolders={setFolders}
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

        {view === 'outline' && (
          <Outline
            selectedDoc={selectedDoc}
            setSelectedDoc={setSelectedDoc}
            accentColor={currentType.color}
            folders={folders}
            statuses={statuses}
            setStatuses={setStatuses}
          />
        )}

        <Inspector />

      </div>

      <div style={{ height: '28px', background: '#0a0a0c', borderTop: '1px solid #1a1a1d', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '16px' }}>
        <span style={{ color: currentType.color, fontSize: '11px' }}>{currentType.icon} {currentType.label}</span>
        <span style={{ color: '#333', fontSize: '11px' }}>•</span>
        <span style={{ color: '#444', fontSize: '11px' }}>{projectName}</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: '#52b788', fontSize: '11px' }}>● Saved</span>
      </div>

    </div>
  )
}

export default App