import { NextResponse } from 'next/server'
import { client } from '../../../../lib/sanity'

export async function GET() {
  const now = new Date().toISOString()
  try {
    const requests = await client.fetch(
      `*[_type == "prayerRequest" && status == "active" && expiresAt > $now]
       | order(verifiedAt desc) {
         _id,
         prayerFor,
         message,
         verifiedAt
       }`,
      { now }
    )
    return NextResponse.json(requests)
  } catch (err) {
    console.error('Failed to fetch prayer requests:', err)
    return NextResponse.json([], { status: 500 })
  }
}
