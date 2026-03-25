import './globals.css'

export const metadata = {
  title: 'Modern Mass',
  description: 'A new prayer every day, grounded in scripture, written for modern life.',
  openGraph: {
    title: 'Modern Mass',
    description: 'A new prayer every day, grounded in scripture, written for modern life.',
    url: 'https://modernmass.org',
    siteName: 'Modern Mass',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
