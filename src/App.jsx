import { useState } from 'react'
import Inspector from './Inspector'
import Sidebar from "./Sidebar"
import Editor from './Editor'

function App() {
  const [selectedDoc, setSelectedDoc] = useState('Chapter 1')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f0f11' }}>

      <div style={{ height: '48px', background: '#0c0c0e', borderBottom: '1px solid #1a1a1d', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
        <p style={{ color: '#ffffff', fontSize: '14px', fontFamily: 'Georgia' }}>Storytelling</p>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        <Sidebar selectedDoc={selectedDoc} setSelectedDoc={setSelectedDoc} />

        <Editor selectedDoc={selectedDoc} />

        <Inspector />

      </div>
      <div style={{ height: '28px', background: '#0a0a0c', borderTop: '1px solid #1a1a1d', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '16px' }}>
  <span style={{ color: '#444', fontSize: '11px' }}>{selectedDoc}</span>
  <span style={{ color: '#333', fontSize: '11px' }}>•</span>
  <span style={{ color: '#444', fontSize: '11px' }}>Storytelling</span>
  <div style={{ flex: 1 }} />
  <span style={{ color: '#52b788', fontSize: '11px' }}>● Saved</span>
</div>
    </div>
  )
}

export default App