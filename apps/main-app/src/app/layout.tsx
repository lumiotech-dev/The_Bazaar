import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Bazaar - Online Marketplace',
  description: 'Shop from thousands of vendors on The Bazaar marketplace',
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
