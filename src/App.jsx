import { useState, useEffect } from 'react'
import Inspector from './Inspector'
import Sidebar from './Sidebar'
import Editor from './Editor'
import Corkboard from './Corkboard'
import Outline from './Outline'
import Home from './Home'

const DEFAULT_STRUCTURES = {
  novel: [
    { id: 'act1', name: 'Act 1', open: true, docs: [{ id: 'doc-1', name: 'Untitled Chapter' }] },
    { id: 'research', name: 'Research', open: false, docs: [] },
    { id: 'characters', name: 'Characters', open: false, docs: [] },
  ],
  comic: [
    { id: 'issue1', name: 'Issue 1', open: true, docs: [{ id: 'doc-1', name: 'Untitled Page' }] },
    { id: 'research', name: 'Research', open: false, docs: [] },
    { id: 'characters', name: 'Characters', open: false, docs: [] },
  ],
  tv: [
    { id: 'season1', name: 'Season 1', open: true, docs: [{ id: 'doc-1', name: 'Untitled Episode' }] },
    { id: 'research', name: 'Research', open: false, docs: [] },
    { id: 'characters', name: 'Characters', open: false, docs: [] },
  ],
  movie: [
    { id: 'act1', name: 'Act 1', open: true, docs: [{ id: 'doc-1', name: 'Untitled Scene' }] },
    { id: 'research', name: 'Research', open: false, docs: [] },
    { id: 'characters', name: 'Characters', open: false, docs: [] },
  ],
  game: [
    { id: 'chapter1', name: 'Chapter 1', open: true, docs: [{ id: 'doc-1', name: 'Untitled Quest' }] },
    { id: 'research', name: 'Research', open: false, docs: [] },
    { id: 'characters', name: 'Characters', open: false, docs: [] },
  ],
}

function App() {
  const [screen, setScreen] = useState('home')
  const [selectedDoc, setSelectedDoc] = useState('')
  const [projectType, setProjectType] = useState('novel')
  const [projectName, setProjectName] = useState('My Project')
  const [projectId, setProjectId] = useState(null)
  const [view, setView] = useState('editor')
  const [folders, setFolders] = useState([])
  const [statuses, setStatuses] = useState({})
  const [docData, setDocData] = useState({})

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
    if (!projectId || folders.length === 0) return
    const projects = JSON.parse(localStorage.getItem('projects') || '[]')
    const updated = projects.filter(p => p.id !== projectId)
    updated.unshift({
      id: projectId,
      name: projectName,
      type: projectType,
      folders: folders,
      statuses: statuses,
      docData: docData,
      lastEdited: new Date().toLocaleDateString(),
    })
    localStorage.setItem('projects', JSON.stringify(updated))
  }, [folders, statuses, projectName, projectId, docData])

  const handleSelectProject = (type, name, existingProject) => {
    if (existingProject) {
      setProjectId(existingProject.id)
      setProjectType(existingProject.type)
      setProjectName(existingProject.name)
      setFolders(existingProject.folders || DEFAULT_STRUCTURES[existingProject.type] || DEFAULT_STRUCTURES.novel)
      setStatuses(existingProject.statuses || {})
      setDocData(existingProject.docData || {})
    } else {
      const newId = `project-${Date.now()}`
      setProjectId(newId)
      setProjectType(type)
      setProjectName(name)
      setFolders(DEFAULT_STRUCTURES[type] || DEFAULT_STRUCTURES.novel)
      setStatuses({})
      setDocData({})
    }
    const loadedFolders = existingProject
  ? (existingProject.folders || DEFAULT_STRUCTURES[existingProject.type] || DEFAULT_STRUCTURES.novel)
  : (DEFAULT_STRUCTURES[type] || DEFAULT_STRUCTURES.novel)
const firstDoc = loadedFolders[0]?.docs[0]
setSelectedDoc(firstDoc ? firstDoc.id : '')
    setView('editor')
    setScreen('editor')
  }

  if (screen === 'home') {
    return <Home onSelectProject={handleSelectProject} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f0f11', fontFamily: 'Inter, -apple-system, sans-serif' }}>

      <div style={{ height: '48px', background: '#0c0c0e', borderBottom: '1px solid #1a1a1d', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px' }}>

        <p
          onClick={() => setScreen('home')}
          style={{ color: '#ffffff', fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: '500', cursor: 'pointer', letterSpacing: '0.01em' }}>
          {currentType.icon} {projectName}
        </p>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '2px', background: '#141416', borderRadius: '6px', padding: '2px' }}>
          <button
            onClick={() => setView('editor')}
            style={{ background: view === 'editor' ? '#1e1e22' : 'transparent', border: 'none', color: view === 'editor' ? '#ddd' : '#555', borderRadius: '4px', padding: '4px 12px', fontSize: '11px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
            Editor
          </button>
          <button
            onClick={() => setView('corkboard')}
            style={{ background: view === 'corkboard' ? '#1e1e22' : 'transparent', border: 'none', color: view === 'corkboard' ? '#ddd' : '#555', borderRadius: '4px', padding: '4px 12px', fontSize: '11px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
            Corkboard
          </button>
          <button
            onClick={() => setView('outline')}
            style={{ background: view === 'outline' ? '#1e1e22' : 'transparent', border: 'none', color: view === 'outline' ? '#ddd' : '#555', borderRadius: '4px', padding: '4px 12px', fontSize: '11px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
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
            docData={docData}
            setDocData={setDocData}
            projectId={projectId}
          />
        )}

        {view === 'corkboard' && (
          <Corkboard
            selectedDoc={selectedDoc}
            setSelectedDoc={setSelectedDoc}
            accentColor={currentType.color}
            folders={folders}
            docData={docData}
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
            docData={docData}
          />
        )}

        <Inspector
          selectedDoc={selectedDoc}
          docData={docData}
          setDocData={setDocData}
        />

      </div>

      <div style={{ height: '28px', background: '#0a0a0c', borderTop: '1px solid #1a1a1d', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '16px' }}>
        <span style={{ color: currentType.color, fontSize: '11px', fontWeight: '500' }}>{currentType.icon} {currentType.label}</span>
        <span style={{ color: '#2a2a2e', fontSize: '11px' }}>•</span>
        <span style={{ color: '#444', fontSize: '11px' }}>{projectName}</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: '#52b788', fontSize: '11px' }}>● Saved</span>
      </div>

    </div>
  )
}

export default App