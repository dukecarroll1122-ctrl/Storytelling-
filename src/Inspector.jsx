import { useState } from 'react'

function Inspector({ selectedDoc, docData, setDocData }) {
  const [activeTab, setActiveTab] = useState('synopsis')

  const currentData = docData[selectedDoc] || {}

  const updateDocData = (field, value) => {
    setDocData({
      ...docData,
      [selectedDoc]: {
        ...currentData,
        [field]: value,
      }
    })
  }

  const wordCount = currentData.wordCount || 0
  const target = parseInt(currentData.target) || 0
  const progress = target > 0 ? Math.min(Math.round((wordCount / target) * 100), 100) : 0

  const progressColor = progress >= 100 ? '#52b788' : progress >= 60 ? '#e8a87c' : '#7ec8e3'

  return (
    <div style={{ width: '260px', background: '#0c0c0e', borderLeft: '1px solid #1a1a1d', display: 'flex', flexDirection: 'column' }}>

      <div style={{ display: 'flex', borderBottom: '1px solid #1a1a1d' }}>
        <button
          onClick={() => setActiveTab('synopsis')}
          style={{ flex: 1, padding: '10px', background: 'transparent', border: 'none', color: activeTab === 'synopsis' ? '#fff' : '#555', cursor: 'pointer', fontSize: '11px', fontFamily: 'Inter, sans-serif', fontWeight: '500', borderBottom: activeTab === 'synopsis' ? '2px solid #7ec8e3' : '2px solid transparent', letterSpacing: '0.06em' }}>
          SYNOPSIS
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          style={{ flex: 1, padding: '10px', background: 'transparent', border: 'none', color: activeTab === 'notes' ? '#fff' : '#555', cursor: 'pointer', fontSize: '11px', fontFamily: 'Inter, sans-serif', fontWeight: '500', borderBottom: activeTab === 'notes' ? '2px solid #7ec8e3' : '2px solid transparent', letterSpacing: '0.06em' }}>
          NOTES
        </button>
      </div>

      <div style={{ flex: 1, padding: '14px', overflow: 'auto' }}>
        {!selectedDoc && (
          <p style={{ color: '#444', fontSize: '12px', fontStyle: 'italic' }}>
            Select a document to see details.
          </p>
        )}

        {selectedDoc && activeTab === 'synopsis' && (
          <div>
            <p style={{ color: '#555', fontSize: '11px', marginBottom: '8px', letterSpacing: '0.08em', fontWeight: '500' }}>SYNOPSIS</p>
            <textarea
              value={currentData.synopsis || ''}
              onChange={(e) => updateDocData('synopsis', e.target.value)}
              placeholder="Write a short summary of this scene..."
              style={{ width: '100%', height: '120px', background: '#141416', border: '1px solid #1e1e22', color: '#999', borderRadius: '6px', padding: '10px', fontSize: '12px', fontFamily: 'Georgia, serif', lineHeight: '1.7', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
            />

            <div style={{ height: '1px', background: '#1a1a1d', margin: '16px 0' }} />

            <p style={{ color: '#555', fontSize: '11px', marginBottom: '10px', letterSpacing: '0.08em', fontWeight: '500' }}>DOCUMENT INFO</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#444', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>Words</span>
              <span style={{ color: '#888', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>{wordCount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#444', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>Modified</span>
              <span style={{ color: '#888', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>Today</span>
            </div>

            <div style={{ height: '1px', background: '#1a1a1d', margin: '16px 0' }} />

            <p style={{ color: '#555', fontSize: '11px', marginBottom: '8px', letterSpacing: '0.08em', fontWeight: '500' }}>WORD COUNT TARGET</p>

            <input
              type="number"
              value={currentData.target || ''}
              onChange={(e) => updateDocData('target', e.target.value)}
              placeholder="Set a word count goal..."
              style={{ width: '100%', background: '#141416', border: '1px solid #1e1e22', borderRadius: '6px', color: '#999', fontSize: '12px', fontFamily: 'Inter, sans-serif', padding: '8px 10px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }}
            />

            {target > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#444', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>{wordCount} / {target} words</span>
                  <span style={{ color: progressColor, fontSize: '11px', fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>{progress}%</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: '#1e1e22', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: progressColor, borderRadius: '2px', transition: 'width 0.3s ease' }} />
                </div>
                {progress >= 100 && (
                  <p style={{ color: '#52b788', fontSize: '11px', marginTop: '8px', fontFamily: 'Inter, sans-serif' }}>
                    ✓ Goal reached!
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {selectedDoc && activeTab === 'notes' && (
          <div>
            <p style={{ color: '#555', fontSize: '11px', marginBottom: '8px', letterSpacing: '0.08em', fontWeight: '500' }}>NOTES</p>
            <textarea
              value={currentData.notes || ''}
              onChange={(e) => updateDocData('notes', e.target.value)}
              placeholder="Private notes about this document..."
              style={{ width: '100%', height: '200px', background: '#141416', border: '1px solid #1e1e22', color: '#999', borderRadius: '6px', padding: '10px', fontSize: '12px', fontFamily: 'Georgia, serif', lineHeight: '1.7', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        )}

      </div>

    </div>
  )
}

export default Inspector