import { useState } from 'react'
import { FolderIcon } from './icons'

const LABEL_COLORS = [null, '#e06060', '#e8a87c', '#e8d87c', '#52b788', '#7ec8e3', '#c77dff']

const STATUS_COLORS = {
  Todo: '#444',
  Draft: '#7ec8e3',
  Revised: '#52b788',
  Final: '#e8a87c',
}

function Sidebar({ selectedDoc, setSelectedDoc, projectType, accentColor, folders, setFolders, labels, setLabels, statuses }) {
  const [editingItem, setEditingItem] = useState(null)
  const [editingValue, setEditingValue] = useState('')

  const cycleLabel = (e, docId) => {
    e.stopPropagation()
    const current = labels[docId] || null
    const currentIndex = LABEL_COLORS.indexOf(current)
    const nextIndex = (currentIndex + 1) % LABEL_COLORS.length
    setLabels({ ...labels, [docId]: LABEL_COLORS[nextIndex] })
  }

  const getStatusColor = (docId) => {
    const status = statuses?.[docId] || 'Todo'
    return STATUS_COLORS[status] || '#444'
  }

  const getStatusLabel = (docId) => {
    return statuses?.[docId] || 'Todo'
  }

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
        <button aria-label="Add folder" onClick={addFolder} style={{ background: 'none', border: 'none', color: '#8f8f99', fontSize: '18px', cursor: 'pointer' }}>+</button>
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
                  style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px', color: '#ccc', fontSize: '13px', cursor: 'pointer' }}>
                  <FolderIcon width="14" height="14" /> {folder.name}
                </div>
              )}

              <button aria-label="Add document" onClick={() => addDoc(folder.id)} style={{ background: 'none', border: 'none', color: '#8f8f99', fontSize: '16px', cursor: 'pointer', padding: '0 4px' }}>+</button>
              <button aria-label="Delete folder" onClick={() => deleteFolder(folder.id)} style={{ background: 'none', border: 'none', color: '#7d7d87', fontSize: '16px', cursor: 'pointer' }}>×</button>
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
                }}
                onMouseEnter={e => { if (selectedDoc !== doc.id) e.currentTarget.style.background = '#141416' }}
                onMouseLeave={e => { if (selectedDoc !== doc.id) e.currentTarget.style.background = 'transparent' }}>

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
                    style={{ flex: 1, color: selectedDoc === doc.id ? '#fff' : '#aaa', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      onClick={(e) => cycleLabel(e, doc.id)}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: labels[doc.id] || 'transparent',
                        flexShrink: 0,
                        cursor: 'pointer',
                        border: labels[doc.id] ? 'none' : '1px solid #444',
                        display: 'inline-block',
                      }}
                      title="Click to cycle label color"
                    />
                    {doc.name}
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontSize: '9px',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: '600',
                        letterSpacing: '0.04em',
                        color: getStatusColor(doc.id),
                        opacity: 0.8,
                      }}>
                      {getStatusLabel(doc.id) !== 'Todo' ? getStatusLabel(doc.id).toUpperCase() : ''}
                    </span>
                  </div>
                )}

                <button aria-label="Delete document" onClick={() => deleteDoc(folder.id, doc.id)} style={{ background: 'none', border: 'none', color: '#7d7d87', fontSize: '16px', cursor: 'pointer' }}>×</button>
              </div>
            ))}

          </div>
        ))}
      </div>

    </div>
  )
}

export default Sidebar
