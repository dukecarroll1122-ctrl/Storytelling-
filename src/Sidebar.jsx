import { useState } from 'react'

function Sidebar({ selectedDoc, setSelectedDoc }) {
  const [manuscriptOpen, setManuscriptOpen] = useState(true)
  return (
    <div style={{ width: '250px', background: '#0c0c0e', borderRight: '1px solid #1a1a1d', height: '100%' }}>

      <p style={{ color: '#555', padding: '16px', fontSize: '11px', letterSpacing: '0.1em' }}>BINDER</p>

      <div style={{ padding: '0 8px' }}>

        <div
          onClick={() => setManuscriptOpen(!manuscriptOpen)}
          style={{ color: '#ccc', fontSize: '13px', padding: '6px 8px', cursor: 'pointer' }}>
          {manuscriptOpen ? '📂' : '📁'} Manuscript
        </div>

        {manuscriptOpen && (
          <div>
            <div
              onClick={() => setSelectedDoc('Chapter 1')}
              style={{ color: selectedDoc === 'Chapter 1' ? '#fff' : '#aaa', fontSize: '13px', padding: '6px 8px', paddingLeft: '28px', cursor: 'pointer', background: selectedDoc === 'Chapter 1' ? '#1a1a2e' : 'transparent', borderRadius: '4px' }}>
              📄 Chapter 1
            </div>
            <div
              onClick={() => setSelectedDoc('Chapter 2')}
              style={{ color: selectedDoc === 'Chapter 2' ? '#fff' : '#aaa', fontSize: '13px', padding: '6px 8px', paddingLeft: '28px', cursor: 'pointer', background: selectedDoc === 'Chapter 2' ? '#1a1a2e' : 'transparent', borderRadius: '4px' }}>
              📄 Chapter 2
            </div>
          </div>
        )}

        <div style={{ color: '#ccc', fontSize: '13px', padding: '6px 8px', cursor: 'pointer' }}>
          📁 Research
        </div>

        <div style={{ color: '#ccc', fontSize: '13px', padding: '6px 8px', cursor: 'pointer' }}>
          📁 Characters
        </div>

      </div>

    </div>
  )
}

export default Sidebar