import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vendor Portal - The Bazaar',
  description: 'Manage your store and products on The Bazaar',
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
