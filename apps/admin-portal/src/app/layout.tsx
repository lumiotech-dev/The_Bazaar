import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Admin Portal - The Bazaar',
  description: 'Manage The Bazaar platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
