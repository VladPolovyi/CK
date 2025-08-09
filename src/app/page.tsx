import { Shield, Users, Calendar, Trophy, Sword, Crown, Zap, Target, Skull, Flame, Droplets } from 'lucide-react'
import Navigation from '@/components/Navigation'
import styles from './page.module.scss'

export default function Home() {
  return (
    <div className="min-h-screen blood-gradient">
      <Navigation />

      {/* Hero Section */}
      <div className="blood-hero relative overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block text-blood-glow combat-text">CBITAHOK KPOBI</span>
                  <span className={`block sm:mx-auto lg:mx-0 ${styles.ukrainianPvpText}`}>UKRAINIAN PVP</span>
                </h1>
                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Where the blood flows and legends are born. Join the elite warriors who embrace the darkness. 
                  In the down of blood, only the strongest survive.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <a href="#" className="blood-button w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white md:py-4 md:text-lg md:px-10">
                      <Droplets className="mr-2 h-5 w-5" />
                      Join the Blood
                    </a>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-blood-glow text-base font-medium rounded-md text-blood-glow bg-transparent hover:bg-blood-glow hover:text-white md:py-4 md:text-lg md:px-10 transition-all">
                      <Target className="mr-2 h-5 w-5" />
                      View Warriors
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Blood Stats */}
      <div className="py-12 bg-dark-gray/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="blood-card rounded-lg p-6 text-center">
              <Droplets className="h-8 w-8 text-blood-glow mx-auto mb-2 animate-pulse" />
              <div className="text-2xl font-bold text-white combat-text">666</div>
              <div className="text-gray-300">Blood Victories</div>
            </div>
            <div className="blood-card rounded-lg p-6 text-center">
              <Trophy className="h-8 w-8 text-blood-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">13</div>
              <div className="text-gray-300">Dark Titles</div>
            </div>
            <div className="blood-card rounded-lg p-6 text-center">
              <Target className="h-8 w-8 text-blood-light mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">99%</div>
              <div className="text-gray-300">Blood Rate</div>
            </div>
            <div className="blood-card rounded-lg p-6 text-center">
              <Sword className="h-8 w-8 text-blood-glow mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">13+</div>
              <div className="text-gray-300">Blood Warriors</div>
            </div>
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

      {/* Blood Call */}
      <div className="py-12 bg-dark-gray/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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

      {/* Footer */}
      <footer className="blood-nav border-t border-blood-glow/20">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-300">
              © 2024 CBITAHOK KPOBI - Down of Blood. All rights reserved. | In blood we trust.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
