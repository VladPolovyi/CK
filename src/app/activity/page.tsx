import { Activity, Calendar, Users, Trophy, Sword, Clock, TrendingUp, Target } from 'lucide-react'
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import ReadyToBleed from '@/components/ReadyToBleed'

export default function GuildActivity() {
  return (
    <div className="min-h-screen blood-gradient">
      <Navigation />
      <div className="pt-20">
      {/* Hero Section */}
      <HeroSection 
        title="Guild Activity"
        subtitle="Track the bloodshed and conquests of our warriors. Every victory, every achievement, every drop of blood spilled."
        backgroundImage="/images/etazis_glad_s2.jpg"
      />

      {/* TBD Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="blood-card rounded-lg p-12">
            <Activity className="h-16 w-16 text-blood-glow mx-auto mb-6" />
            <h2 className="text-3xl font-extrabold text-white mb-4">
              <span className="text-blood-light">Coming Soon</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Guild activity features are currently under development. 
              Soon you'll be able to track the bloodshed and conquests of our warriors.
            </p>
            <div className="mt-8 text-gray-400">
              <div className="text-sm">Features in development:</div>
              <div className="mt-2 space-y-1 text-xs">
                <div>• Last 24hrs PVP activity tracking</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ready to Bleed Section */}
      <ReadyToBleed />
    </div>
  </div>
  )
}
