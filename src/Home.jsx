function Home({ onSelectProject }) {
  const projectTypes = [
    { id: 'novel', icon: '📖', label: 'Novel', description: 'Chapters, acts and scenes', color: '#e8a87c' },
    { id: 'comic', icon: '💥', label: 'Comic', description: 'Issues, pages and panels', color: '#f4a261' },
    { id: 'tv', icon: '📺', label: 'TV Show', description: 'Seasons, episodes and scenes', color: '#7ec8e3' },
    { id: 'movie', icon: '🎬', label: 'Movie', description: 'Acts, sequences and scenes', color: '#c77dff' },
    { id: 'game', icon: '🎮', label: 'Game', description: 'Chapters, quests and dialogue', color: '#52b788' },
  ]

  return (
    <div style={{ height: '100vh', background: '#0f0f11', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', fontFamily: 'Georgia', fontSize: '36px', fontWeight: 'normal', marginBottom: '8px' }}>
          Storytelling
        </h1>
        <p style={{ color: '#555', fontSize: '14px' }}>
          What are you working on?
        </p>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '700px' }}>
        {projectTypes.map(pt => (
          <div
            key={pt.id}
            onClick={() => onSelectProject(pt.id)}
            style={{
              width: '180px',
              padding: '24px 16px',
              background: '#0c0c0e',
              border: `1px solid #1a1a1d`,
              borderTop: `3px solid ${pt.color}`,
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#141416'
              e.currentTarget.style.borderColor = pt.color
              e.currentTarget.style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#0c0c0e'
              e.currentTarget.style.borderColor = '#1a1a1d'
              e.currentTarget.style.transform = 'translateY(0)'
            }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{pt.icon}</div>
            <div style={{ color: pt.color, fontSize: '14px', fontWeight: 'bold', marginBottom: '6px' }}>{pt.label}</div>
            <div style={{ color: '#555', fontSize: '11px', lineHeight: '1.5' }}>{pt.description}</div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Home