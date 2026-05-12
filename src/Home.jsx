import { useState } from 'react'

function Home({ onSelectProject }) {
  const [selectedType, setSelectedType] = useState(null)
  const [projectName, setProjectName] = useState('')

  const projectTypes = [
    { id: 'novel', icon: '📖', label: 'Novel', description: 'Chapters, acts and scenes', color: '#e8a87c' },
    { id: 'comic', icon: '💥', label: 'Comic', description: 'Issues, pages and panels', color: '#f4a261' },
    { id: 'tv', icon: '📺', label: 'TV Show', description: 'Seasons, episodes and scenes', color: '#7ec8e3' },
    { id: 'movie', icon: '🎬', label: 'Movie', description: 'Acts, sequences and scenes', color: '#c77dff' },
    { id: 'game', icon: '🎮', label: 'Game', description: 'Chapters, quests and dialogue', color: '#52b788' },
  ]

  const currentType = projectTypes.find(p => p.id === selectedType)

  const handleStart = () => {
    const name = projectName.trim() || `My ${currentType.label}`
    onSelectProject(selectedType, name)
  }

  return (
    <div style={{ height: '100vh', background: '#0f0f11', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', fontFamily: 'Georgia', fontSize: '36px', fontWeight: 'normal', marginBottom: '8px' }}>
          Storytelling
        </h1>
        <p style={{ color: '#555', fontSize: '14px' }}>
          {selectedType ? `Name your ${currentType.label.toLowerCase()}` : 'What are you working on?'}
        </p>
      </div>

      {!selectedType ? (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '700px' }}>
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