import { useState, useEffect } from 'react'
import Inspector from './Inspector'
import Sidebar from './Sidebar'
import Editor from './Editor'
import Corkboard from './Corkboard'
import Outline from './Outline'
import Home from './Home'
import CharacterSheet from './CharacterSheet'
import Compile from './Compile'
import Pricing from './Pricing'
import { saveProject, updateProject, getUserPlan } from './api'
import { useUser } from '@clerk/clerk-react'

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
  const [distractionFree, setDistractionFree] = useState(false)
  const [showCompile, setShowCompile] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

useEffect(() => {
  localStorage.setItem('theme', theme)
}, [theme])
const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('fontFamily') || 'Georgia, serif')

useEffect(() => {
  localStorage.setItem('fontFamily', fontFamily)
}, [fontFamily])
  const [labels, setLabels] = useState({})
  const { user } = useUser()
  const userId = user?.id || 'temp-user'
  const [userPlan, setUserPlan] = useState('free')
  const [wordGoal, setWordGoal] = useState(() => {
    return parseInt(localStorage.getItem('wordGoal') || '500')
  })
  const [todayWords, setTodayWords] = useState(() => {
    const today = new Date().toDateString()
    const saved = JSON.parse(localStorage.getItem('dailyWords') || '{}')
    return saved[today] || 0
  })
  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('streak') || '0')
  })

 useEffect(() => {
  if (user) {
    getUserPlan(userId).then(plan => setUserPlan(plan))
  }
}, [userId, user])

useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  if (params.get('payment') === 'success' && user) {
    getUserPlan(userId).then(plan => {
      setUserPlan(plan)
      window.history.replaceState({}, '', window.location.pathname)
    })
  }
}, [user, userId])

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

  const isCharacterDoc = () => {
    for (const folder of folders) {
      if (folder.name === 'Characters') {
        const doc = folder.docs.find(d => d.id === selectedDoc)
        if (doc) return true
      }
    }
    return false
  }

  const getTotalWordCount = () => {
    let total = 0
    folders.forEach(folder => {
      folder.docs.forEach(doc => {
        const count = docData[doc.id]?.wordCount || 0
        total += count
      })
    })
    return total
  }

  const updateDailyWords = (count) => {
    const today = new Date().toDateString()
    const saved = JSON.parse(localStorage.getItem('dailyWords') || '{}')
    saved[today] = count
    localStorage.setItem('dailyWords', JSON.stringify(saved))
    setTodayWords(count)

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()
    const hitGoalToday = count >= wordGoal
    const hitGoalYesterday = (saved[yesterdayStr] || 0) >= wordGoal

    if (hitGoalToday) {
      const newStreak = hitGoalYesterday ? streak + 1 : 1
      setStreak(newStreak)
      localStorage.setItem('streak', newStreak.toString())
    }
  }

  useEffect(() => {
    if (!projectId || folders.length === 0) return

    const projectData = {
      name: projectName,
      type: projectType,
      folders: folders,
      statuses: statuses,
      docData: docData,
      labels: labels,
      lastEdited: new Date().toLocaleDateString(),
    }

    const projects = JSON.parse(localStorage.getItem('projects') || '[]')
    const updated = projects.filter(p => p.id !== projectId)
    updated.unshift({ id: projectId, ...projectData })
    localStorage.setItem('projects', JSON.stringify(updated))

    const dbId = localStorage.getItem(`db-${projectId}`)
    if (dbId) {
      updateProject(dbId, projectData)
    }
  }, [folders, statuses, projectName, projectId, docData, labels])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && distractionFree) {
        setDistractionFree(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [distractionFree])

  const handleSelectProject = (type, name, existingProject, templateFolders) => {
    if (existingProject) {
      setProjectId(existingProject.id)
      setProjectType(existingProject.type)
      setProjectName(existingProject.name)
      setFolders(existingProject.folders || DEFAULT_STRUCTURES[existingProject.type] || DEFAULT_STRUCTURES.novel)
      setStatuses(existingProject.statuses || {})
      setDocData(existingProject.docData || {})
      setLabels(existingProject.labels || {})
    } else {
      const newId = `project-${Date.now()}`
      const newFolders = templateFolders || DEFAULT_STRUCTURES[type] || DEFAULT_STRUCTURES.novel
      setProjectId(newId)
      setProjectType(type)
      setProjectName(name)
      setFolders(newFolders)
      setStatuses({})
      setDocData({})
      setLabels({})
      saveProject({
        name,
        type,
        folders: newFolders,
        statuses: {},
        docData: {},
        labels: {},
        userId,
      }).then(data => {
        if (data && data.id) {
          localStorage.setItem(`db-${newId}`, data.id)
        }
      })
    }
    const loadedFolders = existingProject
      ? (existingProject.folders || DEFAULT_STRUCTURES[existingProject.type] || DEFAULT_STRUCTURES.novel)
      : (templateFolders || DEFAULT_STRUCTURES[type] || DEFAULT_STRUCTURES.novel)
    const firstDoc = loadedFolders[0]?.docs[0]
    setSelectedDoc(firstDoc ? firstDoc.id : '')
    setView('editor')
    setScreen('editor')
    setDistractionFree(false)
  }

  const compile = Compile({ folders, projectName, projectId })

  if (screen === 'home') {
    return <Home onSelectProject={handleSelectProject} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f0f11', fontFamily: 'Inter, -apple-system, sans-serif' }}>

      {!distractionFree && (
        <div style={{ height: '48px', background: '#0c0c0e', borderBottom: '1px solid #1a1a1d', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px' }}>

          <p
            onClick={() => setScreen('home')}
            style={{ color: '#ffffff', fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: '500', cursor: 'pointer', letterSpacing: '0.01em' }}>
            {currentType.icon} {projectName}
          </p>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>

            <div style={{ display: 'flex', gap: '2px', background: '#141416', borderRadius: '6px', padding: '2px' }}>
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
              <button
                onClick={() => setDistractionFree(true)}
                style={{ background: 'transparent', border: 'none', color: '#555', borderRadius: '4px', padding: '4px 12px', fontSize: '11px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
                Focus
              </button>
            </div>

            <div style={{ width: '1px', height: '18px', background: '#1e1e22', margin: '0 4px' }} />

            {userPlan === 'free' && (
              <button
                onClick={() => setShowPricing(true)}
                style={{ background: 'transparent', border: '1px solid #2a2a2e', color: '#7ec8e3', borderRadius: '6px', padding: '4px 12px', fontSize: '11px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
                Upgrade ↑
              </button>
            )}

            <div style={{ width: '1px', height: '18px', background: '#1e1e22', margin: '0 4px' }} />

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowCompile(!showCompile)}
                style={{ background: showCompile ? '#1e1e22' : 'transparent', border: '1px solid #2a2a2e', color: '#888', borderRadius: '6px', padding: '4px 12px', fontSize: '11px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
                Compile ↓
              </button>
              {showCompile && (
                <div style={{ position: 'absolute', top: '34px', right: '0', background: '#141416', border: '1px solid #2a2a2e', borderRadius: '6px', padding: '4px', zIndex: 100, minWidth: '180px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                  <div
                    onClick={() => { compile.compilePDF(); setShowCompile(false) }}
                    style={{ padding: '8px 12px', color: '#ccc', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', fontFamily: 'Inter, sans-serif' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1e1e22'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    📄 Compile as PDF
                  </div>
                  <div
                    onClick={() => { compile.compileDOCX(); setShowCompile(false) }}
                    style={{ padding: '8px 12px', color: '#ccc', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', fontFamily: 'Inter, sans-serif' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1e1e22'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    📝 Compile as DOCX
                  </div>
                  <div
                    onClick={() => { compile.compileEPUB(); setShowCompile(false) }}
                    style={{ padding: '8px 12px', color: '#ccc', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', fontFamily: 'Inter, sans-serif' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1e1e22'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    📚 Compile as EPUB
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {!distractionFree && (
          <Sidebar
            key={projectId}
            selectedDoc={selectedDoc}
            setSelectedDoc={setSelectedDoc}
            projectType={projectType}
            accentColor={currentType.color}
            folders={folders}
            setFolders={setFolders}
            labels={labels}
            setLabels={setLabels}
          />
        )}

        {view === 'editor' && !isCharacterDoc() && (
          <Editor
            selectedDoc={selectedDoc}
            setSelectedDoc={setSelectedDoc}
            docName={getDocName()}
            folders={folders}
            setFolders={setFolders}
            docData={docData}
            setDocData={setDocData}
            projectId={projectId}
            distractionFree={distractionFree}
            setDistractionFree={setDistractionFree}
            userPlan={userPlan}
            wordGoal={wordGoal}
            todayWords={todayWords}
            onWordsUpdate={updateDailyWords}
            theme={theme}
            setTheme={setTheme}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
          />
        )}

        {view === 'editor' && isCharacterDoc() && (
          <CharacterSheet
            selectedDoc={selectedDoc}
            folders={folders}
            docData={docData}
            setDocData={setDocData}
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

        {!distractionFree && (
          <Inspector
            selectedDoc={selectedDoc}
            docData={docData}
            setDocData={setDocData}
          />
        )}

      </div>

      {!distractionFree && (
        <div style={{ height: '28px', background: '#0a0a0c', borderTop: '1px solid #1a1a1d', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '16px' }}>
          <span style={{ color: currentType.color, fontSize: '11px', fontWeight: '500' }}>{currentType.icon} {currentType.label}</span>
          <span style={{ color: '#2a2a2e', fontSize: '11px' }}>•</span>
          <span style={{ color: '#444', fontSize: '11px' }}>{projectName}</span>
          <span style={{ color: '#2a2a2e', fontSize: '11px' }}>•</span>
          <span style={{ color: '#444', fontSize: '11px' }}>{getTotalWordCount().toLocaleString()} words</span>
          <span style={{ color: '#2a2a2e', fontSize: '11px' }}>•</span>
          <span style={{ color: todayWords >= wordGoal ? '#52b788' : '#444', fontSize: '11px' }}>
            {todayWords}/{wordGoal} today
          </span>
          {streak > 0 && (
            <span style={{ color: '#e8a87c', fontSize: '11px' }}>🔥 {streak} day streak</span>
          )}
          <div style={{ flex: 1 }} />
          <span style={{ color: '#52b788', fontSize: '11px' }}>● Saved</span>
        </div>
      )}

      {showPricing && <Pricing onClose={() => setShowPricing(false)} />}

    </div>
  )
}

export default App