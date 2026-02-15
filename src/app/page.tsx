import { Shield, Users, Calendar, Trophy, Sword, Crown, Zap, Target, Skull, Flame, Droplets } from 'lucide-react'
import Navigation from '@/components/Navigation'
import ReadyToBleed from '@/components/ReadyToBleed'
import AchievementStats from '@/components/AchievementStats'
import GuildPvPOverview from '@/components/GuildPvPOverview'
import styles from './page.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import achievementData from '@/data/generated/achievements-data.json'
import pvpData from '@/data/generated/pvp-activity.json'


export default function Home() {
  return (
    <div className="blood-gradient">
      <Navigation />
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/karesh_glad.png"
            alt="Blood Achievements Background"
            width={1920}
            height={1080}
            priority
            quality={90}
            className="w-full h-full object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <h1 className="text-6xl font-black text-white sm:text-7xl md:text-8xl mb-8 tracking-wider drop-shadow-2xl">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-700">
              CBITAHOK KPOBI
            </span>
          </h1>

          <div className="text-center mb-6">
            <div className="gothic-guild-text text-2xl font-medium text-white tracking-wide drop-shadow-lg">
              ukrainian pvp guild
            </div>
          </div>
          
          <div className="text-center mb-12">
            <div className="gothic-subtitle text-xl font-medium text-white tracking-wide drop-shadow-lg">
              in World of Warcraft
            </div>
          </div>

          <div className="flex justify-center items-center">
            <a href="#ready-to-bleed" className="inline-block bg-black/50 backdrop-blur-sm border border-red-500/40 rounded-xl px-10 py-6 shadow-2xl hover:bg-black/70 hover:border-red-500/60 transition-all duration-200 cursor-pointer">
              <span className="text-red-400 font-semibold text-xl hover:text-red-300 transition-colors">
                JOIN US
              </span>
            </a>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/90 to-transparent"></div>
      </div>

      {/* Achievement Stats Section */}
      <div className="py-12 bg-black/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="text-blood-light">Achievements</span>
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Guild members who have earned prestigious PvP achievements and titles.
            </p>
          </div>
          
          {/* Achievement Stats Display */}
          <AchievementStats data={achievementData} />
      
          {/* View All Achievements Button */}
          <div className="text-center mt-8">
            <Link 
              href="/achievements" 
              className="inline-block bg-blood-light hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Trophy className="inline mr-2 h-5 w-5" />
              View All Achievements
            </Link>
          </div>
        </div>
      </div>

      {/* PvP Activity Section */}
      <div className="py-12 bg-dark-gray/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="text-blood-light">PvP Activity</span>
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Current season PvP statistics and guild member activity.
            </p>
          </div>
          
          {/* PvP Overview Display */}
          <GuildPvPOverview data={pvpData} />
      
          {/* View PvP Activity Button */}
          <div className="text-center mt-8">
            <Link 
              href="/activity" 
              className="inline-block bg-blood-light hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Sword className="inline mr-2 h-5 w-5" />
              View PvP Activity
            </Link>
          </div>
        </div>
      </div>

      {/* Ready to Bleed Section */}
      <div id="ready-to-bleed">
        <ReadyToBleed />
      </div>
    </div>
  )
}
