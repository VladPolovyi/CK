import Image from 'next/image'

export default function ReadyToBleed() {
  return (
    <div className="relative py-12 bg-cover bg-center bg-no-repeat" style={{ 
      backgroundImage: 'url(/images/morok_glad.jpg)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
          <span className="text-blood-light">Join Us</span>
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Join our Ukrainian PvP guild and compete with skilled players in World of Warcraft.
        </p>
        <div className="flex justify-center">
          <a href="https://discord.gg/9hgAHRfD9x" className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-3 font-medium rounded-md transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center">
            <Image 
              src="/images/logo_discord.svg" 
              alt="Discord" 
              width={80} 
              height={24}
              className="h-6 w-auto brightness-0 invert"
            />
          </a>
        </div>
      </div>
    </div>
  )
}
