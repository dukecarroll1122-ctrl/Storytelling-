import { useState } from 'react'

function Sidebar({ selectedDoc, setSelectedDoc }) {
  const [manuscriptOpen, setManuscriptOpen] = useState(true)
  const [documents, setDocuments] = useState(['Chapter 1', 'Chapter 2'])

  const addDocument = () => {
    const newDoc = `Chapter ${documents.length + 1}`
    setDocuments([...documents, newDoc])
    setSelectedDoc(newDoc)
  }

  return (
    <div style={{ width: '250px', background: '#0c0c0e', borderRight: '1px solid #1a1a1d', height: '100%', display: 'flex', flexDirection: 'column' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #1a1a1d' }}>
        <p style={{ color: '#555', fontSize: '11px', letterSpacing: '0.1em' }}>BINDER</p>
        <button
          onClick={addDocument}
          style={{ background: 'none', border: 'none', color: '#555', fontSize: '18px', cursor: 'pointer', lineHeight: 1 }}>
          +
        </button>
      </div>

      <div style={{ padding: '8px', flex: 1, overflow: 'auto' }}>

        <div
          onClick={() => setManuscriptOpen(!manuscriptOpen)}
          style={{ color: '#ccc', fontSize: '13px', padding: '6px 8px', cursor: 'pointer' }}>
          {manuscriptOpen ? '📂' : '📁'} Manuscript
        </div>

        {manuscriptOpen && (
          <div>
            {documents.map((doc) => (
              <div
                key={doc}
                onClick={() => setSelectedDoc(doc)}
                style={{
                  color: selectedDoc === doc ? '#fff' : '#aaa',
                  fontSize: '13px',
                  padding: '6px 8px',
                  paddingLeft: '28px',
                  cursor: 'pointer',
                  background: selectedDoc === doc ? '#1a1a2e' : 'transparent',
                  borderRadius: '4px',
                }}>
                📄 {doc}
              </div>
            ))}
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