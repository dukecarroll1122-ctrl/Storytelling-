function Corkboard({ selectedDoc, setSelectedDoc, accentColor, folders }) {
  const allDocs = folders.flatMap(folder =>
    folder.docs.map(doc => ({
      name: doc.startsWith('Untitled-') && !isNaN(doc.split('-').pop()) ? 'Untitled' : doc,
      rawName: doc,
      folder: folder.name,
    }))
  )

  return (
    <div style={{ flex: 1, background: '#0d0c0a', overflow: 'auto', padding: '32px' }}>
      <div style={{
        backgroundImage: 'radial-gradient(#2a2520 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        minHeight: '100%',
        borderRadius: '8px',
        padding: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        alignContent: 'flex-start',
      }}>

        {allDocs.length === 0 && (
          <p style={{ color: '#555', fontSize: '13px' }}>
            Add documents in the Binder to see them here.
          </p>
        )}

        {allDocs.map((card, i) => (
          <div
            key={card.rawName}
            onClick={() => setSelectedDoc(card.rawName)}
            style={{
              width: '200px',
              minHeight: '160px',
              background: '#1c1915',
              border: selectedDoc === card.rawName ? `1px solid ${accentColor}` : '1px solid #2a2520',
              borderTop: `3px solid ${accentColor}`,
              borderRadius: '4px',
              padding: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              transform: `rotate(${(i % 3 - 1) * 0.8}deg)`,
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'rotate(0deg) scale(1.02)'
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.6)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = `rotate(${(i % 3 - 1) * 0.8}deg)`
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)'
            }}>
            <div style={{ fontSize: '10px', color: '#555', marginBottom: '6px', letterSpacing: '0.1em' }}>
              {card.folder}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: accentColor, marginBottom: '10px', fontFamily: 'Georgia' }}>
              {card.name}
            </div>
            <div style={{ fontSize: '12px', color: '#666', fontFamily: 'Georgia', fontStyle: 'italic' }}>
              Click to open in editor...
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Corkboard