import { useState, useEffect } from 'react'
import { useAppUser } from './useAppUser'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import './Home.css'
import { PROJECT_TYPE_ICONS, UploadIcon, XIcon, FileIcon } from './icons'

const TEMPLATES = {
  novel: [
    {
      id: 'blank',
      name: 'Blank',
      description: 'Start from scratch',
      folders: [
        { id: 'manuscript', name: 'Manuscript', open: true, docs: [{ id: 'doc-1', name: 'Chapter 1' }] },
        { id: 'research', name: 'Research', open: false, docs: [] },
        { id: 'characters', name: 'Characters', open: false, docs: [] },
      ]
    },
    {
      id: 'three-act',
      name: 'Three Act Structure',
      description: 'Classic beginning, middle, end',
      folders: [
        { id: 'act1', name: 'Act 1 — Setup', open: true, docs: [{ id: 'doc-1', name: 'Chapter 1' }, { id: 'doc-2', name: 'Chapter 2' }] },
        { id: 'act2', name: 'Act 2 — Confrontation', open: false, docs: [{ id: 'doc-3', name: 'Chapter 3' }, { id: 'doc-4', name: 'Chapter 4' }] },
        { id: 'act3', name: 'Act 3 — Resolution', open: false, docs: [{ id: 'doc-5', name: 'Chapter 5' }] },
        { id: 'research', name: 'Research', open: false, docs: [] },
        { id: 'characters', name: 'Characters', open: false, docs: [] },
      ]
    },
    {
      id: 'heros-journey',
      name: "Hero's Journey",
      description: 'The classic 12-stage story arc',
      folders: [
        { id: 'ordinary-world', name: 'Ordinary World', open: true, docs: [{ id: 'doc-1', name: 'The Beginning' }] },
        { id: 'call', name: 'Call to Adventure', open: false, docs: [{ id: 'doc-2', name: 'The Call' }] },
        { id: 'trials', name: 'Trials & Allies', open: false, docs: [{ id: 'doc-3', name: 'The Road' }] },
        { id: 'ordeal', name: 'The Ordeal', open: false, docs: [{ id: 'doc-4', name: 'Dark Night' }] },
        { id: 'return', name: 'The Return', open: false, docs: [{ id: 'doc-5', name: 'Coming Home' }] },
        { id: 'characters', name: 'Characters', open: false, docs: [] },
        { id: 'research', name: 'Research', open: false, docs: [] },
      ]
    },
  ],
  comic: [
    {
      id: 'blank',
      name: 'Blank',
      description: 'Start from scratch',
      folders: [
        { id: 'issue1', name: 'Issue 1', open: true, docs: [{ id: 'doc-1', name: 'Page 1' }] },
        { id: 'research', name: 'Research', open: false, docs: [] },
        { id: 'characters', name: 'Characters', open: false, docs: [] },
      ]
    },
    {
      id: 'miniseries',
      name: 'Miniseries',
      description: '5-issue story arc',
      folders: [
        { id: 'issue1', name: 'Issue 1', open: true, docs: [{ id: 'doc-1', name: 'Page 1' }] },
        { id: 'issue2', name: 'Issue 2', open: false, docs: [{ id: 'doc-2', name: 'Page 1' }] },
        { id: 'issue3', name: 'Issue 3', open: false, docs: [{ id: 'doc-3', name: 'Page 1' }] },
        { id: 'issue4', name: 'Issue 4', open: false, docs: [{ id: 'doc-4', name: 'Page 1' }] },
        { id: 'issue5', name: 'Issue 5', open: false, docs: [{ id: 'doc-5', name: 'Page 1' }] },
        { id: 'characters', name: 'Characters', open: false, docs: [] },
      ]
    },
  ],
  tv: [
    {
      id: 'blank',
      name: 'Blank',
      description: 'Start from scratch',
      folders: [
        { id: 'season1', name: 'Season 1', open: true, docs: [{ id: 'doc-1', name: 'Episode 1' }] },
        { id: 'research', name: 'Research', open: false, docs: [] },
        { id: 'characters', name: 'Characters', open: false, docs: [] },
      ]
    },
    {
      id: 'pilot-plus',
      name: 'Pilot Season',
      description: 'Pilot + 6 episode season',
      folders: [
        { id: 'development', name: 'Development', open: true, docs: [{ id: 'doc-1', name: 'Series Bible' }, { id: 'doc-2', name: 'Pilot' }] },
        { id: 'season1', name: 'Season 1', open: false, docs: [
          { id: 'doc-3', name: 'Episode 1' },
          { id: 'doc-4', name: 'Episode 2' },
          { id: 'doc-5', name: 'Episode 3' },
          { id: 'doc-6', name: 'Episode 4' },
          { id: 'doc-7', name: 'Episode 5' },
          { id: 'doc-8', name: 'Episode 6' },
        ]},
        { id: 'characters', name: 'Characters', open: false, docs: [] },
        { id: 'research', name: 'Research', open: false, docs: [] },
      ]
    },
  ],
  movie: [
    {
      id: 'blank',
      name: 'Blank',
      description: 'Start from scratch',
      folders: [
        { id: 'act1', name: 'Act 1', open: true, docs: [{ id: 'doc-1', name: 'Opening Scene' }] },
        { id: 'research', name: 'Research', open: false, docs: [] },
        { id: 'characters', name: 'Characters', open: false, docs: [] },
      ]
    },
    {
      id: 'screenplay',
      name: 'Screenplay',
      description: 'Three act screenplay structure',
      folders: [
        { id: 'act1', name: 'Act 1 (pp. 1-25)', open: true, docs: [{ id: 'doc-1', name: 'Opening Image' }, { id: 'doc-2', name: 'Setup' }, { id: 'doc-3', name: 'Inciting Incident' }] },
        { id: 'act2a', name: 'Act 2A (pp. 25-55)', open: false, docs: [{ id: 'doc-4', name: 'New World' }, { id: 'doc-5', name: 'Fun & Games' }] },
        { id: 'act2b', name: 'Act 2B (pp. 55-85)', open: false, docs: [{ id: 'doc-6', name: 'Midpoint' }, { id: 'doc-7', name: 'Dark Night' }] },
        { id: 'act3', name: 'Act 3 (pp. 85-110)', open: false, docs: [{ id: 'doc-8', name: 'Climax' }, { id: 'doc-9', name: 'Resolution' }] },
        { id: 'characters', name: 'Characters', open: false, docs: [] },
      ]
    },
  ],
  game: [
    {
      id: 'blank',
      name: 'Blank',
      description: 'Start from scratch',
      folders: [
        { id: 'chapter1', name: 'Chapter 1', open: true, docs: [{ id: 'doc-1', name: 'Quest 1' }] },
        { id: 'research', name: 'Research', open: false, docs: [] },
        { id: 'characters', name: 'Characters', open: false, docs: [] },
      ]
    },
    {
      id: 'rpg',
      name: 'RPG Story',
      description: 'Main quest with side quests',
      folders: [
        { id: 'main', name: 'Main Quest', open: true, docs: [{ id: 'doc-1', name: 'Prologue' }, { id: 'doc-2', name: 'Act 1' }, { id: 'doc-3', name: 'Act 2' }, { id: 'doc-4', name: 'Final Act' }] },
        { id: 'side', name: 'Side Quests', open: false, docs: [{ id: 'doc-5', name: 'Side Quest 1' }] },
        { id: 'dialogue', name: 'Dialogue Trees', open: false, docs: [] },
        { id: 'characters', name: 'Characters', open: false, docs: [] },
        { id: 'world', name: 'World Building', open: false, docs: [] },
      ]
    },
  ],
}

