import { createClient } from '@sanity/client'

// Token-authenticated client used exclusively in server-side API routes.
// Never import this in client components or expose the token to the browser.
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2026-03-25',
  token: process.env.SANITY_WRITE_TOKEN,
})
