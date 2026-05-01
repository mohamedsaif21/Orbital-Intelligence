import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Orbital Intelligence',
  description: 'AI-driven GIS land encroachment detection',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}