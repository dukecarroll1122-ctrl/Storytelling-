import { useState, useEffect } from 'react'

function Inspector({ selectedDoc, docData, setDocData }) {
  const [activeTab, setActiveTab] = useState('synopsis')

  const currentData = docData[selectedDoc] || { synopsis: '', notes: '' }

  const updateDocData = (field, value) => {
    setDocData({
      ...docData,
      [selectedDoc]: {
        ...currentData,
        [field]: value,
      }
    })
  }

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
              value={currentData.synopsis}
              onChange={(e) => updateDocData('synopsis', e.target.value)}
              placeholder="Write a short summary of this scene..."
              style={{ width: '100%', height: '160px', background: '#141416', border: '1px solid #1e1e22', color: '#999', borderRadius: '6px', padding: '10px', fontSize: '12px', fontFamily: 'Georgia, serif', lineHeight: '1.7', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        )}

        {selectedDoc && activeTab === 'notes' && (
          <div>
            <p style={{ color: '#555', fontSize: '11px', marginBottom: '8px', letterSpacing: '0.08em', fontWeight: '500' }}>NOTES</p>
            <textarea
              value={currentData.notes}
              onChange={(e) => updateDocData('notes', e.target.value)}
              placeholder="Private notes about this document..."
              style={{ width: '100%', height: '160px', background: '#141416', border: '1px solid #1e1e22', color: '#999', borderRadius: '6px', padding: '10px', fontSize: '12px', fontFamily: 'Georgia, serif', lineHeight: '1.7', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        )}
      </div>

    </div>
  )
}

export default Inspector