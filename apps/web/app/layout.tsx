import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Load Testing Demo - Subito.it Style',
  description: 'A Next.js app for load testing ad details pages',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
