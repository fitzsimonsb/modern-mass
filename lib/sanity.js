import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2026-03-25',
})

export async function getTodaysPrayer() {
  const today = new Date().toISOString().split('T')[0] // "2026-04-05"
  return client.fetch(
    `*[_type == "prayer" && date == $today && status == "published"][0]{
      date,
      liturgicalContext,
      season,
      scriptureReference,
      scriptureText,
      reflection,
      prayer
    }`,
    { today }
  )
}
