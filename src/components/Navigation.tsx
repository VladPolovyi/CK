"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="blood-nav fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-red-500 hover:text-red-400 p-3"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>

          {/* Desktop Left Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/achievements" className="text-gray-300 hover:text-blood-glow px-3 py-2 rounded-md text-sm font-medium transition-colors">Achievements</Link>
            <Link href="/activity" className="text-gray-300 hover:text-blood-glow px-3 py-2 rounded-md text-sm font-medium transition-colors">Activity</Link>
          </div>
          
          {/* Centered Logo */}
          <div className="flex items-center justify-center flex-1 md:flex-none">
            <Link href="/" className="blood-logo">
              <div className="flex flex-col items-center">
                <div className="mb-2">
                  <Image 
                    src="/images/logo.png" 
                    alt="CBITAHOK KPOBI Logo" 
                    width={120} 
                    height={120} 
                    priority
                    quality={100}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    className="w-20 h-20 md:w-[100px] md:h-[100px]"
                    style={{
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 0 8px rgba(255, 0, 0, 0.5))'
                    }}
                  />
                </div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Right Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/gallery" className="text-gray-300 hover:text-blood-glow px-3 py-2 rounded-md text-sm font-medium transition-colors">Gallery</Link>
            <Link href="https://discord.gg/9hgAHRfD9x" className="text-gray-300 hover:text-blood-glow px-3 py-2 rounded-md text-sm font-medium transition-colors">Discord</Link>
          </div>

          {/* Mobile placeholder for right side */}
          <div className="md:hidden w-10"></div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-blood-glow/20">
            <div className="px-4 py-4 space-y-2">
              <Link 
                href="/achievements" 
                className="block text-gray-300 hover:text-blood-glow px-3 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Achievements
              </Link>
              <Link 
                href="/activity" 
                className="block text-gray-300 hover:text-blood-glow px-3 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Activity
              </Link>
              <Link 
                href="/gallery" 
                className="block text-gray-300 hover:text-blood-glow px-3 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Gallery
              </Link>
              <Link 
                href="https://discord.gg/9hgAHRfD9x" 
                className="block text-gray-300 hover:text-blood-glow px-3 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Discord
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
