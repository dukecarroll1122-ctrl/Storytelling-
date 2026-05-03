import Sidebar from "./Sidebar"
function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f0f11' }}>

      <div style={{ height: '48px', background: '#0c0c0e', borderBottom: '1px solid #1a1a1d', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
        <p style={{ color: '#ffffff', fontSize: '14px', fontFamily: 'Georgia' }}>Storytelling</p>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        <Sidebar />

        <div style={{ flex: 1, background: '#0f0f11' }}>
          <p style={{ color: '#fff', padding: '16px' }}>Editor</p>
        </div>

        <div style={{ width: '260px', background: '#0c0c0e', borderLeft: '1px solid #1a1a1d' }}>
          <p style={{ color: '#555', padding: '16px', fontSize: '12px' }}>INSPECTOR</p>
        </div>

      </div>

    </div>
  )
}

export default App