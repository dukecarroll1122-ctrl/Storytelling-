import Inspector from './Inspector'
import Sidebar from "./Sidebar"
import Editor from './Editor'

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f0f11' }}>

      <div style={{ height: '48px', background: '#0c0c0e', borderBottom: '1px solid #1a1a1d', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
        <p style={{ color: '#ffffff', fontSize: '14px', fontFamily: 'Georgia' }}>Storytelling</p>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        <Sidebar />

        <Editor />

        <Inspector />

      </div>

    </div>
  )
}

export default App