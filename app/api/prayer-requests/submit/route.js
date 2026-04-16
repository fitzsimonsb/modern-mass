import { NextResponse } from 'next/server'
import { writeClient } from '../../../../lib/sanity-write'
import { Resend } from 'resend'
import Filter from 'bad-words'

const resend = new Resend(process.env.RESEND_API_KEY)
const profanityFilter = new Filter()

// Blocks any text containing a URL
const URL_PATTERN = /https?:\/\/|www\.\S/i

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function hashEmail(email) {
  const buffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(email)
  )
  return Buffer.from(buffer).toString('hex')
}

async function moderateWithOpenAI(text) {
  try {
    const res = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: text }),
    })
    const data = await res.json()
    return data.results?.[0]?.flagged ?? false
  } catch {
    // Don't block the submission if the moderation API is unavailable
    return false
  }
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { requesterName, prayerFor, message, email, honeypot } = body

  // Honeypot — bots fill hidden fields, humans don't; silently succeed to avoid training bots
  if (honeypot) {
    return NextResponse.json({ success: true })
  }

  // Required field validation
  if (!requesterName?.trim() || !prayerFor?.trim() || !email?.trim()) {
    return NextResponse.json(
      { error: 'Please fill in all required fields.' },
      { status: 400 }
    )
  }

  if (requesterName.trim().length > 100) {
    return NextResponse.json(
      { error: 'Name must be 100 characters or fewer.' },
      { status: 400 }
    )
  }

  if (prayerFor.trim().length > 100) {
    return NextResponse.json(
      { error: '"Praying for" must be 100 characters or fewer.' },
      { status: 400 }
    )
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 }
    )
  }

  if (message && message.length > 300) {
    return NextResponse.json(
      { error: 'Context must be 300 characters or fewer.' },
      { status: 400 }
    )
  }

  // Block URLs in user-submitted text
  if (URL_PATTERN.test(prayerFor) || URL_PATTERN.test(message ?? '')) {
    return NextResponse.json(
      { error: 'Links are not permitted in prayer requests.' },
      { status: 400 }
    )
  }

  // Profanity filter (bad-words library)
  const combinedText = [prayerFor.trim(), message ?? ''].filter(Boolean).join(' ')
  if (profanityFilter.isProfane(combinedText)) {
    return NextResponse.json(
      { error: 'Your request contains language that is not permitted. Please revise and try again.' },
      { status: 400 }
    )
  }

  // OpenAI content moderation — catches hate speech, harassment, violence, self-harm, sexual content
  const isFlagged = await moderateWithOpenAI(combinedText)
  if (isFlagged) {
    return NextResponse.json(
      { error: 'Your request could not be submitted. Please ensure the content is respectful and appropriate.' },
      { status: 400 }
    )
  }

  // Rate limit: one active request per email address at a time
  const emailNormalized = email.toLowerCase().trim()
  const emailHash = await hashEmail(emailNormalized)
  const now = new Date().toISOString()

  const existing = await writeClient.fetch(
    `*[_type == "prayerRequest" && emailHash == $emailHash && (
      status == "pending_verification" ||
      (status == "active" && expiresAt > $now)
    )][0]{ _id }`,
    { emailHash, now }
  )

  if (existing) {
    return NextResponse.json(
      { error: 'You already have an active prayer request. Please wait for it to expire before submitting a new one.' },
      { status: 429 }
    )
  }

  // Store in Sanity — raw email is never persisted, only the hash
  const verificationToken = crypto.randomUUID()

  await writeClient.create({
    _type: 'prayerRequest',
    requesterName: requesterName.trim(),
    prayerFor: prayerFor.trim(),
    message: message?.trim() ?? '',
    emailHash,
    status: 'pending_verification',
    verificationToken,
    flagCount: 0,
    submittedAt: now,
  })

  // Send verification email
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/prayer-requests/verify?token=${verificationToken}`
  const safePrayerFor = escapeHtml(prayerFor.trim())

  await resend.emails.send({
    from: `Modern Mass <${process.env.EMAIL_FROM ?? 'onboarding@resend.dev'}>`,
    to: emailNormalized,
    subject: 'Confirm your prayer request — Modern Mass',
    html: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#FAF8F4;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F4;padding:40px 20px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0"
             style="background:#ffffff;border-radius:8px;padding:48px 40px;max-width:480px;">
        <tr><td>
          <p style="font-family:Georgia,serif;font-size:12px;letter-spacing:0.12em;
                    text-transform:uppercase;color:#B8976A;margin:0 0 28px;">Modern Mass</p>
          <h1 style="font-family:Georgia,serif;font-size:26px;font-weight:500;
                     color:#1A1714;margin:0 0 16px;line-height:1.3;">
            Your prayer request is almost live
          </h1>
          <p style="font-size:15px;line-height:1.7;color:#4A4540;margin:0 0 8px;">
            Thank you for asking the community to pray for
            <strong>${safePrayerFor}</strong>.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#4A4540;margin:0 0 36px;">
            Click the button below to confirm your email and make your request
            visible on the prayer wall. This link expires in 24 hours.
          </p>
          <a href="${verifyUrl}"
             style="display:inline-block;background:#1A1714;color:#FAF8F4;
                    text-decoration:none;padding:14px 32px;border-radius:6px;
                    font-family:sans-serif;font-size:13px;font-weight:500;
                    letter-spacing:0.06em;">
            Confirm prayer request
          </a>
          <p style="font-size:12px;color:#9A9390;margin:36px 0 0;line-height:1.7;">
            If you didn&rsquo;t submit this request, you can safely ignore this email
            &mdash; it will expire automatically after 24 hours.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  })

  return NextResponse.json({ success: true })
}
