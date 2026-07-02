import { SignInButton, SignUpButton } from '@clerk/clerk-react'

function Landing() {
  const projectTypes = [
    { icon: '📖', label: 'Novel', description: 'Chapters, acts and scenes', color: '#e8a87c' },
    { icon: '💥', label: 'Comic', description: 'Issues, pages and panels', color: '#f4a261' },
    { icon: '📺', label: 'TV Show', description: 'Seasons and episodes', color: '#7ec8e3' },
    { icon: '🎬', label: 'Movie', description: 'Acts and sequences', color: '#c77dff' },
    { icon: '🎮', label: 'Game', description: 'Quests and dialogue', color: '#52b788' },
  ]

  const features = [
    { icon: '✍️', title: 'Rich Text Editor', description: 'Beautiful writing environment with full formatting, focus mode, and typewriter scrolling.' },
    { icon: '☁️', title: 'Cloud Sync', description: 'Your writing syncs across every device automatically. Never lose a word.' },
    { icon: '✦', title: 'AI Writing Assistant', description: 'Stuck? Your AI assistant helps you brainstorm, improve scenes, and find plot holes.' },
    { icon: '📦', title: 'Export Anywhere', description: 'Compile your manuscript to PDF, DOCX, or EPUB with a single click.' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f11',
      color: '#e2e2ea',
      fontFamily: 'Inter, -apple-system, sans-serif',
      overflowX: 'hidden',
    }}>

      {/* Nav */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 48px',
        borderBottom: '1px solid #1a1a1d',
        position: 'sticky',
        top: 0,
        background: '#0f0f11',
        zIndex: 100,
      }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#fff' }}>
          Storytelling
        </span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <SignInButton mode="modal">
            <button style={{
              background: 'transparent',
              border: '1px solid #2a2a2e',
              color: '#888',
              borderRadius: '6px',
              padding: '8px 18px',
              cursor: 'pointer',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
            }}>
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button style={{
              background: 'rgba(126,200,227,0.15)',
              border: '1px solid rgba(126,200,227,0.4)',
              color: '#7ec8e3',
              borderRadius: '6px',
              padding: '8px 18px',
              cursor: 'pointer',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: '500',
            }}>
              Get Started Free
            </button>
          </SignUpButton>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '100px 48px 80px',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '0.15em',
          color: '#7ec8e3',
          marginBottom: '24px',
          fontFamily: 'Inter, sans-serif',
        }}>
          THE WRITING APP FOR EVERY KIND OF STORY
        </div>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '56px',
          fontWeight: 'normal',
          lineHeight: '1.15',
          color: '#ffffff',
          marginBottom: '24px',
          letterSpacing: '-1px',
        }}>
          Your story deserves the right tool
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#666',
          lineHeight: '1.7',
          marginBottom: '40px',
          maxWidth: '560px',
        }}>
          Storytelling is a creative writing platform for novelists, screenwriters, comic writers and game designers. One app, every kind of story.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <SignUpButton mode="modal">
            <button style={{
              background: 'rgba(126,200,227,0.15)',
              border: '1px solid rgba(126,200,227,0.4)',
              color: '#7ec8e3',
              borderRadius: '8px',
              padding: '14px 32px',
              cursor: 'pointer',
              fontSize: '15px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: '500',
            }}>
              Start Writing Free →
            </button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button style={{
              background: 'transparent',
              border: '1px solid #2a2a2e',
              color: '#666',
              borderRadius: '8px',
              padding: '14px 32px',
              cursor: 'pointer',
              fontSize: '15px',
              fontFamily: 'Inter, sans-serif',
            }}>
              Sign In
            </button>
          </SignInButton>
        </div>
        <p style={{ color: '#444', fontSize: '12px', marginTop: '16px' }}>
          Free forever · No credit card required
        </p>
      </section>

      {/* Project Types */}
      <section style={{
        padding: '80px 48px',
        borderTop: '1px solid #1a1a1d',
        borderBottom: '1px solid #1a1a1d',
        background: '#0c0c0e',
      }}>
        <p style={{
          textAlign: 'center',
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '0.15em',
          color: '#555',
          marginBottom: '48px',
          fontFamily: 'Inter, sans-serif',
        }}>
          BUILT FOR EVERY KIND OF STORY
        </p>
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {projectTypes.map(pt => (
            <div key={pt.label} style={{
              width: '160px',
              padding: '28px 16px',
              background: '#0f0f11',
              border: '1px solid #1e1e22',
              borderTop: `3px solid ${pt.color}`,
              borderRadius: '10px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{pt.icon}</div>
              <div style={{ color: pt.color, fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                {pt.label}
              </div>
              <div style={{ color: '#444', fontSize: '12px', lineHeight: '1.5' }}>
                {pt.description}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 48px', maxWidth: '900px', margin: '0 auto' }}>
        <p style={{
          textAlign: 'center',
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '0.15em',
          color: '#555',
          marginBottom: '48px',
          fontFamily: 'Inter, sans-serif',
        }}>
          EVERYTHING YOU NEED TO WRITE
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}>
          {features.map(f => (
            <div key={f.title} style={{
              padding: '32px',
              background: '#0c0c0e',
              border: '1px solid #1a1a1d',
              borderRadius: '10px',
            }}>
              <div style={{ fontSize: '28px', marginBottom: '16px' }}>{f.icon}</div>
              <div style={{ color: '#fff', fontSize: '16px', fontWeight: '500', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>
                {f.title}
              </div>
              <div style={{ color: '#555', fontSize: '13px', lineHeight: '1.7' }}>
                {f.description}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{
        padding: '80px 48px',
        borderTop: '1px solid #1a1a1d',
        background: '#0c0c0e',
      }}>
        <p style={{
          textAlign: 'center',
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '0.15em',
          color: '#555',
          marginBottom: '48px',
          fontFamily: 'Inter, sans-serif',
        }}>
          SIMPLE PRICING
        </p>
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          maxWidth: '800px',
          margin: '0 auto',
          flexWrap: 'wrap',
        }}>

          {/* Free */}
          <div style={{
            flex: 1,
            minWidth: '220px',
            padding: '32px',
            background: '#0f0f11',
            border: '1px solid #1e1e22',
            borderRadius: '12px',
            textAlign: 'center',
          }}>
            <div style={{ color: '#555', fontSize: '11px', letterSpacing: '0.1em', marginBottom: '16px' }}>FREE</div>
            <div style={{ color: '#fff', fontSize: '40px', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>$0</div>
            <div style={{ color: '#444', fontSize: '13px', marginBottom: '24px' }}>Forever free</div>
            {['3 projects', 'All project types', 'Export PDF, DOCX, EPUB'].map(f => (
              <div key={f} style={{ color: '#555', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #1a1a1d', textAlign: 'left' }}>✓ {f}</div>
            ))}
            <SignUpButton mode="modal">
              <button style={{ marginTop: '24px', width: '100%', padding: '12px', background: 'transparent', border: '1px solid #2a2a2e', color: '#666', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                Get Started Free
              </button>
            </SignUpButton>
          </div>

          {/* Pro */}
          <div style={{
            flex: 1,
            minWidth: '220px',
            padding: '32px',
            background: '#0f0f11',
            border: '1px solid rgba(126,200,227,0.3)',
            borderRadius: '12px',
            textAlign: 'center',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#7ec8e3',
              color: '#000',
              fontSize: '10px',
              fontWeight: '600',
              padding: '3px 12px',
              borderRadius: '20px',
            }}>
              POPULAR
            </div>
            <div style={{ color: '#7ec8e3', fontSize: '11px', letterSpacing: '0.1em', marginBottom: '16px' }}>PRO</div>
            <div style={{ color: '#fff', fontSize: '40px', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>$10</div>
            <div style={{ color: '#444', fontSize: '13px', marginBottom: '24px' }}>per month</div>
            {['Unlimited projects', 'Cloud sync', 'AI writing assistant'].map(f => (
              <div key={f} style={{ color: '#aaa', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #1a1a1d', textAlign: 'left' }}>✓ {f}</div>
            ))}
            <SignUpButton mode="modal">
              <button style={{ marginTop: '24px', width: '100%', padding: '12px', background: 'rgba(126,200,227,0.15)', border: '1px solid rgba(126,200,227,0.4)', color: '#7ec8e3', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                Get Pro →
              </button>
            </SignUpButton>
          </div>

          {/* Outright */}
          <div style={{
            flex: 1,
            minWidth: '220px',
            padding: '32px',
            background: '#0f0f11',
            border: '1px solid #1e1e22',
            borderRadius: '12px',
            textAlign: 'center',
          }}>
            <div style={{ color: '#555', fontSize: '11px', letterSpacing: '0.1em', marginBottom: '16px' }}>OUTRIGHT</div>
            <div style={{ color: '#fff', fontSize: '40px', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>$20</div>
            <div style={{ color: '#444', fontSize: '13px', marginBottom: '24px' }}>one time</div>
            {['Unlimited projects', 'Cloud sync', 'No subscription'].map(f => (
              <div key={f} style={{ color: '#aaa', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #1a1a1d', textAlign: 'left' }}>✓ {f}</div>
            ))}
            <SignUpButton mode="modal">
              <button style={{ marginTop: '24px', width: '100%', padding: '12px', background: 'transparent', border: '1px solid #2a2a2e', color: '#888', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                Buy Outright →
              </button>
            </SignUpButton>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 48px',
        borderTop: '1px solid #1a1a1d',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#444' }}>Storytelling</span>
        <span style={{ color: '#333', fontSize: '12px' }}>© 2026 · Built by Randy Carroll</span>
      </footer>

    </div>
  )
}

export default Landing
