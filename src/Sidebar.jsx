import { useEffect, useState } from 'react'

const DEFAULT_STRUCTURES = {
  novel: [
    { id: 'act1', name: 'Act 1', open: true, docs: [{ id: 'doc-1', name: 'Untitled Chapter' }] },
    { id: 'research', name: 'Research', open: false, docs: [] },
    { id: 'characters', name: 'Characters', open: false, docs: [] },
  ],
  comic: [
    { id: 'issue1', name: 'Issue 1', open: true, docs: [{ id: 'doc-1', name: 'Untitled Page' }] },
    { id: 'research', name: 'Research', open: false, docs: [] },
    { id: 'characters', name: 'Characters', open: false, docs: [] },
  ],
  tv: [
    { id: 'season1', name: 'Season 1', open: true, docs: [{ id: 'doc-1', name: 'Untitled Episode' }] },
    { id: 'research', name: 'Research', open: false, docs: [] },
    { id: 'characters', name: 'Characters', open: false, docs: [] },
  ],
  movie: [
    { id: 'act1', name: 'Act 1', open: true, docs: [{ id: 'doc-1', name: 'Untitled Scene' }] },
    { id: 'research', name: 'Research', open: false, docs: [] },
    { id: 'characters', name: 'Characters', open: false, docs: [] },
  ],
  game: [
    { id: 'chapter1', name: 'Chapter 1', open: true, docs: [{ id: 'doc-1', name: 'Untitled Quest' }] },
    { id: 'research', name: 'Research', open: false, docs: [] },
    { id: 'characters', name: 'Characters', open: false, docs: [] },
  ],
}

function Sidebar({ selectedDoc, setSelectedDoc, projectType, accentColor, folders, setFolders }) {
  const [editingItem, setEditingItem] = useState(null)
  const [editingValue, setEditingValue] = useState('')

  useEffect(() => {
    setFolders(DEFAULT_STRUCTURES[projectType] || DEFAULT_STRUCTURES.novel)
    setSelectedDoc('')
  }, [projectType])

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
    setEditingValue('Untitled Folder')
  }

  const addDoc = (folderId) => {
    const newDoc = { id: `doc-${Date.now()}`, name: 'Untitled' }
    setFolders(folders.map(f =>
      f.id === folderId ? { ...f, docs: [...f.docs, newDoc] } : f
    ))
    setSelectedDoc(newDoc.id)
    setEditingItem(newDoc.id)
    setEditingValue('Untitled')
  }

  const deleteFolder = (folderId) => {
    setFolders(folders.filter(f => f.id !== folderId))
  }

  const deleteDoc = (folderId, docId) => {
    setFolders(folders.map(f =>
      f.id === folderId ? { ...f, docs: f.docs.filter(d => d.id !== docId) } : f
    ))
    if (selectedDoc === docId) setSelectedDoc('')
  }

  const saveEdit = (type, folderId, itemId) => {
    const finalName = editingValue.trim() || 'Untitled'
    if (type === 'folder') {
      setFolders(folders.map(f =>
        f.id === folderId ? { ...f, name: finalName } : f
      ))
    } else {
      setFolders(folders.map(f =>
        f.id === folderId
          ? { ...f, docs: f.docs.map(d => d.id === itemId ? { ...d, name: finalName } : d) }
          : f
      ))
    }
    setEditingItem(null)
    setEditingValue('')
  }

  const startEditing = (id, currentName) => {
    setEditingItem(id)
    setEditingValue(currentName)
  }

  return (
    <div style={{ width: '250px', background: '#0c0c0e', borderRight: '1px solid #1a1a1d', height: '100%', display: 'flex', flexDirection: 'column' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #1a1a1d' }}>
        <p style={{ color: '#555', fontSize: '11px', letterSpacing: '0.1em' }}>BINDER</p>
        <button onClick={addFolder} style={{ background: 'none', border: 'none', color: '#555', fontSize: '18px', cursor: 'pointer' }}>+</button>
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
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => saveEdit('folder', folder.id, folder.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit('folder', folder.id, folder.id)
                    if (e.key === 'Escape') setEditingItem(null)
                  }}
                  style={{ flex: 1, background: '#1a1a1d', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', borderRadius: '3px', padding: '2px 6px' }}
                />
              ) : (
                <div
                  onClick={() => toggleFolder(folder.id)}
                  onDoubleClick={() => startEditing(folder.id, folder.name)}
                  style={{ flex: 1, color: '#ccc', fontSize: '13px', cursor: 'pointer' }}>
                  📁 {folder.name}
                </div>
              )}

              <span onClick={() => addDoc(folder.id)} style={{ color: '#555', fontSize: '16px', cursor: 'pointer', padding: '0 4px' }}>+</span>
              <span onClick={() => deleteFolder(folder.id)} style={{ color: '#444', fontSize: '16px', cursor: 'pointer' }}>×</span>
            </div>

            {folder.open && folder.docs.map(doc => (
              <div
                key={doc.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px 8px 4px 32px',
                  background: selectedDoc === doc.id ? accentColor + '22' : 'transparent',
                  borderRadius: '4px',
                  borderLeft: selectedDoc === doc.id ? `2px solid ${accentColor}` : '2px solid transparent',
                }}>

                {editingItem === doc.id ? (
                  <input
                    autoFocus
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onBlur={() => saveEdit('doc', folder.id, doc.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit('doc', folder.id, doc.id)
                      if (e.key === 'Escape') setEditingItem(null)
                    }}
                    style={{ flex: 1, background: '#1a1a1d', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', borderRadius: '3px', padding: '2px 6px' }}
                  />
                ) : (
                  <div
                    onClick={() => setSelectedDoc(doc.id)}
                    onDoubleClick={() => startEditing(doc.id, doc.name)}
                    style={{ flex: 1, color: selectedDoc === doc.id ? '#fff' : '#aaa', fontSize: '13px', cursor: 'pointer' }}>
                    📄 {doc.name}
                  </div>
                )}

                <span onClick={() => deleteDoc(folder.id, doc.id)} style={{ color: '#444', fontSize: '16px', cursor: 'pointer' }}>×</span>
              </div>
            ))}

          </div>
        ))}
      </div>

    </div>
  )
}

export default Sidebar