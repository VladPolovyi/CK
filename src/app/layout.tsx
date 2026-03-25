import type { Metadata } from 'next'
import { Inter, Eczar } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Footer from '@/components/Footer'

import './globals.scss'

const inter = Inter({ subsets: ['latin'] })
const eczar = Eczar({ 
  subsets: ['latin'],
  weight: '700',
  variable: '--font-eczar'
})


export const metadata: Metadata = {
  title: 'CBITAHOK KPOBI - Ukrainian PvP Community',
  description: 'Ukrainian PvP guild in World of Warcraft. Arena, Battleground & Solo Shuffle. Join the most competitive Ukrainian WoW community.',
  icons: {
    icon: '/images/logo2.png',
    shortcut: '/images/logo2.png',
    apple: '/images/logo2.png',
  },
  metadataBase: new URL('https://www.ckpvp.com'),
  openGraph: {
    title: 'CBITAHOK KPOBI - Ukrainian PvP Community',
    description: 'Ukrainian PvP guild in World of Warcraft. Arena, Blitz & Solo Shuffle. Join the most competitive Ukrainian WoW community.',
    url: 'https://www.ckpvp.com',
    siteName: 'CBITAHOK KPOBI',
    images: [
      {
        url: '/images/logo_main.png',
        width: 1200,
        height: 630,
        alt: 'CBITAHOK KPOBI - Ukrainian PvP Guild',
      },
    ],
    locale: 'uk_UA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CBITAHOK KPOBI - Ukrainian PvP Community',
    description: 'Ukrainian PvP guild in World of Warcraft. Arena, Battleground & Solo Shuffle champions. Join the most competitive Ukrainian WoW community.',
    images: ['/images/logo_main.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${eczar.variable} blood-gradient min-h-screen min-h-[100dvh] flex flex-col`}>
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
