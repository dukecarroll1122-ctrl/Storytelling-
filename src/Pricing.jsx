import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { CheckIcon } from './icons'

function Pricing({ onClose }) {
  const { user } = useUser()
  const userId = user?.id || 'temp-user'

  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const handleCheckout = async (plan) => {
    try {
      const response = await fetch('https://storytelling-server-production.up.railway.app/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userId }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout failed:', error)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        background: '#0f0f11',
        border: '1px solid #1e1e22',
        borderRadius: '16px',
        padding: '48px',
        maxWidth: '800px',
        width: '90%',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '28px', fontFamily: 'Georgia, serif', fontWeight: 'normal', marginBottom: '8px' }}>
            Choose your plan
          </h2>
          <p style={{ color: '#9d9da7', fontSize: '14px' }}>Start free, upgrade when you're ready</p>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>

          <div style={{
            flex: 1,
            background: '#0c0c0e',
            border: '1px solid #1e1e22',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
          }}>
            <h3 style={{ color: '#888', fontSize: '12px', letterSpacing: '0.1em', marginBottom: '16px' }}>FREE</h3>
            <div style={{ color: '#fff', fontSize: '36px', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>$0</div>
            <div style={{ color: '#9d9da7', fontSize: '13px', marginBottom: '24px' }}>Forever free</div>
            <div style={{ textAlign: 'left', marginBottom: '24px' }}>
              {['3 projects', 'All project types', 'Export PDF, DOCX, EPUB', 'Local save'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8f8f99', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #1a1a1d' }}><CheckIcon width="12" height="12" /> {f}</div>
              ))}
            </div>
            <button
              onClick={onClose}
              style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #2a2a2e', color: '#666', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
              Continue Free
            </button>
          </div>

          <div style={{
            flex: 1,
            background: '#0c0c0e',
            border: '1px solid #7ec8e344',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
            position: 'relative',
          }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#7ec8e3', color: '#000', fontSize: '11px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>
              POPULAR
            </div>
            <h3 style={{ color: '#7ec8e3', fontSize: '12px', letterSpacing: '0.1em', marginBottom: '16px' }}>PRO</h3>
            <div style={{ color: '#fff', fontSize: '36px', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>$10</div>
            <div style={{ color: '#9d9da7', fontSize: '13px', marginBottom: '24px' }}>per month</div>
            <div style={{ textAlign: 'left', marginBottom: '24px' }}>
              {['Unlimited projects', 'Cloud sync across devices', 'AI writing assistant', 'Priority support'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c2c2cc', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #1a1a1d' }}><CheckIcon width="12" height="12" /> {f}</div>
              ))}
            </div>
            <button
              onClick={() => handleCheckout('pro')}
              style={{ width: '100%', padding: '12px', background: 'rgba(126,200,227,0.15)', border: '1px solid rgba(126,200,227,0.4)', color: '#7ec8e3', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
              Get Pro →
            </button>
          </div>

          <div style={{
            flex: 1,
            background: '#0c0c0e',
            border: '1px solid #1e1e22',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
          }}>
            <h3 style={{ color: '#888', fontSize: '12px', letterSpacing: '0.1em', marginBottom: '16px' }}>OUTRIGHT</h3>
            <div style={{ color: '#fff', fontSize: '36px', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>$20</div>
            <div style={{ color: '#9d9da7', fontSize: '13px', marginBottom: '24px' }}>one time</div>
            <div style={{ textAlign: 'left', marginBottom: '24px' }}>
              {['Unlimited projects', 'Cloud sync across devices', 'No subscription', 'Lifetime updates'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c2c2cc', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #1a1a1d' }}><CheckIcon width="12" height="12" /> {f}</div>
              ))}
            </div>
            <button
              onClick={() => handleCheckout('outright')}
              style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #2a2a2e', color: '#888', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
              Buy Outright →
            </button>
          </div>

        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8f8f99', fontSize: '13px', cursor: 'pointer' }}>← Back</button>
        </div>

      </div>
    </div>
  )
}

export default Pricing