import { SignInButton, SignUpButton } from '@clerk/clerk-react'
import './Landing.css'

const icon = (path) => (props) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {path}
  </svg>
)

const BookIcon = icon(<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" />)
const BurstIcon = icon(<path d="M13 2 4.5 13.5H12L11 22l8.5-11.5H12L13 2Z" />)
const TvIcon = icon(<><rect x="2" y="7" width="20" height="14" rx="2" /><path d="m17 2-5 5-5-5" /></>)
const FilmIcon = icon(<><rect x="2" y="3" width="20" height="18" rx="2" /><path d="M7 3v18M17 3v18M2 8h5M2 16h5M17 8h5M17 16h5" /></>)
const GamepadIcon = icon(<><path d="M6 12h4m-2-2v4M15 13h.01M18 11h.01" /><rect x="2" y="6" width="20" height="12" rx="6" /></>)
const PenIcon = icon(<path d="m17 3 4 4L7 21H3v-4L17 3Z" />)
const CloudIcon = icon(<path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.4 1.5A4 4 0 0 0 6.5 19h11Z" />)
const SparkleIcon = icon(<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />)
const PackageIcon = icon(<><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" /><path d="M3 8l9 5 9-5M12 13v8" /></>)
const CheckIcon = icon(<path d="M20 6 9 17l-5-5" />)

function Landing() {
  const projectTypes = [
    { Icon: BookIcon, label: 'Novel', description: 'Chapters, acts and scenes', color: '#e8a87c' },
    { Icon: BurstIcon, label: 'Comic', description: 'Issues, pages and panels', color: '#f4a261' },
    { Icon: TvIcon, label: 'TV Show', description: 'Seasons and episodes', color: '#7ec8e3' },
    { Icon: FilmIcon, label: 'Movie', description: 'Acts and sequences', color: '#c77dff' },
    { Icon: GamepadIcon, label: 'Game', description: 'Quests and dialogue', color: '#52b788' },
  ]

  const features = [
    { Icon: PenIcon, title: 'Rich Text Editor', description: 'Beautiful writing environment with full formatting, focus mode, and typewriter scrolling.' },
    { Icon: CloudIcon, title: 'Cloud Sync', description: 'Your writing syncs across every device automatically. Never lose a word.' },
    { Icon: SparkleIcon, title: 'AI Writing Assistant', description: 'Stuck? Your AI assistant helps you brainstorm, improve scenes, and find plot holes.' },
    { Icon: PackageIcon, title: 'Export Anywhere', description: 'Compile your manuscript to PDF, DOCX, or EPUB with a single click.' },
  ]

  return (
    <div className="landing-page">

      <nav className="landing-nav">
        <span className="landing-logo">Storytelling</span>
        <div className="landing-nav-actions">
          <SignInButton mode="modal">
            <button className="landing-btn landing-btn-secondary">Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="landing-btn landing-btn-primary">Get Started Free</button>
          </SignUpButton>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-eyebrow">THE WRITING APP FOR EVERY KIND OF STORY</div>
        <h1>Your story deserves the right tool</h1>
        <p>
          Storytelling is a creative writing platform for novelists, screenwriters, comic writers and game designers. One app, every kind of story.
        </p>
        <div className="landing-hero-actions">
          <SignUpButton mode="modal">
            <button className="landing-btn landing-btn-primary">Start Writing Free →</button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button className="landing-btn landing-btn-secondary">Sign In</button>
          </SignInButton>
        </div>
        <p className="landing-hero-note">Free forever · No credit card required</p>
      </section>

      <section className="landing-types">
        <p className="landing-section-label">BUILT FOR EVERY KIND OF STORY</p>
        <div className="landing-types-grid">
          {projectTypes.map(({ Icon, label, description, color }) => (
            <div key={label} className="landing-type-card" style={{ '--card-color': color }}>
              <div className="landing-type-icon"><Icon /></div>
              <div className="landing-type-label">{label}</div>
              <div className="landing-type-desc">{description}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-features">
        <p className="landing-section-label">EVERYTHING YOU NEED TO WRITE</p>
        <div className="landing-features-grid">
          {features.map(({ Icon, title, description }) => (
            <div key={title} className="landing-feature-card">
              <div className="landing-feature-icon"><Icon /></div>
              <div className="landing-feature-title">{title}</div>
              <div className="landing-feature-desc">{description}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-pricing">
        <p className="landing-section-label">SIMPLE PRICING</p>
        <div className="landing-pricing-grid">

          <div className="landing-price-card">
            <div className="landing-price-tier">FREE</div>
            <div className="landing-price-amount">$0</div>
            <div className="landing-price-period">Forever free</div>
            <ul className="landing-price-features">
              {['3 projects', 'All project types', 'Export PDF, DOCX, EPUB'].map(f => (
                <li key={f}><CheckIcon width="14" height="14" strokeWidth="2" />{f}</li>
              ))}
            </ul>
            <SignUpButton mode="modal">
              <button className="landing-btn landing-btn-secondary landing-price-cta">Get Started Free</button>
            </SignUpButton>
          </div>

          <div className="landing-price-card landing-price-card--featured">
            <div className="landing-price-badge">POPULAR</div>
            <div className="landing-price-tier landing-price-tier--accent">PRO</div>
            <div className="landing-price-amount">$10</div>
            <div className="landing-price-period">per month</div>
            <ul className="landing-price-features">
              {['Unlimited projects', 'Cloud sync', 'AI writing assistant'].map(f => (
                <li key={f}><CheckIcon width="14" height="14" strokeWidth="2" />{f}</li>
              ))}
            </ul>
            <SignUpButton mode="modal">
              <button className="landing-btn landing-btn-strong landing-price-cta">Get Pro →</button>
            </SignUpButton>
          </div>

          <div className="landing-price-card">
            <div className="landing-price-tier">OUTRIGHT</div>
            <div className="landing-price-amount">$20</div>
            <div className="landing-price-period">one time</div>
            <ul className="landing-price-features">
              {['Unlimited projects', 'Cloud sync', 'No subscription'].map(f => (
                <li key={f}><CheckIcon width="14" height="14" strokeWidth="2" />{f}</li>
              ))}
            </ul>
            <SignUpButton mode="modal">
              <button className="landing-btn landing-btn-secondary landing-price-cta">Buy Outright →</button>
            </SignUpButton>
          </div>

        </div>
      </section>

      <footer className="landing-footer">
        <span className="landing-footer-brand">Storytelling</span>
        <span className="landing-footer-copy">© 2026 · Built by Randy Carroll</span>
      </footer>

    </div>
  )
}

export default Landing
