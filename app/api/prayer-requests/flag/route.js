import { NextResponse } from 'next/server'
import { writeClient } from '../../../../lib/sanity-write'

const AUTO_REJECT_THRESHOLD = 3

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { id } = body

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Missing request ID.' }, { status: 400 })
  }

  const doc = await writeClient.fetch(
    `*[_type == "prayerRequest" && _id == $id && status == "active"][0]{ _id, flagCount }`,
    { id }
  )

  if (!doc) {
    return NextResponse.json({ error: 'Request not found.' }, { status: 404 })
  }

  const newFlagCount = (doc.flagCount ?? 0) + 1
  const autoRejected = newFlagCount >= AUTO_REJECT_THRESHOLD

  const patch = writeClient.patch(doc._id).set({ flagCount: newFlagCount })
  if (autoRejected) {
    patch.set({ status: 'rejected' })
  }
  await patch.commit()

  return NextResponse.json({ success: true, autoRejected })
}
