import { Droplets, Target } from 'lucide-react'

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
          <span className="text-blood-light">Ready to Bleed?</span>
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Prove your worth in the down of blood. Only the strongest will be remembered.
        </p>
        <div className="flex justify-center space-x-4">
          <a href="#" className="blood-button px-8 py-3 text-white font-medium rounded-md">
            <Droplets className="inline mr-2 h-5 w-5" />
            Join the Blood
          </a>
          <a href="#" className="border border-blood-glow text-blood-glow px-8 py-3 font-medium rounded-md hover:bg-blood-glow hover:text-white transition-all">
            <Target className="inline mr-2 h-5 w-5" />
            Challenge Us
          </a>
        </div>
      </div>
    </div>
  )
}
