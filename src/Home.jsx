import { useState, useEffect } from 'react'

function Home({ onSelectProject }) {
  const [selectedType, setSelectedType] = useState(null)
  const [projectName, setProjectName] = useState('')
  const [recentProjects, setRecentProjects] = useState([])

  const projectTypes = [
    { id: 'novel', icon: '📖', label: 'Novel', description: 'Chapters, acts and scenes', color: '#e8a87c' },
    { id: 'comic', icon: '💥', label: 'Comic', description: 'Issues, pages and panels', color: '#f4a261' },
    { id: 'tv', icon: '📺', label: 'TV Show', description: 'Seasons, episodes and scenes', color: '#7ec8e3' },
    { id: 'movie', icon: '🎬', label: 'Movie', description: 'Acts, sequences and scenes', color: '#c77dff' },
    { id: 'game', icon: '🎮', label: 'Game', description: 'Chapters, quests and dialogue', color: '#52b788' },
  ]

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('projects') || '[]')
    setRecentProjects(saved)
  }, [])

  const currentType = projectTypes.find(p => p.id === selectedType)

  const handleStart = () => {
    const name = projectName.trim() || `My ${currentType.label}`
    onSelectProject(selectedType, name)
  }

  const handleOpenProject = (project) => {
    onSelectProject(null, null, project)
  }

  const deleteProject = (e, projectId) => {
    e.stopPropagation()
    const updated = recentProjects.filter(p => p.id !== projectId)
    setRecentProjects(updated)
    localStorage.setItem('projects', JSON.stringify(updated))
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
    <div style={{ height: '100vh', background: '#0f0f11', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>

      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', fontFamily: 'Georgia', fontSize: '36px', fontWeight: 'normal', marginBottom: '8px' }}>
          Storytelling
        </h1>
        <p style={{ color: '#555', fontSize: '14px' }}>
          {selectedType ? `Name your ${currentType.label.toLowerCase()}` : 'What are you working on?'}
        </p>
      </div>

      {!selectedType ? (
        <>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '700px', marginBottom: '48px' }}>
            {projectTypes.map(pt => (
              <div
                key={pt.id}
                onClick={() => setSelectedType(pt.id)}
                style={{
                  width: '180px',
                  padding: '24px 16px',
                  background: '#0c0c0e',
                  border: '1px solid #1a1a1d',
                  borderTop: `3px solid ${pt.color}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#141416'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#0c0c0e'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{pt.icon}</div>
                <div style={{ color: pt.color, fontSize: '14px', fontWeight: 'bold', marginBottom: '6px' }}>{pt.label}</div>
                <div style={{ color: '#555', fontSize: '11px', lineHeight: '1.5' }}>{pt.description}</div>
              </div>
            ))}
          </div>

          {recentProjects.length > 0 && (
            <div style={{ width: '100%', maxWidth: '700px' }}>
              <p style={{ color: '#555', fontSize: '11px', letterSpacing: '0.1em', marginBottom: '12px' }}>RECENT PROJECTS</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentProjects.map(project => (
                  <div
                    key={project.id}
                    onClick={() => handleOpenProject(project)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      background: '#0c0c0e',
                      border: '1px solid #1a1a1d',
                      borderLeft: `3px solid ${getProjectColor(project.type)}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#141416'}
                    onMouseLeave={e => e.currentTarget.style.background = '#0c0c0e'}>
                    <span style={{ fontSize: '20px', marginRight: '12px' }}>{getProjectIcon(project.type)}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#fff', fontSize: '14px', marginBottom: '2px' }}>{project.name}</div>
                      <div style={{ color: '#555', fontSize: '11px' }}>{project.type} • edited {project.lastEdited}</div>
                    </div>
                    <span
                      onClick={(e) => deleteProject(e, project.id)}
                      style={{ color: '#333', fontSize: '16px', cursor: 'pointer', padding: '4px 8px' }}>
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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>{currentType.icon}</div>
          <input
            autoFocus
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleStart()
              if (e.key === 'Escape') setSelectedType(null)
            }}
            placeholder={`My ${currentType.label}`}
            style={{
              background: '#0c0c0e',
              border: `1px solid ${currentType.color}55`,
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '22px',
              fontFamily: 'Georgia',
              padding: '12px 24px',
              outline: 'none',
              textAlign: 'center',
              width: '320px',
              marginBottom: '24px',
              display: 'block',
            }}
          />
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => setSelectedType(null)}
              style={{ background: 'transparent', border: '1px solid #2a2a2e', color: '#555', borderRadius: '6px', padding: '10px 24px', cursor: 'pointer', fontSize: '13px' }}>
              Back
            </button>
            <button
              onClick={handleStart}
              style={{ background: currentType.color + '22', border: `1px solid ${currentType.color}55`, color: currentType.color, borderRadius: '6px', padding: '10px 24px', cursor: 'pointer', fontSize: '13px' }}>
              Start Writing →
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default Home