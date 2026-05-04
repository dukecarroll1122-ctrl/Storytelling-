import { useState } from 'react'

function Inspector() {
  const [synopsis, setSynopsis] = useState('')
  const [notes, setNotes] = useState('')
  const [activeTab, setActiveTab] = useState('synopsis')

  return (
    <div style={{ width: '260px', background: '#0c0c0e', borderLeft: '1px solid #1a1a1d', display: 'flex', flexDirection: 'column' }}>

      <div style={{ display: 'flex', borderBottom: '1px solid #1a1a1d' }}>
        <button
          onClick={() => setActiveTab('synopsis')}
          style={{ flex: 1, padding: '10px', background: 'transparent', border: 'none', color: activeTab === 'synopsis' ? '#fff' : '#555', cursor: 'pointer', fontSize: '11px', borderBottom: activeTab === 'synopsis' ? '2px solid #7ec8e3' : '2px solid transparent' }}>
          SYNOPSIS
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          style={{ flex: 1, padding: '10px', background: 'transparent', border: 'none', color: activeTab === 'notes' ? '#fff' : '#555', cursor: 'pointer', fontSize: '11px', borderBottom: activeTab === 'notes' ? '2px solid #7ec8e3' : '2px solid transparent' }}>
          NOTES
        </button>
      </div>

      <div style={{ flex: 1, padding: '16px', overflow: 'auto' }}>

        {activeTab === 'synopsis' && (
          <div>
            <p style={{ color: '#555', fontSize: '11px', marginBottom: '8px', letterSpacing: '0.1em' }}>SYNOPSIS</p>
            <textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Write a short summary of this scene..."
              style={{ width: '100%', height: '120px', background: '#141416', border: '1px solid #1e1e22', color: '#999', borderRadius: '4px', padding: '10px', fontSize: '12px', fontFamily: 'Georgia', lineHeight: '1.6', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        )}

        {activeTab === 'notes' && (
          <div>
            <p style={{ color: '#555', fontSize: '11px', marginBottom: '8px', letterSpacing: '0.1em' }}>NOTES</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Private notes about this document..."
              style={{ width: '100%', height: '120px', background: '#141416', border: '1px solid #1e1e22', color: '#999', borderRadius: '4px', padding: '10px', fontSize: '12px', fontFamily: 'Georgia', lineHeight: '1.6', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        )}

      </div>

    </div>
  )
}

export default Inspector