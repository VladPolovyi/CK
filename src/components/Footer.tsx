import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="blood-nav border-t border-blood-glow/20 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Guild Info */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white mb-4">
              <span className="text-blood-light">CBITAHOK KPOBI</span>
            </h3>
            <p className="text-gray-300 text-sm mb-2">
              Ukrainian PvP Guild
            </p>
            <p className="text-gray-400 text-xs">
              World of Warcraft • Dawn of Blood
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link 
                href="/" 
                className="block text-gray-300 hover:text-blood-light transition-colors text-sm"
              >
                Home
              </Link>
              <Link 
                href="/achievements" 
                className="block text-gray-300 hover:text-blood-light transition-colors text-sm"
              >
                Achievements
              </Link>
              <Link 
                href="/activity" 
                className="block text-gray-300 hover:text-blood-light transition-colors text-sm"
              >
                PvP Activity
              </Link>
              <Link 
                href="/gallery" 
                className="block text-gray-300 hover:text-blood-light transition-colors text-sm"
              >
                Gallery
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm mb-2">
              © {new Date().getFullYear()} CBITAHOK KPOBI
            </p>
            <p className="text-gray-500 text-xs">
              All rights reserved
            </p>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="mt-8 pt-6 border-t border-gray-700/30">
          <div className="text-center">
            <p className="text-gray-500 text-xs">
              Forged in blood and darkness • Where legends are born
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

