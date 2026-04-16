'use client'

import { useState } from 'react'

export default function PrayerRequestForm() {
  const [form, setForm] = useState({
    requesterName: '',
    prayerFor: '',
    message: '',
    email: '',
  })
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/prayer-requests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, honeypot }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="pr-success">
        <div className="pr-success-icon">✓</div>
        <h3 className="pr-success-title">Check your email</h3>
        <p className="pr-success-text">
          We&rsquo;ve sent a confirmation link to your inbox. Click it to make your prayer
          request visible to the community for the next 48 hours.
        </p>
      </div>
    )
  }

  return (
    <form className="pr-form" onSubmit={handleSubmit} noValidate>
      {/* Honeypot — visually hidden, only bots fill this in */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="pr-field">
        <label className="pr-label" htmlFor="pr-requester">Your name</label>
        <input
          id="pr-requester"
          className="pr-input"
          type="text"
          placeholder="e.g. Sarah"
          value={form.requesterName}
          onChange={update('requesterName')}
          required
          maxLength={100}
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="pr-for">Praying for</label>
        <input
          id="pr-for"
          className="pr-input"
          type="text"
          placeholder="e.g. my father John, or peace in our parish"
          value={form.prayerFor}
          onChange={update('prayerFor')}
          required
          maxLength={100}
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="pr-message">
          Context <span className="pr-optional">(optional)</span>
        </label>
        <textarea
          id="pr-message"
          className="pr-textarea"
          placeholder="Share a little about why you are asking for prayer…"
          value={form.message}
          onChange={update('message')}
          maxLength={300}
          rows={4}
        />
        <span className="pr-char-count">{form.message.length} / 300</span>
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="pr-email">Your email</label>
        <input
          id="pr-email"
          className="pr-input"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={update('email')}
          required
        />
        <span className="pr-hint">
          We&rsquo;ll send a confirmation link. Your email is never shown publicly.
        </span>
      </div>

      {status === 'error' && (
        <p className="pr-error" role="alert">{errorMsg}</p>
      )}

      <button className="pr-btn" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Submitting…' : 'Submit prayer request'}
      </button>
    </form>
  )
}
