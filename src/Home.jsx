import { useState, useEffect } from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react'

function Home({ onSelectProject }) {
  const [selectedType, setSelectedType] = useState(null)
  const [projectName, setProjectName] = useState('')
  const [recentProjects, setRecentProjects] = useState([])
  const { user, isLoaded } = useUser()
  const userId = user?.id || 'temp-user'

  const projectTypes = [
    { id: 'novel', icon: '📖', label: 'Novel', description: 'Chapters, acts and scenes', color: '#e8a87c' },
    { id: 'comic', icon: '💥', label: 'Comic', description: 'Issues, pages and panels', color: '#f4a261' },
    { id: 'tv', icon: '📺', label: 'TV Show', description: 'Seasons, episodes and scenes', color: '#7ec8e3' },
    { id: 'movie', icon: '🎬', label: 'Movie', description: 'Acts, sequences and scenes', color: '#c77dff' },
    { id: 'game', icon: '🎮', label: 'Game', description: 'Chapters, quests and dialogue', color: '#52b788' },
  ]

  useEffect(() => {
    const loadProjects = async () => {
      if (!isLoaded) return

      // Clear localStorage if user changed
  const lastUserId = localStorage.getItem('lastUserId')
  if (lastUserId && lastUserId !== userId) {
    localStorage.clear()
  }
  localStorage.setItem('lastUserId', userId)


      const local = JSON.parse(localStorage.getItem('projects') || '[]')
      setRecentProjects(local)

      try {
        console.log('loading projects for user:', userId)
        const response = await fetch(`http://localhost:3001/api/projects/${userId}`)
        const dbProjects = await response.json()
        if (dbProjects && dbProjects.length > 0) {
          const merged = mergeProjects(local, dbProjects)
          setRecentProjects(merged)
          localStorage.setItem('projects', JSON.stringify(merged))
        }
      } catch (error) {
        console.error('Could not load from database:', error)
      }
    }
    loadProjects()
  }, [userId, isLoaded])

  const mergeProjects = (local, remote) => {
    const merged = [...local]
    remote.forEach(remoteProject => {
      const exists = merged.find(p =>
        p.name === remoteProject.name && p.type === remoteProject.type
      )
      if (!exists) {
        merged.unshift({
          id: remoteProject.id,
          name: remoteProject.name,
          type: remoteProject.type,
          folders: remoteProject.folders,
          statuses: remoteProject.statuses,
          docData: remoteProject.docData,
          labels: remoteProject.labels,
          lastEdited: new Date(remoteProject.lastEdited).toLocaleDateString(),
        })
      }
    })
    return merged
  }

  const currentType = projectTypes.find(p => p.id === selectedType)

  const handleStart = () => {
    const name = projectName.trim() || `My ${currentType.label}`
    onSelectProject(selectedType, name, null)
  }

  const handleOpenProject = (project) => {
    onSelectProject(project.type, project.name, project)
  }

  const deleteProject = (e, projectId) => {
    e.stopPropagation()
    const updated = recentProjects.filter(p => p.id !== projectId)
    setRecentProjects(updated)
    localStorage.setItem('projects', JSON.stringify(updated))
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    let content = ''
    const fileName = file.name.replace(/\.[^/.]+$/, '')

    if (file.name.endsWith('.docx')) {
      const mammoth = await import('mammoth')
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer })
      content = result.value
    } else {
      content = await file.text()
    }

    const newId = `project-${Date.now()}`
    const docId = `doc-${Date.now()}`

    const project = {
      id: newId,
      name: fileName,
      type: 'novel',
      folders: [
        {
          id: 'manuscript',
          name: 'Manuscript',
          open: true,
          docs: [{ id: docId, name: fileName }]
        },
        { id: 'research', name: 'Research', open: false, docs: [] },
        { id: 'characters', name: 'Characters', open: false, docs: [] },
      ],
      statuses: {},
      docData: {},
      lastEdited: new Date().toLocaleDateString(),
    }

    const projects = JSON.parse(localStorage.getItem('projects') || '[]')
    projects.unshift(project)
    localStorage.setItem('projects', JSON.stringify(projects))
    localStorage.setItem(`${newId}-${docId}`, content)

    onSelectProject('novel', fileName, project)
  }

  const getProjectColor = (type) => {
    const pt = projectTypes.find(p => p.id === type)
    return pt ? pt.color : '#555'
  }

  const getProjectIcon = (type) => {
    const pt = projectTypes.find(p => p.id === type)
    return pt ? pt.icon : '📄'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f11',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 32px 32px',
      overflowY: 'auto',
      fontFamily: 'Inter, -apple-system, sans-serif',
      position: 'relative',
    }}>

      <div style={{ position: 'absolute', top: '20px', right: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <SignedOut>
          <SignInButton mode="modal">
            <button style={{ background: 'transparent', border: '1px solid #2a2a2e', color: '#888', borderRadius: '6px', padding: '7px 16px', cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h1 style={{
          color: '#ffffff',
          fontFamily: 'Georgia, serif',
          fontSize: '32px',
          fontWeight: 'normal',
          marginBottom: '8px',
          letterSpacing: '-0.5px',
        }}>
          Storytelling
        </h1>
        <p style={{ color: '#555', fontSize: '13px', fontWeight: '400' }}>
          {selectedType ? `Name your ${currentType.label.toLowerCase()}` : 'What are you working on?'}
        </p>
      </div>

      {!selectedType ? (
        <>
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '720px',
            marginBottom: '32px',
          }}>
            {projectTypes.map(pt => (
              <div
                key={pt.id}
                onClick={() => {
                  setSelectedType(pt.id)
                  setProjectName('')
                }}
                style={{
                  width: '130px',
                  padding: '20px 12px',
                  background: '#0c0c0e',
                  border: '1px solid #1e1e22',
                  borderTop: `2px solid ${pt.color}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#141416'
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#0c0c0e'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{pt.icon}</div>
                <div style={{ color: pt.color, fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                  {pt.label}
                </div>
                <div style={{ color: '#444', fontSize: '11px', lineHeight: '1.5' }}>
                  {pt.description}
                </div>
              </div>
            ))}
          </div>

          <div style={{ width: '100%', maxWidth: '600px', marginBottom: '24px' }}>
            <label
              htmlFor="importFile"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: '#0c0c0e',
                border: '1px dashed #2a2a2e',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#555',
                fontSize: '13px',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#444'
                e.currentTarget.style.color = '#888'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#2a2a2e'
                e.currentTarget.style.color = '#555'
              }}>
              ↑ Import existing file — DOCX or TXT
            </label>
            <input
              id="importFile"
              type="file"
              accept=".docx,.txt,.md"
              style={{ display: 'none' }}
              onChange={handleImport}
            />
          </div>

          {recentProjects.length > 0 && (
            <div style={{ width: '100%', maxWidth: '600px' }}>
              <p style={{ color: '#444', fontSize: '11px', letterSpacing: '0.08em', marginBottom: '10px', fontWeight: '500' }}>
                RECENT PROJECTS
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {recentProjects.map(project => (
                  <div
                    key={project.id}
                    onClick={() => handleOpenProject(project)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 14px',
                      background: '#0c0c0e',
                      border: '1px solid #1e1e22',
                      borderLeft: `2px solid ${getProjectColor(project.type)}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#141416'}
                    onMouseLeave={e => e.currentTarget.style.background = '#0c0c0e'}>
                    <span style={{ fontSize: '18px', marginRight: '10px' }}>
                      {getProjectIcon(project.type)}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#e0e0e0', fontSize: '13px', fontWeight: '500', marginBottom: '2px' }}>
                        {project.name}
                      </div>
                      <div style={{ color: '#444', fontSize: '11px' }}>
                        {project.type} • edited {project.lastEdited}
                      </div>
                    </div>
                    <span
                      onClick={(e) => deleteProject(e, project.id)}
                      style={{ color: '#333', fontSize: '18px', cursor: 'pointer', padding: '4px 8px', lineHeight: 1 }}>
                      ×
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '44px', marginBottom: '20px' }}>{currentType.icon}</div>
          <input
            autoFocus
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleStart()
              if (e.key === 'Escape') {
                setSelectedType(null)
                setProjectName('')
              }
            }}
            placeholder={`My ${currentType.label}`}
            style={{
              background: '#0c0c0e',
              border: `1px solid ${currentType.color}44`,
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '20px',
              fontFamily: 'Georgia, serif',
              padding: '12px 24px',
              outline: 'none',
              textAlign: 'center',
              width: '300px',
              marginBottom: '24px',
              display: 'block',
            }}
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={() => {
                setSelectedType(null)
                setProjectName('')
              }}
              style={{
                background: 'transparent',
                border: '1px solid #2a2a2e',
                color: '#555',
                borderRadius: '6px',
                padding: '10px 22px',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'inherit',
              }}>
              Back
            </button>
            <button
              onClick={handleStart}
              style={{
                background: currentType.color + '22',
                border: `1px solid ${currentType.color}55`,
                color: currentType.color,
                borderRadius: '6px',
                padding: '10px 22px',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'inherit',
                fontWeight: '500',
              }}>
              Start Writing →
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default Home