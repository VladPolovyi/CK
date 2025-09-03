import type { Metadata } from 'next'
import { Inter, Eczar } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

import './globals.scss'

const inter = Inter({ subsets: ['latin'] })
const eczar = Eczar({ 
  subsets: ['latin'],
  weight: '700',
  variable: '--font-eczar'
})

export const metadata: Metadata = {
  title: 'CBITAHOK KPOBI - Dawn of Blood',
  description: 'Welcome to CBITAHOK KPOBI - Dawn of Blood. Where legends are forged in blood and darkness.',
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${eczar.variable} blood-gradient min-h-screen`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
