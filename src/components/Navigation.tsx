import Image from 'next/image'
import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="blood-nav fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left Navigation */}
          <div className="flex items-center space-x-6">
            <Link href="/achievements" className="text-gray-300 hover:text-blood-glow px-3 py-2 rounded-md text-sm font-medium transition-colors">Achievements</Link>
            <Link href="/activity" className="text-gray-300 hover:text-blood-glow px-3 py-2 rounded-md text-sm font-medium transition-colors">Activity</Link>
          </div>
          
                     {/* Centered Logo */}
           <div className="flex items-center justify-center flex-1">
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
                      style={{
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 0 8px rgba(255, 0, 0, 0.5))'
                      }}
                    />
                  </div>
               </div>
             </Link>
           </div>
          
          {/* Right Navigation */}
          <div className="flex items-center space-x-6">
            <Link href="/gallery" className="text-gray-300 hover:text-blood-glow px-3 py-2 rounded-md text-sm font-medium transition-colors">Gallery</Link>
            <Link href="#" className="text-gray-300 hover:text-blood-glow px-3 py-2 rounded-md text-sm font-medium transition-colors">Join</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