function Home({ onSelectProject }) {
  const [selectedType, setSelectedType] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [projectName, setProjectName] = useState('')
  const [recentProjects, setRecentProjects] = useState([])
  const { user, isLoaded } = useAppUser()
  const userId = user?.id || 'temp-user'
  const [userPlan, setUserPlan] = useState('free')

  useEffect(() => {
    if (isLoaded && user) {
      import('./api').then(({ getUserPlan }) => {
        getUserPlan(userId).then(plan => setUserPlan(plan))
      })
    }
  }, [userId, user, isLoaded])

  const projectTypes = [
    { id: 'novel', label: 'Novel', description: 'Chapters, acts and scenes', color: '#e8a87c' },
    { id: 'comic', label: 'Comic', description: 'Issues, pages and panels', color: '#f4a261' },
    { id: 'tv', label: 'TV Show', description: 'Seasons, episodes and scenes', color: '#7ec8e3' },
    { id: 'movie', label: 'Movie', description: 'Acts, sequences and scenes', color: '#c77dff' },
    { id: 'game', label: 'Game', description: 'Chapters, quests and dialogue', color: '#52b788' },
  ]

  useEffect(() => {
    const loadProjects = async () => {
      if (!isLoaded) return

      const lastUserId = localStorage.getItem('lastUserId')
      if (lastUserId && lastUserId !== userId) {
        localStorage.clear()
      }
      localStorage.setItem('lastUserId', userId)

      const local = JSON.parse(localStorage.getItem('projects') || '[]')
      setRecentProjects(local)

      try {
        const response = await fetch(`https://storytelling-server-production.up.railway.app/api/projects/${userId}`)
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
  const templates = selectedType ? TEMPLATES[selectedType] : []

  const handleStart = () => {
    if (userPlan === 'free' && recentProjects.length >= 3) {
      alert('Free plan is limited to 3 projects. Upgrade to Pro for unlimited projects.')
      return
    }
    const name = projectName.trim() || `My ${currentType.label}`
    const template = templates.find(t => t.id === selectedTemplate)
    onSelectProject(selectedType, name, null, template?.folders)
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
    return pt ? pt.color : '#7ec8e3'
  }

  const getProjectIcon = (type) => PROJECT_TYPE_ICONS[type] || FileIcon

  const step = !selectedType ? 'type' : !selectedTemplate ? 'template' : 'name'

  return (
    <div className="home-page">

      <div className="home-topbar">
        {user?.id !== 'demo-user' && (
          <SignedOut>
            <SignInButton mode="modal">
              <button className="home-signin-btn">Sign In</button>
            </SignInButton>
          </SignedOut>
        )}
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      <div className="home-header">
        <h1>Storytelling</h1>
        <p>
          {step === 'type' && 'What are you working on?'}
          {step === 'template' && `Choose a template for your ${currentType.label.toLowerCase()}`}
          {step === 'name' && `Name your ${currentType.label.toLowerCase()}`}
        </p>
      </div>

      {step === 'type' && (
        <div className="home-step">
          <div className="home-types-grid">
            {projectTypes.map(pt => {
              const Icon = PROJECT_TYPE_ICONS[pt.id]
              return (
                <button
                  key={pt.id}
                  type="button"
                  className="home-type-card"
                  style={{ '--card-color': pt.color }}
                  onClick={() => {
                    setSelectedType(pt.id)
                    setSelectedTemplate(null)
                    setProjectName('')
                  }}>
                  <div className="home-type-icon"><Icon /></div>
                  <div className="home-type-label">{pt.label}</div>
                  <div className="home-type-desc">{pt.description}</div>
                </button>
              )
            })}
          </div>

          <div className="home-import">
            <label htmlFor="importFile" className="home-import-label">
              <UploadIcon width="16" height="16" />
              Import existing file — DOCX or TXT
            </label>
            <input
              id="importFile"
              type="file"
              accept=".docx,.txt,.md"
              className="home-import-input"
              onChange={handleImport}
            />
          </div>

          {recentProjects.length > 0 && (
            <div className="home-recent">
              <p className="home-recent-label">RECENT PROJECTS</p>
              <div className="home-recent-list">
                {recentProjects.map(project => {
                  const Icon = getProjectIcon(project.type)
                  return (
                    <div
                      key={project.id}
                      className="home-recent-item"
                      style={{ '--card-color': getProjectColor(project.type) }}>
                      <button
                        type="button"
                        className="home-recent-open"
                        onClick={() => handleOpenProject(project)}>
                        <span className="home-recent-icon"><Icon width="18" height="18" /></span>
                        <span className="home-recent-info">
                          <span className="home-recent-name">{project.name}</span>
                          <span className="home-recent-meta">{project.type} • edited {project.lastEdited}</span>
                        </span>
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${project.name}`}
                        className="home-recent-delete"
                        onClick={(e) => deleteProject(e, project.id)}>
                        <XIcon width="14" height="14" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {step === 'template' && (
        <div className="home-templates" style={{ '--card-color': currentType.color }}>
          <div className="home-templates-list">
            {templates.map(t => (
              <button
                key={t.id}
                type="button"
                className={`home-template-card${selectedTemplate === t.id ? ' home-template-card--selected' : ''}`}
                style={{ '--tint': `${currentType.color}11` }}
                onClick={() => setSelectedTemplate(t.id)}>
                <div className="home-template-name">{t.name}</div>
                <div className="home-template-desc">{t.description}</div>
              </button>
            ))}
          </div>
          <div className="home-actions">
            <button
              type="button"
              className="home-btn home-btn-back"
              onClick={() => {
                setSelectedType(null)
                setSelectedTemplate(null)
              }}>
              Back
            </button>
            <button
              type="button"
              className="home-btn home-btn-primary"
              onClick={() => {
                if (!selectedTemplate) setSelectedTemplate('blank')
              }}
              disabled={!selectedTemplate}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {step === 'name' && (() => {
        const NameIcon = PROJECT_TYPE_ICONS[currentType.id]
        return (
          <div className="home-name-step" style={{ '--card-color': currentType.color }}>
            <div className="home-name-icon"><NameIcon width="40" height="40" /></div>
            <input
              autoFocus
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleStart()
                if (e.key === 'Escape') {
                  setSelectedTemplate(null)
                }
              }}
              placeholder={`My ${currentType.label}`}
              aria-label="Project name"
              className="home-name-input"
            />
            <div className="home-actions">
              <button
                type="button"
                className="home-btn home-btn-back"
                onClick={() => setSelectedTemplate(null)}>
                Back
              </button>
              <button
                type="button"
                className="home-btn home-btn-primary"
                onClick={handleStart}>
                Start Writing →
              </button>
            </div>
          </div>
        )
      })()}

    </div>
  )
}

export default Home