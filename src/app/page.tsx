import { Shield, Users, Calendar, Trophy, Sword, Crown, Zap, Target, Skull, Flame, Droplets } from 'lucide-react'
import Navigation from '@/components/Navigation'
import ReadyToBleed from '@/components/ReadyToBleed'
import styles from './page.module.scss'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen blood-gradient">
      <Navigation />

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/morok_glad.jpg"
            alt="Blood Achievements Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <h1 className="text-6xl font-black text-white sm:text-7xl md:text-8xl mb-8 tracking-wider drop-shadow-2xl">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-700">
              CBITAHOK KPOBI
            </span>
          </h1>

                    <div className="text-center mb-6">
            <div className="gothic-guild-text text-2xl font-medium text-gray-300 tracking-wide">
              eu ravencrest guild
            </div>
          </div>
          
          <div className="text-center mb-12">
            <div className="gothic-subtitle text-xl font-medium text-gray-400 tracking-wide">
              in World of Warcraft
            </div>
          </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="inline-block bg-black/50 backdrop-blur-sm border border-red-500/40 rounded-xl px-10 py-6 shadow-2xl">
              <a href="#" className="text-red-400 font-semibold text-xl hover:text-red-300 transition-colors">
                <Droplets className="inline mr-2 h-5 w-5" />
                Join the Blood
              </a>
            </div>
            <div className="inline-block bg-black/50 backdrop-blur-sm border border-red-500/40 rounded-xl px-10 py-6 shadow-2xl">
              <a href="#" className="text-red-400 font-semibold text-xl hover:text-red-300 transition-colors">
                <Target className="inline mr-2 h-5 w-5" />
                View Warriors
              </a>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/90 to-transparent"></div>
      </div>

      {/* Achievement Stats Section */}
      <div className="py-12 bg-dark-gray/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="text-blood-glow">Blood Achievements</span>
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              The legends of blood and conquest. These warriors have proven their worth in battle.
            </p>
          </div>
          
      
          {/* View All Achievements Button */}
          <div className="text-center">
            <Link 
              href="/achievements" 
              className="inline-block bg-blood-glow hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Trophy className="inline mr-2 h-5 w-5" />
              View All Achievements
            </Link>
          </div>
        </div>
      </div>



      {/* Guild Features */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="text-blood-glow">Why Choose</span> CBITAHOK KPOBI?
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              We are the harbingers of blood. Join us or become our prey.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="blood-card rounded-lg p-6">
              <Shield className="h-12 w-12 text-blood-glow mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Blood Dominance</h3>
              <p className="text-gray-300">
                Our warriors bathe in the blood of their enemies. We don't just win - we consume.
              </p>
            </div>
            <div className="blood-card rounded-lg p-6">
              <Users className="h-12 w-12 text-blood-glow mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Dark Brotherhood</h3>
              <p className="text-gray-300">
                Only those who embrace the darkness are accepted. We are a brotherhood of blood.
              </p>
            </div>
            <div className="blood-card rounded-lg p-6">
              <Trophy className="h-12 w-12 text-blood-gold mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Blood Legacy</h3>
              <p className="text-gray-300">
                Our name strikes fear in the hearts of all. We are the lords of blood and shadow.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ready to Bleed Section */}
      <ReadyToBleed />

             {/* Footer */}
       <footer className="blood-nav border-t border-blood-glow/20">
         <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
           <div className="text-center">
             <p className="text-gray-300">
               © {new Date().getFullYear()} CBITAHOK KPOBI - Down of Blood. All rights reserved. | In blood we trust.
             </p>
           </div>
         </div>
       </footer>
    </div>
  )
}
