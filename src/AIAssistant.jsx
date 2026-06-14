import { useState } from 'react'

function AIAssistant({ editor, onClose }) {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setResponse('')

    try {
      const context = editor?.state.doc.textContent || ''
      const res = await fetch('http://localhost:3001/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context: context.slice(-2000) }),
      })
      const data = await res.json()
      setResponse(data.response || 'No response received.')
    } catch (error) {
      setResponse('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'absolute',
      top: '60px',
      right: '32px',
      width: '340px',
      maxHeight: '500px',
      background: '#141416',
      border: '1px solid #2a2a2e',
      borderRadius: '10px',
      padding: '16px',
      zIndex: 300,
      boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ color: '#7ec8e3', fontSize: '12px', fontWeight: '600', letterSpacing: '0.08em' }}>✦ AI ASSISTANT</span>
        <span onClick={onClose} style={{ color: '#555', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>×</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
        {['Brainstorm ideas', 'What happens next?', 'Improve this scene', 'Check for plot holes'].map(quick => (
          <button
            key={quick}
            onClick={() => setPrompt(quick)}
            style={{ background: '#1e1e22', border: '1px solid #2a2a2e', color: '#888', borderRadius: '20px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            {quick}
          </button>
        ))}
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask for ideas, feedback, or what to write next..."
        style={{ width: '100%', background: '#1e1e22', border: '1px solid #2a2a2e', borderRadius: '6px', color: '#ccc', fontSize: '13px', padding: '10px', outline: 'none', marginBottom: '8px', resize: 'none', height: '70px', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}
      />

      <button
        onClick={handleAsk}
        disabled={loading}
        style={{ background: 'rgba(126,200,227,0.15)', border: '1px solid rgba(126,200,227,0.4)', color: '#7ec8e3', borderRadius: '6px', padding: '8px', cursor: loading ? 'default' : 'pointer', fontSize: '12px', fontWeight: '500', marginBottom: '12px' }}>
        {loading ? 'Thinking...' : 'Ask'}
      </button>

      {response && (
        <div style={{ flex: 1, overflowY: 'auto', background: '#0f0f11', border: '1px solid #1e1e22', borderRadius: '6px', padding: '12px', color: '#aaa', fontSize: '13px', lineHeight: '1.6', fontFamily: 'Georgia, serif', whiteSpace: 'pre-wrap' }}>
          {response}
        </div>
      )}
    </div>
  )
}

export default AIAssistant