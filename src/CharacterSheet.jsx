function CharacterSheet({ selectedDoc, folders, docData, setDocData }) {
  const currentData = docData[selectedDoc] || {}

  const update = (field, value) => {
    setDocData(prev => ({
      ...prev,
      [selectedDoc]: {
        ...prev[selectedDoc],
        [field]: value,
      }
    }))
  }

  const fieldStyle = {
    width: '100%',
    background: '#141416',
    border: '1px solid #1e1e22',
    borderRadius: '6px',
    color: '#d4d0c8',
    fontSize: '13px',
    fontFamily: 'Georgia, serif',
    padding: '10px 12px',
    outline: 'none',
    marginBottom: '20px',
    transition: 'border-color 0.15s',
  }

  const labelStyle = {
    fontSize: '10px',
    fontWeight: '600',
    letterSpacing: '0.1em',
    color: '#8f8f99',
    marginBottom: '6px',
    fontFamily: 'Inter, sans-serif',
    display: 'block',
  }

  const getCharName = () => {
    for (const folder of folders) {
      const doc = folder.docs.find(d => d.id === selectedDoc)
      if (doc) return doc.name
    }
    return 'Character'
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0f0f11', overflow: 'auto' }}>

      <div style={{ padding: '32px 48px 16px', borderBottom: '1px solid #1a1a1d' }}>
        <div style={{ fontSize: '11px', color: '#8f8f99', letterSpacing: '0.1em', marginBottom: '6px', fontFamily: 'Inter, sans-serif' }}>
          CHARACTER SHEET
        </div>
        <h2 style={{ fontSize: '24px', fontFamily: 'Georgia, serif', fontWeight: '500', color: '#fff' }}>
          {currentData.name || getCharName()}
        </h2>
      </div>

      <div style={{ padding: '32px 48px', maxWidth: '720px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '4px' }}>
          <div>
            <label style={labelStyle}>NAME</label>
            <input
              value={currentData.name || ''}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Character name"
              style={{ ...fieldStyle, marginBottom: '0' }}
              onFocus={e => e.target.style.borderColor = 'rgba(106,180,212,0.4)'}
              onBlur={e => e.target.style.borderColor = '#1e1e22'}
            />
          </div>
          <div>
            <label style={labelStyle}>AGE</label>
            <input
              value={currentData.age || ''}
              onChange={(e) => update('age', e.target.value)}
              placeholder="Age"
              style={{ ...fieldStyle, marginBottom: '0' }}
              onFocus={e => e.target.style.borderColor = 'rgba(106,180,212,0.4)'}
              onBlur={e => e.target.style.borderColor = '#1e1e22'}
            />
          </div>
          <div>
            <label style={labelStyle}>ROLE</label>
            <select
              value={currentData.role || ''}
              onChange={(e) => update('role', e.target.value)}
              style={{ ...fieldStyle, marginBottom: '0', cursor: 'pointer' }}>
              <option value="">Select role</option>
              <option value="Protagonist">Protagonist</option>
              <option value="Antagonist">Antagonist</option>
              <option value="Supporting">Supporting</option>
              <option value="Mentor">Mentor</option>
              <option value="Love Interest">Love Interest</option>
              <option value="Comic Relief">Comic Relief</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '4px', marginTop: '20px' }}>
          <label style={labelStyle}>PHYSICAL APPEARANCE</label>
          <textarea
            value={currentData.appearance || ''}
            onChange={(e) => update('appearance', e.target.value)}
            placeholder="Describe how this character looks..."
            style={{ ...fieldStyle, height: '100px', resize: 'none' }}
            onFocus={e => e.target.style.borderColor = 'rgba(106,180,212,0.4)'}
            onBlur={e => e.target.style.borderColor = '#1e1e22'}
          />
        </div>

        <div style={{ marginBottom: '4px' }}>
          <label style={labelStyle}>BACKSTORY</label>
          <textarea
            value={currentData.backstory || ''}
            onChange={(e) => update('backstory', e.target.value)}
            placeholder="Where did this character come from? What shaped them?"
            style={{ ...fieldStyle, height: '120px', resize: 'none' }}
            onFocus={e => e.target.style.borderColor = 'rgba(106,180,212,0.4)'}
            onBlur={e => e.target.style.borderColor = '#1e1e22'}
          />
        </div>

        <div style={{ marginBottom: '4px' }}>
          <label style={labelStyle}>MOTIVATION</label>
          <textarea
            value={currentData.motivation || ''}
            onChange={(e) => update('motivation', e.target.value)}
            placeholder="What does this character want more than anything?"
            style={{ ...fieldStyle, height: '100px', resize: 'none' }}
            onFocus={e => e.target.style.borderColor = 'rgba(106,180,212,0.4)'}
            onBlur={e => e.target.style.borderColor = '#1e1e22'}
          />
        </div>

        <div style={{ marginBottom: '4px' }}>
          <label style={labelStyle}>INTERNAL CONFLICT</label>
          <textarea
            value={currentData.conflict || ''}
            onChange={(e) => update('conflict', e.target.value)}
            placeholder="What inner struggle does this character face?"
            style={{ ...fieldStyle, height: '100px', resize: 'none' }}
            onFocus={e => e.target.style.borderColor = 'rgba(106,180,212,0.4)'}
            onBlur={e => e.target.style.borderColor = '#1e1e22'}
          />
        </div>

        <div style={{ marginBottom: '4px' }}>
          <label style={labelStyle}>NOTES</label>
          <textarea
            value={currentData.characterNotes || ''}
            onChange={(e) => update('characterNotes', e.target.value)}
            placeholder="Anything else worth noting about this character..."
            style={{ ...fieldStyle, height: '100px', resize: 'none' }}
            onFocus={e => e.target.style.borderColor = 'rgba(106,180,212,0.4)'}
            onBlur={e => e.target.style.borderColor = '#1e1e22'}
          />
        </div>

      </div>

    </div>
  )
}

export default CharacterSheet