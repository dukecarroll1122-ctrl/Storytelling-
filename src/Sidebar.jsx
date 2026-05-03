import { useState } from 'react'

function Sidebar() {
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
            <div style={{ color: '#aaa', fontSize: '13px', padding: '6px 8px', paddingLeft: '28px', cursor: 'pointer' }}>
              📄 Chapter 1
            </div>
            <div style={{ color: '#aaa', fontSize: '13px', padding: '6px 8px', paddingLeft: '28px', cursor: 'pointer' }}>
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