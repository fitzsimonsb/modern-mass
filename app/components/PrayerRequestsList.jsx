'use client'

import { useState, useEffect } from 'react'

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function PrayerCard({ request }) {
  const [expanded, setExpanded] = useState(false)
  const [flagged, setFlagged] = useState(false)
  const [flagging, setFlagging] = useState(false)

  async function handleFlag(e) {
    e.stopPropagation()
    if (flagged || flagging) return
    setFlagging(true)
    try {
      await fetch('/api/prayer-requests/flag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: request._id }),
      })
    } finally {
      setFlagged(true)
      setFlagging(false)
    }
  }

  return (
    <div className={`pw-card${expanded ? ' pw-card--open' : ''}`}>
      <button
        className="pw-card-trigger"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <span className="pw-card-name">{request.prayerFor}</span>
        <span className="pw-card-toggle" aria-hidden="true">
          {expanded ? '−' : '+'}
        </span>
      </button>

      {expanded && (
        <div className="pw-card-body">
          {request.message ? (
            <p className="pw-card-message">{request.message}</p>
          ) : (
            <p className="pw-card-message pw-card-message--empty">
              No additional context provided.
            </p>
          )}
          <div className="pw-card-footer">
            <span className="pw-card-time">{timeAgo(request.verifiedAt)}</span>
            <button
              className={`pw-card-flag${flagged ? ' pw-card-flag--sent' : ''}`}
              onClick={handleFlag}
              disabled={flagged || flagging}
            >
              {flagged ? 'Reported' : 'Report'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PrayerRequestsList() {
  const [requests, setRequests] = useState(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    fetch('/api/prayer-requests/list')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setRequests)
      .catch(() => {
        setRequests([])
        setLoadError(true)
      })
  }, [])

  if (requests === null) {
    return <p className="pw-status">Loading…</p>
  }

  if (loadError) {
    return <p className="pw-status">Could not load prayer requests right now.</p>
  }

  if (requests.length === 0) {
    return (
      <p className="pw-status">
        No prayer requests yet — be the first to ask the community to pray with you.
      </p>
    )
  }

  return (
    <div className="pw-list">
      {requests.map((r) => (
        <PrayerCard key={r._id} request={r} />
      ))}
    </div>
  )
}
