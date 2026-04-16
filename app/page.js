import { getTodaysPrayer } from '../lib/sanity'
import PrayerRequestForm from './components/PrayerRequestForm'
import PrayerRequestsList from './components/PrayerRequestsList'

// Refresh the page every hour so the prayer updates automatically each day
export const revalidate = 3600

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function Home() {
  const prayer = await getTodaysPrayer()

  const todayStr = new Date().toISOString().split('T')[0]
  const displayDate = formatDate(todayStr)

  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <a href="/" className="wordmark">Modern Mass</a>
        <span className="nav-date">{displayDate}</span>
      </nav>

      {prayer ? (
        <>
          {/* HERO */}
          <div className="hero">
            <span className="liturgical-tag">{prayer.liturgicalContext}</span>
            <h1 className="hero-title">Today&rsquo;s Prayer</h1>
          </div>

          {/* SCRIPTURE */}
          <div className="scripture-block">
            <div className="scripture-ref">{prayer.scriptureReference}</div>
            <p className="scripture-text">&ldquo;{prayer.scriptureText}&rdquo;</p>
          </div>

          {/* PRAYER CONTENT */}
          <div className="prayer-content">
            <div className="section-label">Reflection</div>
            <p className="reflection-text">{prayer.reflection}</p>

            <div className="section-label">Prayer</div>
            <p className="prayer-text">{prayer.prayer}</p>
          </div>
        </>
      ) : (
        /* NO PRAYER FALLBACK */
        <div className="no-prayer">
          <h2 className="no-prayer-title">Today&rsquo;s prayer is on its way.</h2>
          <p className="no-prayer-text">Check back shortly — a new prayer is published each day at midday.</p>
        </div>
      )}

      {/* PRAYER REQUESTS */}
      <div className="pr-section">
        <div className="pr-section-inner">
          <div className="pr-section-header">
            <span className="section-label">Praying Together</span>
            <h2 className="pr-section-title">Ask us to pray for you</h2>
            <p className="pr-section-desc">
              Submit a name or intention below. Once you confirm your email, your request will
              appear on the prayer wall and the community will pray with you for 48 hours.
            </p>
          </div>
          <PrayerRequestForm />
        </div>

        <div className="pr-section-inner">
          <div className="pr-section-header">
            <span className="section-label">Prayer Wall</span>
            <h2 className="pr-section-title">Who we&rsquo;re praying for</h2>
            <p className="pr-section-desc">
              Click any name to read more. Each intention is held in prayer for 48 hours.
            </p>
          </div>
          <PrayerRequestsList />
        </div>
      </div>

      <div className="divider" />

      {/* COMING SOON */}
      <div className="coming-soon">
        <div className="coming-soon-label">Coming Soon</div>
        <h2 className="coming-soon-title">Daily prayers, delivered to your phone.</h2>
        <p className="coming-soon-desc">
          The Modern Mass app for iOS and Android is on its way. A new prayer every day at midday —
          no searching, no setup, just a moment to stop and reflect.
        </p>

        <div className="app-badges">
          <div className="badge">
            <span className="badge-icon">🍎</span>
            <div className="badge-text">
              <span className="badge-sub">Coming soon on the</span>
              <span className="badge-name">App Store</span>
            </div>
          </div>
          <div className="badge">
            <span className="badge-icon">▶</span>
            <div className="badge-text">
              <span className="badge-sub">Coming soon on</span>
              <span className="badge-name">Google Play</span>
            </div>
          </div>
        </div>

        {/* EMAIL CAPTURE — Beehiiv */}
        <div className="email-section">
          <h3 className="email-title">Be the first to know</h3>
          <p className="email-desc">Get notified when the app launches.</p>
          <script async src="https://subscribe-forms.beehiiv.com/embed.js"></script>
          <iframe
            src="https://subscribe-forms.beehiiv.com/2fdc126e-9e7a-459e-8a6d-da70e660a925"
            className="beehiiv-embed"
            data-test-id="beehiiv-embed"
            frameBorder="0"
            scrolling="no"
            style={{width: '560px', height: '315px', margin: '0', borderRadius: '0', backgroundColor: 'transparent', boxShadow: 'none', maxWidth: '100%'}}
          />
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-wordmark">Modern Mass</div>
        <div className="footer-sub">modernmass.org</div>
      </footer>
    </>
  )
}
