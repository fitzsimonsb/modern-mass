const MESSAGES = {
  success: {
    icon: '✓',
    variant: 'success',
    title: 'Your prayer request is live.',
    body: 'The community can now see your intention and will be praying with you. Your request will remain on the wall for 48 hours.',
  },
  already_verified: {
    icon: '✓',
    variant: 'success',
    title: 'Already confirmed.',
    body: 'Your prayer request is already live. The community is praying for your intention.',
  },
  expired: {
    icon: '×',
    variant: 'error',
    title: 'This link has expired.',
    body: 'Confirmation links are valid for 24 hours. Please return to the home page and submit a new request.',
  },
  not_found: {
    icon: '×',
    variant: 'error',
    title: 'Link not recognised.',
    body: 'This confirmation link could not be found. Please return to the home page and try submitting again.',
  },
  invalid: {
    icon: '×',
    variant: 'error',
    title: 'Invalid link.',
    body: 'This confirmation link is not valid. Please return to the home page and try again.',
  },
}

export default async function PrayerRequestVerifiedPage({ searchParams }) {
  const status = searchParams?.status ?? 'invalid'
  const { icon, variant, title, body } = MESSAGES[status] ?? MESSAGES.invalid

  return (
    <>
      <nav className="nav">
        <a href="/" className="wordmark">Modern Mass</a>
      </nav>

      <div className="pr-verified">
        <div className={`pr-verified-icon pr-verified-icon--${variant}`}>{icon}</div>
        <h1 className="pr-verified-title">{title}</h1>
        <p className="pr-verified-body">{body}</p>
        <a href="/" className="pr-verified-link">Return to home</a>
      </div>
    </>
  )
}
