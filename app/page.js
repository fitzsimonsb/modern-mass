import { getTodaysPrayer } from '../lib/sanity'

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

        {/* EMAIL CAPTURE
            Replace the form below with your Beehiiv or Mailchimp embed code.
            Sign up free at beehiiv.com, create a publication, then paste your
            embed form here in place of this placeholder. */}
        <div className="email-section">
          <h3 className="email-title">Be the first to know</h3>
          <p className="email-desc">Get notified when the app launches.</p>
          <form className="email-form" action="#" method="post">
            <input
              className="email-input"
              type="email"
              name="email"
              placeholder="your@email.com"
              required
            />
            <button className="email-btn" type="submit">Notify me</button>
          </form>
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
