import { useState } from 'react'

function Sidebar({ selectedDoc, setSelectedDoc, documents, setDocuments, research, setResearch, characters, setCharacters }) {
  const [manuscriptOpen, setManuscriptOpen] = useState(true)
  const [researchOpen, setResearchOpen] = useState(false)
  const [charactersOpen, setCharactersOpen] = useState(false)

  const addDocument = (list, setList) => {
    const newDoc = 'Untitled'
    const timestamp = Date.now()
    const uniqueName = `${newDoc} ${timestamp}`
    setList([...list, uniqueName])
    setSelectedDoc(uniqueName)
  }

  const renameDocument = (list, setList, oldName, newName) => {
    if (!newName || newName === oldName) return
    const updated = list.map(d => d === oldName ? newName : d)
    setList(updated)
    if (selectedDoc === oldName) setSelectedDoc(newName)
  }

  const deleteDocument = (list, setList, doc) => {
    const updated = list.filter(d => d !== doc)
    setList(updated)
    if (selectedDoc === doc) setSelectedDoc(updated[0] || '')
  }

  const renderDocs = (list, setList) => (
    list.map((doc) => (
      <div
        key={doc}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '4px 8px 4px 28px',
          background: selectedDoc === doc ? '#1a1a2e' : 'transparent',
          borderRadius: '4px',
        }}>
        <div
          onClick={() => setSelectedDoc(doc)}
          style={{ flex: 1, color: selectedDoc === doc ? '#fff' : '#aaa', fontSize: '13px', cursor: 'pointer' }}>
          📄 {doc.startsWith('Untitled') ? 'Untitled' : doc}
        </div>
        <span
          onClick={() => deleteDocument(list, setList, doc)}
          style={{ color: '#444', fontSize: '16px', cursor: 'pointer', paddingLeft: '4px' }}>
          ×
        </span>
      </div>
    ))
  )

  return (
    <div style={{ width: '250px', background: '#0c0c0e', borderRight: '1px solid #1a1a1d', height: '100%', display: 'flex', flexDirection: 'column' }}>

      <div style={{ padding: '10px 16px', borderBottom: '1px solid #1a1a1d' }}>
        <p style={{ color: '#555', fontSize: '11px', letterSpacing: '0.1em' }}>BINDER</p>
      </div>

      <div style={{ padding: '6px', flex: 1, overflow: 'auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', padding: '4px 8px' }}>
          <div onClick={() => setManuscriptOpen(!manuscriptOpen)} style={{ color: '#ccc', fontSize: '13px', flex: 1, cursor: 'pointer' }}>
            {manuscriptOpen ? '📂' : '📁'} Manuscript
          </div>
          <span onClick={() => addDocument(documents, setDocuments)} style={{ color: '#555', fontSize: '16px', cursor: 'pointer' }}>+</span>
        </div>
        {manuscriptOpen && renderDocs(documents, setDocuments)}

        <div style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', marginTop: '4px' }}>
          <div onClick={() => setResearchOpen(!researchOpen)} style={{ color: '#ccc', fontSize: '13px', flex: 1, cursor: 'pointer' }}>
            {researchOpen ? '📂' : '📁'} Research
          </div>
          <span onClick={() => addDocument(research, setResearch)} style={{ color: '#555', fontSize: '16px', cursor: 'pointer' }}>+</span>
        </div>
        {researchOpen && renderDocs(research, setResearch)}

        <div style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', marginTop: '4px' }}>
          <div onClick={() => setCharactersOpen(!charactersOpen)} style={{ color: '#ccc', fontSize: '13px', flex: 1, cursor: 'pointer' }}>
            {charactersOpen ? '📂' : '📁'} Characters
          </div>
          <span onClick={() => addDocument(characters, setCharacters)} style={{ color: '#555', fontSize: '16px', cursor: 'pointer' }}>+</span>
        </div>
        {charactersOpen && renderDocs(characters, setCharacters)}

      </div>

    </div>
  )
}

export default Sidebar