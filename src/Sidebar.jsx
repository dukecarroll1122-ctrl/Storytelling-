import { useState } from 'react'

const DEFAULT_STRUCTURES = {
  novel: [
    { id: 'act1', name: 'Act 1', open: true, docs: ['Untitled Chapter'] },
    { id: 'research', name: 'Research', open: false, docs: [] },
    { id: 'characters', name: 'Characters', open: false, docs: [] },
  ],
  comic: [
    { id: 'issue1', name: 'Issue 1', open: true, docs: ['Untitled Page'] },
    { id: 'research', name: 'Research', open: false, docs: [] },
    { id: 'characters', name: 'Characters', open: false, docs: [] },
  ],
  tv: [
    { id: 'season1', name: 'Season 1', open: true, docs: ['Untitled Episode'] },
    { id: 'research', name: 'Research', open: false, docs: [] },
    { id: 'characters', name: 'Characters', open: false, docs: [] },
  ],
  movie: [
    { id: 'act1', name: 'Act 1', open: true, docs: ['Untitled Scene'] },
    { id: 'research', name: 'Research', open: false, docs: [] },
    { id: 'characters', name: 'Characters', open: false, docs: [] },
  ],
  game: [
    { id: 'chapter1', name: 'Chapter 1', open: true, docs: ['Untitled Quest'] },
    { id: 'research', name: 'Research', open: false, docs: [] },
    { id: 'characters', name: 'Characters', open: false, docs: [] },
  ],
}

function Sidebar({ selectedDoc, setSelectedDoc, projectType, accentColor }) {
  const [folders, setFolders] = useState(DEFAULT_STRUCTURES[projectType] || DEFAULT_STRUCTURES.novel)
  const [editingItem, setEditingItem] = useState(null)

  const toggleFolder = (folderId) => {
    setFolders(folders.map(f =>
      f.id === folderId ? { ...f, open: !f.open } : f
    ))
  }

  const addFolder = () => {
    const newFolder = {
      id: `folder-${Date.now()}`,
      name: 'Untitled Folder',
      open: true,
      docs: [],
    }
    setFolders([...folders, newFolder])
    setEditingItem(newFolder.id)
  }

  const renameFolder = (folderId, newName) => {
    setFolders(folders.map(f =>
      f.id === folderId ? { ...f, name: newName } : f
    ))
  }

  const deleteFolder = (folderId) => {
    setFolders(folders.filter(f => f.id !== folderId))
  }

  const addDoc = (folderId) => {
    const newDoc = `Untitled-${Date.now()}`
    setFolders(folders.map(f =>
      f.id === folderId ? { ...f, docs: [...f.docs, newDoc] } : f
    ))
    setSelectedDoc(newDoc)
    setEditingItem(newDoc)
  }

  const renameDoc = (folderId, oldDoc, newName) => {
    const finalName = newName.trim() || 'Untitled'
    setFolders(folders.map(f =>
      f.id === folderId
        ? { ...f, docs: f.docs.map(d => d === oldDoc ? finalName : d) }
        : f
    ))
    if (selectedDoc === oldDoc) setSelectedDoc(finalName)
  }

  const deleteDoc = (folderId, doc) => {
    setFolders(folders.map(f =>
      f.id === folderId ? { ...f, docs: f.docs.filter(d => d !== doc) } : f
    ))
    if (selectedDoc === doc) setSelectedDoc('')
  }

  const getDocName = (doc) => {
    if (doc.startsWith('Untitled-') && !isNaN(doc.split('-').pop())) {
      return 'Untitled'
    }
    return doc
  }

  return (
    <div style={{ width: '250px', background: '#0c0c0e', borderRight: '1px solid #1a1a1d', height: '100%', display: 'flex', flexDirection: 'column' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #1a1a1d' }}>
        <p style={{ color: '#555', fontSize: '11px', letterSpacing: '0.1em' }}>BINDER</p>
        <button
          onClick={addFolder}
          style={{ background: 'none', border: 'none', color: '#555', fontSize: '18px', cursor: 'pointer' }}>
          +
        </button>
      </div>

      <div style={{ padding: '6px', flex: 1, overflow: 'auto' }}>
        {folders.map(folder => (
          <div key={folder.id}>

            <div
              style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', borderRadius: '4px' }}
              onMouseEnter={e => e.currentTarget.style.background = '#141416'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

              <div onClick={() => toggleFolder(folder.id)} style={{ cursor: 'pointer', marginRight: '6px', color: '#666', fontSize: '12px' }}>
                {folder.open ? '▼' : '▶'}
              </div>

              {editingItem === folder.id ? (
                <input
                  autoFocus
                  defaultValue={folder.name}
                  onBlur={(e) => {
                    renameFolder(folder.id, e.target.value || folder.name)
                    setEditingItem(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      renameFolder(folder.id, e.target.value || folder.name)
                      setEditingItem(null)
                    }
                  }}
                  style={{ flex: 1, background: '#1a1a1d', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', borderRadius: '3px', padding: '2px 6px' }}
                />
              ) : (
                <div
                  onDoubleClick={() => setEditingItem(folder.id)}
                  onClick={() => toggleFolder(folder.id)}
                  style={{ flex: 1, color: '#ccc', fontSize: '13px', cursor: 'pointer' }}>
                  📁 {folder.name}
                </div>
              )}

              <span onClick={() => addDoc(folder.id)} style={{ color: '#555', fontSize: '16px', cursor: 'pointer', padding: '0 4px' }}>+</span>
              <span onClick={() => deleteFolder(folder.id)} style={{ color: '#444', fontSize: '16px', cursor: 'pointer' }}>×</span>
            </div>

            {folder.open && folder.docs.map(doc => (
              <div
                key={doc}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px 8px 4px 32px',
                  background: selectedDoc === doc ? accentColor + '22' : 'transparent',
                  borderRadius: '4px',
                  borderLeft: selectedDoc === doc ? `2px solid ${accentColor}` : '2px solid transparent',
                }}>

                {editingItem === doc ? (
                  <input
                    autoFocus
                    defaultValue={getDocName(doc)}
                    onBlur={(e) => {
                      renameDoc(folder.id, doc, e.target.value)
                      setEditingItem(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        renameDoc(folder.id, doc, e.target.value)
                        setEditingItem(null)
                      }
                    }}
                    style={{ flex: 1, background: '#1a1a1d', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', borderRadius: '3px', padding: '2px 6px' }}
                  />
                ) : (
                  <div
                    onClick={() => setSelectedDoc(doc)}
                    onDoubleClick={() => setEditingItem(doc)}
                    style={{ flex: 1, color: selectedDoc === doc ? '#fff' : '#aaa', fontSize: '13px', cursor: 'pointer' }}>
                    📄 {getDocName(doc)}
                  </div>
                )}

                <span onClick={() => deleteDoc(folder.id, doc)} style={{ color: '#444', fontSize: '16px', cursor: 'pointer' }}>×</span>
              </div>
            ))}

          </div>
        ))}
      </div>

    </div>
  )
}

export default Sidebar