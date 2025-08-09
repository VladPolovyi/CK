import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.scss'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CBITAHOK KPOBI - Down of Blood',
  description: 'Welcome to CBITAHOK KPOBI - Down of Blood. Where legends are forged in blood and darkness.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} blood-gradient min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
