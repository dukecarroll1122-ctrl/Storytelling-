import { useState } from 'react'

const PROJECT_STRUCTURES = {
  novel: {
    folders: ['Manuscript', 'Research', 'Characters'],
    defaultDoc: 'Untitled Chapter',
  },
  comic: {
    folders: ['Issue 1', 'Research', 'Characters'],
    defaultDoc: 'Untitled Page',
  },
  tv: {
    folders: ['Season 1', 'Research', 'Characters'],
    defaultDoc: 'Untitled Episode',
  },
  movie: {
    folders: ['Act 1', 'Research', 'Characters'],
    defaultDoc: 'Untitled Scene',
  },
  game: {
    folders: ['Chapter 1', 'Research', 'Characters'],
    defaultDoc: 'Untitled Quest',
  },
}

function Sidebar({ selectedDoc, setSelectedDoc, documents, setDocuments, research, setResearch, characters, setCharacters, projectType, accentColor }) {
  const [mainOpen, setMainOpen] = useState(true)
  const [researchOpen, setResearchOpen] = useState(false)
  const [charactersOpen, setCharactersOpen] = useState(false)

  const structure = PROJECT_STRUCTURES[projectType] || PROJECT_STRUCTURES.novel
  const mainFolderName = structure.folders[0]
  const defaultDoc = structure.defaultDoc

  const addDocument = (list, setList) => {
    const timestamp = Date.now()
    const newDoc = `${defaultDoc}-${timestamp}`
    setList([...list, newDoc])
    setSelectedDoc(newDoc)
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
          background: selectedDoc === doc ? accentColor + '22' : 'transparent',
          borderRadius: '4px',
          borderLeft: selectedDoc === doc ? `2px solid ${accentColor}` : '2px solid transparent',
        }}>
        <div
          onClick={() => setSelectedDoc(doc)}
          style={{ flex: 1, color: selectedDoc === doc ? '#fff' : '#aaa', fontSize: '13px', cursor: 'pointer' }}>
          📄 {doc.includes('-') ? defaultDoc.replace('Untitled ', '') : doc}
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
          <div onClick={() => setMainOpen(!mainOpen)} style={{ color: '#ccc', fontSize: '13px', flex: 1, cursor: 'pointer' }}>
            {mainOpen ? '📂' : '📁'} {mainFolderName}
          </div>
          <span onClick={() => addDocument(documents, setDocuments)} style={{ color: '#555', fontSize: '16px', cursor: 'pointer' }}>+</span>
        </div>
        {mainOpen && renderDocs(documents, setDocuments)}

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