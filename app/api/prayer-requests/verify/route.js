import { NextResponse } from 'next/server'
import { writeClient } from '../../../../lib/sanity-write'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''

  if (!token) {
    return NextResponse.redirect(`${base}/prayer-request-verified?status=invalid`)
  }

  const doc = await writeClient.fetch(
    `*[_type == "prayerRequest" && verificationToken == $token][0]{
      _id,
      status,
      submittedAt
    }`,
    { token }
  )

  if (!doc) {
    return NextResponse.redirect(`${base}/prayer-request-verified?status=not_found`)
  }

  if (doc.status === 'active') {
    return NextResponse.redirect(`${base}/prayer-request-verified?status=already_verified`)
  }

  if (doc.status !== 'pending_verification') {
    return NextResponse.redirect(`${base}/prayer-request-verified?status=invalid`)
  }

  // Verification links expire after 24 hours
  const ageHours = (Date.now() - new Date(doc.submittedAt).getTime()) / (1000 * 60 * 60)
  if (ageHours > 24) {
    await writeClient.patch(doc._id).set({ status: 'expired' }).commit()
    return NextResponse.redirect(`${base}/prayer-request-verified?status=expired`)
  }

  const verifiedAt = new Date()
  const expiresAt = new Date(verifiedAt.getTime() + 48 * 60 * 60 * 1000) // 48 hours

  await writeClient
    .patch(doc._id)
    .set({
      status: 'active',
      verifiedAt: verifiedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    })
    .commit()

  return NextResponse.redirect(`${base}/prayer-request-verified?status=success`)
}
