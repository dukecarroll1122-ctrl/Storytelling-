const STATUS_COLORS = {
  'Todo': '#555',
  'Draft': '#7ec8e3',
  'Revised': '#52b788',
  'Final': '#e8a87c',
}

function Outline({ selectedDoc, setSelectedDoc, accentColor, folders, statuses, setStatuses }) {
  const allDocs = folders.flatMap(folder =>
    folder.docs.map(doc => ({
      id: doc.id,
      name: doc.name,
      folder: folder.name,
    }))
  )

  const getStatus = (docId) => statuses[docId] || 'Todo'

  const cycleStatus = (docId) => {
    const order = ['Todo', 'Draft', 'Revised', 'Final']
    const current = getStatus(docId)
    const nextIndex = (order.indexOf(current) + 1) % order.length
    setStatuses({ ...statuses, [docId]: order[nextIndex] })
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #1e1e22' }}>
            <th style={{ textAlign: 'left', padding: '8px 12px', color: '#555', fontWeight: 'normal', fontSize: '11px', letterSpacing: '0.1em' }}>TITLE</th>
            <th style={{ textAlign: 'left', padding: '8px 12px', color: '#555', fontWeight: 'normal', fontSize: '11px', letterSpacing: '0.1em' }}>FOLDER</th>
            <th style={{ textAlign: 'left', padding: '8px 12px', color: '#555', fontWeight: 'normal', fontSize: '11px', letterSpacing: '0.1em' }}>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {allDocs.length === 0 && (
            <tr>
              <td colSpan="3" style={{ padding: '24px 12px', color: '#555', fontSize: '13px' }}>
                Add documents in the Binder to see them here.
              </td>
            </tr>
          )}
          {allDocs.map((doc) => (
            <tr
              key={doc.id}
              onClick={() => setSelectedDoc(doc.id)}
              style={{
                borderBottom: '1px solid #16161a',
                background: selectedDoc === doc.id ? accentColor + '11' : 'transparent',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                if (selectedDoc !== doc.id) e.currentTarget.style.background = '#14141a'
              }}
              onMouseLeave={e => {
                if (selectedDoc !== doc.id) e.currentTarget.style.background = 'transparent'
              }}>
              <td style={{ padding: '10px 12px' }}>
                <span style={{ color: selectedDoc === doc.id ? '#fff' : '#c0bdb8' }}>
                  {doc.name}
                </span>
              </td>
              <td style={{ padding: '10px 12px', color: '#555', fontSize: '12px' }}>
                {doc.folder}
              </td>
              <td style={{ padding: '10px 12px' }}>
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    cycleStatus(doc.id)
                  }}
                  style={{
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '3px',
                    background: STATUS_COLORS[getStatus(doc.id)] + '22',
                    color: STATUS_COLORS[getStatus(doc.id)],
                    cursor: 'pointer',
                    border: `1px solid ${STATUS_COLORS[getStatus(doc.id)]}44`,
                  }}>
                  {getStatus(doc.id)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Outline